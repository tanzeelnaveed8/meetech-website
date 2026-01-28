// Google Analytics 4 integration

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date | 'update',
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize GA4
export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load gtag.js script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // IP anonymization for GDPR compliance
    cookie_flags: 'SameSite=None;Secure',
  });
}

// Track page view
export function trackGAPageView(url: string) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Track custom event
export function trackGAEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
}

// Track CTA click
export function trackGACTAClick(ctaId: string, ctaText: string, ctaUrl?: string) {
  trackGAEvent('cta_click', {
    cta_id: ctaId,
    cta_text: ctaText,
    cta_url: ctaUrl,
  });
}

// Track form submission
export function trackGAFormSubmit(formId: string, formType: string) {
  trackGAEvent('form_submit', {
    form_id: formId,
    form_type: formType,
  });
}

// Track scroll depth
export function trackGAScrollDepth(depth: number) {
  trackGAEvent('scroll_depth', {
    depth_percentage: depth,
  });
}

// Enable/disable GA based on consent
export function setGAConsent(granted: boolean) {
  if (!window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
}
