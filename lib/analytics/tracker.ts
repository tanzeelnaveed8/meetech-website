// Analytics tracking utility for client-side event tracking

type EventType = 'cta_click' | 'scroll_depth' | 'form_submit' | 'page_view' | 'custom';

interface TrackEventParams {
  eventType: EventType;
  eventData: Record<string, any>;
  pageTitle?: string;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  pageViews: number;
  entryPage: string;
}

class AnalyticsTracker {
  private sessionData: SessionData | null = null;
  private consentGiven: boolean = false;
  private scrollDepthTracked: Set<number> = new Set();
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.checkConsent();
    }
  }

  // Initialize or restore session
  private initializeSession() {
    const stored = sessionStorage.getItem('analytics_session');
    if (stored) {
      this.sessionData = JSON.parse(stored);
    } else {
      this.sessionData = {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        entryPage: window.location.pathname,
      };
      this.saveSession();
      this.createSessionOnServer();
    }

    // Update session every 30 seconds
    this.sessionCheckInterval = setInterval(() => {
      this.updateSessionOnServer();
    }, 30000);
  }

  // Check if user has given consent
  private checkConsent() {
    const consent = localStorage.getItem('analytics_consent');
    this.consentGiven = consent === 'true';
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save session to sessionStorage
  private saveSession() {
    if (this.sessionData) {
      sessionStorage.setItem('analytics_session', JSON.stringify(this.sessionData));
    }
  }

  // Create session on server
  private async createSessionOnServer() {
    if (!this.consentGiven || !this.sessionData) return;

    try {
      await fetch('/api/analytics/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionData.sessionId,
          entryPage: this.sessionData.entryPage,
          referrer: document.referrer || undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to create analytics session:', error);
    }
  }

  // Update session on server
  private async updateSessionOnServer() {
    if (!this.consentGiven || !this.sessionData) return;

    const duration = Math.floor((Date.now() - this.sessionData.startTime) / 1000);

    try {
      await fetch('/api/analytics/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionData.sessionId,
          exitPage: window.location.pathname,
          pageViews: this.sessionData.pageViews,
          duration,
        }),
      });
    } catch (error) {
      console.error('Failed to update analytics session:', error);
    }
  }

  // Set consent status
  setConsent(granted: boolean) {
    this.consentGiven = granted;
    localStorage.setItem('analytics_consent', granted.toString());

    if (granted && this.sessionData) {
      this.createSessionOnServer();
    }
  }

  // Track generic event
  async trackEvent({ eventType, eventData, pageTitle }: TrackEventParams) {
    if (!this.consentGiven || !this.sessionData) return;

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          eventData,
          pageUrl: window.location.href,
          pagePath: window.location.pathname,
          pageTitle: pageTitle || document.title,
          sessionId: this.sessionData.sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  // Track page view
  trackPageView() {
    if (this.sessionData) {
      this.sessionData.pageViews++;
      this.saveSession();
    }

    this.trackEvent({
      eventType: 'page_view',
      eventData: {
        path: window.location.pathname,
        referrer: document.referrer,
      },
    });

    // Reset scroll depth tracking for new page
    this.scrollDepthTracked.clear();
  }

  // Track CTA click
  trackCTAClick(ctaId: string, ctaText: string, ctaUrl?: string) {
    this.trackEvent({
      eventType: 'cta_click',
      eventData: {
        ctaId,
        ctaText,
        ctaUrl,
      },
    });
  }

  // Track form submission
  trackFormSubmit(formId: string, formType: string) {
    this.trackEvent({
      eventType: 'form_submit',
      eventData: {
        formId,
        formType,
      },
    });
  }

  // Track scroll depth
  trackScrollDepth(depth: number) {
    if (this.scrollDepthTracked.has(depth)) return;

    this.scrollDepthTracked.add(depth);
    this.trackEvent({
      eventType: 'scroll_depth',
      eventData: {
        depth,
        maxScroll: Math.max(...Array.from(this.scrollDepthTracked)),
      },
    });
  }

  // Initialize scroll tracking
  initScrollTracking() {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);

          // Track at 25%, 50%, 75%, 100%
          if (scrollPercent >= 25 && !this.scrollDepthTracked.has(25)) {
            this.trackScrollDepth(25);
          }
          if (scrollPercent >= 50 && !this.scrollDepthTracked.has(50)) {
            this.trackScrollDepth(50);
          }
          if (scrollPercent >= 75 && !this.scrollDepthTracked.has(75)) {
            this.trackScrollDepth(75);
          }
          if (scrollPercent >= 100 && !this.scrollDepthTracked.has(100)) {
            this.trackScrollDepth(100);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }

  // Cleanup on unmount
  destroy() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    this.updateSessionOnServer();
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null;

export function getAnalyticsTracker(): AnalyticsTracker {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker();
  }
  return trackerInstance;
}

// Convenience functions
export function trackPageView() {
  getAnalyticsTracker().trackPageView();
}

export function trackCTAClick(ctaId: string, ctaText: string, ctaUrl?: string) {
  getAnalyticsTracker().trackCTAClick(ctaId, ctaText, ctaUrl);
}

export function trackFormSubmit(formId: string, formType: string) {
  getAnalyticsTracker().trackFormSubmit(formId, formType);
}

export function setAnalyticsConsent(granted: boolean) {
  getAnalyticsTracker().setConsent(granted);
}

export function initScrollTracking() {
  return getAnalyticsTracker().initScrollTracking();
}
