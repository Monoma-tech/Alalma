'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean
  onIntersect?: (entry: IntersectionObserverEntry) => void
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
    onIntersect
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting
        setIsIntersecting(isInView)

        if (isInView) {
          setHasIntersected(true)
          onIntersect?.(entry)
          
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, root, rootMargin, triggerOnce, onIntersect])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

// Hook especializado para animaciones de entrada
export function useScrollAnimation(
  animationClass = 'animate-fade-in-up',
  options: UseIntersectionObserverOptions = {}
) {
  const { elementRef, hasIntersected } = useIntersectionObserver(options)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (hasIntersected) {
      element.classList.add(animationClass)
    }
  }, [hasIntersected, animationClass, elementRef])

  return elementRef as React.RefObject<HTMLDivElement>
}

// Hook para animaciones escalonadas
export function useStaggeredAnimation(
  itemsCount: number,
  baseDelay = 0.1,
  animationClass = 'animate-fade-in-up'
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { hasIntersected } = useIntersectionObserver()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasIntersected) return

    const items = container.children
    Array.from(items).forEach((item, index) => {
      const htmlItem = item as HTMLElement
      htmlItem.style.animationDelay = `${index * baseDelay}s`
      htmlItem.classList.add(animationClass)
    })
  }, [hasIntersected, itemsCount, baseDelay, animationClass])

  return containerRef
}