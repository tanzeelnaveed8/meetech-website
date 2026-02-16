import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getAllChangeRequests } from '@/lib/db/queries/change-requests'

export async function GET(request: NextRequest) {
  const authCheck = await requireRole(['ADMIN', 'EDITOR', 'VIEWER'])
  if (!authCheck.authorized) {
    return authCheck.response
  }

  const { searchParams } = new URL(request.url)

  try {
    const filters = {
      status: searchParams.get('status') || undefined,
      projectId: searchParams.get('projectId') || undefined,
      clientId: searchParams.get('clientId') || undefined,
    }

    const changeRequests = await getAllChangeRequests(filters)

    return NextResponse.json({ changeRequests }, { status: 200 })
  } catch (error) {
    console.error('Get change requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch change requests' },
      { status: 500 }
    )
  }
}
