import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { getConversationsByUser, getOrCreateConversation } from '@/lib/db/queries/messages'

// GET /api/messages   List all conversations for the current user
export async function GET() {
  const authCheck = await requireAuth()
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const { id, role } = authCheck.session!.user
    const conversations = await getConversationsByUser(id, role)
    return NextResponse.json({ conversations }, { status: 200 })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/messages   Create a conversation for a project (body: { projectId })
export async function POST(request: Request) {
  const authCheck = await requireAuth()
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      )
    }

    const conversation = await getOrCreateConversation(projectId)
    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
