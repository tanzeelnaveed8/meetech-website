import { auth } from './auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await auth()

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  return {
    authorized: true,
    session,
  }
}

export async function requireRole(allowedRoles: string[]) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const userRole = session.user.role

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    session,
  }
}

export async function requireOwnership(resourceUserId: string) {
  const session = await auth()

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const userRole = session.user.role
  const userId = session.user.id

  // Admins can access any resource
  const isAdmin = ['ADMIN', 'EDITOR'].includes(userRole)

  // User owns the resource or is an admin
  if (userId === resourceUserId || isAdmin) {
    return {
      authorized: true,
      session,
    }
  }

  return {
    authorized: false,
    response: NextResponse.json(
      { error: 'Forbidden', message: 'You do not have access to this resource' },
      { status: 403 }
    ),
  }
}
