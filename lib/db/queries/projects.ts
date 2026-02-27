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
        include: {
          milestone: {
            select: {
              id: true,
              title: true,
              status: true,
              approvalStatus: true,
            },
          },
        },
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
      approvals: {
        include: {
          requestedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      launchChecklist: true,
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
      launchChecklist: {
        create: {},
      },
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
  approvalStatus?: string
  approvalComment?: string
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
    approvalStatus?: string
    approvedAt?: Date
    approvalComment?: string
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
  milestoneId?: string
  stripeCheckoutUrl?: string
  stripePaymentIntentId?: string
}) {
  return prisma.payment.create({
    data: {
      ...data,
      isUnlocked: !data.milestoneId,
      unlockedAt: data.milestoneId ? undefined : new Date(),
    },
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
    isUnlocked?: boolean
    unlockedAt?: Date
    stripeCheckoutUrl?: string
    stripePaymentIntentId?: string
    milestoneId?: string | null
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

export async function unlockPaymentsForMilestoneApproval(projectId: string, milestoneId: string) {
  return prisma.payment.updateMany({
    where: {
      projectId,
      milestoneId,
      isUnlocked: false,
    },
    data: {
      isUnlocked: true,
      unlockedAt: new Date(),
      status: 'PENDING',
    },
  })
}

export async function getApprovalsByProject(projectId: string) {
  return prisma.approval.findMany({
    where: { projectId },
    include: {
      requestedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      milestone: {
        select: {
          id: true,
          title: true,
          status: true,
          approvalStatus: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createApproval(data: {
  projectId: string
  requestedById: string
  type: string
  title: string
  description?: string
  milestoneId?: string
}) {
  return prisma.approval.create({
    data,
    include: {
      requestedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })
}

export async function reviewApproval(data: {
  approvalId: string
  status: 'APPROVED' | 'CHANGES_REQUESTED'
  reviewedById: string
  decisionComment?: string
}) {
  return prisma.approval.update({
    where: { id: data.approvalId },
    data: {
      status: data.status,
      reviewedById: data.reviewedById,
      reviewedAt: new Date(),
      decisionComment: data.decisionComment,
    },
    include: {
      requestedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      milestone: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
}

export async function addApprovalComment(data: {
  approvalId: string
  authorId: string
  message: string
}) {
  return prisma.approvalComment.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function getOrCreateLaunchChecklist(projectId: string) {
  return prisma.launchChecklist.upsert({
    where: { projectId },
    update: {},
    create: { projectId },
  })
}

export async function updateLaunchChecklist(data: {
  projectId: string
  updatedById: string
  appStoreAssetsReady?: boolean
  privacyPolicyVerified?: boolean
  paymentGatewayTested?: boolean
  analyticsIntegrated?: boolean
  securityAuditCompleted?: boolean
  notes?: string
}) {
  return prisma.launchChecklist.upsert({
    where: { projectId: data.projectId },
    update: {
      appStoreAssetsReady: data.appStoreAssetsReady,
      privacyPolicyVerified: data.privacyPolicyVerified,
      paymentGatewayTested: data.paymentGatewayTested,
      analyticsIntegrated: data.analyticsIntegrated,
      securityAuditCompleted: data.securityAuditCompleted,
      notes: data.notes,
      updatedById: data.updatedById,
    },
    create: {
      projectId: data.projectId,
      appStoreAssetsReady: data.appStoreAssetsReady ?? false,
      privacyPolicyVerified: data.privacyPolicyVerified ?? false,
      paymentGatewayTested: data.paymentGatewayTested ?? false,
      analyticsIntegrated: data.analyticsIntegrated ?? false,
      securityAuditCompleted: data.securityAuditCompleted ?? false,
      notes: data.notes,
      updatedById: data.updatedById,
    },
  })
}
