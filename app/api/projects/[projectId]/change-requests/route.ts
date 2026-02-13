import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById } from '@/lib/db/queries/projects'
import { getChangeRequestsByProject, createChangeRequest, updateChangeRequestStatus } from '@/lib/db/queries/change-requests'
import { z } from 'zod'

const createChangeRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
})

const updateChangeRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  status: z.string().min(1, 'Status is required'),
  adminResponse: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { session } = authCheck
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  try {
    // Verify user has access to the project
    const project = await getProjectById(projectId, session.user.id, session.user.role)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const changeRequests = await getChangeRequestsByProject(projectId)

    return NextResponse.json({ changeRequests }, { status: 200 })
  } catch (error) {
    console.error('Get change requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch change requests' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['CLIENT'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { session } = authCheck
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  try {
    // Verify client has access to this project
    const project = await getProjectById(projectId, session.user.id, session.user.role)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const data = createChangeRequestSchema.parse(body)

    const changeRequest = await createChangeRequest({
      projectId,
      clientId: session.user.id,
      title: data.title,
      message: data.message,
    })

    return NextResponse.json({ changeRequest }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create change request error:', error)
    return NextResponse.json(
      { error: 'Failed to create change request' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const body = await request.json()
    const data = updateChangeRequestSchema.parse(body)

    const changeRequest = await updateChangeRequestStatus(
      data.requestId,
      data.status,
      data.adminResponse
    )

    return NextResponse.json({ changeRequest }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update change request error:', error)
    return NextResponse.json(
      { error: 'Failed to update change request' },
      { status: 500 }
    )
  }
}
