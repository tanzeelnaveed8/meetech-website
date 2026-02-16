export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { getLeads } from '@/lib/db/queries/leads'
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await requireAuth()
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as any
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

    // Fetch all leads matching criteria (no pagination for export)
    const result = await getLeads({
      status,
      startDate,
      endDate,
      limit: 10000, // Max export limit
    })

    // Generate CSV
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Project Type',
      'Message',
      'Status',
      'Source',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Device Type',
      'Assigned To',
      'Created At',
    ]

    const rows = result.data.map((lead) => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone || '',
      lead.company || '',
      lead.projectType,
      lead.message.replace(/"/g, '""'), // Escape quotes
      lead.status,
      lead.referrerUrl || '',
      lead.utmSource || '',
      lead.utmMedium || '',
      lead.utmCampaign || '',
      lead.deviceType,
      lead.assignedTo?.name || '',
      lead.createdAt.toISOString(),
    ])

    // Build CSV content
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to export leads' },
      { status: 500 }
    )
  }
}
