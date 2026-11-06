import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams?.filename

    if (!filename) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    // Prevent directory traversal
    const safeFilename = path.basename(filename)
    if (safeFilename !== filename) {
      return new NextResponse('Invalid File Name', { status: 400 })
    }

    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', safeFilename),
      `/home/sdnt7854/public_html/terrajeepadventures.com/uploads/${safeFilename}`,
      `/home/sdnt7854/terrajeepadventures/public/uploads/${safeFilename}`,
      `/home/sdnt7854/terrajeep/public/uploads/${safeFilename}`,
    ]

    let foundPath: string | null = null
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        foundPath = p
        break
      }
    }

    if (!foundPath) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const ext = path.extname(safeFilename).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.avif': 'image/avif',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'
    const fileBuffer = fs.readFileSync(foundPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving upload file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

