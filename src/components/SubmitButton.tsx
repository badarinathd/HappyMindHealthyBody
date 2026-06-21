'use client';

import { useFormStatus } from 'react-dom';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({
  children,
  variant = 'primary',
  pendingLabel,
  className = '',
}: Props) {
  const { pending } = useFormStatus();
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button type="submit" disabled={pending} className={`${base} ${className}`}>
      {pending ? (pendingLabel ?? 'Please wait…') : children}
    </button>
  );
}
