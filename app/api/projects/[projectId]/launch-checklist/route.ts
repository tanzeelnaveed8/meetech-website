import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth/middleware'
import { getOrCreateLaunchChecklist, getProjectById, updateLaunchChecklist } from '@/lib/db/queries/projects'

const updateLaunchChecklistSchema = z.object({
  appStoreAssetsReady: z.boolean().optional(),
  privacyPolicyVerified: z.boolean().optional(),
  paymentGatewayTested: z.boolean().optional(),
  analyticsIntegrated: z.boolean().optional(),
  securityAuditCompleted: z.boolean().optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'])
  if (!authCheck.authorized) return authCheck.response

  const { session } = authCheck
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await getProjectById(projectId, session.user.id, session.user.role)
  if (!project) {
    return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  const launchChecklist = await getOrCreateLaunchChecklist(projectId)
  return NextResponse.json({ launchChecklist }, { status: 200 })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) return authCheck.response

  const { session } = authCheck
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await getProjectById(projectId, session.user.id, session.user.role)
  if (!project) {
    return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const data = updateLaunchChecklistSchema.parse(body)

    const launchChecklist = await updateLaunchChecklist({
      projectId,
      updatedById: session.user.id,
      ...data,
    })

    return NextResponse.json({ launchChecklist }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update launch checklist' }, { status: 500 })
  }
}
