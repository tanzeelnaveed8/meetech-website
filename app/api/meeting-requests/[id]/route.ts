import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getMeetingRequestById, updateMeetingRequestStatus } from '@/lib/db/queries/meeting-requests'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  adminNote: z.string().max(500).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) return authCheck.response

  const { id } = await params

  try {
    const existing = await getMeetingRequestById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Meeting request not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = updateSchema.parse(body)

    const updated = await updateMeetingRequestStatus(id, data.status, data.adminNote)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Update meeting request error:', error)
    return NextResponse.json({ error: 'Failed to update meeting request' }, { status: 500 })
  }
}
