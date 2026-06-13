import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '../components/layout/AppLayout'
import { MessageList } from '../components/chat'
import { MessageInput } from '../components/input'
import { EmptyState } from '../components/layout/EmptyState'
import { useChatStore } from '../stores/chatStore'
import { useChat } from '../hooks/useChat'
import { chatService } from '../services/chatService'

export function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setActiveConversation = useChatStore((s) => s.setActiveConversationId)
  const activeConversationId = useChatStore((s) => s.activeConversationId)

  const { messages, isLoading, isSending, onError, streamingContent, sendMessage } = useChat()

  useEffect(() => {
    if (conversationId) setActiveConversation(conversationId)
  }, [conversationId, setActiveConversation])

  const newChatThenSend = useMutation({
    mutationFn: () => chatService.createConversation(),
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setActiveConversation(conv.id)
      navigate(`/chat/${conv.id}`)
    },
  })

  const handleSuggestionClick = async (text: string) => {
    if (activeConversationId) {
      sendMessage(text)
      return
    }
    const conv = await newChatThenSend.mutateAsync()
    setActiveConversation(conv.id)
    setTimeout(() => sendMessage(text), 50)
  }

  return (
    <AppLayout>
      {!activeConversationId ? (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      ) : (
        <>
          <MessageList
            messages={messages}
            isSending={isSending}
            streamingContent={streamingContent} 
          />
          <MessageInput
            onSend={sendMessage}
            isSending={isSending}
            disabled={isSending}
            onStop={onError}  
          />
        </>
      )}
    </AppLayout>
  )
}