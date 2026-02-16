import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getUsers, createUser } from '@/lib/db/queries/users'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

    const user = await createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      isActive: data.isActive,
    })

    // Send welcome email
    try {
      const loginUrl = user.role === 'CLIENT'
        ? `${process.env.NEXTAUTH_URL}/client/login`
        : `${process.env.NEXTAUTH_URL}/admin/login`

      await resend.emails.send({
        from: 'Meetech <noreply@meetech.com>',
        to: user.email,
        subject: 'Welcome to Meetech Client Portal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Meetech!</h2>
            <p>Hello ${user.name},</p>
            <p>Your account has been created successfully. You can now access the ${user.role === 'CLIENT' ? 'client portal' : 'admin panel'}.</p>
            <p><strong>Login Details:</strong></p>
            <ul>
              <li>Email: ${user.email}</li>
              <li>Password: ${data.password}</li>
            </ul>
            <p><strong>Important:</strong> Please change your password after your first login.</p>
            <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Login Now</a>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Meetech Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
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
