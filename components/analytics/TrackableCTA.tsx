'use client';

import { trackCTAClick } from '@/lib/analytics/tracker';

interface TrackableCTAProps {
  ctaId: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function TrackableCTA({
  ctaId,
  href,
  onClick,
  children,
  className = '',
  target,
  rel,
}: TrackableCTAProps) {
  const handleClick = () => {
    // Extract text content for tracking
    const ctaText = typeof children === 'string'
      ? children
      : 'CTA Click';

    trackCTAClick(ctaId, ctaText, href);

    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
