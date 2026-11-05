import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logout berhasil' })
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })

  try {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
  } catch {}

  return response
}
