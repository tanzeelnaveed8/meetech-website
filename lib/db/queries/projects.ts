import { prisma } from '@/lib/db/client'
import type { Project, Milestone, ProjectFile, Payment } from '@prisma/client'

export interface ProjectWithRelations extends Project {
  client: {
    id: string
    name: string
    email: string
  }
  manager: {
    id: string
    name: string
    email: string
  }
  milestones: Milestone[]
  files: ProjectFile[]
  payments: Payment[]
  _count: {
    milestones: number
    files: number
    changeRequests: number
    payments: number
  }
}

export async function getProjectsByClient(clientId: string) {
  return prisma.project.findMany({
    where: { clientId },
    include: {
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          milestones: true,
          files: true,
          changeRequests: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getProjectById(
  projectId: string,
  userId: string,
  userRole: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
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
          email: true,
        },
      },
      milestones: {
        orderBy: { order: 'asc' },
      },
      files: {
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        orderBy: { dueDate: 'asc' },
      },
      changeRequests: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          milestones: true,
          files: true,
          changeRequests: true,
          payments: true,
        },
      },
    },
  })

  if (!project) {
    return null
  }

  // Check access control
  const isAdmin = ['ADMIN', 'EDITOR', 'VIEWER'].includes(userRole)
  const isClient = userRole === 'CLIENT' && project.clientId === userId

  if (!isAdmin && !isClient) {
    return null
  }

  return project
}

export async function getAllProjects(filters?: {
  status?: string
  clientId?: string
  managerId?: string
}) {
  return prisma.project.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.clientId && { clientId: filters.clientId }),
      ...(filters?.managerId && { managerId: filters.managerId }),
    },
    include: {
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
          email: true,
        },
      },
      _count: {
        select: {
          milestones: true,
          files: true,
          changeRequests: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createProject(data: {
  name: string
  description?: string
  scope?: string
  status?: string
  progress?: number
  clientId: string
  managerId: string
  startDate?: Date
  expectedEndDate?: Date
}) {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description || 'Project requirements to be added',
      scope: data.scope || 'To be defined based on requirements document',
      status: data.status,
      progress: data.progress,
      clientId: data.clientId,
      managerId: data.managerId,
      startDate: data.startDate,
      expectedEndDate: data.expectedEndDate,
    },
    include: {
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
          email: true,
        },
      },
    },
  })
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string
    description?: string
    scope?: string
    status?: string
    progress?: number
    managerId?: string
    startDate?: Date
    expectedEndDate?: Date
    actualEndDate?: Date
  }
) {
  return prisma.project.update({
    where: { id: projectId },
    data,
    include: {
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
          email: true,
        },
      },
    },
  })
}

export async function deleteProject(projectId: string) {
  return prisma.project.delete({
    where: { id: projectId },
  })
}

// Milestone queries
export async function createMilestone(data: {
  projectId: string
  title: string
  description: string
  status?: string
  order?: number
  expectedDate?: Date
}) {
  return prisma.milestone.create({
    data,
  })
}

export async function updateMilestone(
  milestoneId: string,
  data: {
    title?: string
    description?: string
    status?: string
    order?: number
    expectedDate?: Date
    completedDate?: Date
  }
) {
  return prisma.milestone.update({
    where: { id: milestoneId },
    data,
  })
}

export async function deleteMilestone(milestoneId: string) {
  return prisma.milestone.delete({
    where: { id: milestoneId },
  })
}

// Payment queries
export async function createPayment(data: {
  projectId: string
  amount: number
  currency?: string
  description: string
  status?: string
  dueDate: Date
  paidDate?: Date
}) {
  return prisma.payment.create({
    data,
  })
}

export async function updatePayment(
  paymentId: string,
  data: {
    amount?: number
    currency?: string
    description?: string
    status?: string
    dueDate?: Date
    paidDate?: Date
  }
) {
  return prisma.payment.update({
    where: { id: paymentId },
    data,
  })
}

export async function deletePayment(paymentId: string) {
  return prisma.payment.delete({
    where: { id: paymentId },
  })
}
