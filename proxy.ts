import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookieHeader = request.headers.get('cookie') || ''
  const hasToken = cookieHeader.includes('terra_admin_session=') || request.cookies.has('terra_admin_session')

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
