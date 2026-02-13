import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById, updateProject, deleteProject } from '@/lib/db/queries/projects'
import { z } from 'zod'

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  managerId: z.string().optional(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
  actualEndDate: z.string().optional(),
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

    return NextResponse.json({ project }, { status: 200 })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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

  const { projectId } = await params

  try {
    const body = await request.json()
    const data = updateProjectSchema.parse(body)

    const updateData: any = { ...data }

    // Convert date strings to Date objects
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.expectedEndDate) updateData.expectedEndDate = new Date(data.expectedEndDate)
    if (data.actualEndDate) updateData.actualEndDate = new Date(data.actualEndDate)

    const project = await updateProject(projectId, updateData)

    return NextResponse.json({ project }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { projectId } = await params

  try {
    await deleteProject(projectId)

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
