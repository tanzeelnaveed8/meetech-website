import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById } from '@/lib/db/queries/projects'
import { createMilestone, updateMilestone, deleteMilestone } from '@/lib/db/queries/projects'
import { z } from 'zod'

const createMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string().optional(),
  order: z.number().optional(),
  expectedDate: z.string().optional(),
})

const updateMilestoneSchema = z.object({
  milestoneId: z.string().min(1, 'Milestone ID is required'),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.string().optional(),
  order: z.number().optional(),
  expectedDate: z.string().optional(),
  completedDate: z.string().optional(),
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
    const project = await getProjectById(projectId, session.user.id, session.user.role)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ milestones: project.milestones }, { status: 200 })
  } catch (error) {
    console.error('Get milestones error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch milestones' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { projectId } = await params

  try {
    const body = await request.json()
    const data = createMilestoneSchema.parse(body)

    const milestone = await createMilestone({
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      order: data.order,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
    })

    return NextResponse.json({ milestone }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to create milestone' },
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
    const data = updateMilestoneSchema.parse(body)

    const updateData: any = {
      title: data.title,
      description: data.description,
      status: data.status,
      order: data.order,
    }

    if (data.expectedDate) updateData.expectedDate = new Date(data.expectedDate)
    if (data.completedDate) updateData.completedDate = new Date(data.completedDate)

    const milestone = await updateMilestone(data.milestoneId, updateData)

    return NextResponse.json({ milestone }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to update milestone' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const milestoneId = searchParams.get('milestoneId')

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      )
    }

    await deleteMilestone(milestoneId)

    return NextResponse.json(
      { message: 'Milestone deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to delete milestone' },
      { status: 500 }
    )
  }
}
