import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import {
  getMessagesByConversation,
  createMessage,
  checkConversationAccess,
  markMessagesAsRead,
} from '@/lib/db/queries/messages'

// GET /api/messages/[conversationId]   Get messages for a conversation
export async function GET(
  request: NextRequest,
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

    // Mark messages as read when fetching
    await markMessagesAsRead(conversationId, id)

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') || undefined

    const messages = await getMessagesByConversation(
      conversationId,
      limit,
      before
    )

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages/[conversationId]   Send a message
export async function POST(
  request: Request,
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

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Message content too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    const message = await createMessage(conversationId, id, content.trim())

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
