import { useQuery } from '@tanstack/react-query'
import { chatService } from '../../services/chatService'
import { ConversationItem } from './ConversationItem'
import { Spinner } from '../ui/Spinner'
import {mockConversations} from '../../mocks/data'
export function ConversationList() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  })
  if (!Array.isArray(conversations) || conversations.length === 0) {
    return (
    <div className="flex flex-col gap-1">
      {mockConversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  )
  }
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (!conversations?.length) {
    return <p className="text-xs text-gray-600 text-center py-6">No conversations yet</p>
  }

  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  )
}