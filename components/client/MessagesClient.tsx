'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, isToday, isYesterday } from 'date-fns';
import {
  FiSend,
  FiMessageSquare,
  FiChevronLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';

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
  manager: { id: string; name: string; email: string };
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

export default function MessagesClient({
  userId,
  userRole,
}: MessagesClientProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const searchParams = useSearchParams();
  const targetConversationId = searchParams.get('conversationId');

  const isAdmin = ['ADMIN', 'EDITOR', 'VIEWER'].includes(userRole);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setIsLoadingConvos(false);
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(
    async (conversationId: string, silent = false) => {
      if (!silent) setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${conversationId}`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
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
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
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

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Open conversation
  const openConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setShowMobileThread(true);
    await fetchMessages(conv.id);
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
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
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
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  // Helper: get other party name
  const getOtherPartyName = (conv: Conversation) => {
    return isAdmin ? conv.project.client.name : conv.project.manager.name;
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
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Start a new conversation for a project
  const startNewConversation = async (projectId: string) => {
    setIsCreatingConvo(true);
    try {
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
        }
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
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

  // ─── Main Render ───────────────────────────────────────────────

  const conversationListJSX = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5" />
            Messages
          </h2>
          {isAdmin && (
            <button
              onClick={openNewConvoModal}
              className="p-2 rounded-lg bg-accent text-text-inverse hover:bg-accent-hover transition-colors duration-150"
              title="New Conversation"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-text-muted mt-1">
          {isAdmin
            ? 'Client conversations'
            : 'Messages with your manager'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoadingConvos ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FiMessageSquare className="w-12 h-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-muted">No conversations yet</p>
            <p className="text-xs text-text-disabled mt-1">
              {isAdmin
                ? 'Conversations will appear when clients message you'
                : 'Go to a project to start a conversation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full text-left p-4 hover:bg-bg-subtle transition-colors duration-150 ${
                  activeConversation?.id === conv.id
                    ? 'bg-accent/5 border-l-3 border-l-accent'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold flex-shrink-0">
                    {getOtherPartyName(conv).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-text-primary truncate">
                        {getOtherPartyName(conv)}
                      </span>
                      <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                        {formatConversationTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-accent truncate">
                      {conv.project.name}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-xs text-text-muted truncate mt-0.5">
                        {conv.lastMessage.sender.id === userId
                          ? 'You: '
                          : ''}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {/* Unread badge */}
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent rounded-full">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
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
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border-default bg-bg-surface">
        {isAdmin && (
          <button
            onClick={() => setShowMobileThread(false)}
            className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold flex-shrink-0">
          {getOtherPartyName(activeConversation).charAt(0).toUpperCase()}
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
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-page">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
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
            {messages.map((msg) => {
              const isOwn = msg.senderId === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isOwn
                        ? 'bg-accent text-text-inverse rounded-br-md'
                        : 'bg-bg-card border border-border-default text-text-primary rounded-bl-md'
                    }`}
                  >
                    {!isOwn && (
                      <p
                        className={`text-xs font-semibold mb-1 ${
                          isOwn ? 'text-text-inverse/80' : 'text-accent'
                        }`}
                      >
                        {msg.sender.name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span
                        className={`text-[10px] ${
                          isOwn
                            ? 'text-text-inverse/60'
                            : 'text-text-disabled'
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {isOwn && (
                        <span
                          className={`${
                            msg.isRead
                              ? 'text-text-inverse/80'
                              : 'text-text-inverse/40'
                          }`}
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
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-border-default bg-bg-surface p-3">
        <form
          onSubmit={sendMessage}
          className="flex items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border-default bg-bg-page px-4 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            style={{ maxHeight: '120px' }}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
            className="!rounded-xl !min-h-[40px] !px-4"
            aria-label="Send message"
          >
            <FiSend className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-[10px] text-text-disabled mt-1.5 px-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );

  // ── CLIENT: direct full-screen chat (no conversation list) ──────────
  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border-default bg-bg-card shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
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
          <div className="flex flex-col h-full">
            {/* Project tabs — if multiple conversations */}
            {conversations.length > 1 && (
              <div className="flex gap-2 px-4 py-2 border-b border-border-default bg-bg-subtle overflow-x-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeConversation?.id === conv.id
                        ? 'bg-accent text-text-inverse'
                        : 'bg-bg-card text-text-muted border border-border-default hover:border-accent hover:text-accent'
                    }`}
                  >
                    {conv.project.name}
                    {conv.unreadCount > 0 && (
                      <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              {messageThreadJSX}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ADMIN: original side-by-side layout ──────────────────────────────
  return (
    <div className="rounded-xl border border-border-default bg-bg-card shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      {/* Desktop: side-by-side */}
      <div className="hidden lg:grid lg:grid-cols-[340px_1fr] h-full">
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
          <div className="relative w-full max-w-lg bg-bg-card rounded-2xl border border-border-default shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-default">
              <h3 className="text-lg font-semibold text-text-primary">Start New Conversation</h3>
              <button
                onClick={() => setShowNewConvoModal(false)}
                className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
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
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-inverse text-sm font-semibold flex-shrink-0">
                          {project.client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold text-text-primary truncate">
                              {project.client.name}
                            </span>
                            {project.conversation && (
                              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
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
