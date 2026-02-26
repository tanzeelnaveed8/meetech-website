import { prisma } from "@/lib/db/client";

// Get or create a conversation for a project
export async function getOrCreateConversation(projectId: string) {
  let conversation = await prisma.conversation.findUnique({
    where: { projectId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { projectId },
    });
  }

  return conversation;
}

// Get all conversations for a user (admin sees all, client sees own projects)
export async function getConversationsByUser(userId: string, role: string) {
  const isAdmin = ["ADMIN", "EDITOR", "VIEWER"].includes(role);

  if (!isAdmin) {
    // Ensure client can always start chatting, even without an assigned project yet.
    let clientProjects = await prisma.project.findMany({
      where: { clientId: userId },
      select: { id: true },
    });

    if (clientProjects.length === 0) {
      const manager =
        (await prisma.user.findFirst({
          where: { role: "ADMIN", isActive: true },
          select: { id: true },
        })) ??
        (await prisma.user.findFirst({
          where: { role: "EDITOR", isActive: true },
          select: { id: true },
        }));

      if (manager) {
        const supportProject = await prisma.project.create({
          data: {
            name: "General Support",
            description:
              "Auto-created support channel so the client can message their manager.",
            scope: "General support and communication",
            status: "IN_PROGRESS",
            progress: 0,
            clientId: userId,
            managerId: manager.id,
          },
          select: { id: true },
        });

        clientProjects = [supportProject];
      }
    }

    // Ensure each client project has an associated conversation.
    await Promise.all(
      clientProjects.map((project) =>
        prisma.conversation.upsert({
          where: { projectId: project.id },
          update: {},
          create: { projectId: project.id },
        })
      )
    );
  }

  const conversations = await prisma.conversation.findMany({
    where: isAdmin
      ? {} // Admin sees all conversations
      : {
          project: { clientId: userId },
        },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          clientId: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  // Compute unread count per conversation for the current user
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          isRead: false,
        },
      });

      return {
        ...conv,
        lastMessage: conv.messages[0] || null,
        unreadCount,
      };
    }),
  );

  return conversationsWithUnread;
}

// Get messages for a conversation
export async function getMessagesByConversation(
  conversationId: string,
  limit = 50,
  before?: string,
) {
  return prisma.message.findMany({
    where: {
      conversationId,
      ...(before && { createdAt: { lt: new Date(before) } }),
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

// Create a new message
export async function createMessage(
  conversationId: string,
  senderId: string,
  content: string,
) {
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return message;
}

// Mark all messages from the other party as read
export async function markMessagesAsRead(
  conversationId: string,
  userId: string,
) {
  return prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

// Get total unread message count for a user
export async function getUnreadCount(userId: string, role: string) {
  const isAdmin = ["ADMIN", "EDITOR", "VIEWER"].includes(role);

  return prisma.message.count({
    where: {
      senderId: { not: userId },
      isRead: false,
      conversation: isAdmin
        ? {} // Admin sees unread from all conversations
        : {
            project: { clientId: userId },
          },
    },
  });
}

// Check if user has access to a conversation
export async function checkConversationAccess(
  conversationId: string,
  userId: string,
  role: string,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      project: {
        select: {
          clientId: true,
          managerId: true,
        },
      },
    },
  });

  if (!conversation) return null;

  const isAdmin = ["ADMIN", "EDITOR"].includes(role);
  const isClient =
    role === "CLIENT" && conversation.project.clientId === userId;
  const isManager = conversation.project.managerId === userId;

  if (!isAdmin && !isClient && !isManager) return null;

  return conversation;
}
