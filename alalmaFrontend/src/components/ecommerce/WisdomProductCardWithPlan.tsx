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
  isInWishlist?: boolean
}

export function WisdomProductCardWithPlan({ product, onAddToCart, onAddToWishlist, isInWishlist = false }: WisdomProductCardProps) {
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

  const getCategoryColor = () => {
    // Paleta azul suave para todas las categorías
    return 'bg-slate-50 text-slate-600 border border-slate-200'
  }

  const getPlanBadgeInfo = () => {
    // Paleta azul elegante y suave
    switch (product.accessLevel) {
      case 'free':
        return { label: 'Gratis', color: 'bg-sky-50 text-sky-700 border border-sky-200', icon: '✨' }
      case 'basic':
        return { label: 'Buscador', color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: '🔍' }
      case 'intermediate':
        return { label: 'Transformador', color: 'bg-indigo-50 text-indigo-700 border border-indigo-200', icon: '🌟' }
      case 'premium':
        return { label: 'Maestro', color: 'bg-violet-50 text-violet-700 border border-violet-200', icon: '👑' }
    }
  }

  const planBadge = getPlanBadgeInfo()

  return (
    <div 
      className={`group cursor-pointer card-enhanced hover-lift-strong ${
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
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 flex items-center gap-1">
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
          <div className={`absolute bottom-3 right-3 ${getCategoryColor()} px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1`}>
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
          <div className={`aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden ${
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
            <div className={`absolute inset-0 bg-blue-900/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered && hasAccess ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                size="sm"
                variant="outline"
                className={`bg-white/95 hover:bg-white cursor-pointer shadow-lg hover-scale transition-all duration-300 ${
                  isInWishlist 
                    ? 'text-red-600 border-red-200 hover:border-red-300 animate-bounce-in' 
                    : 'text-blue-700 border-blue-200 hover:border-blue-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToWishlist(product)
                }}
              >
                <Heart className={`w-4 h-4 transition-all duration-300 ${
                  isInWishlist ? 'fill-current animate-pulse-glow' : 'hover:scale-110'
                }`} />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className={`font-semibold mb-2 line-clamp-2 ${hasAccess ? 'text-slate-800' : 'text-slate-600'}`}>
            {product.name}
          </h3>
          
          {/* Duration and Instructor */}
          <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{product.duration}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/instructor/${product.instructorId}`)
                }}
                className="truncate text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                {product.instructor}
              </button>
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
                      ? hasAccess ? 'fill-amber-400 text-amber-400' : 'fill-slate-400 text-slate-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${hasAccess ? 'text-slate-700' : 'text-slate-600'}`}>
              {product.rating}
            </span>
            <span className="text-xs text-slate-500">
              ({product.reviews} reseñas)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isIncludedInPlan ? (
                <span className="text-xl font-semibold text-emerald-600">
                  Incluido
                </span>
              ) : (
                <>
                  <span className="text-xl font-semibold text-slate-800">
                    ${(product.planPrice && hasAccess ? product.planPrice : product.price).toFixed(2)} USD
                  </span>
                  {product.originalPrice && hasAccess && (
                    <span className="text-sm text-slate-500 line-through">
                      ${product.originalPrice.toFixed(2)} USD
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            ref={buttonRef}
            className={`w-full text-white cursor-pointer btn-animated hover-lift transition-all duration-300 shadow-sm hover:shadow-lg ${
              !hasAccess 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                : isIncludedInPlan 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
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