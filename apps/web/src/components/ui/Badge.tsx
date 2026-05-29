import { clsx } from 'clsx'

type BadgeVariant = 'default' | 'sale' | 'soldout' | 'new' | 'featured'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-sand-100 text-bark-500',
  sale:     'bg-blush-200 text-blush-500',
  soldout:  'bg-sand-200 text-sand-400',
  new:      'bg-sage-100 text-sage-500',
  featured: 'bg-cream-200 text-bark-400',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
