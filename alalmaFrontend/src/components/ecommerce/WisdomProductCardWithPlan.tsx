'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Heart, Star, Clock, User, BookOpen, Sparkles, Lock, Crown } from 'lucide-react'
import Image from 'next/image'
import { type Product } from '@/data/products'
import { useFlyToCart } from '@/hooks/useFlyToCart'
import { useUserPlan } from '@/contexts/UserPlanContext'

interface WisdomProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
}

export function WisdomProductCardWithPlan({ product, onAddToCart, onAddToWishlist }: WisdomProductCardProps) {
  const router = useRouter()
  const { flyToCart } = useFlyToCart()
  const { canAccess } = useUserPlan()
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const hasAccess = canAccess(product.accessLevel)
  const isIncludedInPlan = product.isIncludedInPlan && hasAccess

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!hasAccess) {
      router.push('/plans')
      return
    }
    
    if (buttonRef.current) {
      flyToCart(buttonRef.current, {
        onComplete: () => {
          onAddToCart(product)
        }
      })
    } else {
      onAddToCart(product)
    }
  }

  const handleCardClick = () => {
    if (hasAccess) {
      router.push(`/product/${product.id}`)
    } else {
      router.push('/plans')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cursos':
        return <BookOpen className="w-4 h-4" />
      case 'Terapias':
        return <Sparkles className="w-4 h-4" />
      case 'Herramientas':
        return <Star className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    if (!hasAccess) return 'bg-gray-100 text-gray-500'
    
    switch (category) {
      case 'Cursos':
        return 'bg-blue-100 text-blue-800'
      case 'Terapias':
        return 'bg-pink-100 text-pink-800'
      case 'Herramientas':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanBadgeInfo = () => {
    switch (product.accessLevel) {
      case 'free':
        return { label: 'Gratis', color: 'bg-green-100 text-green-800', icon: '✨' }
      case 'basic':
        return { label: 'Buscador', color: 'bg-blue-100 text-blue-800', icon: '💙' }
      case 'intermediate':
        return { label: 'Transformador', color: 'bg-purple-100 text-purple-800', icon: '💜' }
      case 'premium':
        return { label: 'Maestro', color: 'bg-yellow-100 text-yellow-800', icon: '👑' }
    }
  }

  const planBadge = getPlanBadgeInfo()

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
        !hasAccess ? 'opacity-70' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Card className={`relative ${!hasAccess ? 'border-gray-300' : ''}`}>
        {!hasAccess && (
          <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center rounded-lg">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center text-sm font-medium text-gray-700">
              <Lock className="w-4 h-4 mr-2" />
              Requiere {planBadge.label}
            </div>
          </div>
        )}
        
        <div className="relative overflow-hidden">
          {/* Access Level Badge */}
          <div className={`absolute top-3 left-3 ${planBadge.color} px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1`}>
            <span>{planBadge.icon}</span>
            {planBadge.label}
          </div>

          {/* Included in Plan Badge */}
          {isIncludedInPlan && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Incluido
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && hasAccess && (
            <div className="absolute top-12 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
              -{discount}%
            </div>
          )}
          
          {/* Category Badge */}
          <div className={`absolute bottom-3 right-3 ${getCategoryColor(product.category)} px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1`}>
            {getCategoryIcon(product.category)}
            {product.category}
          </div>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-12 right-3 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
              Próximamente
            </div>
          )}

          {/* Product Image */}
          <div className={`aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden ${
            !hasAccess ? 'grayscale' : ''
          }`}>
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
            
            {/* Hover Actions */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered && hasAccess ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white cursor-pointer transition-transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToWishlist(product)
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className={`font-semibold mb-2 line-clamp-2 ${hasAccess ? 'text-gray-900' : 'text-gray-600'}`}>
            {product.name}
          </h3>
          
          {/* Duration and Instructor */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{product.duration}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span className="truncate">{product.instructor}</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? hasAccess ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${hasAccess ? 'text-gray-900' : 'text-gray-600'}`}>
              {product.rating}
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviews} reseñas)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isIncludedInPlan ? (
                <span className="text-2xl font-bold text-green-600">
                  Incluido
                </span>
              ) : (
                <>
                  <span className={`text-2xl font-bold ${hasAccess ? 'text-purple-600' : 'text-gray-500'}`}>
                    ${(product.planPrice && hasAccess ? product.planPrice : product.price).toLocaleString()}
                  </span>
                  {product.originalPrice && hasAccess && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            ref={buttonRef}
            className={`w-full transition-all duration-200 hover:scale-105 ${
              !hasAccess 
                ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer'
                : isIncludedInPlan
                ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
            }`}
            onClick={handleAddToCart}
            disabled={!product.inStock && hasAccess}
          >
            {!hasAccess ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Ver Planes
              </>
            ) : !product.inStock ? (
              'Próximamente'
            ) : isIncludedInPlan ? (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Acceder Ahora
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Añadir al carrito
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}