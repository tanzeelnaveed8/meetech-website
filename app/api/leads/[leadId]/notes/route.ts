export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLeadNote } from '@/lib/db/queries/leads'
import { requireAuth } from '@/lib/auth/middleware'

const createNoteSchema = z.object({
  note: z.string().min(1, 'Note cannot be empty').max(2000),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  // Check authentication
  const auth = await requireAuth()
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { leadId } = await params
    const body = await request.json()
    const validatedData = createNoteSchema.parse(body)

    const note = await createLeadNote({
      leadId: leadId,
      authorId: auth.session!.user.id,
      note: validatedData.note,
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid note data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create note' },
      { status: 500 }
    )
  }
}
