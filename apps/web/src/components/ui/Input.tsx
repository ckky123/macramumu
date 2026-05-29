import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-bark-500 font-sans"
          >
            {label}
            {props.required && (
              <span className="text-blush-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-sm text-bark-600',
              'font-sans placeholder:text-sand-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-bark-300 focus:border-bark-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-300'
                : 'border-sand-300 hover:border-sand-400',
              leftIcon && 'pl-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 font-sans" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-sand-400 font-sans">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
