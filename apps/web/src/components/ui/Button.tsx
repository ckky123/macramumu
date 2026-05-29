import React from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  // Allow rendering as a different element (e.g. Link)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ElementType
  to?: string
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-bark-400 text-cream-50 hover:bg-bark-500 active:bg-bark-600 shadow-soft hover:shadow-warm',
  secondary:
    'bg-blush-200 text-bark-600 hover:bg-blush-300 active:bg-blush-400',
  outline:
    'border-2 border-bark-300 text-bark-500 hover:bg-bark-100 hover:border-bark-400',
  ghost:
    'text-bark-500 hover:bg-sand-100 hover:text-bark-600',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-sm rounded-lg',
  md:  'px-5 py-2.5 text-sm rounded-xl',
  lg:  'px-7 py-3.5 text-base rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  as: Component = 'button',
  ...props
}: ButtonProps) {
  const isButton = Component === 'button'

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-sans font-medium',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-bark-400 focus-visible:ring-offset-2',
        isButton && 'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...(isButton ? { disabled: disabled || isLoading, 'aria-busy': isLoading } : {})}
      {...props}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </Component>
  )
}
