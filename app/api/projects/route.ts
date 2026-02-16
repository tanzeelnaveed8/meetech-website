import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getAllProjects, getProjectsByClient, createProject } from '@/lib/db/queries/projects'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default('Project requirements to be added'),
  scope: z.string().optional().default('To be defined based on requirements document'),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  clientId: z.string().min(1, 'Client is required'),
  managerId: z.string().min(1, 'Manager is required'),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { session } = authCheck
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  try {
    let projects

    if (session.user.role === 'CLIENT') {
      // Clients can only see their own projects
      projects = await getProjectsByClient(session.user.id)
    } else {
      // Admins can see all projects with optional filters
      const filters = {
        status: searchParams.get('status') || undefined,
        clientId: searchParams.get('clientId') || undefined,
        managerId: searchParams.get('managerId') || undefined,
      }
      projects = await getAllProjects(filters)
    }

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const body = await request.json()
    const data = createProjectSchema.parse(body)

    const project = await createProject({
      name: data.name,
      description: data.description,
      scope: data.scope,
      status: data.status,
      progress: data.progress,
      clientId: data.clientId,
      managerId: data.managerId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      expectedEndDate: data.expectedEndDate ? new Date(data.expectedEndDate) : undefined,
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
