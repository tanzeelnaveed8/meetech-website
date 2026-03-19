// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { FiCalendar, FiClock, FiFileText, FiMessageSquare, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { useToast } from '@/components/ui/Toast';

// const TIME_SLOTS = [
//   { value: 'MORNING', label: 'Morning', sublabel: '9 AM – 12 PM' },
//   { value: 'AFTERNOON', label: 'Afternoon', sublabel: '12 PM – 5 PM' },
//   { value: 'EVENING', label: 'Evening', sublabel: '5 PM – 9 PM' },
// ] as const;

// type TimeSlot = (typeof TIME_SLOTS)[number]['value'];

// interface MeetingRequestRow {
//   id: string;
//   preferredDate: string;
//   preferredTimeSlot: string;
//   topic: string;
//   notes: string | null;
//   status: string;
//   createdAt: string;
// }

// function formatDate(dateStr: string) {
//   return new Date(dateStr).toLocaleDateString(undefined, {
//     weekday: 'short',
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// }

// function formatSlot(slot: string) {
//   const found = TIME_SLOTS.find((s) => s.value === slot);
//   return found ? `${found.label} (${found.sublabel})` : slot;
// }

// function getMonthYear(d: Date) {
//   return { year: d.getFullYear(), month: d.getMonth() };
// }

// function toYYYYMMDD(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// }

// const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// export default function BookMeetingPage() {
//   const { success: toastSuccess, error: toastError } = useToast();
//   const [calendarMonth, setCalendarMonth] = useState(() => new Date());
//   const [selectedDate, setSelectedDate] = useState('');
//   const [slotsAvailability, setSlotsAvailability] = useState<Record<string, boolean> | null>(null);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [preferredTimeSlot, setPreferredTimeSlot] = useState<TimeSlot | ''>('');
//   const [topic, setTopic] = useState('');
//   const [notes, setNotes] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [requests, setRequests] = useState<MeetingRequestRow[]>([]);
//   const [loadingRequests, setLoadingRequests] = useState(true);

//   const tomorrow = useMemo(() => {
//     const t = new Date();
//     t.setDate(t.getDate() + 1);
//     t.setHours(0, 0, 0, 0);
//     return t;
//   }, []);

//   const calendarDays = useMemo(() => {
//     const { year, month } = getMonthYear(calendarMonth);
//     const first = new Date(year, month, 1);
//     const last = new Date(year, month + 1, 0);
//     const startPad = first.getDay();
//     const endPad = 6 - last.getDay();
//     const days: (Date | null)[] = [];
//     for (let i = 0; i < startPad; i++) days.push(null);
//     for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
//     for (let i = 0; i < endPad; i++) days.push(null);
//     return days;
//   }, [calendarMonth]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const res = await fetch('/api/meeting-requests');
//         if (res.ok) {
//           const data = await res.json();
//           setRequests(data);
//         }
//       } catch {
//         // ignore
//       } finally {
//         setLoadingRequests(false);
//       }
//     };
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     if (!selectedDate) {
//       setSlotsAvailability(null);
//       setPreferredTimeSlot('');
//       return;
//     }
//     let cancelled = false;
//     setLoadingSlots(true);
//     setSlotsAvailability(null);
//     setPreferredTimeSlot('');
//     fetch(`/api/meeting-requests/availability?date=${selectedDate}`)
//       .then((res) => (res.ok ? res.json() : null))
//       .then((data) => {
//         if (!cancelled && data?.slots) setSlotsAvailability(data.slots);
//       })
//rimsha---
// .then((data) => {
//   if (!cancelled && data?.slots) {
//     setSlotsAvailability(data.slots);
//   } else if (!cancelled) {
//     setSlotsAvailability({
//       MORNING: false,
//       AFTERNOON: false,
//       EVENING: false,
//     });
//   }
// })----------
//       .catch(() => {})
//       .finally(() => {
//         if (!cancelled) setLoadingSlots(false);
//       });
//     return () => { cancelled = true; };
//   }, [selectedDate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError('');
//     if (!selectedDate) {
//       setFormError('Please select a date from the calendar');
//       return;
//     }
//     if (!preferredTimeSlot) {
//       setFormError('Please select an available time slot');
//       return;
//     }
//     if (!topic.trim()) {
//       setFormError('Please enter a meeting topic');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const res = await fetch('/api/meeting-requests', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           preferredDate: new Date(selectedDate + 'T12:00:00.000Z').toISOString(),
//           preferredTimeSlot,
//           topic: topic.trim(),
//           notes: notes.trim() || undefined,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toastSuccess('Meeting request submitted. Your project manager will confirm the slot.');
//         setSelectedDate('');
//         setPreferredTimeSlot('');
//         setTopic('');
//         setNotes('');
//         setSlotsAvailability(null);
//         setRequests((prev) => [data, ...prev]);
//       } else {
//         setFormError(data.error || 'Failed to submit request');
//       }
//     } catch {
//       toastError('Something went wrong. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const today = useMemo(() => {
//     const t = new Date();
//     t.setHours(0, 0, 0, 0);
//     return t;
//   }, []);

//   const isDateSelectable = (d: Date) => d >= tomorrow;
//   const isDateSelected = (d: Date) => selectedDate === toYYYYMMDD(d);
//   const isToday = (d: Date) => toYYYYMMDD(d) === toYYYYMMDD(today);

//   return (
//     <div className="max-w-3xl mx-auto space-y-10">
//       {/* Page header */}
//       <div className="flex flex-col sm:flex-row sm:items-start gap-4">
//         <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent-muted flex items-center justify-center">
//           <FiCalendar className="w-7 h-7 text-accent" aria-hidden />
//         </div>
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-1.5">
//             Book Your Meeting
//           </h1>
//           <p className="text-text-muted text-sm sm:text-base max-w-xl">
//             Request a meeting with your project manager. Choose your preferred date and time slot.
//           </p>
//         </div>
//       </div>

//       {/* Form card */}
//       <Card variant="elevated" padding="lg" className="rounded-2xl shadow-lg border-border-default/80">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {formError && (
//             <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 text-sm text-red-700 dark:text-red-300">
//               {formError}
//             </div>
//           )}

//           {/* Calendar scheduling */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-semibold text-text-primary">
//                 Select date <span className="text-red-500">*</span>
//               </span>
//               <div className="flex items-center gap-1">
//                 <button
//                   type="button"
//                   onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
//                   className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
//                   aria-label="Previous month"
//                 >
//                   <FiChevronLeft className="w-4 h-4" />
//                 </button>
//                 <span className="min-w-[150px] text-center text-sm font-semibold text-text-primary">
//                   {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
//                   className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
//                   aria-label="Next month"
//                 >
//                   <FiChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//             <div className="rounded-xl border border-border-default overflow-hidden">
//               <div className="grid grid-cols-7 bg-bg-subtle/60">
//                 {WEEKDAY_LABELS.map((label) => (
//                   <div
//                     key={label}
//                     className="py-2 text-center text-[11px] font-semibold text-text-muted tracking-wide uppercase"
//                   >
//                     {label}
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 gap-px bg-border-default/40">
//                 {calendarDays.map((day, i) => {
//                   if (!day) {
//                     return <div key={`empty-${i}`} className="aspect-square bg-bg-card" />;
//                   }
//                   const selectable = isDateSelectable(day);
//                   const selected = isDateSelected(day);
//                   const todayMark = isToday(day);
//                   return (
//                     <button
//                       key={toYYYYMMDD(day)}
//                       type="button"
//                       disabled={!selectable || isSubmitting}
//                       onClick={() => selectable && setSelectedDate(toYYYYMMDD(day))}
//                       className={`aspect-square flex items-center justify-center text-sm font-medium transition-all bg-bg-card ${
//                         selected
//                           ? 'bg-accent text-text-inverse shadow-inner'
//                           : selectable
//                             ? 'text-text-primary hover:bg-accent-muted hover:text-accent'
//                             : 'text-text-disabled cursor-not-allowed opacity-40'
//                       }`}
//                     >
//                       <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
//                         selected
//                           ? 'bg-accent text-text-inverse shadow-md'
//                           : todayMark
//                             ? 'ring-[0.5] ring-accent/40 font-bold'
//                             : ''
//                       }`}>
//                         {day.getDate()}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Available time slots for selected date */}
//             {selectedDate && (
//               <div className="pt-2 border-t border-border-default">
//                 <span className="mb-2 block text-sm font-semibold text-text-primary">
//                   Available time slots <span className="text-red-500">*</span>
//                 </span>
//                 {loadingSlots ? (
//                   <p className="text-sm text-text-muted py-4">Loading availability...</p>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                     {TIME_SLOTS.map((slot) => {
//                       const available = slotsAvailability?.[slot.value] ?? false;
//                       const isSelected = preferredTimeSlot === slot.value;
//                       return (
//                         <button
//                           key={slot.value}
//                           type="button"
//                           disabled={!available || isSubmitting}
//                           onClick={() => available && setPreferredTimeSlot(slot.value)}
//                           className={`relative flex flex-col items-center rounded-xl border-2 px-3 py-3.5 text-center transition-all duration-200 ${
//                             !available
//                               ? 'border-border-default bg-bg-subtle text-text-disabled cursor-not-allowed opacity-70'
//                               : isSelected
//                                 ? 'border-accent bg-accent-muted text-accent shadow-sm'
//                                 : 'border-border-default bg-bg-surface text-text-body hover:border-border-strong hover:bg-bg-subtle'
//                           }`}
//                         >
//                           {isSelected && (
//                             <FiCheckCircle className="absolute top-2 right-2 w-4 h-4 text-accent" aria-hidden />
//                           )}
//                           <FiClock className="w-5 h-5 mb-1.5 text-current opacity-80" aria-hidden />
//                           <span className="text-xs font-semibold">{slot.label}</span>
//                           <span className="text-[10px] opacity-80 mt-0.5">
//                             {available ? slot.sublabel : 'Unavailable'}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <hr className="border-border-default" aria-hidden />

//           {/* Topic & notes */}
//           <div className="space-y-5">
//             <Input
//               id="topic"
//               type="text"
//               label="Meeting topic"
//               isRequired
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               placeholder="e.g. Project review, design feedback"
//               disabled={isSubmitting}
//               leftIcon={<FiFileText className="h-5 w-5" />}
//               className="rounded-xl py-3.5"
//             />
//             <div>
//               <label
//                 htmlFor="notes"
//                 className="mb-2 block text-sm font-semibold text-text-primary"
//               >
//                 Additional notes
//               </label>
//               <div className="relative">
//                 <FiMessageSquare className="absolute left-3.5 top-3.5 w-5 h-5 text-text-muted pointer-events-none" />
//                 <textarea
//                   id="notes"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Any specific points you want to cover..."
//                   rows={3}
//                   className="w-full rounded-xl border border-border-default bg-bg-surface pl-11 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none focus:ring-[0.5] focus:ring-accent/20 transition-colors disabled:opacity-50 resize-none"
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="pt-2">
//             <Button
//               type="submit"
//               size="lg"
//               isLoading={isSubmitting}
//               disabled={isSubmitting}
//               leftIcon={<FiCalendar className="w-5 h-5" />}
//               className="w-full sm:w-auto min-w-[200px] shadow-md hover:shadow-lg transition-shadow"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit meeting request'}
//             </Button>
//           </div>
//         </form>
//       </Card>

//       {/* Past requests */}
//       {requests.length > 0 && (
//         <Card variant="default" padding="lg" className="rounded-2xl">
//           <h2 className="text-base font-semibold text-text-primary tracking-tight mb-1">
//             Your meeting requests
//           </h2>
//           <p className="text-sm text-text-muted mb-5">Status and history of your requests</p>
//           {loadingRequests ? (
//             <p className="text-sm text-text-muted">Loading...</p>
//           ) : (
//             <ul className="space-y-3">
//               {requests.map((req) => (
//                 <li
//                   key={req.id}
//                   className="flex flex-wrap items-start gap-3 p-4 rounded-xl border border-border-default bg-bg-subtle/50 hover:border-border-strong/50 transition-colors"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-text-primary">{req.topic}</p>
//                     <p className="text-sm text-text-muted mt-1">
//                       {formatDate(req.preferredDate)} · {formatSlot(req.preferredTimeSlot)}
//                     </p>
//                     {req.notes && (
//                       <p className="text-sm text-text-muted mt-1">{req.notes}</p>
//                     )}
//                   </div>
//                   <span
//                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
//                       req.status === 'CONFIRMED'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
//                         : req.status === 'CANCELLED'
//                           ? 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
//                           : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
//                     }`}
//                   >
//                     {req.status === 'CONFIRMED' && <FiCheckCircle className="w-3.5 h-3.5" />}
//                     {req.status}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </Card>
//       )}
//     </div>
//   );
// }


"use client";

import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import Spinner from '@/components/ui/Spinner';

/* ----------------------------- CONSTANTS ----------------------------- */

const TIME_SLOTS = [
  { value: "MORNING", label: "Morning", sublabel: "9 AM – 12 PM", icon: "🌅" },
  { value: "AFTERNOON", label: "Afternoon", sublabel: "12 PM – 5 PM", icon: "☀️" },
  { value: "EVENING", label: "Evening", sublabel: "5 PM – 9 PM", icon: "🌙" },
] as const;

type TimeSlot = (typeof TIME_SLOTS)[number]["value"];

interface MeetingRequestRow {
  id: string;
  preferredDate: string;
  preferredTimeSlot: string;
  topic: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ----------------------------- HELPERS ----------------------------- */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSlot(slot: string) {
  const found = TIME_SLOTS.find((s) => s.value === slot);
  return found ? `${found.label} (${found.sublabel})` : slot;
}

function getMonthYear(d: Date) {
  return { year: d.getFullYear(), month: d.getMonth() };
}

function toYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ----------------------------- COMPONENT ----------------------------- */

export default function BookMeetingPage() {
  const { success: toastSuccess, error: toastError } = useToast();

  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [slotsAvailability, setSlotsAvailability] = useState<Record<string, boolean> | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<TimeSlot | "">("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [requests, setRequests] = useState<MeetingRequestRow[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
 


  const tomorrow = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const calendarDays = useMemo(() => {
    const { year, month } = getMonthYear(calendarMonth);
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const endPad = 6 - last.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    for (let i = 0; i < endPad; i++) days.push(null);
    return days;
  }, [calendarMonth]);

  /* ----------------------------- FETCH REQUESTS ----------------------------- */

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/meeting-requests");
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  /* ----------------------------- FETCH AVAILABILITY ----------------------------- */

  useEffect(() => {
    if (!selectedDate) {
      setSlotsAvailability(null);
      setPreferredTimeSlot("");
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setSlotsAvailability(null);
    setPreferredTimeSlot("");

    fetch(`/api/meeting-requests/availability?date=${selectedDate}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          setSlotsAvailability(
            data?.slots ?? { MORNING: true, AFTERNOON: true, EVENING: true }
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlotsAvailability({ MORNING: true, AFTERNOON: true, EVENING: true });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  /* ----------------------------- VALIDATIONS ----------------------------- */

  const isDateSelectable = (d: Date) => d >= tomorrow;
  const isDateSelected = (d: Date) => selectedDate === toYYYYMMDD(d);
  const isToday = (d: Date) => toYYYYMMDD(d) === toYYYYMMDD(today);

  /* ----------------------------- SUBMIT ----------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedDate) return setFormError("Please select a date");
    if (!preferredTimeSlot) return setFormError("Please select a time slot");
    if (!topic.trim()) return setFormError("Please enter a meeting topic");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/meeting-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredDate: new Date(selectedDate + "T12:00:00.000Z").toISOString(),
          preferredTimeSlot,
          topic: topic.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess("Meeting request submitted.");
        setSelectedDate("");
        setPreferredTimeSlot("");
        setTopic("");
        setNotes("");
        setSlotsAvailability(null);
        setRequests((prev) => [data, ...prev]);
      } else {
        setFormError(data.error || "Submission failed");
      }
    } catch {
      toastError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans space-y-6">
      {/* Breadcrumb – minimal */}
      <nav className="flex text-text-muted p-2 rounded-lg border border-accent/15 bg-accent/10 w-fit mb-16" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">
              <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
              <a href="#" className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand">Client</a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" /></svg>
              <span className="inline-flex items-center text-sm font-medium text-body-subtle capitalize">Book your meeting</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="flex my-6 flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl  font-semibold text-text-primary tracking-tight capitalize">
            Book a meeting
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Schedule a session with your project manager.
          </p>
        </div>
        <div className="text-xs text-text-muted">
          <span className="font-medium">Timezone:</span> UTC+00:00 (GMT)
        </div>
      </header>

      {/* Main grid – split pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN – Calendar & Time slots */}
        <div className="space-y-6">
          {/* Calendar card – glassmorphism */}
          <div className="bg-accent/5 backdrop-blur-md ring-[0.5] ring-accent/10 rounded-2xl p-5 transition-all duration-300 hover:ring-accent/20 border-[1px] border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-text-primary/90">Select date</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1)
                    )
                  }
                  className="p-1.5 hover:bg-accent/10 rounded-md transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-medium text-text-primary w-32 text-center">
                  {calendarMonth.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1)
                    )
                  }
                  className="p-1.5 hover:bg-accent/10 rounded-md transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="ring-[0.5] ring-accent/10 rounded-xl overflow-hidden  bg-bg-page">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 bg-accent text-text-primary border-b border-accent/10">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="py-2  text-center text-xs font-medium"
                  >
                    {label}
                  </div>
                ))}
              </div>
              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, i) => {
                  if (!day)
                    return <div key={`empty-${i}`} className="h-12 bg-transparent" />;
                  const selectable = isDateSelectable(day);
                  const selected = isDateSelected(day);
                  const isCurrentToday = isToday(day);
                  return (
                    <button
                      key={toYYYYMMDD(day)}
                      type="button"
                      disabled={!selectable || isSubmitting}
                      onClick={() => setSelectedDate(toYYYYMMDD(day))}
                      className={`
                        relative h-12 flex items-center justify-center text-sm transition-all duration-150 border border-accent/20
                        ${selectable ? "hover:bg-accent/10 cursor-pointer" : "opacity-30 cursor-not-allowed"}
                        ${selected ? "bg-accent/80 text-text-inverse backdrop-blur-sm" : "text-text-primary/80"}
                        ${isCurrentToday && !selected ? "ring-[0.5] ring-accent ring-inset" : ""}
                      `}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time slots – shown only when a date is selected */}
          {selectedDate && (
            <div className="bg-accent/5 backdrop-blur-md ring-[0.5] ring-accent/10 rounded-2xl p-5 transition-all duration-300 hover:ring-accent/20 border-[1px] border-accent/20">
              <h2 className="text-sm font-medium text-text-primary/90 mb-4">Select time window</h2>

              {loadingSlots ? (
                <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                  <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                  Checking availability...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.filter((slot) => slotsAvailability?.[slot.value]).map((slot) => {
                    const isSelected = preferredTimeSlot === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setPreferredTimeSlot(slot.value)}
                        className={`
                          flex flex-col items-start p-3 rounded-xl ring-[0.5] transition-all duration-200  border-[1px] border-accent/20
                          
                          ${isSelected
                            ? "ring-1 ring-accent bg-accent/60 text-text-primary"
                          : "ring-accent/10 hover:ring-accent/20 bg-bg-page"
                          }
                        `}
                      >
                        <span className="text-lg mb-1">{slot.icon}</span>
                        <span
                          className={`text-xs font-medium "
                            }`}
                        >
                          {slot.label}
                        </span>
                        <span className="text-[10px] text-text-muted">{slot.sublabel}</span>
                      </button>
                    );
                  })}
                  {TIME_SLOTS.every((slot) => !slotsAvailability?.[slot.value]) &&
                    slotsAvailability !== null && (
                      <p className="col-span-3 text-sm text-text-muted/70 py-2">
                        No slots available for this date.
                      </p>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – Meeting details & recent requests */}
        <div className="space-y-6">
          {/* Form card – glassmorphism */}
          <div className="bg-accent/5 backdrop-blur-md ring-[0.5] ring-accent/10 rounded-2xl p-5 transition-all duration-300 hover:ring-accent/20 border-[1px] border-accent/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-400 text-sm ring-[0.5] ring-red-500/20 rounded-lg">
                  <AlertCircle size={18} />
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/60"
                  />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Meeting topic"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-page ring-[0.5] ring-accent/10 rounded-lg text-sm focus:ring-[0.5] focus:ring-accent outline-none transition placeholder:text-text-muted/50"
                  />
                </div>
                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="absolute left-3 top-3 text-text-muted/60"
                  />
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes (optional)"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-page ring-[0.5] ring-accent/10 rounded-lg text-sm focus:ring-[0.5] focus:ring-accent outline-none transition resize-none placeholder:text-text-muted/50"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-4">
                <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted/70">
                  <Info size={14} />
                  <span>Usually confirmed within 24h</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-accent text-text-inverse rounded-lg text-sm font-medium hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Confirm request"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Recent requests card – glassmorphism */}
          <div className="bg-accent/5 backdrop-blur-md ring-[0.5] ring-accent/10 rounded-2xl p-5 transition-all duration-300 hover:ring-accent/20 border-[1px] border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-text-primary/90">Recent requests</h2>
              <span className="text-xs bg-accent/10 text-text-muted px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            </div>

            {loadingRequests ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-accent/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-accent/20">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-bg-page ring-[0.5] ring-accent/10 rounded-lg hover:ring-accent/30 transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${req.status === "CONFIRMED"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                          }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-[9px] text-text-muted/50">#{req.id.slice(0, 4)}</span>
                    </div>
                    <h3 className="text-sm font-medium text-text-primary/90 truncate mb-1">
                      {req.topic}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-text-muted/70">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(req.preferredDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatSlot(req.preferredTimeSlot)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Beautiful empty state */
              <div className="text-center py-12">
                <div className="relative mx-auto h-24 w-24 mb-4">
                  <div className="absolute inset-0 rounded-full bg-accent/5 animate-pulse" />
                  <Calendar className="relative h-12 w-12 text-text-muted/30 mx-auto mt-6" />
                </div>
                <p className="text-sm text-text-muted/60 font-light">No meetings scheduled</p>
                <p className="text-xs text-text-muted/40 mt-1">Your requests will appear here</p>
              </div>
            )}
          </div>

          {/* Support card – glassmorphism */}
          <div className="bg-accent/10 backdrop-blur-md ring-[0.5] ring-accent/20 rounded-2xl p-5 transition-all duration-300 hover:ring-accent/30 border-[1px] border-accent/20">
            <h3 className="text-sm font-medium text-text-primary/90 mb-1">Need a rush meeting?</h3>
            <p className="text-xs text-text-muted/70 mb-3">
              Contact support directly for urgent matters.
            </p>
            <Link
              href="/client/messages"
              className="inline-flex items-center px-3 py-1.5 bg-accent text-text-inverse text-xs rounded-lg hover:bg-accent-hover transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}