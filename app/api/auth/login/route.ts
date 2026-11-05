import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateCredentials, signToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    const isValid = await validateCredentials(username, password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      )
    }

    const token = signToken(username)
    const isHttps = request.url.startsWith('https:')

    const response = NextResponse.json({ success: true, message: 'Login berhasil' })

    // Set cookie directly on response
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Also set via next/headers cookies() for maximum compatibility
    try {
      const cookieStore = await cookies()
      cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })
    } catch (e) {
      console.warn('CookieStore fallback error:', e)
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat login' },
      { status: 500 }
    )
  }
}
