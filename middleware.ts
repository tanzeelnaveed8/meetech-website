import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Admin routes - require ADMIN, EDITOR, or VIEWER roles
  if (pathname.startsWith('/admin')) {
    // Skip login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    if (!session?.user) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    const allowedRoles = ['ADMIN', 'EDITOR', 'VIEWER']
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Client routes - require CLIENT role
  if (pathname.startsWith('/client')) {
    // Skip login page itself
    if (pathname === '/client/login') {
      return NextResponse.next()
    }

    if (!session?.user) {
      const url = new URL('/client/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (session.user.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/client/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
}
