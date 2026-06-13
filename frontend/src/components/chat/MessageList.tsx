import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { StreamingBubble } from './StreamingBubble'
import type { Message } from '../../types/chat'

interface Props {
  messages: Message[]
  isSending: boolean
  streamingContent: string
}

export function MessageList({ messages, isSending, streamingContent }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending, streamingContent])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Show typing indicator while waiting for first token */}
      {isSending && !streamingContent && <TypingIndicator />}

      {/* Show streaming bubble once tokens start arriving */}
      {streamingContent && <StreamingBubble content={streamingContent} />}

      <div ref={bottomRef} />
    </div>
  )
}