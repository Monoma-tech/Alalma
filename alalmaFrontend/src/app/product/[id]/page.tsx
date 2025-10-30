'use client'

import { useState, use } from 'react'
import { ProductDetail } from '@/components/product/ProductDetail'
import { findProductById } from '@/data/products'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [wishlist, setWishlist] = useState<number[]>([]) // Simular lista de favoritos
  const product = findProductById(resolvedParams.id)
  
  const handleAddToWishlist = () => {
    if (!product) return
    
    setWishlist(prev => {
      if (prev.includes(product.id)) {
        // Remover de favoritos
        return prev.filter(id => id !== product.id)
      } else {
        // Agregar a favoritos  
        return [...prev, product.id]
      }
    })
  }
  
  const isInWishlist = product ? wishlist.includes(product.id) : false
  
  return (
    <ProductDetail 
      productId={resolvedParams.id} 
      isInWishlist={isInWishlist}
      onAddToWishlist={handleAddToWishlist}
    />
  )
}