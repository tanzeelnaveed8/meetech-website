// Application constants

// ============================================================================
// Lead Management Constants
// ============================================================================

export const LEAD_STATUSES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-green-100 text-green-800' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-800' },
] as const;

export const PROJECT_TYPES = [
  'Web Development',
  'Mobile App',
  'Consulting',
  'Other',
] as const;

export const ADMIN_ROLES = [
  { value: 'ADMIN', label: 'Administrator', description: 'Full access to all features' },
  { value: 'EDITOR', label: 'Editor', description: 'Can manage leads and content' },
  { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
  { value: 'CLIENT', label: 'Client', description: 'Access to assigned projects only' },
] as const;

// ============================================================================
// Rate Limiting Constants
// ============================================================================

export const RATE_LIMITS = {
  CONTACT_FORM: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
  API_DEFAULT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// ============================================================================
// File Upload Constants
// ============================================================================

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

// ============================================================================
// Analytics Constants
// ============================================================================

export const EVENT_TYPES = [
  'cta_click',
  'scroll_depth',
  'form_submit',
  'page_view',
  'custom',
] as const;

export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

export const DEVICE_TYPES = ['mobile', 'tablet', 'desktop'] as const;

export const ANALYTICS_REPORT_TYPES = [
  { value: 'overview', label: 'Overview' },
  { value: 'conversion-funnel', label: 'Conversion Funnel' },
  { value: 'top-pages', label: 'Top Pages' },
  { value: 'device-breakdown', label: 'Device Breakdown' },
  { value: 'cta-performance', label: 'CTA Performance' },
] as const;

// ============================================================================
// Pagination Constants
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

// ============================================================================
// Date Format Constants
// ============================================================================

export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a',
} as const;

// ============================================================================
// Notification Constants
// ============================================================================

export const NOTIFICATION_TYPES = {
  NEW_LEAD: 'new_lead',
  STATUS_CHANGE: 'status_change',
  ASSIGNMENT: 'assignment',
} as const;

// ============================================================================
// Session Constants
// ============================================================================

export const SESSION = {
  UPDATE_INTERVAL_MS: 30000, // 30 seconds
  STORAGE_KEY: 'analytics_session',
  CONSENT_KEY: 'analytics_consent',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized - Please log in',
  FORBIDDEN: 'Forbidden - Insufficient permissions',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  LEAD_CREATED: 'Thank you for your inquiry. We will contact you soon.',
  LEAD_UPDATED: 'Lead updated successfully',
  NOTE_ADDED: 'Note added successfully',
  EXPORT_READY: 'Export completed successfully',
} as const;

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  COMPANY_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 5000,
  NOTE_MAX_LENGTH: 2000,
} as const;

// ============================================================================
// Admin Navigation
// ============================================================================

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/change-requests', label: 'Change Requests' },
] as const;
