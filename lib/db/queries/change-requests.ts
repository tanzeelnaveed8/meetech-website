import { prisma } from '@/lib/db/client'

export async function getChangeRequestsByProject(projectId: string) {
  return prisma.changeRequest.findMany({
    where: { projectId },
    include: {
      client: {
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

export async function getChangeRequestsByClient(clientId: string) {
  return prisma.changeRequest.findMany({
    where: { clientId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllChangeRequests(filters?: {
  status?: string
  projectId?: string
  clientId?: string
}) {
  return prisma.changeRequest.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.projectId && { projectId: filters.projectId }),
      ...(filters?.clientId && { clientId: filters.clientId }),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
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

export async function getChangeRequestById(requestId: string) {
  return prisma.changeRequest.findUnique({
    where: { id: requestId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          clientId: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function createChangeRequest(data: {
  projectId: string
  clientId: string
  title: string
  message: string
}) {
  return prisma.changeRequest.create({
    data,
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function updateChangeRequestStatus(
  requestId: string,
  status: string,
  adminResponse?: string
) {
  return prisma.changeRequest.update({
    where: { id: requestId },
    data: {
      status,
      adminResponse,
      reviewedAt: new Date(),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function deleteChangeRequest(requestId: string) {
  return prisma.changeRequest.delete({
    where: { id: requestId },
  })
}
