import { useNavigate } from 'react-router-dom'
import { MessageSquare, Trash2 } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'        // ✅ singular
import { useUiStore } from '../../stores/uiStore'
import type { Conversation } from '../../types/chat'

interface Props {
  conversation: Conversation
  isDark?: boolean
}

export function ConversationItem({ conversation, isDark = true }: Props) {  // ✅ destructure isDark
  const navigate = useNavigate()
  const { activeConversationId, setActiveConversationId } = useChatStore()    // ✅ correct name
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const isActive = activeConversationId === conversation.id

  const handleClick = () => {
    setActiveConversationId(conversation.id)                                   // ✅ correct name
    navigate(`/chat/${conversation.id}`)
    if (window.innerWidth < 768) setSidebarOpen(false)                      // ✅ close on mobile
  }

  return (
    // ✅ removed border-b wrapper div, use background states instead
    <button
      onClick={handleClick}
      className={`
        group w-full flex items-center gap-2.5 px-2 py-2 rounded-lg
        text-left text-[13px] transition-colors duration-100
        ${isActive
          ? isDark
            ? 'bg-white/10 text-white'
            : 'bg-blue-50 text-blue-700'
          : isDark
            ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      {/* Icon */}
      <MessageSquare
        size={14}
        className={`flex-shrink-0 transition-colors
          ${isActive
            ? isDark ? 'text-white' : 'text-blue-600'
            : isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
      />

      {/* Title */}
      <span className="truncate flex-1">{conversation.title}</span>

      {/* Delete — appears on hover only */}
      <Trash2
        size={13}
        className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
          ${isDark
            ? 'text-gray-500 hover:text-red-400'
            : 'text-gray-400 hover:text-red-500'
          }`}
      />
    </button>
  )
}