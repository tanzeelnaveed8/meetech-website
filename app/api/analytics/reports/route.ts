export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date();

    let reportData;

    switch (reportType) {
      case 'overview':
        reportData = await getOverviewReport(startDate, endDate);
        break;
      case 'conversion-funnel':
        reportData = await getConversionFunnelReport(startDate, endDate);
        break;
      case 'top-pages':
        reportData = await getTopPagesReport(startDate, endDate);
        break;
      case 'device-breakdown':
        reportData = await getDeviceBreakdownReport(startDate, endDate);
        break;
      case 'cta-performance':
        reportData = await getCTAPerformanceReport(startDate, endDate);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type. Valid types: overview, conversion-funnel, top-pages, device-breakdown, cta-performance' },
          { status: 400 }
        );
    }

    return NextResponse.json({ report: reportData });
  } catch (error) {
    console.error('Analytics report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics report' },
      { status: 500 }
    );
  }
}

async function getOverviewReport(startDate: Date, endDate: Date) {
  const [totalEvents, totalSessions, uniqueVisitors, avgSessionDuration] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        timestamp: { gte: startDate, lte: endDate },
      },
    }),
    prisma.userSession.count({
      where: {
        startedAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.userSession.findMany({
      where: {
        startedAt: { gte: startDate, lte: endDate },
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    }).then(sessions => sessions.length),
    prisma.userSession.aggregate({
      where: {
        startedAt: { gte: startDate, lte: endDate },
        duration: { not: null },
      },
      _avg: { duration: true },
    }),
  ]);

  return {
    totalEvents,
    totalSessions,
    uniqueVisitors,
    avgSessionDuration: Math.round(avgSessionDuration._avg.duration || 0),
  };
}

async function getConversionFunnelReport(startDate: Date, endDate: Date) {
  const [pageViews, ctaClicks, formSubmissions] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        timestamp: { gte: startDate, lte: endDate },
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        eventType: 'cta_click',
        timestamp: { gte: startDate, lte: endDate },
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        eventType: 'form_submit',
        timestamp: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  return {
    stages: [
      { name: 'Page Views', count: pageViews, percentage: 100 },
      {
        name: 'CTA Clicks',
        count: ctaClicks,
        percentage: pageViews > 0 ? Math.round((ctaClicks / pageViews) * 100) : 0
      },
      {
        name: 'Form Submissions',
        count: formSubmissions,
        percentage: pageViews > 0 ? Math.round((formSubmissions / pageViews) * 100) : 0
      },
    ],
  };
}

async function getTopPagesReport(startDate: Date, endDate: Date) {
  const pageViews = await prisma.analyticsEvent.groupBy({
    by: ['pagePath'],
    where: {
      eventType: 'page_view',
      timestamp: { gte: startDate, lte: endDate },
    },
    _count: { pagePath: true },
    orderBy: { _count: { pagePath: 'desc' } },
    take: 10,
  });

  return {
    pages: pageViews.map(pv => ({
      path: pv.pagePath,
      views: pv._count.pagePath,
    })),
  };
}

async function getDeviceBreakdownReport(startDate: Date, endDate: Date) {
  const deviceBreakdown = await prisma.userSession.groupBy({
    by: ['deviceType'],
    where: {
      startedAt: { gte: startDate, lte: endDate },
    },
    _count: { deviceType: true },
  });

  const total = deviceBreakdown.reduce((sum, d) => sum + d._count.deviceType, 0);

  return {
    devices: deviceBreakdown.map(d => ({
      type: d.deviceType,
      count: d._count.deviceType,
      percentage: total > 0 ? Math.round((d._count.deviceType / total) * 100) : 0,
    })),
  };
}

async function getCTAPerformanceReport(startDate: Date, endDate: Date) {
  const ctaClicks = await prisma.analyticsEvent.findMany({
    where: {
      eventType: 'cta_click',
      timestamp: { gte: startDate, lte: endDate },
    },
    select: { eventData: true },
  });

  // Group by CTA ID
  const ctaStats = ctaClicks.reduce((acc: Record<string, number>, event) => {
    const ctaId = (event.eventData as any)?.ctaId || 'unknown';
    acc[ctaId] = (acc[ctaId] || 0) + 1;
    return acc;
  }, {});

  return {
    ctas: Object.entries(ctaStats)
      .map(([ctaId, clicks]) => ({ ctaId, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10),
  };
}
