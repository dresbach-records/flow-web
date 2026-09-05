import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './CTAButton.css';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'outline' | 'ghost';
  children: ReactNode;
}

export default function CTAButton({ variant = 'gradient', children, ...props }: CTAButtonProps) {
  return (
    <button className={`site-cta site-cta-${variant}`} {...props}>
      {children}
    </button>
  );
}
