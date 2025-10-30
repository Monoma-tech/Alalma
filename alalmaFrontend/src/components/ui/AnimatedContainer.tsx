'use client'

import { ReactNode, forwardRef } from 'react'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  animation?: string
  delay?: number
  staggered?: boolean
  staggerDelay?: number
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, animation = 'animate-fade-in-up', delay = 0, staggered = false, staggerDelay = 0.1 }, forwardedRef) => {
    const scrollRef = useScrollAnimation(animation, {
      threshold: 0.1,
      triggerOnce: true
    })

    const childrenArray = Array.isArray(children) ? children : [children]
    const staggerRef = useStaggeredAnimation(
      staggered ? childrenArray.length : 0,
      staggerDelay,
      animation
    )

    const ref = staggered ? staggerRef : scrollRef

    return (
      <div
        ref={forwardedRef || ref}
        className={cn(
          'opacity-0', // Inicia invisible para la animación
          staggered && 'stagger-container',
          className
        )}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'

// Componente especializado para grids animados
interface AnimatedGridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8
  staggerDelay?: number
}

export function AnimatedGrid({ 
  children, 
  className, 
  cols = 3, 
  gap = 6, 
  staggerDelay = 0.1 
}: AnimatedGridProps) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const staggerRef = useStaggeredAnimation(childrenArray.length, staggerDelay)

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  }

  const gapClass = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  return (
    <div
      ref={staggerRef}
      className={cn(
        'grid',
        gridCols[cols],
        gapClass[gap],
        'stagger-container',
        className
      )}
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="opacity-0"
          style={{ animationDelay: `${index * staggerDelay}s` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Componente para animaciones de entrada desde diferentes direcciones
interface AnimatedEntryProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  delay?: number
  duration?: number
}

export function AnimatedEntry({ 
  children, 
  className, 
  direction = 'up', 
  delay = 0,
  duration = 0.6 
}: AnimatedEntryProps) {
  const animations = {
    up: 'animate-fade-in-up',
    down: 'animate-slide-down',
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    scale: 'animate-fade-in-scale',
    fade: 'animate-fade-in'
  }

  const animation = animations[direction]
  const scrollRef = useScrollAnimation(animation, {
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <div
      ref={scrollRef}
      className={cn('opacity-0', className)}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  )
}