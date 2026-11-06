import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/data'
import { checkAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function GET() {
  const settings = await getSettings()
  // Exclude password from GET response for safety
  return NextResponse.json({
    success: true,
    data: {
      googleReviewUrl: settings.googleReviewUrl,
      adminUsername: settings.adminUsername,
      siteTitle: settings.siteTitle,
      whatsappNumber: settings.whatsappNumber,
    },
  }, { headers: NO_CACHE_HEADERS })
}

export async function POST(request: Request) {
  const isAuthed = await checkAuth(request)
  if (!isAuthed) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updates: Record<string, string> = {}

    if (body.googleReviewUrl) updates.googleReviewUrl = body.googleReviewUrl
    if (body.siteTitle) updates.siteTitle = body.siteTitle
    if (body.whatsappNumber) updates.whatsappNumber = body.whatsappNumber
    if (body.adminUsername) updates.adminUsername = body.adminUsername

    // If changing password, require newPassword
    if (body.newPassword && body.newPassword.trim().length >= 6) {
      updates.adminPassword = body.newPassword.trim()
    }

    const success = await saveSettings(updates)
    if (success) {
      const updatedSettings = await getSettings()
      return NextResponse.json({
        success: true,
        message: 'Pengaturan berhasil diperbarui',
        data: {
          googleReviewUrl: updatedSettings.googleReviewUrl,
          adminUsername: updatedSettings.adminUsername,
          siteTitle: updatedSettings.siteTitle,
          whatsappNumber: updatedSettings.whatsappNumber,
        },
      })
    }

    return NextResponse.json({ success: false, message: 'Gagal memperbarui pengaturan' }, { status: 500 })
  } catch (error) {
    console.error('Error in settings POST:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

