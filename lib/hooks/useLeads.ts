'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadFilters } from '@/lib/types';

/**
 * Custom hook for fetching and managing leads
 */
export function useLeads(filters?: LeadFilters) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLeads();
  };

  return { leads, loading, error, pagination, refetch };
}

/**
 * Custom hook for fetching a single lead
 */
export function useLead(leadId: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) return;
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }

      const data = await response.json();
      setLead(data.lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lead');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLead();
  };

  return { lead, loading, error, refetch };
}

/**
 * Custom hook for updating lead status
 */
export function useUpdateLead(leadId: string) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLead = async (updates: { status?: string; assignedToId?: string }) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update lead');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update lead';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return { updateLead, updating, error };
}
