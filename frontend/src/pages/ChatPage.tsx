import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { MessageList } from '../components/chat/MessageList'
import { MessageInput } from '../components/input'
import { EmptyState } from '../components/layout/EmptyState'
import { useChatStore } from '../stores/chatStore'
import { useChat } from '../hooks/useChat'
import { chatService } from '../services/chatService'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
export function ChatPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams()
  const setActiveConversation = useChatStore((s) => s.setActiveConversationId)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const handleSuggestionClick = async (text: string) => {
  if (activeConversationId) {
    // Scenario A — conversation already exists, send immediately
    sendMessage(text)
    return
  }

  // Scenario B — no conversation yet, create one first
  try {
    const conv = await chatService.createConversation()
    const queryClient = useQueryClient()
    // 1. Update React Query cache so sidebar shows the new chat
    queryClient.invalidateQueries({ queryKey: ['conversations'] })

    // 2. Update the store so useChat knows which conversation is active
    setActiveConversation(conv.id)

    // 3. Update the URL
    navigate(`/chat/${conv.id}`)

    // 4. Wait one tick for the store + URL to settle before sending
    //    Without this, sendMessage reads activeConversationId as null
    setTimeout(() => sendMessage(text), 50)

  } catch (error) {
    console.error('Failed to create conversation:', error)
  }
}
  // Sync URL param → store (handles direct URL visits / refresh)
  useEffect(() => {
    if (conversationId) setActiveConversation(conversationId)
  }, [conversationId, setActiveConversation])

  const { messages, isLoading, isStreaming, sendMessage,stopStream } = useChat()


  return (
    <AppLayout>
      {!activeConversationId ? (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading messages...</div>
        </div>
      ) : (
        <>
          <MessageList messages={messages} isStreaming={isStreaming} />
          <MessageInput onSend={sendMessage} isSending={isStreaming} onStop={stopStream} disabled={isStreaming} />
        </>
      )}
    </AppLayout>
  )
}