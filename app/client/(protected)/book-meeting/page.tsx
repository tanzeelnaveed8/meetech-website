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
//                             ? 'ring-2 ring-accent/40 font-bold'
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
//                   className="w-full rounded-xl border border-border-default bg-bg-surface pl-11 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-50 resize-none"
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

import * as Icons from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiClock, FiFileText, FiMessageSquare, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import Link from "next/link";


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
  const [slotsAvailability, setSlotsAvailability] =
    useState<Record<string, boolean> | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [preferredTimeSlot, setPreferredTimeSlot] =
    useState<TimeSlot | "">("");
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
    for (let d = 1; d <= last.getDate(); d++)
      days.push(new Date(year, month, d));
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
        if (!cancelled && data?.slots) {
          setSlotsAvailability(data.slots);
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
  const isDateSelected = (d: Date) =>
    selectedDate === toYYYYMMDD(d);
  const isToday = (d: Date) =>
    toYYYYMMDD(d) === toYYYYMMDD(today);

  /* ----------------------------- SUBMIT ----------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedDate)
      return setFormError("Please select a date");
    if (!preferredTimeSlot)
      return setFormError("Please select a time slot");
    if (!topic.trim())
      return setFormError("Please enter a meeting topic");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/meeting-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredDate: new Date(
            selectedDate + "T12:00:00.000Z"
          ).toISOString(),
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
    <div className="min-h-screen bg-bg-page p-4 md:p-6 font-sans">
      <div className="w-full mx-auto space-y-8">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <span className="p-1.5 bg-accent-muted rounded-lg flex items-center justify-center w-8 h-8">
                <Icons.Calendar />
              </span>
              <span className="text-sm font-bold tracking-wider uppercase">Meetech Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Book A Meeting
            </h1>
            <p className="text-text-muted mt-1 max-w-md">
              Schedule a session with your project manager to keep things moving.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs text-text-muted uppercase font-bold">Current timezone</span>
            <span className="text-sm text-text-body font-medium">UTC+00:00 GMT</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-6">
            <div className="bg-bg-surface rounded-3xl shadow-sm border border-border-default  overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-6 md:p-8 space-y-8">
                  {formError && (
                    <div className="flex items-center gap-3 p-4 bg-accent-muted border-border-default text-accent text-sm">
                      <div className="w-5 h-5"><Icons.AlertCircle /></div>
                      {formError}
                    </div>
                  )}

                  {/* SELECT DATE */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-bold text-text-body flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-accent-muted text-primary  flex items-center justify-center text-[10px]">1</span>
                        SELECT DATE
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                          className="p-2 hover:bg-bg-subtle rounded-xl transition-colors flex items-center justify-center w-8 h-8"
                        >
                          <Icons.ChevronLeft />
                        </button>
                        <span className="text-sm font-bold text-text-body w-32 text-center">
                          {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                          className="p-2 hover:bg-bg-subtle rounded-xl transition-colors flex items-center justify-center w-8 h-8"
                        >
                          <Icons.ChevronRight />
                        </button>
                      </div>
                    </div>

                    <div className="border border-border-default rounded-2xl overflow-hidden bg-bg-page">
                      <div className="grid grid-cols-7 border-b border-border-default">
                        {WEEKDAY_LABELS.map(label => (
                          <div key={label} className="py-3 text-text-primary text-center text-[10px] font-bold bg-accent uppercase tracking-widest">
                            {label}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-px bg-bg-subtle">
                        {calendarDays.map((day, i) => {
                          if (!day) return <div key={`empty-${i}`} className="bg-bg-surface h-12 md:h-14" />;
                          const selectable = isDateSelectable(day);
                          const selected = isDateSelected(day);
                          const currentToday = isToday(day);

                          return (
                            <button
                              key={toYYYYMMDD(day)}
                              type="button"
                              disabled={!selectable || isSubmitting}
                              onClick={() => setSelectedDate(toYYYYMMDD(day))}
                              className={`
  relative h-12 md:h-14 flex flex-col items-center border-[0.4px] border-accent/20 justify-center transition-all bg-bg-surface
  ${selectable ? 'hover:bg-accent-muted hover:text-inverse cursor-pointer' : 'cursor-not-allowed opacity-25'}
  ${selected
                                ? 'z-10 bg-blue-600 text-text-primary ring-2 ring-accent ring-inset hover:bg-accent'
                                  : 'text-text-body'}
`}
                            >
                              <span className={`text-sm font-semibold ${selected ? 'text-text-inverse' : ''}`}>
                                {day.getDate()}
                              </span>
                              {currentToday && !selected && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* SELECT TIME WINDOW */}
                  {selectedDate && (
                    <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <label className="text-sm font-bold text-text-body flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-full bg-accent-muted text-primary flex items-center justify-center text-[10px]">2</span>
                        SELECT TIME WINDOW
                      </label>

                      {loadingSlots ? (
                        <div className="flex items-center gap-3 text-text-muted py-4 italic text-sm">
                          <div className="w-4 h-4 border-2 border-border-strong border-t-accent rounded-full animate-spin" />
                          Checking availability...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {TIME_SLOTS.map((slot) => {
                            const available = slotsAvailability?.[slot.value];
                            const isSelected = preferredTimeSlot === slot.value;
                            return (
                              <button
                                key={slot.value}
                                type="button"
                                disabled={!available || isSubmitting}
                                onClick={() => setPreferredTimeSlot(slot.value)}
                                className={`
                    relative flex flex-col p-4 rounded-2xl border-2 text-left transition-all
                    ${!available ? 'opacity-40 grayscale cursor-not-allowed border-border-subtle bg-bg-subtle' :
                                    isSelected ? 'border-accent bg-accent-muted ring-4 ring-accent-muted' :
                                      'border-border-subtle hover:border-border-strong'}
                  `}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xl">{slot.icon}</span>
                                  {isSelected && <div className="text-accent w-5 h-5"><Icons.CheckCircle /></div>}
                                </div>
                                <span className={`text-sm font-bold ${isSelected ? 'text-accent' : 'text-text-body'}`}>
                                  {slot.label}
                                </span>
                                <span className="text-[11px] text-text-muted font-medium">
                                  {available ? slot.sublabel : 'Unavailable'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  )}

                  {/* MEETING DETAILS */}
                  <section className="space-y-4">
                    <label className="text-sm font-bold text-text-body flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent-muted text-primary  flex items-center justify-center text-[10px]">3</span>
                      MEETING DETAILS
                    </label>
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-text-muted group-focus-within:text-accent transition-colors w-6 h-6"><Icons.FileText size={16} /></div>
                        <input
                          type="text"
                          value={topic}
                          onChange={e => setTopic(e.target.value)}
                          placeholder="What would you like to discuss?"
                          className="w-full bg-bg-page border border-border-default rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent transition-all placeholder:text-text-muted"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-text-muted group-focus-within:text-accent transition-colors w-6 h-6"><Icons.MessageSquare size={16} /></div>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Additional context or specific questions (optional)..."
                          className="w-full bg-bg-page border border-border-default rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent transition-all placeholder:text-text-muted resize-none"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* FORM FOOTER */}
                <div className="p-6 md:px-8 border-t border-border-subtle bg-bg-subtle flex items-center justify-between gap-4">
                  <p className=" w-full md:w-1/2 hidden md:flex items-center gap-2 text-xs text-text-muted font-medium">
                    <span className="shrink-0 w-6 h-6"><Icons.Info size={16} /></span> Requests are usually confirmed within 24h.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-1/2 px-6 py-3.5 bg-accent text-text-inverse rounded-2xl font-bold text-sm hover:bg-accent-hover active:scale-[0.98] transition-all shadow-xl shadow-accent-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>

                        Confirm Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-bg-surface rounded-3xl p-6 lg:p-4 border border-border-default shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text-primary flex items-center gap-2">
                  Recent Requests
                  <span className="bg-bg-subtle text-text-muted text-[10px] py-0.5 px-2 rounded-full font-bold">
                    {requests.length}
                  </span>
                </h2>
              </div>

              {loadingRequests ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-bg-subtle rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : requests.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="group p-3 rounded-xl pb-2 hover:border-accent hover:bg-accent-muted transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`
                  text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                  ${req.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                `}
                        >
                          {req.status}
                        </span>
                        <span className="text-[10px] text-text-muted font-medium">#{req.id.slice(2, 6)}</span>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary line-clamp-1 mb-1 group-hover:text-accent">
                        {req.topic}
                      </h3>
                      <div className="flex flex-col gap-1 text-[11px] text-text-muted font-medium">
                        <div className="flex items-center gap-1.5">
                          <div className="shrink-0 w-3 h-3"><Icons.Calendar size={14} /></div>
                          {formatDate(req.preferredDate)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="shrink-0 w-3 h-3"><Icons.Clock size={14} /></div>
                          {formatSlot(req.preferredTimeSlot)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-text-disabled w-6 h-6"><Icons.Calendar /></div>
                  </div>
                  <p className="text-sm text-text-muted">No recent requests found.</p>
                </div>
              )}
            </div>

            <div className="bg-accent rounded-3xl p-6 lg:p-4 text-text-inverse shadow-xl shadow-accent-muted overflow-hidden relative">
              <div className="">
                <h3 className="font-bold mb-2">Need a rush meeting?</h3>
                <p className="text-xs text-text-inverse/80 mb-4 leading-relaxed">
                  If you have an urgent issue that needs immediate attention, contact support directly.
                </p>
                <Link
                href="/client/messages"
                 className="text-xs font-bold bg-bg-surface text-accent px-4 py-2 rounded-xl hover:bg-text-primary hover:cursor-pointer transition-colors">
                  Contact Support
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent-hover rounded-full blur-2xl opacity-50" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

 
