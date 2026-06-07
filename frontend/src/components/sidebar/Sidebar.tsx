import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../../services/chatService'
import { useChatStore } from '../../stores/chatStore'
import { ConversationList } from './ConversationList'

export function Sidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId)

  const newChat = useMutation({
    mutationFn: chatService.createConversation,
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setActiveConversationId(conv.id)
      navigate(`/chat/${conv.id}`)
    },
  })

  return (
    <div className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <span className="font-semibold text-white text-sm">Chatbot</span>
        <button
          onClick={() => newChat.mutate()}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="New chat"
        >
          <PenSquare size={16} />
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <ConversationList />
      </div>
    </div>
  )
}