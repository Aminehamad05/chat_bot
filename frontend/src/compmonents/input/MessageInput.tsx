import React from 'react'
import {useState} from 'react';
import {SendButton} from './SendButton';
import {StopButton} from './StopButton';
interface Props{
  onSend:(content:string) => void;
  disabled?:boolean;
  onStop:()=> void;
  isStreaming?:boolean;

}
export function MessageInput({onSend,disabled,onStop,isStreaming}:Props) {
  const [content,setContent] = useState('');

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(content.trim() && !disabled){
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
      />
      {isStreaming ? (
        <StopButton onClick={onStop} isStreaming={isStreaming} />
      ) : (
        <SendButton type="submit">Send</SendButton>
      )}
    </form>
  );
}

