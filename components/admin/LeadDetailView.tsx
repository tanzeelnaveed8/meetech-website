'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string;
  message: string;
  fileUrl: string | null;
  status: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerUrl: string | null;
  landingPage: string;
  deviceType: string;
  ipAddress: string | null;
  consentGiven: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  notes?: Array<{
    id: string;
    note: string;
    createdAt: Date;
    author: {
      name: string;
      email: string;
    };
  }>;
}

interface LeadDetailViewProps {
  lead: Lead;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-green-100 text-green-800' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-800' },
];

export default function LeadDetailView({ lead }: LeadDetailViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add note');
      }

      setNewNote('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const currentStatusColor = STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm transition-colors"
        >
          ← Back to Leads
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-medium ${currentStatusColor}`}>
            {STATUS_OPTIONS.find(s => s.value === status)?.label || status}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 text-gray-900">Lead Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-gray-600">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-600">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.email}</dd>
              </div>
              {lead.phone && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.phone}</dd>
                </div>
              )}
              {lead.company && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.company}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-600">Project Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.projectType}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-600">Submitted</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <dt className="text-xs font-medium text-gray-600 mb-2">Message</dt>
              <dd className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
                {lead.message}
              </dd>
            </div>

            {lead.fileUrl && (
              <div className="mt-6">
                <dt className="text-xs font-medium text-gray-600 mb-2">Attachment</dt>
                <a
                  href={lead.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
                >
                  View Attachment →
                </a>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 text-gray-900">Notes</h2>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this lead..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={3}
                disabled={isAddingNote}
              />
              <button
                type="submit"
                disabled={isAddingNote || !newNote.trim()}
                className="mt-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-4">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-gray-900 pl-4 py-2">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {note.author.name} • {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No notes yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Update Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  disabled={isUpdating || status === option.value}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    status === option.value
                      ? option.color
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  } disabled:cursor-not-allowed`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Tracking */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Source Tracking</h3>
            <dl className="space-y-3">
              {lead.utmSource && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">UTM Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.utmSource}</dd>
                </div>
              )}
              {lead.utmMedium && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">UTM Medium</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.utmMedium}</dd>
                </div>
              )}
              {lead.utmCampaign && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">UTM Campaign</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.utmCampaign}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-600">Landing Page</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{lead.landingPage}</dd>
              </div>
              {lead.referrerUrl && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">Referrer</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">{lead.referrerUrl}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-600">Device</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.deviceType}</dd>
              </div>
              {lead.ipAddress && (
                <div>
                  <dt className="text-xs font-medium text-gray-600">IP Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.ipAddress}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Assignment */}
          {lead.assignedTo && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold mb-4 text-gray-900">Assigned To</h3>
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.assignedTo.name}</p>
                <p className="text-xs text-gray-600">{lead.assignedTo.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
