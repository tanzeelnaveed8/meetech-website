import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantClasses = {
  default: 'border border-border-default bg-bg-card shadow-sm',
  elevated: 'border border-border-default bg-bg-card shadow-md',
  bordered: 'border border-border-default bg-bg-surface',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverable ? 'hover:shadow-md hover:border-border-strong cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

