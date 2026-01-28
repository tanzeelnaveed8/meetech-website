import { prisma } from '../client'
import { Prisma } from '@prisma/client'

export async function createEvent(data: {
  eventType: string
  eventData: Prisma.JsonValue
  pageUrl: string
  pagePath: string
  pageTitle?: string
  sessionId: string
  userId?: string
  deviceType: string
  browser?: string
  os?: string
}) {
  return prisma.analyticsEvent.create({
    data: {
      ...data,
      eventData: data.eventData as any,
    },
  })
}

export async function getEvents(params?: {
  eventType?: string
  sessionId?: string
  pageUrl?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  const { eventType, sessionId, pageUrl, startDate, endDate, limit = 100 } = params || {}

  const where: Prisma.AnalyticsEventWhereInput = {}

  if (eventType) where.eventType = eventType
  if (sessionId) where.sessionId = sessionId
  if (pageUrl) where.pageUrl = pageUrl
  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  const [events, total] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    }),
    prisma.analyticsEvent.count({ where }),
  ])

  return { data: events, total }
}

export async function createSession(data: {
  sessionId: string
  entryPage: string
  deviceType: string
  location?: string
  referrer?: string
}) {
  return prisma.userSession.create({
    data,
  })
}

export async function updateSession(
  sessionId: string,
  data: {
    exitPage?: string
    pageViews?: number
    endedAt?: Date
    duration?: number
  }
) {
  return prisma.userSession.update({
    where: { sessionId },
    data,
  })
}

export async function getSession(sessionId: string) {
  return prisma.userSession.findUnique({
    where: { sessionId },
  })
}

export async function getSessionWithEvents(sessionId: string) {
  const [session, events] = await Promise.all([
    prisma.userSession.findUnique({
      where: { sessionId },
    }),
    prisma.analyticsEvent.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    }),
  ])

  return session ? { ...session, events } : null
}
