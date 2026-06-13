import { eq, desc, asc } from 'drizzle-orm'
import { db } from '../db/index'
import { conversations, messages } from '../db/schema'
import { AppError } from '../middleware/errorHandler'
import type { Conversation, Message, NewMessage } from '../db/schema'

export const conversationService = {

  // ── Conversations ───────────────────────────────────────────

  async getAll(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.lastMessageAt))
  },

  async getById(id: string, userId: string): Promise<Conversation> {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1)

    if (!conv) throw new AppError('Conversation not found', 404)
    if (conv.userId !== userId) throw new AppError('Forbidden', 403)

    return conv
  },

  async create(userId: string, title?: string): Promise<Conversation> {
    const [conv] = await db
      .insert(conversations)
      .values({
        userId,
        title: title ?? 'New conversation',
      })
      .returning()

    return conv
  },

  async updateTitle(id: string, userId: string, title: string): Promise<Conversation> {
    const conv = await conversationService.getById(id, userId)

    const [updated] = await db
      .update(conversations)
      .set({ title })
      .where(eq(conversations.id, conv.id))
      .returning()

    return updated
  },

  async delete(id: string, userId: string): Promise<void> {
    const conv = await conversationService.getById(id, userId)

    await db
      .delete(conversations)
      .where(eq(conversations.id, conv.id))
  },

  // ── Messages ─────────────────────────────────────────────────

  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    // Verify ownership first
    await conversationService.getById(conversationId, userId)

    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
  },

  async saveMessage(data: NewMessage): Promise<Message> {
    const [msg] = await db
      .insert(messages)
      .values(data)
      .returning()

    return msg
  },

  async updateLastMessageAt(conversationId: string): Promise<void> {
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId))
  },

  // Auto-generate title from first user message
  async generateTitle(firstMessage: string): Promise<string> {
    const trimmed = firstMessage.trim()
    if (trimmed.length <= 40) return trimmed
    return trimmed.slice(0, 40) + '...'
  },
}