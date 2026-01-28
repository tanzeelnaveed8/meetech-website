import { NextRequest, NextResponse } from 'next/server'
import { getPageBySlug } from '@/lib/sanity/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get('region')

    if (!region) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Region parameter is required' },
        { status: 400 }
      )
    }

    const page = await getPageBySlug(slug, region)

    if (!page) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}
