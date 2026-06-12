import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Enums ────────────────────────────────────────────────────
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant'])

// ── Tables ───────────────────────────────────────────────────
export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      varchar('name', { length: 100 }).notNull(),
  email:     varchar('email', { length: 255 }).notNull().unique(),
  password:  varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const conversations = pgTable('conversations', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:         varchar('title', { length: 255 }).notNull().default('New conversation'),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  lastMessageAt: timestamp('last_message_at').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id:             uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role:           messageRoleEnum('role').notNull(),
  content:        text('content').notNull(),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
})

// ── Relations ─────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user:     one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields:     [messages.conversationId],
    references: [conversations.id],
  }),
}))

// ── Inferred types (use these throughout your app) ────────────
export type User         = typeof users.$inferSelect
export type NewUser      = typeof users.$inferInsert
export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
export type Message      = typeof messages.$inferSelect
export type NewMessage   = typeof messages.$inferInsert