// Shared TypeScript types for Lead Management and Analytics

// ============================================================================
// Lead Management Types
// ============================================================================

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'IN_PROGRESS'
  | 'CONVERTED'
  | 'LOST';

export type ProjectType =
  | 'Web Development'
  | 'Mobile App'
  | 'Consulting'
  | 'Other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: ProjectType;
  message: string;
  fileUrl?: string;

  // Source Tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrerUrl?: string;
  landingPage: string;
  deviceType: string;
  ipAddress?: string;

  // Lead Management
  status: LeadStatus;
  assignedToId?: string;
  assignedTo?: AdminUser;

  // Compliance
  consentGiven: boolean;
  consentAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations
  notes?: LeadNote[];
}

export interface LeadNote {
  id: string;
  leadId: string;
  lead?: Lead;
  authorId: string;
  author: AdminUser;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedLeads?: Lead[];
  leadNotes?: LeadNote[];
}

export type AdminRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: ProjectType;
  message: string;
  fileUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrerUrl?: string;
  consentGiven: boolean;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  assignedToId?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  assignedToId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export type EventType =
  | 'cta_click'
  | 'scroll_depth'
  | 'form_submit'
  | 'page_view'
  | 'custom';

export interface AnalyticsEvent {
  id: string;
  eventType: EventType;
  eventData: Record<string, any>;
  pageUrl: string;
  pagePath: string;
  pageTitle?: string;
  sessionId: string;
  userId?: string;
  deviceType: string;
  browser?: string;
  os?: string;
  timestamp: Date;
}

export interface UserSession {
  id: string;
  sessionId: string;
  entryPage: string;
  exitPage?: string;
  pageViews: number;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  deviceType: string;
  location?: string;
  referrer?: string;
}

export interface TrackEventParams {
  eventType: EventType;
  eventData: Record<string, any>;
  pageTitle?: string;
}

export interface CreateEventInput {
  eventType: EventType;
  eventData: Record<string, any>;
  pageUrl: string;
  pagePath: string;
  pageTitle?: string;
  sessionId: string;
  userId?: string;
  deviceType: string;
  browser?: string;
  os?: string;
}

export interface CreateSessionInput {
  sessionId: string;
  entryPage: string;
  deviceType: string;
  location?: string;
  referrer?: string;
}

export interface UpdateSessionInput {
  exitPage?: string;
  pageViews?: number;
  duration?: number;
  endedAt?: Date;
}

export interface EventFilters {
  eventType?: EventType;
  sessionId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Analytics Report Types
// ============================================================================

export interface OverviewReport {
  totalEvents: number;
  totalSessions: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
}

export interface ConversionFunnelReport {
  stages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export interface TopPagesReport {
  pages: Array<{
    path: string;
    views: number;
  }>;
}

export interface DeviceBreakdownReport {
  devices: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export interface CTAPerformanceReport {
  ctas: Array<{
    ctaId: string;
    clicks: number;
  }>;
}

export type AnalyticsReportType =
  | 'overview'
  | 'conversion-funnel'
  | 'top-pages'
  | 'device-breakdown'
  | 'cta-performance';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Notification Types
// ============================================================================

export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
}

export interface SlackNotificationData {
  text: string;
  blocks?: any[];
}

export interface LeadNotificationData {
  lead: Lead;
  notificationType: 'new_lead' | 'status_change' | 'assignment';
}
