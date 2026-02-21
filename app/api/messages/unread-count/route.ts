import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { getUnreadCount } from '@/lib/db/queries/messages'

// GET /api/messages/unread-count   Get unread message count for nav badge
export async function GET() {
  const authCheck = await requireAuth()
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const { id, role } = authCheck.session!.user
    const count = await getUnreadCount(id, role)

    return NextResponse.json({ count }, { status: 200 })
  } catch (error) {
    console.error('Get unread count error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
}
