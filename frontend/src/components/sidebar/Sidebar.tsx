import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Menu, PenSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../../services/chatService'
import { useChatStore } from '../../stores/chatStore'
import { ConversationList } from './ConversationList'
import { useUiStore } from '../../stores/uiStore'

interface Props {
  isDark: boolean
}

export function Sidebar({ isDark }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setActiveConversation = useChatStore((s) => s.setActiveConversationId)
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const newChat = useMutation({
    mutationFn: chatService.createConversation,
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setActiveConversation(conv.id)
      navigate(`/chat/${conv.id}`)
    },
    onError: (error) => {
      console.error('Failed to create conversation', error)
    },
  })

  // Shared button style
  const iconBtn = `
    inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors
    ${isDark
      ? 'text-gray-400 hover:text-white hover:bg-white/10'
      : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'}
  `

  return (
    <div className={`
      flex-shrink-0 flex flex-col h-full transition-all duration-200
      ${isSidebarOpen ? 'w-64' : 'w-16'}
      ${isDark
        ? 'bg-gray-900 border-r border-white/5'
        : 'bg-gray-50 border-r border-gray-200'}
    `}>

      {/* Header */}
      <div className={`
        flex items-center h-14 px-3 flex-shrink-0
        ${isSidebarOpen ? 'justify-between' : 'justify-center'}
        
      `}>
        {isSidebarOpen && (
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <span className={`font-semibold text-sm tracking-tight
              ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Chatbot
            </span>
          </div>
        )}

        <div className={`flex items-center gap-1 ${!isSidebarOpen ? 'flex-col gap-2' : ''}`}>
          {isSidebarOpen && (
            <button
              onClick={() => newChat.mutate()}
              disabled={newChat.isPending}
              className={iconBtn}
              title="New chat"
            >
              <PenSquare size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className={iconBtn}
            aria-label="Toggle sidebar"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Collapsed — just a new chat icon centered */}
      {!isSidebarOpen && (
        <div className="flex flex-col items-center pt-3">
          <button
            onClick={() => newChat.mutate()}
            disabled={newChat.isPending}
            className={iconBtn}
            title="New chat"
          >
            <PenSquare size={16} />
          </button>
        </div>
      )}

      {/* Conversation list */}
      {isSidebarOpen && (
        <div className="flex-1 overflow-y-auto py-2 px-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-white/10">

          {/* Section label */}
          <p className={`text-[11px] font-medium uppercase tracking-wider px-2 mb-2
            ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Conversations
          </p>

          <ConversationList isDark={isDark} />
        </div>
      )}

      {/* Footer — subtle version info */}
      {isSidebarOpen && (
        <div className={`px-4 py-3 flex-shrink-0 border-t
          ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
          <p className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            v0.1.0 · mock mode
          </p>
        </div>
      )}

    </div>
  )
}