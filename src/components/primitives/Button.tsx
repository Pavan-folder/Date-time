import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-modern hover:shadow-modern-lg active:scale-95';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
    secondary: 'bg-neutral-100 dark:bg-dark-primary-700 text-neutral-900 dark:text-dark-primary-100 hover:bg-neutral-200 dark:hover:bg-dark-primary-600 active:bg-neutral-300 dark:active:bg-dark-primary-500',
    outline: 'border border-neutral-300 dark:border-dark-primary-600 bg-white dark:bg-dark-primary-800 text-neutral-900 dark:text-dark-primary-100 hover:bg-neutral-50 dark:hover:bg-dark-primary-700 active:bg-neutral-100 dark:active:bg-dark-primary-600',
    ghost: 'text-neutral-700 dark:text-dark-primary-300 hover:bg-neutral-100 dark:hover:bg-dark-primary-700 hover:text-neutral-900 dark:hover:text-dark-primary-100 active:bg-neutral-200 dark:active:bg-dark-primary-600',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
