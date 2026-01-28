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
