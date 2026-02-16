/**
 * Animation constants for consistent motion across the application
 * Following MEETECH Development constitution principles
 */

/**
 * Standard easing curve for smooth, natural motion
 * cubic-bezier(0.25, 0.46, 0.45, 0.94)
 */
export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Standard duration for primary transitions (in seconds)
 */
export const DURATION = 0.5;

/**
 * Duration for micro-interactions (in seconds)
 */
export const DURATION_FAST = 0.2;

/**
 * Duration for slower, more dramatic animations (in seconds)
 */
export const DURATION_SLOW = 0.8;

/**
 * Stagger delay for child animations (in seconds)
 */
export const STAGGER_DELAY = 0.1;

/**
 * Initial delay before stagger begins (in seconds)
 */
export const STAGGER_DELAY_CHILDREN = 0.08;
