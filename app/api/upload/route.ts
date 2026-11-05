import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Maximum allowed photo file size: 5 MB
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_FILE_SIZE_MB = 5

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

    const uploadedPaths: string[] = []
    let totalOriginalBytes = 0
    let totalCompressedBytes = 0

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

      // Sanitize base name and enforce .webp extension
      const ext = path.extname(file.name)
      const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() || 'photo'
      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${baseClean}.webp`
      const targetPath = path.join(uploadsDir, uniqueName)

      // Auto-compress and convert to modern WebP format using Sharp:
      // - .rotate(): Preserves correct camera/phone orientation (EXIF)
      // - .resize(): Limits maximum resolution to 2048x2048 without upscaling smaller images
      // - .webp(): Quality 82 provides crisp visual fidelity with dramatic file size reduction (typically 50-80% smaller)
      const webpBuffer = await sharp(inputBuffer)
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

      fs.writeFileSync(targetPath, webpBuffer)
      totalCompressedBytes += webpBuffer.length
      uploadedPaths.push(`/uploads/${uniqueName}`)
    }

    if (uploadedPaths.length === 0) {
      return NextResponse.json({ success: false, message: 'Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.' }, { status: 400 })
    }

    const savedPercent = totalOriginalBytes > 0
      ? Math.max(0, Math.round(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100))
      : 0

    return NextResponse.json({
      success: true,
      message: `${uploadedPaths.length} foto berhasil dioptimasi & dikonversi ke WebP!`,
      urls: uploadedPaths,
      url: uploadedPaths[0],
      savedPercent,
      originalKb: Math.round(totalOriginalBytes / 1024),
      compressedKb: Math.round(totalCompressedBytes / 1024),
    })
  } catch (error) {
    console.error('Error in upload POST:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengunggah dan mengompresi foto' }, { status: 500 })
  }
}
