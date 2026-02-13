import { prisma } from '@/lib/db/client'
import { hashPassword } from '@/lib/auth/password'

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
