'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { type Product } from '@/data/products'

// Tipos para el carrito
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

// Tipos para el contexto
interface FavoritesCartContextType {
  // Favoritos
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: number) => void
  isInFavorites: (productId: number) => boolean
  toggleFavorite: (product: Product) => void
  
  // Carrito
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartItemCount: number
  cartTotal: number
}

const FavoritesCartContext = createContext<FavoritesCartContextType | undefined>(undefined)

interface FavoritesCartProviderProps {
  children: ReactNode
}

export function FavoritesCartProvider({ children }: FavoritesCartProviderProps) {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // ===== FAVORITOS =====
  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev // Ya está en favoritos
      }
      return [...prev, product]
    })
  }, [])

  const removeFromFavorites = useCallback((productId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== productId))
  }, [])

  const isInFavorites = useCallback((productId: number) => {
    return favorites.some(item => item.id === productId)
  }, [favorites])

  const toggleFavorite = useCallback((product: Product) => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }, [isInFavorites, addToFavorites, removeFromFavorites])

  // ===== CARRITO =====
  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Cálculos derivados
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value: FavoritesCartContextType = {
    // Favoritos
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    toggleFavorite,
    
    // Carrito  
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartTotal
  }

  return (
    <FavoritesCartContext.Provider value={value}>
      {children}
    </FavoritesCartContext.Provider>
  )
}

// Hook para usar el contexto
export function useFavoritesCart() {
  const context = useContext(FavoritesCartContext)
  if (context === undefined) {
    throw new Error('useFavoritesCart must be used within a FavoritesCartProvider')
  }
  return context
}