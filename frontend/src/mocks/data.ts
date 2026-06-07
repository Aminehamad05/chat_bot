import type { Conversation, Message } from '../types/chat'

export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'What is TypeScript?',
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'React Query explained',
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
  },
]

export const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', role: 'user', content: 'What is TypeScript?', createdAt: new Date().toISOString() },
    { id: '2', role: 'assistant', content: 'TypeScript is a strongly typed superset of JavaScript that compiles to plain JS. It adds static types, interfaces, and better tooling.', createdAt: new Date().toISOString() },
  ],
  '2': [
    { id: '3', role: 'user', content: 'Explain React Query', createdAt: new Date().toISOString() },
    { id: '4', role: 'assistant', content: 'React Query is a server state management library. It handles fetching, caching, and syncing data from your API so you don\'t need useEffect for data fetching.', createdAt: new Date().toISOString() },
  ],
}