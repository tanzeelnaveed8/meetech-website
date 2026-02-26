import { prisma } from '@/lib/db/client'

export async function getMeetingRequestsByClient(clientId: string) {
  return prisma.meetingRequest.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllMeetingRequests(filters?: {
  status?: string
  clientId?: string
}) {
  return prisma.meetingRequest.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.clientId && { clientId: filters.clientId }),
    },
    include: {
      client: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createMeetingRequest(data: {
  clientId: string
  preferredDate: Date
  preferredTimeSlot: string
  topic: string
  notes?: string
}) {
  return prisma.meetingRequest.create({ data })
}

export async function getMeetingRequestById(id: string) {
  return prisma.meetingRequest.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function updateMeetingRequestStatus(
  id: string,
  status: string,
  adminNote?: string
) {
  return prisma.meetingRequest.update({
    where: { id },
    data: {
      status,
      adminNote,
      reviewedAt: new Date(),
    },
    include: {
      client: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function getSlotAvailabilityForDate(date: string) {
  // date is YYYY-MM-DD; find all non-cancelled requests on that day
  const start = new Date(date + 'T00:00:00.000Z')
  const end = new Date(date + 'T23:59:59.999Z')

  const existing = await prisma.meetingRequest.findMany({
    where: {
      preferredDate: { gte: start, lte: end },
      status: { not: 'CANCELLED' },
    },
    select: { preferredTimeSlot: true },
  })

  const bookedSlots = new Set(existing.map((r) => r.preferredTimeSlot))

  return {
    MORNING: !bookedSlots.has('MORNING'),
    AFTERNOON: !bookedSlots.has('AFTERNOON'),
    EVENING: !bookedSlots.has('EVENING'),
  }
}
