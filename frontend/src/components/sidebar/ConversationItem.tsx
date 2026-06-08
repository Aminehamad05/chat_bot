import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'
import type { Conversation } from '../../types/chat'

interface Props {
  conversation: Conversation
}

export function ConversationItem({ conversation }: Props) {
  const navigate = useNavigate()
  const { activeConversationId, setActiveConversationId } = useChatStore()
  const isActive = activeConversationId === conversation.id

  const handleClick = () => {
    setActiveConversationId(conversation.id)
    navigate(`/chat/${conversation.id}`)
  }

  return (
    <div className="border-b border-gray-700">
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors
        ${isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
    >
      <MessageSquare size={15} className="flex-shrink-0" />
      <span className="truncate">{conversation.title}</span>
    </button>
    </div>
  )
}