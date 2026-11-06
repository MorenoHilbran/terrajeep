import { NextResponse } from 'next/server'
import { getPackages, savePackages, PackageItem } from '@/lib/data'
import { checkAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function GET() {
  const items = await getPackages()
  return NextResponse.json({ success: true, data: items }, { headers: NO_CACHE_HEADERS })
}

export async function POST(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Bulk replace (reorder, full save)
    if (Array.isArray(body.packages)) {
      const success = await savePackages(body.packages)
      if (success) {
        return NextResponse.json({ success: true, data: body.packages })
      }
      return NextResponse.json({ success: false, message: 'Gagal menyimpan paket' }, { status: 500 })
    }

    // Single package upsert
    const pkg: PackageItem = body
    if (!pkg.name || !pkg.prices?.IDR?.value) {
      return NextResponse.json({ success: false, message: 'Nama dan harga paket wajib diisi' }, { status: 400 })
    }

    const current = await getPackages()
    let updated: PackageItem[]

    if (pkg.id) {
      // Update existing
      const index = current.findIndex((p) => p.id === pkg.id)
      if (index !== -1) {
        updated = [...current]
        updated[index] = pkg
      } else {
        updated = [...current, pkg]
      }
    } else {
      // Create new
      const newPkg: PackageItem = {
        ...pkg,
        id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        num: pkg.num || String(current.length + 1).padStart(2, '0'),
      }
      updated = [...current, newPkg]
    }

    const success = await savePackages(updated)
    if (success) {
      return NextResponse.json({ success: true, data: updated })
    }

    return NextResponse.json({ success: false, message: 'Gagal memperbarui paket' }, { status: 500 })
  } catch (error) {
    console.error('Error in packages POST:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID wajib diisi' }, { status: 400 })
    }

    const current = await getPackages()
    const updated = current.filter((p) => p.id !== id)
    const success = await savePackages(updated)

    if (success) {
      return NextResponse.json({ success: true, data: updated })
    }

    return NextResponse.json({ success: false, message: 'Gagal menghapus paket' }, { status: 500 })
  } catch (error) {
    console.error('Error in packages DELETE:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

