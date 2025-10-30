import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm',
            'placeholder:text-gray-500 placeholder:opacity-100',
            'transition-all duration-300 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:scale-[1.02]',
            'hover:border-gray-400 hover:shadow-sm',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }