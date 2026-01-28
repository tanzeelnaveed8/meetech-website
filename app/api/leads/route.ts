import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLead, getLeads } from '@/lib/db/queries/leads'
import { sendLeadNotification } from '@/lib/notifications/email'
import { sendSlackLeadAlert } from '@/lib/notifications/slack'
import { requireAuth } from '@/lib/auth/middleware'

// Rate limiting store (in-memory - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const limit = 5 // 5 submissions per hour
  const window = 60 * 60 * 1000 // 1 hour in milliseconds

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetAt) {
    // Create new record
    rateLimitStore.set(ip, { count: 1, resetAt: now + window })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// Validation schema
const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().max(100).optional(),
  projectType: z.enum(['Web Development', 'Mobile App', 'Consulting', 'Other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  fileUrl: z.string().url().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrerUrl: z.string().optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: 'Consent is required',
  }),
  // Honeypot field for spam prevention
  website: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Honeypot check - if 'website' field is filled, it's likely a bot
    if (body.website) {
      console.warn('Spam detected: honeypot field filled')
      // Return success to not alert the bot
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // Validate input
    const validatedData = createLeadSchema.parse(body)

    // Get device type from user agent
    const userAgent = request.headers.get('user-agent') || ''
    const deviceType = userAgent.match(/mobile/i) ? 'mobile' : userAgent.match(/tablet/i) ? 'tablet' : 'desktop'

    // Get landing page from referer or body
    const landingPage = validatedData.referrerUrl || request.headers.get('referer') || '/'

    // Anonymize IP (mask last octet for privacy)
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0'

    // Create lead in database
    const lead = await createLead({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company,
      projectType: validatedData.projectType,
      message: validatedData.message,
      fileUrl: validatedData.fileUrl,
      utmSource: validatedData.utmSource,
      utmMedium: validatedData.utmMedium,
      utmCampaign: validatedData.utmCampaign,
      referrerUrl: validatedData.referrerUrl,
      landingPage,
      deviceType,
      ipAddress: anonymizedIp,
      consentGiven: validatedData.consentGiven,
      consentAt: new Date(),
    })

    // Send notifications (don't wait for them to complete)
    Promise.all([
      sendLeadNotification({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? undefined,
        company: lead.company ?? undefined,
        projectType: lead.projectType,
        message: lead.message,
        utmSource: lead.utmSource ?? undefined,
        utmMedium: lead.utmMedium ?? undefined,
        utmCampaign: lead.utmCampaign ?? undefined,
        deviceType: lead.deviceType,
        createdAt: lead.createdAt,
      }),
      sendSlackLeadAlert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? undefined,
        company: lead.company ?? undefined,
        projectType: lead.projectType,
        message: lead.message,
        utmSource: lead.utmSource ?? undefined,
        utmMedium: lead.utmMedium ?? undefined,
        utmCampaign: lead.utmCampaign ?? undefined,
        deviceType: lead.deviceType,
        createdAt: lead.createdAt,
      }),
    ]).catch((error) => {
      console.error('Error sending notifications:', error)
      // Don't fail the request if notifications fail
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry. We will contact you soon.',
        leadId: lead.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid form data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await requireAuth()
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as any
    const assignedToId = searchParams.get('assignedToId') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await getLeads({
      status,
      assignedToId,
      startDate,
      endDate,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
