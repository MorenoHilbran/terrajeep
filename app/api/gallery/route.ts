import { NextResponse } from 'next/server'
import { getGallery, saveGallery, GalleryItem } from '@/lib/data'
import { checkAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function GET() {
  const items = await getGallery()
  return NextResponse.json({ success: true, data: items }, { headers: NO_CACHE_HEADERS })
}

export async function POST(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: NO_CACHE_HEADERS })
  }

  try {
    const body = await request.json()
    
    // If body has items array, replace whole array (for reordering or bulk update)
    if (Array.isArray(body.items)) {
      const success = await saveGallery(body.items)
      if (success) {
        return NextResponse.json({ success: true, data: body.items }, { headers: NO_CACHE_HEADERS })
      }
      return NextResponse.json({ success: false, message: 'Gagal menyimpan galeri' }, { status: 500, headers: NO_CACHE_HEADERS })
    }

    // Otherwise, single item addition
    const { src, title } = body
    if (!src) {
      return NextResponse.json({ success: false, message: 'URL gambar wajib diisi' }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const current = await getGallery()
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      src,
      title: title || `Foto Galeri ${current.length + 1}`,
    }

    const updated = [newItem, ...current]
    const success = await saveGallery(updated)

    if (success) {
      return NextResponse.json({ success: true, data: updated, newItem }, { headers: NO_CACHE_HEADERS })
    }

    return NextResponse.json({ success: false, message: 'Gagal menambahkan foto' }, { status: 500, headers: NO_CACHE_HEADERS })
  } catch (error) {
    console.error('Error in gallery POST:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

export async function DELETE(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401, headers: NO_CACHE_HEADERS })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID wajib diisi' }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const current = await getGallery()
    const updated = current.filter((item) => item.id !== id)
    const success = await saveGallery(updated)

    if (success) {
      return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS })
    }

    return NextResponse.json({ success: false, message: 'Gagal menghapus foto' }, { status: 500, headers: NO_CACHE_HEADERS })
  } catch (error) {
    console.error('Error in gallery DELETE:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

