import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth/middleware'
import {
  addApprovalComment,
  createApproval,
  getApprovalsByProject,
  getProjectById,
  reviewApproval,
  unlockPaymentsForMilestoneApproval,
  updateMilestone,
} from '@/lib/db/queries/projects'

const createApprovalSchema = z.object({
  type: z.enum(['DESIGN', 'FEATURE', 'BUDGET', 'SCOPE_CHANGE', 'MILESTONE']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  milestoneId: z.string().optional(),
})

const reviewApprovalSchema = z.object({
  approvalId: z.string().min(1),
  status: z.enum(['APPROVED', 'CHANGES_REQUESTED']),
  decisionComment: z.string().optional(),
  comment: z.string().optional(),
})

const commentSchema = z.object({
  approvalId: z.string().min(1),
  message: z.string().min(1, 'Comment is required'),
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

  const approvals = await getApprovalsByProject(projectId)
  return NextResponse.json({ approvals }, { status: 200 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'CLIENT'])
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
    const { type, title, description, milestoneId } = createApprovalSchema.parse(body)

    const approval = await createApproval({
      projectId,
      requestedById: session.user.id,
      type,
      title,
      description,
      milestoneId,
    })

    return NextResponse.json({ approval }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create approval' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'CLIENT'])
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

    if (body.action === 'comment') {
      const data = commentSchema.parse(body)
      const comment = await addApprovalComment({
        approvalId: data.approvalId,
        authorId: session.user.id,
        message: data.message,
      })
      return NextResponse.json({ comment }, { status: 200 })
    }

    if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Only admin/editor can review approvals' }, { status: 403 })
    }

    const data = reviewApprovalSchema.parse(body)
    const approval = await reviewApproval({
      approvalId: data.approvalId,
      status: data.status,
      reviewedById: session.user.id,
      decisionComment: data.decisionComment,
    })

    if (data.comment) {
      await addApprovalComment({
        approvalId: data.approvalId,
        authorId: session.user.id,
        message: data.comment,
      })
    }

    if (approval.type === 'MILESTONE' && approval.milestoneId) {
      await updateMilestone(approval.milestoneId, {
        approvalStatus: data.status,
        approvedAt: data.status === 'APPROVED' ? new Date() : undefined,
        approvalComment: data.decisionComment,
      })
      if (data.status === 'APPROVED') {
        await unlockPaymentsForMilestoneApproval(projectId, approval.milestoneId)
      }
    }

    return NextResponse.json({ approval }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 })
  }
}
