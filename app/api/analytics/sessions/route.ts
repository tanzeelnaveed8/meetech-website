export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession, updateSession, getSession } from '@/lib/db/queries/analytics';

const createSessionSchema = z.object({
  sessionId: z.string(),
  entryPage: z.string(),
  referrer: z.string().optional(),
});

const updateSessionSchema = z.object({
  sessionId: z.string(),
  exitPage: z.string().optional(),
  pageViews: z.number().optional(),
  duration: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    // Extract device info from user agent
    const userAgent = request.headers.get('user-agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Get location from IP (simplified - in production use a geolocation service)
    const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown';
    const location = await getLocationFromIP(ip);

    // Create session
    const session = await createSession({
      ...validatedData,
      deviceType,
      location,
    });

    return NextResponse.json({ success: true, sessionId: session.sessionId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid session data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateSessionSchema.parse(body);

    // Update session
    const session = await updateSession(validatedData.sessionId, {
      exitPage: validatedData.exitPage,
      pageViews: validatedData.pageViews,
      duration: validatedData.duration,
      endedAt: validatedData.exitPage ? new Date() : undefined,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid session data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// Helper functions
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

async function getLocationFromIP(ip: string): Promise<string> {
  // Simplified location detection
  // In production, use a service like ipapi.co or MaxMind GeoIP
  if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
    return 'Local';
  }
  return 'Unknown';
}
