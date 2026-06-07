import type { Message } from '../../types/chat';

interface Props {
  message: Message;
}

export function StreamingBubble({ message }: Props) {
  return (
    <div data-role="assistant" data-streaming="true">
      <p>{message.content}</p>
    </div>
  );
}

export default StreamingBubble;