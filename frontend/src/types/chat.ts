// types/chat.ts
export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  conversationId : string
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  lastMessageAt: string
}