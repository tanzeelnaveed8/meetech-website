export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getLeadById, updateLead } from '@/lib/db/queries/leads'
import { requireAuth } from '@/lib/auth/middleware'
import { LeadStatus } from '@/lib/db/queries/leads'

const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'IN_PROGRESS', 'CONVERTED', 'LOST']).optional(),
  assignedToId: z.string().nullable().optional(),
})

export async function GET(
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
    const lead = await getLeadById(leadId)

    if (!lead) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const validatedData = updateLeadSchema.parse(body)

    const lead = await updateLead(leadId, validatedData)

    return NextResponse.json(lead)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update lead' },
      { status: 500 }
    )
  }
}
