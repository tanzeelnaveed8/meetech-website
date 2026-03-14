import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const paymentId = session.metadata?.paymentId
    const projectId = session.metadata?.projectId

    if (paymentId && projectId) {
      try {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'PAID',
            paidDate: new Date(),
            isUnlocked: true,
            stripePaymentIntentId: session.payment_intent as string,
          },
        })
        console.log(`Payment ${paymentId} marked as PAID via webhook`)
      } catch (error) {
        console.error('Failed to update payment from webhook:', error)
        return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
