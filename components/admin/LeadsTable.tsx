'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Lead {
  id: string;
  name: string;
  email: string;
  projectType: string;
  status: string;
  createdAt: string;
  utmSource?: string;
  deviceType: string;
  assignedTo?: {
    name: string;
  };
}

interface LeadsTableProps {
  initialLeads?: Lead[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

export default function LeadsTable({ initialLeads = [] }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', currentPage.toString());

      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();

      setLeads(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400';
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400';
      case 'CONVERTED':
        return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400';
      case 'LOST':
        return 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            id="status-filter"
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={STATUS_OPTIONS}
          />
          <Input
            id="start-date"
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            id="end-date"
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-3" />
            Loading...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-bg-subtle transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">{lead.name}</div>
                      {lead.assignedTo && (
                        <div className="text-xs text-text-muted">Assigned: {lead.assignedTo.name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="text-sm text-accent hover:text-accent-hover transition-colors duration-200">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-body">
                      {lead.projectType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted">
                      {lead.utmSource || 'Direct'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-bg-subtle px-4 py-3 border-t border-border-default flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
