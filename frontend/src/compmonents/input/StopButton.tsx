import type { ButtonHTMLAttributes } from 'react';
import { FaStop } from 'react-icons/fa';
import { Button } from '../ui/Button';

interface StopButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isStreaming?: boolean;
}

export function StopButton({
  isStreaming = false,
  children = 'Stop',
  className = '',
  ...props
}: StopButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={`btn-ghost ${className}`.trim()}
      disabled={!isStreaming || props.disabled}
      {...props}
    >
      <FaStop />
      {children}
    </Button>
  );
}