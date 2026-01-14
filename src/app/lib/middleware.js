import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware (req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  const { pathname } = req.nextUrl

  // if no token -> redirect
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Example: role check
  if (pathname.startsWith('/admin') && token.role !== 'admin') {
    const unauthorizedUrl = new URL('/unauthorized', req.url)
    return NextResponse.redirect(unauthorizedUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'] // protected routes
}
