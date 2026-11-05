import { NextResponse } from 'next/server'
import { verifyToken, extractToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  let token = extractToken(request)

  if (!token) {
    try {
      const cookieStore = await cookies()
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    } catch {}
  }

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  const { valid, username } = verifyToken(token)
  if (!valid) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({ authenticated: true, username })
}
