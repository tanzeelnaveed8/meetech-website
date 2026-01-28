import { prisma } from '../client'
import { Prisma } from '@prisma/client'

// Lead status constants (replacing enum)
export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  IN_PROGRESS: 'IN_PROGRESS',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus]

export async function createLead(data: {
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  message: string
  fileUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrerUrl?: string
  landingPage: string
  deviceType: string
  ipAddress?: string
  consentGiven: boolean
  consentAt?: Date
}) {
  return prisma.lead.create({
    data,
  })
}

export async function getLeads(params?: {
  status?: LeadStatusType
  assignedToId?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}) {
  const { status, assignedToId, startDate, endDate, page = 1, limit = 50 } = params || {}

  const where: Prisma.LeadWhereInput = {}

  if (status) where.status = status
  if (assignedToId) where.assignedToId = assignedToId
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ])

  return {
    data: leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      notes: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function updateLead(
  id: string,
  data: {
    status?: LeadStatusType
    assignedToId?: string | null
  }
) {
  return prisma.lead.update({
    where: { id },
    data,
  })
}

export async function getLeadsByStatus(status: LeadStatusType) {
  return prisma.lead.findMany({
    where: { status },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createLeadNote(data: {
  leadId: string
  authorId: string
  note: string
}) {
  return prisma.leadNote.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}
