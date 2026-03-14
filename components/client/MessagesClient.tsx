'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import {
  FiSend,
  FiMessageSquare,
  FiChevronLeft,
  FiCheck,
  FiCheckCircle,
  FiPlus,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, ChevronRight, Search, MessageSquareQuote } from 'lucide-react';

interface Sender {
  id: string;
  name: string;
  role: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: Sender;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface ConversationProject {
  id: string;
  name: string;
  clientId: string;
  client: { id: string; name: string; email: string };
  manager?: { id: string; name: string; email?: string };
  managers?: { id: string; name: string; email?: string }[]; // array of managers/admins
}

interface Conversation {
  id: string;
  projectId: string;
  project: ConversationProject;
  lastMessage: Message | null;
  unreadCount: number;
  lastMessageAt: string;
}

interface ProjectForConversation {
  id: string;
  name: string;
  status: string;
  client: { id: string; name: string; email: string };
  manager: { id: string; name: string };
  conversation: { id: string } | null;
}

interface MessagesClientProps {
  userId: string;
  userRole: string;
}


function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday ' + format(date, 'h:mm a');
  return format(date, 'MMM d, h:mm a');
}

function formatConversationTime(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

function formatDaySeparator(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
}

export default function MessagesClient({
  userId,
  userRole,
}: MessagesClientProps) {
  const [search, setSearch] = useState('');
  const [showMobileView, setShowMobileView] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [projects, setProjects] = useState<ProjectForConversation[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isCreatingConvo, setIsCreatingConvo] = useState(false);
  const [conversationSearch, setConversationSearch] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const searchParams = useSearchParams();
  const targetConversationId = searchParams.get('conversationId');

  const isAdmin = ['ADMIN', 'EDITOR', 'VIEWER'].includes(userRole);

  // const getManagerName = useCallback((conv: Conversation) => {
  //   return (
  //     conv.project.manager?.name ??
  //     conv.project.managers?.[0]?.name ??
  //     'Manager'
  //   );
  // }, []);

  const handleBack = () => {
    setShowMobileView(false);
  };

  console.log("activeConversation : ", activeConversation)

  const getManagerName = useCallback((conv: Conversation) => {
    if (conv.project.managers && conv.project.managers.length > 0) {
      return conv.project.managers.map((m) => m.name);
    }
    return conv.project.manager ? [conv.project.manager.name] : ['Manager'];
  }, []);


  // const getOtherPartyName = useCallback(
  //   (conv: Conversation) => {
  //     return isAdmin ? conv.project.client.name : getManagerName(conv);
  //   },
  //   [getManagerName, isAdmin]
  // );

  const getOtherPartyName = useCallback(
    (conv: Conversation) => {
      if (isAdmin) return conv.project.client.name;
      const managerNames = getManagerName(conv);
      return managerNames.join(', '); // Join multiple names with comma
    },
    [getManagerName, isAdmin]
  );

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  const updateNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distanceFromBottom < 140;
    setIsNearBottom(near);
    if (near) setShowJumpToLatest(false);
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setErrorBanner(null);
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations);
      } else {
        setErrorBanner(data?.error ?? 'Failed to load conversations.');
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setErrorBanner('Failed to load conversations. Check your connection and try again.');
    } finally {
      setIsLoadingConvos(false);
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(
    async (conversationId: string, silent = false) => {
      if (!silent) setIsLoadingMessages(true);
      try {
        if (!silent) setErrorBanner(null);
        const res = await fetch(`/api/messages/${conversationId}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        } else if (!silent) {
          setErrorBanner(data?.error ?? 'Failed to load messages.');
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        if (!silent) {
          setErrorBanner('Failed to load messages. Check your connection and try again.');
        }
      } finally {
        if (!silent) setIsLoadingMessages(false);
      }
    },
    []
  );

  // Initial load — for CLIENT: auto-open target or first conversation
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/messages');
        const data = await res.json();
        if (res.ok) {
          setConversations(data.conversations);
          if (!isAdmin && data.conversations.length > 0) {
            // If coming from a project page, open that specific conversation
            const target: Conversation = targetConversationId
              ? data.conversations.find((c: Conversation) => c.id === targetConversationId) ?? data.conversations[0]
              : data.conversations[0];
            setActiveConversation(target);
            setShowMobileThread(true);
            fetchMessages(target.id);
            if (target.unreadCount > 0) {
              await fetch(`/api/messages/${target.id}/read`, { method: 'POST' });
            }
          }
        } else {
          setErrorBanner(data?.error ?? 'Failed to load messages.');
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        setErrorBanner('Failed to load messages. Check your connection and try again.');
      } finally {
        setIsLoadingConvos(false);
      }
    };
    load();
  }, [fetchConversations, fetchMessages, isAdmin, targetConversationId]);

  // Poll for updates
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      fetchConversations();
      if (activeConversation) {
        fetchMessages(activeConversation.id, true);
      }
    }, 10000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [activeConversation, fetchConversations, fetchMessages]);

  // Scroll behavior on new messages:
  // - Keep user pinned to bottom when they are already near bottom.
  // - If they scroll up to read, don't yank them down; show a "Jump to latest" button instead.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;

    const isOwn = last.senderId === userId;
    const isNewLast = last.id !== lastMessageIdRef.current;
    lastMessageIdRef.current = last.id;

    if (!isNewLast) return;

    if (isNearBottom || isOwn) {
      scrollToBottom('auto');
      setShowJumpToLatest(false);
    } else {
      setShowJumpToLatest(true);
    }
  }, [isNearBottom, messages, scrollToBottom, userId]);

  // Open conversation
  const openConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setShowMobileThread(true);
    setShowMobileView(true); // open thread on mobile
    await fetchMessages(conv.id);
    setIsNearBottom(true);
    setShowJumpToLatest(false);
    requestAnimationFrame(() => {
      scrollToBottom('auto');
      textareaRef.current?.focus();
    });
    // Mark as read
    if (conv.unreadCount > 0) {
      await fetch(`/api/messages/${conv.id}/read`, { method: 'POST' });
      fetchConversations();
    }
  };

  // Send message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeConversation || isSending) return;

    setIsSending(true);
    try {
      setErrorBanner(null);
      const res = await fetch(`/api/messages/${activeConversation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (res.ok) {
        setNewMessage('');
        await fetchMessages(activeConversation.id, true);
        await fetchConversations();
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.focus();
        }
        setIsNearBottom(true);
        requestAnimationFrame(() => scrollToBottom('auto'));
      } else {
        const data = await res.json().catch(() => null);
        setErrorBanner(data?.error ?? 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setErrorBanner('Failed to send message. Check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewMessage(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  // Fetch projects for new conversation modal (admin only)
  const openNewConvoModal = async () => {
    setShowNewConvoModal(true);
    setIsLoadingProjects(true);
    setProjectSearch('');
    try {
      const res = await fetch('/api/messages/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
      } else {
        setErrorBanner(data?.error ?? 'Failed to load projects.');
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setErrorBanner('Failed to load projects. Check your connection and try again.');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Start a new conversation for a project
  const startNewConversation = async (projectId: string) => {
    setIsCreatingConvo(true);
    try {
      setErrorBanner(null);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        setShowNewConvoModal(false);
        await fetchConversations();
        // Find and open the new/existing conversation
        const convRes = await fetch('/api/messages');
        const convData = await convRes.json();
        if (convRes.ok) {
          setConversations(convData.conversations);
          const targetConv = convData.conversations.find(
            (c: Conversation) => c.projectId === projectId
          );
          if (targetConv) {
            openConversation(targetConv);
          }
        } else {
          setErrorBanner(convData?.error ?? 'Conversation created, but failed to refresh list.');
        }
      } else {
        const data = await res.json().catch(() => null);
        setErrorBanner(data?.error ?? 'Failed to create conversation.');
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setErrorBanner('Failed to create conversation. Check your connection and try again.');
    } finally {
      setIsCreatingConvo(false);
    }
  };

  // Filter projects in modal
  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.client.name.toLowerCase().includes(q) ||
      p.client.email.toLowerCase().includes(q)
    );
  });

  const filteredConversations = conversations.filter((conv) => {
    const q = conversationSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      getOtherPartyName(conv).toLowerCase().includes(q) ||
      conv.project.name.toLowerCase().includes(q)
    );
  });

  // Modal accessibility: close on Escape
  useEffect(() => {
    if (!showNewConvoModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNewConvoModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showNewConvoModal]);

  // ─── Main Render ───────────────────────────────────────────────

  // const conversationListJSX = (
  //   <div className="flex flex-col h-full min-h-0">
  //     <div className="p-4 border-b border-white/10 bg-slate-950/70">
  //       <div className="flex items-center justify-between">
  //         <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
  //           <FiMessageSquare className="w-5 h-5" />
  //           Messages
  //         </h2>
  //         {isAdmin && (
  //           <button
  //             onClick={openNewConvoModal}
  //             type="button"
  //             className="p-2 rounded-lg bg-accent text-text-inverse hover:bg-accent-hover transition-colors duration-150"
  //             title="New Conversation"
  //             aria-label="Start a new conversation"
  //           >
  //             <FiPlus className="w-4 h-4" />
  //           </button>
  //         )}
  //       </div>
  //       <p className="text-xs text-text-muted mt-1">
  //         {isAdmin
  //           ? 'Client conversations'
  //           : 'Messages with your manager'}
  //       </p>
  //       <div className="mt-3">
  //         <div className="relative">
  //           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-disabled" />
  //           <input
  //             value={conversationSearch}
  //             onChange={(e) => setConversationSearch(e.target.value)}
  //             placeholder="Search conversations..."
  //             aria-label="Search conversations"
  //             className="w-full rounded-lg border border-white/10 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-accent/30"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     <div className="flex-1 overflow-y-auto bg-slate-900/35">
  //       {errorBanner && (
  //         <div className="mx-4 mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-3">
  //           <span className="leading-5">{errorBanner}</span>
  //           <div className="flex items-center gap-2 shrink-0">
  //             <button
  //               type="button"
  //               className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] text-text-primary hover:bg-white/5"
  //               onClick={() => {
  //                 setErrorBanner(null);
  //                 fetchConversations();
  //                 if (activeConversation) fetchMessages(activeConversation.id, true);
  //               }}
  //             >
  //               Retry
  //             </button>
  //             <button
  //               type="button"
  //               className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-white/5"
  //               onClick={() => setErrorBanner(null)}
  //               aria-label="Dismiss error"
  //             >
  //               <FiX className="h-4 w-4" />
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //       {isLoadingConvos ? (
  //         <div className="p-4 space-y-3">
  //           {Array.from({ length: 6 }).map((_, i) => (
  //             <div
  //               key={i}
  //               className="animate-pulse rounded-xl border border-white/10 bg-slate-950/30 p-3"
  //             >
  //               <div className="flex items-center gap-3">
  //                 <div className="h-10 w-10 rounded-full bg-white/10" />
  //                 <div className="flex-1">
  //                   <div className="h-3 w-32 rounded bg-white/10" />
  //                   <div className="mt-2 h-2 w-44 rounded bg-white/10" />
  //                 </div>
  //                 <div className="h-2 w-10 rounded bg-white/10" />
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       ) : conversations.length === 0 ? (
  //         <div className="text-center py-12 px-4">
  //           <FiMessageSquare className="w-12 h-12 text-text-disabled mx-auto mb-3" />
  //           <p className="text-sm text-text-muted">No conversations yet</p>
  //           <p className="text-xs text-text-disabled mt-1">
  //             {isAdmin
  //               ? 'Conversations will appear when clients message you'
  //               : 'Go to a project to start a conversation'}
  //           </p>
  //         </div>
  //       ) : filteredConversations.length === 0 ? (
  //         <div className="text-center py-12 px-4">
  //           <FiSearch className="w-10 h-10 text-text-disabled mx-auto mb-3" />
  //           <p className="text-sm text-text-muted">No conversation matches your search</p>
  //         </div>
  //       ) : (
  //         <div className="divide-y divide-border-default">
  //           {filteredConversations.map((conv) => (
  //             <button
  //               key={conv.id}
  //               onClick={() => openConversation(conv)}
  //               type="button"
  //               aria-label={`Open conversation with ${getOtherPartyName(conv)}`}
  //               className={`w-full text-left p-4 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 transition-colors duration-150 ${activeConversation?.id === conv.id
  //                 ? 'bg-accent/5 border-l-4 border-l-accent'
  //                 : ''
  //                 }`}
  //             >
  //               <div className="flex gap-1 text-white">
  //                 {conv.project.manager ? (
  //                   <div
  //                     className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-text-inverse text-[10px] font-semibold"
  //                     title={conv.project.manager.name || 'Admin'}
  //                   >
  //                     {(conv.project.manager.name?.charAt(0).toUpperCase() || 'A')}
  //                   </div>
  //                 ) : (
  //                   <div
  //                     className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-semibold"
  //                     title="Admin"
  //                   >
  //                     A
  //                   </div>
  //                 )}
  //               </div>
  //             </button>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  const conversationListJSX = (
    <div className="flex flex-col h-full min-h-0 bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-default">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5" />
            Messages
          </h2>
          {isAdmin && (
            <button
              onClick={openNewConvoModal}
              type="button"
              className="p-2 rounded-lg bg-accent text-inverse hover:bg-accent-hover transition-colors duration-150"
              title="New Conversation"
              aria-label="Start a new conversation"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted mt-1">
          {isAdmin ? 'Client conversations' : 'Messages with your manager'}
        </p>
        <div className="mt-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-disabled" />
            <input
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              placeholder="Search conversations..."
              aria-label="Search conversations"
              className="w-full rounded-lg border border-default bg-page py-2 pl-9 pr-3 text-xs text-primary placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        {errorBanner && (
          <div className="mx-4 mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-3">
            <span className="leading-5">{errorBanner}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="rounded-lg border border-default bg-surface px-2 py-1 text-[11px] text-primary hover:bg-subtle"
                onClick={() => {
                  setErrorBanner(null);
                  fetchConversations();
                  if (activeConversation) fetchMessages(activeConversation.id, true);
                }}
              >
                Retry
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-muted hover:text-primary hover:bg-subtle"
                onClick={() => setErrorBanner(null)}
                aria-label="Dismiss error"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {isLoadingConvos ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-default bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-subtle" />
                  <div className="flex-1">
                    <div className="h-3 w-32 rounded bg-subtle" />
                    <div className="mt-2 h-2 w-44 rounded bg-subtle" />
                  </div>
                  <div className="h-2 w-10 rounded bg-subtle" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FiMessageSquare className="w-12 h-12 text-disabled mx-auto mb-3" />
            <p className="text-sm text-muted">No conversations yet</p>
            <p className="text-xs text-disabled mt-1">
              {isAdmin
                ? 'Conversations will appear when clients message you'
                : 'Go to a project to start a conversation'}
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FiSearch className="w-10 h-10 text-disabled mx-auto mb-3" />
            <p className="text-sm text-muted">No conversation matches your search</p>
          </div>
        ) : (
          <div className="divide-y divide-default">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                type="button"
                aria-label={`Open conversation with ${getOtherPartyName(conv)}`}
                className={`w-full text-left p-4 hover:bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 transition-colors duration-150 ${activeConversation?.id === conv.id ? 'bg-accent/5 border-l-4 border-l-accent' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                      {getOtherPartyName(conv).charAt(0).toUpperCase()}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-primary truncate">
                        {getOtherPartyName(conv)}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-muted whitespace-nowrap ml-2">
                          {formatConversationTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {conv.project.name}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-xs text-body truncate mt-1">
                        {conv.lastMessage.senderId === userId ? 'You: ' : ''}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const messageThreadJSX = !activeConversation ? (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-20 h-20 bg-bg-subtle rounded-full flex items-center justify-center mb-4">
        <FiMessageSquare className="w-10 h-10 text-text-disabled" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Select a conversation
      </h3>
      <p className="text-sm text-text-muted max-w-sm">
        Choose a conversation from the list to view messages
      </p>
    </div>
  ) : (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex flex-col w-full h-full lg:h-[100vh]">
        {/* Thread Header */}
        <div className="sticky top-0 z-10 flex gap-3 p-4 border-b border-white/10 bg-slate-950 shrink-0
        ">
          {isAdmin && (
            <button
              onClick={() => setShowMobileThread(false)}
              type="button"
              className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
              aria-label="Back to conversations"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold shrink-0">
            {/* {getOtherPartyName(activeConversation).charAt(0).toUpperCase()} */}
            <div className="flex gap-1">
              {activeConversation.project.manager?.name.charAt(0).toUpperCase()}

              {/* {activeConversation.project.managers?.map((m) => (
                <div
                  key={m.id}
                  className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-text-inverse text-[10px] font-semibold"
                  title={m.name}
                >
                  {(m.role?.charAt(0).toUpperCase() || 'A')} A               </div>
              ))} */}

            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {getOtherPartyName(activeConversation)}
            </h3>
            <p className="text-xs text-text-muted truncate">
              {isAdmin
                ? activeConversation.project.name
                : `${getOtherPartyName(activeConversation)} · Manager`}
            </p>
            <div className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-2 py-0.5 text-[10px] text-blue-200">
              Project: {activeConversation.project.name}
            </div>
          </div>
          <span className="flex items-center gap-1.5 h-fit text-[10px] text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>

        {errorBanner && (
          <div className="mx-4 mt-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-3">
            <span className="leading-5">{errorBanner}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] text-text-primary hover:bg-white/5"
                onClick={() => {
                  setErrorBanner(null);
                  fetchConversations();
                  fetchMessages(activeConversation.id);
                }}
              >
                Retry
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-white/5"
                onClick={() => setErrorBanner(null)}
                aria-label="Dismiss error"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* <div className="w-full h-full "> */}
        {/* Messages Area */}
        {/* <div className="flex-1 overflow-scroll md:overflow-scroll overscroll-contain p-4 space-y-3 scroll-smooth  h-[100vh]  md:h-full" */}

        <div
          ref={messagesContainerRef}
          onScroll={updateNearBottom}
          className="chat-scroll overflow-y-auto flex-1 min-h-0 h-full p-4 space-y-3"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-busy={isLoadingMessages}
        >
          {isLoadingMessages ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="w-[62%] max-w-[520px] rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
                    <div className="h-3 w-40 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-56 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageSquare className="w-10 h-10 text-text-disabled mx-auto mb-2" />
              <p className="text-sm text-text-muted">No messages yet</p>
              <p className="text-xs text-text-disabled mt-1">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isOwn = msg.senderId === userId;
                const previous = index > 0 ? messages[index - 1] : null;
                const showDaySeparator =
                  !previous ||
                  !isSameDay(new Date(previous.createdAt), new Date(msg.createdAt));
                return (
                  <div key={msg.id}>
                    {showDaySeparator && (
                      <div className="my-4 flex items-center justify-center">
                        <span className="rounded-full border text-text-primary border-white/10 bg-slate-950/75 px-3 py-1 text-[10px] font-medium ">
                          {formatDaySeparator(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${isOwn
                          ? 'bg-blue-800 text-text-inverse rounded-br-md shadow-[0_10px_30px_rgba(59,130,246,0.12)]'
                          : 'bg-slate-950/35 border border-white/10 text-text-primary rounded-bl-md'
                          }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-semibold mb-1 text-accent">
                            {msg.sender.name}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {msg.content}
                        </p>
                        <div
                          className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <span
                            className={`text-[10px] ${isOwn
                              ? 'text-text-inverse/60'
                              : 'text-text-disabled'
                              }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </span>
                          {isOwn && (
                            <span
                              className={`${msg.isRead
                                ? 'text-text-inverse/80'
                                : 'text-text-inverse/40'
                                }`}
                              title={msg.isRead ? 'Read' : 'Sent'}
                              aria-label={msg.isRead ? 'Read' : 'Sent'}
                            >
                              {msg.isRead ? (
                                <FiCheckCircle className="w-3 h-3" />
                              ) : (
                                <FiCheck className="w-3 h-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {showJumpToLatest && (
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              type="button"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-text-primary shadow-lg backdrop-blur hover:bg-slate-950/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              onClick={() => {
                scrollToBottom('smooth');
                setShowJumpToLatest(false);
                setIsNearBottom(true);
              }}
              aria-label="Jump to latest messages"
            >
              New messages
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        )}


        {/* Message Input */}
        <div className="shrink-0 border-t border-white/10 bg-slate-950 p-3">
          <form onSubmit={sendMessage} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              aria-label="Message"
              className=" flex-1 resize-none rounded-xl border border-border-default bg-bg-page px-4 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              style={{ maxHeight: '120px' }}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || isSending}
              isLoading={isSending}
              className="rounded-xl! min-h-[40px]! px-4!"
              aria-label="Send message"
            >
              <FiSend className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-text-disabled mt-1.5 px-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>

        {/* </div> */}
      </div>
      {/* Mobile View */}
      <div className="flex md:hidden relative flex-col h-full min-h-0">

        {/* Thread Header */}
        <div className="sticky top-0 z-10 flex gap-3 p-4 border-b border-white/10 bg-slate-950 shrink-0
        ">
          <span
            className="bg-accent/30 hover:bg-accent/40 transition-all duration-200 rounded-full text-white  w-10 h-10 flex justify-center items-center"
            onClick={handleBack}
          ><ArrowLeft size={14} /></span>
          {isAdmin && (
            <button
              onClick={() => setShowMobileThread(false)}
              type="button"
              className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
              aria-label="Back to conversations"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold shrink-0">
            {/* {getOtherPartyName(activeConversation).charAt(0).toUpperCase()} */}
            <div className="flex gap-1">
              {activeConversation.project.manager?.name.charAt(0).toUpperCase()}
              {/*               
              // .map((m) => (
              //   <div
              //     key={m.id}
              //     className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-text-primary text-[10px] font-semibold"
              //     title={m.name}
              //   >
              //     {m.name.charAt(0).toUpperCase()} A
              //   </div>
              // ))} */}

            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {getOtherPartyName(activeConversation)}
            </h3>
            <p className="text-xs text-text-muted truncate">
              {isAdmin
                ? activeConversation.project.name
                : `${getOtherPartyName(activeConversation)} · Manager`}
            </p>
            <div className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-2 py-0.5 text-[10px] text-blue-200">
              Project: {activeConversation.project.name}
            </div>
          </div>
          <span className="flex items-center gap-1.5 h-fit text-[10px] text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>

        {errorBanner && (
          <div className="mx-4 mt-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-3">
            <span className="leading-5">{errorBanner}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] text-text-primary hover:bg-white/5"
                onClick={() => {
                  setErrorBanner(null);
                  fetchConversations();
                  fetchMessages(activeConversation.id);
                }}
              >
                Retry
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-white/5"
                onClick={() => setErrorBanner(null)}
                aria-label="Dismiss error"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* <div className="w-full h-full "> */}
        {/* Messages Area */}
        {/* <div className="flex-1 overflow-scroll md:overflow-scroll overscroll-contain p-4 space-y-3 scroll-smooth  h-[100vh]  md:h-full" */}

        <div
          ref={messagesContainerRef}
          onScroll={updateNearBottom}
          className="chat-scroll flex-1 min-h-0 overflow-y-auto  p-4 space-y-3 pb-32  "
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-busy={isLoadingMessages}
        >
          {isLoadingMessages ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="w-[62%] max-w-[520px] rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3">
                    <div className="h-3 w-40 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-56 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageSquare className="w-10 h-10 text-text-disabled mx-auto mb-2" />
              <p className="text-sm text-text-muted">No messages yet</p>
              <p className="text-xs text-text-disabled mt-1">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isOwn = msg.senderId === userId;
                const previous = index > 0 ? messages[index - 1] : null;
                const showDaySeparator =
                  !previous ||
                  !isSameDay(new Date(previous.createdAt), new Date(msg.createdAt));
                return (
                  <div key={msg.id}>
                    {showDaySeparator && (
                      <div className="my-4 flex items-center justify-center">
                        <span className="rounded-full border text-text-primary border-white/10 bg-slate-950/75 px-3 py-1 text-[10px] font-medium ">
                          {formatDaySeparator(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${isOwn
                          ? 'bg-blue-800 text-text-inverse rounded-br-md shadow-[0_10px_30px_rgba(59,130,246,0.12)]'
                          : 'bg-slate-950/35 border border-white/10 text-text-primary rounded-bl-md'
                          }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-semibold mb-1 text-accent">
                            {msg.sender.name}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {msg.content}
                        </p>
                        <div
                          className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <span
                            className={`text-[10px] ${isOwn
                              ? 'text-text-inverse/60'
                              : 'text-text-disabled'
                              }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </span>
                          {isOwn && (
                            <span
                              className={`${msg.isRead
                                ? 'text-text-inverse/80'
                                : 'text-text-inverse/40'
                                }`}
                              title={msg.isRead ? 'Read' : 'Sent'}
                              aria-label={msg.isRead ? 'Read' : 'Sent'}
                            >
                              {msg.isRead ? (
                                <FiCheckCircle className="w-3 h-3" />
                              ) : (
                                <FiCheck className="w-3 h-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {showJumpToLatest && (
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              type="button"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-text-primary shadow-lg backdrop-blur hover:bg-slate-950/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              onClick={() => {
                scrollToBottom('smooth');
                setShowJumpToLatest(false);
                setIsNearBottom(true);
              }}
              aria-label="Jump to latest messages"
            >
              New messages
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        )}


        {/* Message Input */}
        <div className="shrink-0 fixed bottom-0 w-full border-t border-white/10 bg-slate-950 p-3">
          <form onSubmit={sendMessage} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              aria-label="Message"
              className=" flex-1 resize-none rounded-xl border border-border-default bg-bg-page px-4 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              style={{ maxHeight: '120px' }}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || isSending}
              isLoading={isSending}
              className="rounded-xl! min-h-[40px]! px-4!"
              aria-label="Send message"
            >
              <FiSend className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-text-disabled mt-1.5 px-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>

        {/* </div> */}
      </div>

    </>
  );
  // For client search:
  const filteredConversationsBySearch = conversations.filter((conv) =>
    conv.project.name.toLowerCase().includes(search.toLowerCase()) ||
    getOtherPartyName(conv).toLowerCase().includes(search.toLowerCase())
  );

  // ── CLIENT: direct full-screen chat (no conversation list) ──────────
  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-white/15 bg-slate-900/60 shadow-[0_24px_60px_rgba(2,6,23,0.45)] overflow-hidden backdrop-blur-xl  min-h-[500px]">
        {isLoadingConvos ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-bg-subtle rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="w-10 h-10 text-text-disabled" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No conversation available</h3>
            <p className="text-sm text-text-muted max-w-sm">
              Your manager conversation will appear here shortly. Please contact support if it does not show up.
            </p>
          </div>
        ) : (
          <div className="flex h-[80vh] chat-scroll md:h-full w-full md:overflow-hidden ">
            {/* Project tabs — if multiple conversations */}

            {/* Desktop */}
            <div className="hidden md:flex w-full h-full">
              {conversations.length > 1 && (
                <div className=" w-full md:w-80 flex flex-col h-[100vh] border-r border-border-default bg-bg-subtle">
                  {/* Header Section */}
                  <div className="px-4 py-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Your Projects
                    </h2>
                  </div>
                  {/* <div className="px-3 pb-3">
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border-default bg-bg-card text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div> */}
                  {/* Scrollable List */}
                  <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    <div className=" flex  items-center justify-center px-1 pb-3 mt-3 rounded-lg">
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm  bg-bg-card text-text-default placeholder:text-text-muted focus:outline-none focus:ring-[0.5px] focus:ring-accent  border border-border-default"
                      />
                      {/* <span className="w-10 h-10 flex justify-center items-center"><Search size={14} /></span>
                         */}
                    </div>
                    <div className=''>

                      {filteredConversationsBySearch.map((conv) => {
                        const isActive = activeConversation?.id === conv.id;

                        return (
                          <button
                            key={conv.id}
                            onClick={() => openConversation(conv)}
                            className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
            ${isActive
                                ? 'bg-accent text-text-inverse shadow-sm'
                                : 'text-text-muted hover:bg-bg-card hover:text-text-default border border-transparent hover:border-border-default'
                              }`}
                          >
                            <div className="flex flex-col items-start gap-1 truncate">
                              {/* Optional: Add a Folder or Hash icon here for better visuals */}
                              <h1 className="truncate">{conv.project.name}</h1>
                              {/* Admin / Manager names */}
                              <p className="text-[11px] block text-text-muted truncate">
                                {getOtherPartyName(conv)} · Manager
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className={`
                flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full
                ${isActive ? 'bg-white text-accent' : 'bg-red-500 text-white'}
              `}>
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>

                            <ChevronRight
                              size={14}
                              className={`transition-transform duration-200 ${isActive ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex-1">
                {messageThreadJSX}
              </div>
            </div>


            {/* Mobile */}
            <div className="block md:hidden w-full h-full bg-bg-page">
              {!showMobileView && (
                <div className="w-full h-full">
                  {conversations.length > 1 && (
                    <div className=" w-full md:w-80 flex flex-col h-[80vh] border-r border-border-default bg-bg-subtle">
                      {/* Header Section */}
                      <div className="px-5 py-6 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-accent">
                          <MessageSquareQuote size={14} strokeWidth={2.5} />
                          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em]">
                            Project Workspace
                          </h2>
                        </div>
                        <p className="text-base text-text-muted leading-relaxed">
                          Sync with your <span className="text-text-default font-medium">Managers</span> on active tasks.
                        </p>
                      </div>

                      {/* Scrollable List */}
                      <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        <div className=" flex  items-center justify-center px-1 pb-3 mt-3 rounded-lg">
                          <input
                            type="text"
                            placeholder="Search conversations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm  bg-bg-card text-text-default placeholder:text-text-muted focus:outline-none focus:ring-[0.5px] focus:ring-accent  border border-border-default"
                          />
                          {/* <span className="w-10 h-10 flex justify-center items-center"><Search size={14} /></span>
                         */}
                        </div>
                        <div className=''>

                          {filteredConversationsBySearch.map((conv) => {
                            const isActive = activeConversation?.id === conv.id;

                            return (
                              <button
                                key={conv.id}
                                onClick={() => openConversation(conv)}
                                className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
            ${isActive
                                    ? 'bg-accent text-text-inverse shadow-sm'
                                    : 'text-text-muted hover:bg-bg-card hover:text-text-default border border-transparent hover:border-border-default'
                                  }`}
                              >
                                <div className="flex flex-col items-start gap-1 truncate">
                                  {/* Optional: Add a Folder or Hash icon here for better visuals */}
                                  <h1 className="truncate">{conv.project.name}</h1>
                                  {/* Admin / Manager names */}
                                  <p className="text-[11px] block text-text-muted truncate">
                                    {getOtherPartyName(conv)} · Manager
                                  </p>
                                  {conv.unreadCount > 0 && (
                                    <span className={`
                flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full
                ${isActive ? 'bg-white text-accent' : 'bg-red-500 text-white'}
              `}>
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>

                                <ChevronRight
                                  size={14}
                                  className={`transition-transform duration-200 ${isActive ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'}`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {showMobileView && (
                <div className="w-full h-full">
                  {messageThreadJSX}
                </div>
              )}

            </div>


          </div>
        )}
      </div>
    );
  }

  // ── ADMIN: original side-by-side layout ──────────────────────────────
  return (
    <div className="rounded-xl border border-white/15 bg-bg-page shadow-[0_24px_60px_rgba(2,6,23,0.45)] overflow-hidden backdrop-blur-xl md:h-[calc(100vh-200px)] min-h-[500px]">
      {/* Desktop: side-by-side */}
      <div className="w-full lg:grid lg:grid-cols-[340px_1fr] h-full">
        <div className="border-r border-border-default overflow-hidden">
          {conversationListJSX}
        </div>
        <div className="overflow-hidden">
          {messageThreadJSX}
        </div>
      </div>

      {/* Mobile: swap between list and thread */}
      <div className="lg:hidden h-full">
        {showMobileThread ? messageThreadJSX : conversationListJSX}
      </div>


      {/* New Conversation Modal (admin only) */}
      {showNewConvoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewConvoModal(false)}
          />
          {/* Modal */}
          <div
            className="relative w-full max-w-lg bg-slate-950/95 rounded-2xl border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Start new conversation"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-default">
              <h3 className="text-lg font-semibold text-text-primary">Start New Conversation</h3>
              <button
                onClick={() => setShowNewConvoModal(false)}
                type="button"
                className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border-default">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                <input
                  type="text"
                  placeholder="Search by project or client name..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  aria-label="Search projects"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border-default bg-bg-page text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Project List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-sm text-text-muted">
                    {projectSearch ? 'No matching projects found' : 'No projects available'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-default">
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => startNewConversation(project.id)}
                      disabled={isCreatingConvo}
                      className="w-full text-left p-4 hover:bg-bg-subtle transition-colors duration-150 disabled:opacity-50"
                    >
                      <div className="flex items-start gap-3">
                        {/* Client Avatar */}
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold shrink-0">
                          {project.client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-text-primary truncate">
                              {project.client.name}
                            </span>
                            {project.conversation && (
                              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full shrink-0 ml-2">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted truncate">{project.client.email}</p>
                          <p className="text-xs font-medium text-accent truncate mt-0.5">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-text-disabled truncate mt-0.5">
                            Status: {project.status} • Manager: {project.manager.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
