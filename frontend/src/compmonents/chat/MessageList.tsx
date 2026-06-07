import type { Message } from '../../types/chat';
import {MessageBubble} from './MessageBubble';
import StreamingBubble from './StreamingBubble';
import {TypingIndicator} from './TypingIndicator';

interface Props {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({
  messages,
  isStreaming,
}: Props) {
  const lastMessage =
    messages[messages.length - 1];

  return (
    <>
      {messages.map((message, index) => {
        const isLast =
          index === messages.length - 1;

        const isAssistant =
          message.role === 'assistant';

        if (
          isStreaming &&
          isLast &&
          isAssistant
        ) {
          return (
            <StreamingBubble
              key={message.id}
              message={message}
            />
          );
        }

        return (
          <MessageBubble
            key={message.id}
            message={message}
          />
        );
      })}

      {isStreaming &&
        (!lastMessage ||
          lastMessage.role !== 'assistant') && (
          <TypingIndicator />
        )}
    </>
  );
}

export default MessageList;