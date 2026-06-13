import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChatStore } from '../stores/chatStore'
import { chatService } from '../services/chatService'
import { useAuthStore } from '../stores/authStore'
import type { Message } from '../types/chat'

export function useChat() {
  const queryClient = useQueryClient()
  const { activeConversationId, streamingContent, appendStreamChunk, clearStream } = useChatStore()
  const token = useAuthStore((s) => s.token)

  const messagesQuery = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => chatService.getMessages(activeConversationId!),
    enabled: !!activeConversationId,
  })

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!activeConversationId) throw new Error('No active conversation')

      // 1. Optimistically add the user message to the cache
      const optimistic: Message = {
        id: crypto.randomUUID(),
        conversationId: activeConversationId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData(
        ['messages', activeConversationId],
        (old: Message[] = []) => [...old, optimistic]
      )

      // 2. Open SSE stream to backend
      clearStream()

      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/conversations/${activeConversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // 3. Read the stream chunk by chunk
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          try {
            const json = JSON.parse(line.slice(6))

            if (json.chunk) {
              fullContent += json.chunk
              appendStreamChunk(json.chunk)   // updates UI token by token
            }

            if (json.done || json.error) break

          } catch {
            // malformed chunk, skip
          }
        }
      }

      return fullContent
    },

    onSuccess: (fullContent) => {
      if (!activeConversationId || !fullContent) return

      // 4. Add the complete assistant reply to the cache
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversationId: activeConversationId,
        role: 'assistant',
        content: fullContent,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData(
        ['messages', activeConversationId],
        (old: Message[] = []) => [...old, assistantMessage]
      )

      clearStream()

      // 5. Refresh sidebar so auto-generated title appears
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },

    onError: () => {
      clearStream()
    },
  })

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    isSending: sendMessage.isPending,
    streamingContent,
    onError: sendMessage.reset,
    sendMessage: (content: string) => sendMessage.mutate(content),
  }
}