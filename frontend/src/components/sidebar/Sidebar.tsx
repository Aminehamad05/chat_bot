import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Menu, PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../../services/chatService'
import { useChatStore } from '../../stores/chatStore'
import { ConversationList } from './ConversationList'
import { useUiStore } from '../../stores/uiStore'

export function Sidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId)
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const sidebarWidth = isSidebarOpen ? 'w-64' : 'w-16';
  const newChat = useMutation({
    mutationFn: chatService.createConversation,
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setActiveConversationId(conv.id)
      navigate(`/chat/${conv.id}`)
    },
    onError: (error) => {
    console.error('Failed to create conversation', error)
  },
  })
  return (
    <div className={`${sidebarWidth} flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col h-full`}>
      {/* Header */}
      <div className={`flex ${isSidebarOpen ? 'flex-row justify-between border-b border-gray-700' : 'flex-col'} items-center gap-2 px-3 py-4`}>
        <button
          onClick={() => newChat.mutate()}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          title="New chat"
        >
          <PenSquare size={18} />
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Conversation list */}
      {isSidebarOpen && (
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <ConversationList />
        </div>
      )}
    </div>
  )
}
        