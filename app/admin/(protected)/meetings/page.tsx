"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { FiCalendar, FiClock, FiUser, FiMessageSquare, FiCheck, FiX, FiLoader } from "react-icons/fi";
import Card from "@/components/ui/Card";

const TIME_SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning (9 AM – 12 PM)",
  AFTERNOON: "Afternoon (12 PM – 5 PM)",
  EVENING: "Evening (5 PM – 9 PM)",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400",
  CANCELLED: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
};

interface MeetingRequest {
  id: string;
  preferredDate: string;
  preferredTimeSlot: string;
  topic: string;
  notes: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
  client: { id: string; name: string; email: string };
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNoteMap, setAdminNoteMap] = useState<Record<string, string>>({});

  const fetchMeetings = useCallback(async () => {
    try {
      const url = statusFilter
        ? `/api/meeting-requests?status=${statusFilter}`
        : "/api/meeting-requests";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    fetchMeetings();
  }, [fetchMeetings]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/meeting-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: adminNoteMap[id] || undefined }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMeetings((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
        );
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = meetings.filter((m) => m.status === "PENDING").length;
  const confirmed = meetings.filter((m) => m.status === "CONFIRMED").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Meeting Requests</h1>
        <p className="text-sm text-text-muted">Review and respond to client meeting requests</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", count: meetings.length, color: "text-text-primary" },
          { label: "Pending", count: pending, color: "text-amber-600 dark:text-amber-400" },
          { label: "Confirmed", count: confirmed, color: "text-green-600 dark:text-green-400" },
        ].map(({ label, count, color }) => (
          <Card key={label} padding="md" className="rounded-xl">
            <p className="text-xs text-text-muted uppercase font-semibold tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-text-muted font-medium">Filter by status:</span>
        {["", "PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === s
                ? "bg-accent text-text-inverse"
                : "bg-bg-subtle text-text-muted hover:bg-bg-page"
            }`}
          >
            {s === "" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-text-muted">
            <FiLoader className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading meetings...</span>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-16">
            <FiCalendar className="w-12 h-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-muted">No meeting requests found</p>
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="p-5 hover:bg-bg-subtle transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          STATUS_STYLES[meeting.status] ?? STATUS_STYLES.PENDING
                        }`}
                      >
                        {meeting.status}
                      </span>
                      <span className="text-xs text-text-muted">
                        #{meeting.id.slice(-6)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-text-primary">{meeting.topic}</h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <FiUser className="w-3.5 h-3.5 shrink-0" />
                        {meeting.client.name}
                        <span className="text-text-disabled">({meeting.client.email})</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 shrink-0" />
                        {format(new Date(meeting.preferredDate), "EEE, MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5 shrink-0" />
                        {TIME_SLOT_LABELS[meeting.preferredTimeSlot] ?? meeting.preferredTimeSlot}
                      </span>
                    </div>

                    {meeting.notes && (
                      <p className="text-sm text-text-muted flex items-start gap-1.5">
                        <FiMessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {meeting.notes}
                      </p>
                    )}

                    {meeting.adminNote && (
                      <p className="text-xs text-text-muted italic border-l-2 border-accent pl-2">
                        Admin note: {meeting.adminNote}
                      </p>
                    )}

                    <p className="text-xs text-text-disabled">
                      Submitted {format(new Date(meeting.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  {/* Right: actions */}
                  {meeting.status === "PENDING" && (
                    <div className="flex flex-col gap-2 sm:items-end shrink-0 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Admin note (optional)"
                        value={adminNoteMap[meeting.id] ?? ""}
                        onChange={(e) =>
                          setAdminNoteMap((prev) => ({ ...prev, [meeting.id]: e.target.value }))
                        }
                        className="w-full text-xs border border-border-default rounded-lg px-3 py-2 bg-bg-page outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 placeholder:text-text-disabled"
                      />
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => updateStatus(meeting.id, "CONFIRMED")}
                          disabled={updatingId === meeting.id}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {updatingId === meeting.id ? (
                            <FiLoader className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FiCheck className="w-3.5 h-3.5" />
                          )}
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(meeting.id, "CANCELLED")}
                          disabled={updatingId === meeting.id}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-bg-subtle hover:bg-bg-page border border-border-default text-text-muted text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          <FiX className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
