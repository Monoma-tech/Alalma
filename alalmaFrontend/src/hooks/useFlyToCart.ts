'use client'

import { useCallback } from 'react'

interface FlyToCartOptions {
  targetSelector?: string
  duration?: number
  onComplete?: () => void
}

export const useFlyToCart = () => {
  const flyToCart = useCallback((
    sourceElement: HTMLElement,
    options: FlyToCartOptions = {}
  ) => {
    const {
      targetSelector = '[data-cart-button]',
      duration = 800,
      onComplete
    } = options

    // Encontrar el carrito del header
    const cartButton = document.querySelector(targetSelector)
    if (!cartButton) {
      console.warn('Cart button not found')
      onComplete?.()
      return
    }

    // Obtener posiciones
    const sourceRect = sourceElement.getBoundingClientRect()
    const targetRect = cartButton.getBoundingClientRect()

    // Crear elemento de animación (clon del ícono)
    const flyingIcon = document.createElement('div')
    flyingIcon.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v4"/>
      </svg>
    `

    // Estilos del elemento volador
    Object.assign(flyingIcon.style, {
      position: 'fixed',
      left: `${sourceRect.left + sourceRect.width / 2}px`,
      top: `${sourceRect.top + sourceRect.height / 2}px`,
      width: '24px',
      height: '24px',
      color: '#9333ea', // purple-600
      pointerEvents: 'none',
      zIndex: '9999',
      transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: '1'
    })

    document.body.appendChild(flyingIcon)

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      // Calcular posición final
      const targetX = targetRect.left + targetRect.width / 2
      const targetY = targetRect.top + targetRect.height / 2

      Object.assign(flyingIcon.style, {
        left: `${targetX}px`,
        top: `${targetY}px`,
        transform: 'translate(-50%, -50%) scale(0.3)',
        opacity: '0.7'
      })
    })

    // Limpiar después de la animación
    setTimeout(() => {
      flyingIcon.remove()
      
      // Efecto de "bounce" en el carrito
      const cartIcon = cartButton.querySelector('svg')
      if (cartIcon) {
        cartIcon.style.transition = 'transform 200ms ease-out'
        cartIcon.style.transform = 'scale(1.2)'
        
        setTimeout(() => {
          cartIcon.style.transform = 'scale(1)'
        }, 200)
      }
      
      onComplete?.()
    }, duration)

  }, [])

  return { flyToCart }
}