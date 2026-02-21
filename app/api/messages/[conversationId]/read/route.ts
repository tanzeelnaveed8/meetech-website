import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { markMessagesAsRead, checkConversationAccess } from '@/lib/db/queries/messages'

// POST /api/messages/[conversationId]/read   Mark messages as read
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const authCheck = await requireAuth()
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { conversationId } = await params

  try {
    const { id, role } = authCheck.session!.user

    // Access control
    const conversation = await checkConversationAccess(conversationId, id, role)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      )
    }

    const result = await markMessagesAsRead(conversationId, id)

    return NextResponse.json(
      { success: true, updatedCount: result.count },
      { status: 200 }
    )
  } catch (error) {
    console.error('Mark messages read error:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
