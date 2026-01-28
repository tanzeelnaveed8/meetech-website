import { NextRequest, NextResponse } from 'next/server'
import { getPages } from '@/lib/sanity/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get('region') || undefined
    const pageType = searchParams.get('pageType') || undefined
    const status = searchParams.get('status') || 'published'

    const pages = await getPages({
      region,
      pageType,
      status,
    })

    return NextResponse.json({ data: pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}
