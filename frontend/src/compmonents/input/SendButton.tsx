import type { ButtonHTMLAttributes } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';

interface SendButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export function SendButton({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  ...props
}: SendButtonProps) {
  return (
    <Button
      variant={variant}
      className={`btn-primary ${className}`.trim()}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
}