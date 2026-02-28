import { prisma } from '@/lib/db/client'
import { hashPassword } from '@/lib/auth/password'
import { randomBytes } from 'crypto'

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(8)
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

export async function getUsers(filters?: {
  role?: string
  isActive?: boolean
  search?: string
}) {
  return prisma.user.findMany({
    where: {
      ...(filters?.role && { role: filters.role }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          clientProjects: true,
          managedProjects: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          clientProjects: true,
          managedProjects: true,
          assignedLeads: true,
        },
      },
    },
  })
}

export async function createUser(data: {
  email: string
  password: string
  name: string
  role: string
  isActive?: boolean
}) {
  const passwordHash = await hashPassword(data.password)

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      isActive: data.isActive ?? true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })
}

export async function updateUser(
  userId: string,
  data: {
    email?: string
    name?: string
    role?: string
    isActive?: boolean
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  })
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword)

  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
    select: {
      id: true,
      email: true,
    },
  })
}

export async function deleteUser(userId: string) {
  // Soft delete by setting isActive to false
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: {
      id: true,
      email: true,
      isActive: true,
    },
  })
}

export async function hardDeleteUser(userId: string) {
  return prisma.$transaction(async (tx) => {
    // Remove or detach records that can block hard-deletion due required relations.
    await tx.lead.updateMany({
      where: { assignedToId: userId },
      data: { assignedToId: null },
    })

    await tx.leadNote.deleteMany({
      where: { authorId: userId },
    })

    await tx.approvalComment.deleteMany({
      where: { authorId: userId },
    })

    await tx.approval.deleteMany({
      where: {
        OR: [{ requestedById: userId }, { reviewedById: userId }],
      },
    })

    await tx.message.deleteMany({
      where: { senderId: userId },
    })

    await tx.changeRequest.deleteMany({
      where: { clientId: userId },
    })

    await tx.meetingRequest.deleteMany({
      where: { clientId: userId },
    })

    await tx.projectFile.deleteMany({
      where: { uploadedById: userId },
    })

    await tx.project.deleteMany({
      where: {
        OR: [{ clientId: userId }, { managerId: userId }],
      },
    })

    return tx.user.delete({
      where: { id: userId },
    })
  })
}

export async function createClientWithCode(data: {
  email: string
  name: string
}) {
  // Random internal password - client never uses it
  const internalPassword = randomBytes(32).toString('hex')
  const passwordHash = await hashPassword(internalPassword)
  const plainCode = generateAccessCode()

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: 'CLIENT',
      isActive: true,
      accessCode: plainCode,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  return { user, plainCode }
}

export async function regenerateAccessCode(userId: string) {
  const plainCode = generateAccessCode()
  await prisma.user.update({
    where: { id: userId },
    data: { accessCode: plainCode },
  })
  return plainCode
}

export async function findUserByAccessCode(code: string) {
  return prisma.user.findFirst({
    where: {
      accessCode: code,
      role: 'CLIENT',
      isActive: true,
    },
  })
}

export async function getClientUsers() {
  return prisma.user.findMany({
    where: {
      role: 'CLIENT',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function getManagerUsers() {
  return prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'EDITOR'] },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
  })
}
