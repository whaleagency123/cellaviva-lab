import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_COOKIE = 'admin_session'
const ADMIN_TOKEN  = 'cv-admin-sess-2026-authenticated'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin routes: cookie-based auth ──────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get(ADMIN_COOKIE)?.value
    if (session !== ADMIN_TOKEN) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── Storefront account routes: NextAuth JWT ───────────────────
  if (pathname.startsWith('/account')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
