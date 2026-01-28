import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import crypto from 'crypto'

// Verify Sanity webhook signature
function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.warn('SANITY_WEBHOOK_SECRET not configured')
    return false
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return `sha256=${hash}` === signature
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('x-sanity-webhook-signature')

    // Verify webhook signature
    if (signature && !verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse the body
    const data = JSON.parse(body)
    const { _type, slug, region } = data

    if (!_type) {
      return NextResponse.json(
        { error: 'Bad Request', message: '_type is required' },
        { status: 400 }
      )
    }

    const revalidatedPaths: string[] = []

    // Revalidate based on content type
    if (_type === 'page' && slug?.current) {
      // Revalidate specific page
      const pagePath = `/${slug.current}`
      revalidatePath(pagePath)
      revalidatedPaths.push(pagePath)

      // Also revalidate the API route
      revalidatePath('/api/content/pages')
      revalidatedPaths.push('/api/content/pages')
    } else if (_type === 'contentBlock') {
      // Revalidate all pages (since blocks can be used on multiple pages)
      revalidatePath('/', 'layout')
      revalidatedPaths.push('/ (all pages)')
    } else {
      // Generic revalidation
      revalidatePath('/api/content/pages')
      revalidatedPaths.push('/api/content/pages')
    }

    console.log('✅ Cache revalidated:', revalidatedPaths)

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error revalidating cache:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}
