// components/chat/ChatWindow.tsx
import { useChat } from '../../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import {MessageInput} from '../input/MessageInput'

export function ChatWindow() {
  const { messages, sendMessage, isLoading,stopStream ,isStreaming } = useChat()

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput onSend={sendMessage} onStop={stopStream} isSending={isStreaming} disabled={isStreaming} />
    </div>
  )
}