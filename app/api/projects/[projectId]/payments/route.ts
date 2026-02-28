import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById } from '@/lib/db/queries/projects'
import { createPayment, updatePayment, deletePayment } from '@/lib/db/queries/projects'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  status: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  paidDate: z.string().optional(),
  milestoneId: z.string().optional(),
  stripeCheckoutUrl: z.string().url().optional(),
  stripePaymentIntentId: z.string().optional(),
})

const updatePaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  description: z.string().min(1).optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  isUnlocked: z.boolean().optional(),
  milestoneId: z.string().nullable().optional(),
  stripeCheckoutUrl: z.string().url().optional(),
  stripePaymentIntentId: z.string().optional(),
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

    return NextResponse.json({ payments: project.payments }, { status: 200 })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
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
    const data = createPaymentSchema.parse(body)

    if (data.milestoneId) {
      const existing = await prisma.payment.findFirst({
        where: { milestoneId: data.milestoneId },
        select: { id: true },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'This milestone already has a linked payment' },
          { status: 400 }
        )
      }
    }

    const payment = await createPayment({
      projectId,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: data.status,
      dueDate: new Date(data.dueDate),
      paidDate: data.paidDate ? new Date(data.paidDate) : undefined,
      milestoneId: data.milestoneId,
      stripeCheckoutUrl: data.stripeCheckoutUrl,
      stripePaymentIntentId: data.stripePaymentIntentId,
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const body = await request.json()
    const data = updatePaymentSchema.parse(body)

    if (data.milestoneId) {
      const existing = await prisma.payment.findFirst({
        where: {
          milestoneId: data.milestoneId,
          NOT: { id: data.paymentId },
        },
        select: { id: true },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'This milestone already has a linked payment' },
          { status: 400 }
        )
      }
    }

    const updateData: {
      amount?: number
      currency?: string
      description?: string
      status?: string
      isUnlocked?: boolean
      milestoneId?: string | null
      stripeCheckoutUrl?: string
      stripePaymentIntentId?: string
      dueDate?: Date
      paidDate?: Date
    } = {
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: data.status,
      isUnlocked: data.isUnlocked,
      milestoneId: data.milestoneId,
      stripeCheckoutUrl: data.stripeCheckoutUrl,
      stripePaymentIntentId: data.stripePaymentIntentId,
    }

    if (data.dueDate) updateData.dueDate = new Date(data.dueDate)
    if (data.paidDate) updateData.paidDate = new Date(data.paidDate)
    if (data.status?.toUpperCase() === 'PAID') {
      if (updateData.isUnlocked === undefined) {
        updateData.isUnlocked = true
      }
      if (!updateData.paidDate) {
        updateData.paidDate = new Date()
      }
    }

    const payment = await updatePayment(data.paymentId, updateData)

    return NextResponse.json({ payment }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update payment error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest
) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    await deletePayment(paymentId)

    return NextResponse.json(
      { message: 'Payment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete payment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}
