export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { getPageById } from '@/lib/sanity/queries'
import { requireAuth } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  // Check authentication
  const auth = await requireAuth()
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { pageId } = body

    if (!pageId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'pageId is required' },
        { status: 400 }
      )
    }

    const page = await getPageById(pageId)

    if (!page) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching preview:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch preview' },
      { status: 500 }
    )
  }
}
