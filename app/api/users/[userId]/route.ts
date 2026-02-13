import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getUserById, updateUser, deleteUser, updateUserPassword } from '@/lib/db/queries/users'
import { z } from 'zod'

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER', 'CLIENT']).optional(),
  isActive: z.boolean().optional(),
})

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { userId } = await params

  try {
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { userId } = await params

  try {
    const body = await request.json()

    // Check if this is a password update
    if (body.password) {
      const passwordData = updatePasswordSchema.parse(body)
      const user = await updateUserPassword(userId, passwordData.password)
      return NextResponse.json({ user, message: 'Password updated successfully' }, { status: 200 })
    }

    // Regular user update
    const data = updateUserSchema.parse(body)
    const user = await updateUser(userId, data)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { userId } = await params

  try {
    const user = await deleteUser(userId)

    return NextResponse.json(
      { message: 'User deactivated successfully', user },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
