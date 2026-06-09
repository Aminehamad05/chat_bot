import { useQuery } from '@tanstack/react-query'
import { chatService } from '../../services/chatService'
import { ConversationItem } from './ConversationItem'
import { Spinner } from '../ui/Spinner'

interface Props {
  isDark: boolean
}

export function ConversationList({ isDark }: Props) {
  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  })

  // ✅ Loading — always first
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  // ✅ Error state
  if (isError) {
    return (
      <div className={`mx-2 px-3 py-3 rounded-lg text-xs text-center
        ${isDark
          ? 'bg-red-500/10 text-red-400'
          : 'bg-red-50 text-red-500'}`}>
        Failed to load conversations
      </div>
    )
  }

  // ✅ Empty state
  if (!conversations?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
          ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <p className={`text-xs leading-relaxed
          ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No conversations yet.<br />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Click + to start one.
          </span>
        </p>
      </div>
    )
  }

  // ✅ Grouped by date
  const grouped = groupByDate(conversations)

  return (
    <div className="flex flex-col gap-4">
      {grouped.map(({ label, items }) => (
        <div key={label}>
          {/* Date group label */}
          <p className={`text-[11px] font-medium uppercase tracking-wider px-2 mb-1
            ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {label}
          </p>
          <div className="flex flex-col gap-0.5">
            {items.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

import type { Conversation } from '../../types/chat'

function groupByDate(conversations: Conversation[]): { label: string; items: Conversation[] }[] {
  const now = new Date()
  const today = startOfDay(now)
  const yesterday = startOfDay(new Date(now.getTime() - 86400000))
  const sevenDaysAgo = startOfDay(new Date(now.getTime() - 7 * 86400000))
  const thirtyDaysAgo = startOfDay(new Date(now.getTime() - 30 * 86400000))

  const buckets: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    'Last 7 days': [],
    'Last 30 days': [],
    Older: [],
  }

  for (const conv of conversations) {
    const d = startOfDay(new Date(conv.lastMessageAt))
    if (d >= today) buckets['Today'].push(conv)
    else if (d >= yesterday) buckets['Yesterday'].push(conv)
    else if (d >= sevenDaysAgo) buckets['Last 7 days'].push(conv)
    else if (d >= thirtyDaysAgo) buckets['Last 30 days'].push(conv)
    else buckets['Older'].push(conv)
  }

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }))
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}