import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireRole } from '@/lib/auth/middleware'
import { getProjectById } from '@/lib/db/queries/projects'
import { prisma } from '@/lib/db/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; paymentId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'CLIENT'])
  if (!authCheck.authorized) return authCheck.response

  const { session } = authCheck
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY' },
      { status: 500 }
    )
  }

  const { projectId, paymentId } = await params
  const project = await getProjectById(projectId, session.user.id, session.user.role)
  if (!project) {
    return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      projectId,
    },
  })

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  if (payment.status === 'PAID') {
    return NextResponse.json({ error: 'Payment is already completed' }, { status: 400 })
  }

  try {
    const stripe = new Stripe(stripeSecretKey)
    const requestOrigin = new URL(request.url).origin
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${appBaseUrl}/client/projects/${projectId}?payment=success`,
      cancel_url: `${appBaseUrl}/client/projects/${projectId}?payment=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: payment.currency.toLowerCase(),
            unit_amount: Math.round(payment.amount * 100),
            product_data: {
              name: payment.description,
            },
          },
        },
      ],
      metadata: {
        projectId,
        paymentId,
      },
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Failed to create checkout URL' }, { status: 500 })
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeCheckoutUrl: checkoutSession.url },
    })

    return NextResponse.json(
      { url: checkoutSession.url, sessionId: checkoutSession.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Create checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
