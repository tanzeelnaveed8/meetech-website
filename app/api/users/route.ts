import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getUsers, createUser, createClientWithCode } from '@/lib/db/queries/users'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'], {
    message: 'Invalid role',
  }),
  isActive: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { searchParams } = new URL(request.url)

  try {
    const filters = {
      role: searchParams.get('role') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
    }

    const users = await getUsers(filters)

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await getUsers({ search: data.email })
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // CLIENT: use code-based flow (no password needed)
    if (data.role === 'CLIENT') {
      const { user, plainCode } = await createClientWithCode({ email: data.email, name: data.name })

      // Send welcome email with access code
      try {
        await resend.emails.send({
          from: 'Meetech <noreply@meetech.com>',
          to: user.email,
          subject: 'Welcome to Meetech Client Portal',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 40px 20px;">
              <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h2 style="color: #111; margin-bottom: 8px;">Welcome to Meetech!</h2>
                <p style="color: #555;">Hello ${user.name},</p>
                <p style="color: #555;">Your client portal account has been created. Use the access code below to log in.</p>
                <div style="margin: 32px 0; text-align: center;">
                  <div style="display: inline-block; background: #f0f4ff; border: 2px dashed #4f6ef7; border-radius: 12px; padding: 20px 40px;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase;">Your Access Code</p>
                    <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f6ef7; font-family: monospace;">${plainCode}</p>
                  </div>
                </div>
                <p style="color: #555; font-size: 14px;">Enter this code on the client portal login page. Keep it safe and do not share it.</p>
                <a href="${process.env.NEXTAUTH_URL}/client/login" style="display: inline-block; margin-top: 16px; padding: 12px 28px; background: #4f6ef7; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Go to Client Portal</a>
                <p style="margin-top: 32px; font-size: 12px; color: #999;">If you have any questions, contact your project manager.</p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
      }

      return NextResponse.json({ user, plainCode }, { status: 201 })
    }

    // Non-CLIENT: standard email + password flow
    if (!data.password) {
      return NextResponse.json({ error: 'Password is required for this role' }, { status: 400 })
    }

    const user = await createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      isActive: data.isActive,
    })

    // Send welcome email for non-client users
    try {
      await resend.emails.send({
        from: 'Meetech <noreply@meetech.com>',
        to: user.email,
        subject: 'Welcome to Meetech Admin Panel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Meetech!</h2>
            <p>Hello ${user.name},</p>
            <p>Your account has been created. Login at: ${process.env.NEXTAUTH_URL}/admin/login</p>
            <p>Email: ${user.email}<br>Password: ${data.password}</p>
            <p>Please change your password after first login.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
