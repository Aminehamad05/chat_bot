import { api } from './api'
import type { Conversation, Message } from '../types/chat'

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<Conversation[]>('/api/conversations')
    return res.data
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await api.get<Message[]>(
      `/api/conversations/${conversationId}/messages`
    )
    return res.data
  },

  createConversation: async (): Promise<Conversation> => {
    const res = await api.post<Conversation>('/api/conversations')
    return res.data
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/api/conversations/${conversationId}`)
  },

  updateTitle: async (conversationId: string, title: string): Promise<Conversation> => {
    const res = await api.patch<Conversation>(
      `/api/conversations/${conversationId}/title`,
      { title }
    )
    return res.data
  },
}