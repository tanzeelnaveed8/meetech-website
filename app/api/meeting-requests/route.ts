import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import {
  getMeetingRequestsByClient,
  getAllMeetingRequests,
  createMeetingRequest,
} from '@/lib/db/queries/meeting-requests'
import { z } from 'zod'

const createSchema = z.object({
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTimeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  topic: z.string().min(1, 'Topic is required').max(300),
  notes: z.string().max(1000).optional(),
})

export async function GET() {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'])
  if (!authCheck.authorized) return authCheck.response

  const { session } = authCheck
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    if (session.user.role === 'CLIENT') {
      const requests = await getMeetingRequestsByClient(session.user.id)
      return NextResponse.json(requests)
    }

    const requests = await getAllMeetingRequests()
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Get meeting requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch meeting requests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireRole(['CLIENT'])
  if (!authCheck.authorized) return authCheck.response

  const { session } = authCheck
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const data = createSchema.parse(body)

    const meeting = await createMeetingRequest({
      clientId: session.user.id,
      preferredDate: new Date(data.preferredDate),
      preferredTimeSlot: data.preferredTimeSlot,
      topic: data.topic,
      notes: data.notes,
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Create meeting request error:', error)
    return NextResponse.json({ error: 'Failed to create meeting request' }, { status: 500 })
  }
}
