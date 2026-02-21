import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/db/client'

// GET /api/messages/projects   List all projects (with client info) for starting conversations
// Admin/Editor only
export async function GET() {
  const authCheck = await requireAuth()
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { role } = authCheck.session!.user
  if (!['ADMIN', 'EDITOR'].includes(role)) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        conversation: {
          select: { id: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error('Get projects for messaging error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
