#!/bin/bash
set -Eeuo pipefail

# ==============================================================================
# SCRIPT DEPLOYMENT TERRA JEEP ADVENTURES (NEXT.JS) VIA CPANEL GIT
# ==============================================================================

REPO_DIR="/home/sdnt7854/repositories/terrajeep"
APP_DIR="/home/sdnt7854/terrajeepadventures"

# Jika cPanel Node.js App dibuat dengan nama folder terrajeep, otomatis gunakan path tersebut
if [ ! -d "$APP_DIR" ] && [ -d "/home/sdnt7854/terrajeep" ]; then
    APP_DIR="/home/sdnt7854/terrajeep"
fi

PUBLIC_DIR="/home/sdnt7854/public_html/terrajeepadventures.com"

# Deteksi Node.js & NPM binary (prioritaskan nodevenv cPanel / CloudLinux jika ada)
NODE_BIN=""
NPM_BIN=""

for v in 22 20 18; do
    if [ -f "/home/sdnt7854/nodevenv/terrajeepadventures/$v/bin/node" ]; then
        NODE_BIN="/home/sdnt7854/nodevenv/terrajeepadventures/$v/bin/node"
        NPM_BIN="/home/sdnt7854/nodevenv/terrajeepadventures/$v/bin/npm"
        break
    elif [ -f "/home/sdnt7854/nodevenv/terrajeep/$v/bin/node" ]; then
        NODE_BIN="/home/sdnt7854/nodevenv/terrajeep/$v/bin/node"
        NPM_BIN="/home/sdnt7854/nodevenv/terrajeep/$v/bin/npm"
        break
    fi
done

# Fallback ke path global jika nodevenv belum disetup
if [ -z "$NODE_BIN" ]; then
    NODE_BIN=$(command -v node 2>/dev/null || which node 2>/dev/null || echo "/usr/local/bin/node")
    NPM_BIN=$(command -v npm 2>/dev/null || which npm 2>/dev/null || echo "/usr/local/bin/npm")
fi

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

fail() {
    log "ERROR: $1"
    exit 1
}

log "Memulai deployment Terra Jeep Adventures"

# 1. Validasi direktori dan file penting
[ -d "$REPO_DIR" ] || fail "Repository ($REPO_DIR) tidak ditemukan"
[ -d "$PUBLIC_DIR" ] || fail "Document root ($PUBLIC_DIR) tidak ditemukan. Pastikan folder sudah dibuat di public_html."

# Buat folder APP_DIR jika belum ada
mkdir -p "$APP_DIR"

[ -f "$REPO_DIR/package.json" ] || fail "package.json tidak ditemukan di repository"

if [ ! -x "$NODE_BIN" ]; then
    fail "Node.js binary tidak ditemukan di $NODE_BIN. Pastikan Node.js sudah diaktifkan di cPanel."
fi

# 2. Amankan dan pertahankan persistent storage (data JSON & uploads)
# Supaya foto dan perubahan paket dari admin dashboard tidak terhapus saat git deploy!
PERSISTENT_DATA="$APP_DIR/data"
PERSISTENT_UPLOADS="$APP_DIR/public/uploads"

mkdir -p "$PERSISTENT_DATA"
mkdir -p "$PERSISTENT_UPLOADS"
mkdir -p "$PUBLIC_DIR/uploads"
mkdir -p "$PUBLIC_DIR/_next/static"
mkdir -p "$APP_DIR/tmp"

# Jika ini deployment pertama dan data belum ada, inisialisasi dari repository
if [ ! -f "$PERSISTENT_DATA/settings.json" ] && [ -d "$REPO_DIR/data" ]; then
    log "Inisialisasi data awal (gallery/packages/settings) dari repository..."
    cp -rn "$REPO_DIR/data/"* "$PERSISTENT_DATA/" 2>/dev/null || true
fi

# Pastikan .env.local ada di production
if [ ! -f "$APP_DIR/.env.local" ]; then
    log "Membuat .env.local production default..."
    SECRET_KEY=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 32)
    cat > "$APP_DIR/.env.local" <<ENV
SESSION_SECRET=terra-adventure-prod-${SECRET_KEY}
PORT=3000
NODE_ENV=production
ENV
fi

# 3. Sinkronisasi source code dari repository ke app directory
log "Menyinkronkan source code ke folder aplikasi ($APP_DIR)"

cd "$REPO_DIR"
git fetch origin main 2>/dev/null || true
git reset --hard origin/main 2>/dev/null || true

# Hentikan sisa proses build liar jika sebelumnya pernah macet di server
pkill -f "next build" 2>/dev/null || true

# Salin source code dan pre-built .next (kecuali cache, node_modules, data, uploads)
tar \
    --exclude='./.git' \
    --exclude='./.env' \
    --exclude='./.env.local' \
    --exclude='./node_modules' \
    --exclude='./.next/cache' \
    --exclude='./.next/dev' \
    --exclude='./.next/diagnostics' \
    --exclude='./.next/standalone' \
    --exclude='./data' \
    --exclude='./public/uploads' \
    --exclude='./deploy.sh' \
    --exclude='./.cpanel.yml' \
    -cf - . | tar -C "$APP_DIR" -xf -

# Pastikan images publik tersalin
if [ -d "$REPO_DIR/public/images" ]; then
    mkdir -p "$APP_DIR/public/images" "$PUBLIC_DIR/images"
    cp -rn "$REPO_DIR/public/images/"* "$APP_DIR/public/images/" 2>/dev/null || true
    cp -rn "$REPO_DIR/public/images/"* "$PUBLIC_DIR/images/" 2>/dev/null || true
fi

# 4. Install dependencies jika ada perubahan package.json / package-lock.json
log "Memeriksa Node.js dependencies"

cd "$APP_DIR"

NODE_DIR=$(dirname "$NODE_BIN")
export PATH="$NODE_DIR:$PATH"
export NEXT_USE_WEBPACK=true

if [ ! -d "$APP_DIR/node_modules" ] || [ "$REPO_DIR/package.json" -nt "$APP_DIR/node_modules" ]; then
    log "package.json baru terdeteksi, menjalankan npm install --omit=dev..."
    "$NPM_BIN" install --omit=dev --no-audit --no-fund --legacy-peer-deps
else
    log "node_modules sudah mutakhir. Melewati npm install untuk menghemat waktu."
fi

# 5. Build Next.js Production
# Jika repo sudah menyertakan pre-built .next, lewati npm run build agar tidak membebani CloudLinux CPU/process!
if [ -f "$APP_DIR/.next/BUILD_ID" ]; then
    log "Pre-built .next terdeteksi dari repository. Melewati build di server hosting (hemat CPU/RAM & selesai dalam 5 detik)!"
else
    log "Build lokal tidak ditemukan, menjalankan Next.js build di server..."
    "$NPM_BIN" run build
fi

# 6. Salin static assets ke document root agar dilayani langsung oleh LiteSpeed/Nginx (Cepat & Hemat RAM)
log "Menyinkronkan static assets ke document root ($PUBLIC_DIR)"

# Static chunks JS/CSS dari Next.js
if [ -d "$APP_DIR/.next/static" ]; then
    mkdir -p "$PUBLIC_DIR/_next/static"
    cp -rf "$APP_DIR/.next/static/"* "$PUBLIC_DIR/_next/static/" 2>/dev/null || true
fi

# Public images & icons (kecualikan .htaccess agar konfigurasi Passenger CloudLinux tidak tertimpa!)
if [ -d "$APP_DIR/public" ]; then
    tar \
        --exclude='./uploads' \
        --exclude='./.htaccess' \
        -cf - -C "$APP_DIR/public" . | tar -C "$PUBLIC_DIR" -xf -
fi

# Pastikan konfigurasi Passenger CloudLinux tetap ada di document root .htaccess agar tidak 403 Forbidden
if ! grep -q "PassengerAppRoot" "$PUBLIC_DIR/.htaccess" 2>/dev/null; then
    log "Menjaga konfigurasi Passenger CloudLinux di $PUBLIC_DIR/.htaccess..."
    TMP_HTACCESS=$(mktemp)
    cat <<HTACCESS > "$TMP_HTACCESS"
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "$APP_DIR"
PassengerBaseURI "/"
PassengerNodejs "$NODE_BIN"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

HTACCESS
    if [ -f "$PUBLIC_DIR/.htaccess" ]; then
        cat "$PUBLIC_DIR/.htaccess" >> "$TMP_HTACCESS"
    fi
    mv "$TMP_HTACCESS" "$PUBLIC_DIR/.htaccess"
    chmod 644 "$PUBLIC_DIR/.htaccess"
fi

# Uploads sync & symlink ke document root (agar foto yang baru diupload seketika bisa diakses)
if [ -d "$PERSISTENT_UPLOADS" ]; then
    mkdir -p "$PUBLIC_DIR/uploads"
    cp -rn "$PERSISTENT_UPLOADS/"* "$PUBLIC_DIR/uploads/" 2>/dev/null || true
fi

# 7. Restart Node.js Application (Phusion Passenger / CloudLinux)
log "Merestart aplikasi Node.js (Passenger reload signal)"

touch "$APP_DIR/tmp/restart.txt"
# Hentikan proses node lama agar Passenger memuat kode dan bundle baru secara instan
pkill -u "$USER" -f "$APP_DIR/server.js" 2>/dev/null || true

# 8. Verifikasi hasil deployment
[ -d "$APP_DIR/.next" ] || fail "Build .next tidak ditemukan"
[ -f "$APP_DIR/server.js" ] || fail "server.js tidak ditemukan"
[ -d "$PUBLIC_DIR/_next/static" ] || fail "Static assets Next.js tidak ditemukan di document root"

log "DEPLOYMENT TERRA JEEP ADVENTURES BERHASIL"
