import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

// Maximum allowed photo file size: 5 MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const MAX_FILE_SIZE_MB = 5

// Safely load sharp with CJS require to avoid bundler runtime mangling
function getSharp() {
  try {
    return require('sharp')
  } catch (err) {
    console.warn('Sharp module not available or failed to load:', err)
    return null
  }
}

export async function POST(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      // Check if single file passed under 'file'
      const singleFile = formData.get('file') as File | null
      if (singleFile) {
        files.push(singleFile)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    // 1. Strict File Size Validation (Max 5MB per photo)
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const currentMb = (file.size / (1024 * 1024)).toFixed(1)
        return NextResponse.json(
          {
            success: false,
            message: `Foto "${file.name}" berukuran ${currentMb} MB, melebihi batas maksimal ${MAX_FILE_SIZE_MB} MB. Silakan pilih foto dengan ukuran yang lebih kecil.`,
          },
          { status: 400 }
        )
      }
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Determine all upload target locations (ensuring cPanel document root is synchronized)
    const targetDirs = [uploadsDir]
    const docRootUploads = '/home/sdnt7854/public_html/terrajeepadventures.com/uploads'
    if (fs.existsSync('/home/sdnt7854/public_html/terrajeepadventures.com')) {
      if (!fs.existsSync(docRootUploads)) {
        try { fs.mkdirSync(docRootUploads, { recursive: true }) } catch (_) {}
      }
      try {
        if (fs.existsSync(docRootUploads)) {
          const realDoc = fs.realpathSync(docRootUploads)
          const realPrimary = fs.realpathSync(uploadsDir)
          if (realDoc !== realPrimary && !targetDirs.includes(docRootUploads)) {
            targetDirs.push(docRootUploads)
          }
        }
      } catch (_) {
        if (!targetDirs.includes(docRootUploads)) {
          targetDirs.push(docRootUploads)
        }
      }
    }

    const saveBufferToTargets = (filename: string, buf: Buffer) => {
      for (const d of targetDirs) {
        try {
          if (!fs.existsSync(d)) {
            fs.mkdirSync(d, { recursive: true })
          }
          fs.writeFileSync(path.join(d, filename), buf)
        } catch (err) {
          console.warn(`Failed writing to ${d}:`, err)
        }
      }
    }

    const uploadedPaths: string[] = []
    let totalOriginalBytes = 0
    let totalCompressedBytes = 0
    const sharpInstance = getSharp()

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/jpg', 'image/tiff']
      const isAllowed = allowedTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|gif|avif|tiff)$/i)
      if (!isAllowed) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const inputBuffer = Buffer.from(bytes)
      totalOriginalBytes += inputBuffer.length

      const ext = path.extname(file.name)
      const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() || 'photo'

      // If sharp is available, convert & compress to WebP
      if (sharpInstance) {
        try {
          const webpBuffer = await sharpInstance(inputBuffer)
            .rotate()
            .resize({
              width: 2048,
              height: 2048,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({
              quality: 82,
              effort: 4,
            })
            .toBuffer()

          const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${baseClean}.webp`
          saveBufferToTargets(uniqueName, webpBuffer)

          totalCompressedBytes += webpBuffer.length
          uploadedPaths.push(`/uploads/${uniqueName}`)
          continue
        } catch (sharpError) {
          console.warn('Sharp compression failed, falling back to direct save:', sharpError)
        }
      }

      // Fallback: save original buffer directly (prevents 500 crashes)
      const safeExt = ext.toLowerCase() || '.jpg'
      const fallbackName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${baseClean}${safeExt}`
      saveBufferToTargets(fallbackName, inputBuffer)

      totalCompressedBytes += inputBuffer.length
      uploadedPaths.push(`/uploads/${fallbackName}`)
    }

    if (uploadedPaths.length === 0) {
      return NextResponse.json({ success: false, message: 'Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.' }, { status: 400 })
    }

    const savedPercent = totalOriginalBytes > 0 && totalCompressedBytes < totalOriginalBytes
      ? Math.max(0, Math.round(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100))
      : 0

    return NextResponse.json({
      success: true,
      message: `${uploadedPaths.length} foto berhasil diunggah!`,
      urls: uploadedPaths,
      url: uploadedPaths[0],
      savedPercent,
      originalKb: Math.round(totalOriginalBytes / 1024),
      compressedKb: Math.round(totalCompressedBytes / 1024),
    })
  } catch (error) {
    console.error('Error in upload POST:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengunggah foto' }, { status: 500 })
  }
}
