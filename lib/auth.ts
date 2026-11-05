import crypto from 'crypto'
import { cookies } from 'next/headers'
import { getSettings } from './data'

export const AUTH_COOKIE_NAME = 'terra_admin_session'
const SECRET_KEY = process.env.SESSION_SECRET || 'terra-adventure-secret-key-2026-batur'

export function signToken(username: string): string {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  const base64Payload = Buffer.from(payload).toString('base64url')
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(base64Payload).digest('base64url')
  return `${base64Payload}.${hmac}`
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const [base64Payload, hmac] = token.split('.')
    if (!base64Payload || !hmac) return { valid: false }

    const expectedHmac = crypto.createHmac('sha256', SECRET_KEY).update(base64Payload).digest('base64url')
    if (hmac !== expectedHmac) return { valid: false }

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'))
    if (payload.exp < Date.now()) return { valid: false }

    return { valid: true, username: payload.username }
  } catch {
    return { valid: false }
  }
}

export function extractToken(request?: Request): string | undefined {
  if (request) {
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`))
      if (match) return decodeURIComponent(match[1])
    }
  }
  return undefined
}

export async function checkAuth(request?: Request): Promise<boolean> {
  // Check from request header directly first
  if (request) {
    const headerToken = extractToken(request)
    if (headerToken) {
      const res = verifyToken(headerToken)
      if (res.valid) return true
    }
  }

  // Fallback to Next.js cookies() helper
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (token) {
      const res = verifyToken(token)
      return res.valid
    }
  } catch {}

  return false
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const settings = await getSettings()
  return username === settings.adminUsername && password === settings.adminPassword
}
