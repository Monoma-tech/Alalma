import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Heart, Star, Clock, User, BookOpen, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { type Product } from '@/data/products'
import { useFlyToCart } from '@/hooks/useFlyToCart'

interface WisdomProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
}

export function WisdomProductCard({ product, onAddToCart, onAddToWishlist }: WisdomProductCardProps) {
  const router = useRouter()
  const { flyToCart } = useFlyToCart()
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
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
    switch (category) {
      case 'Cursos':
        return 'bg-blue-100 text-blue-800'
      case 'Terapias':
        return 'bg-purple-100 text-purple-800'
      case 'Herramientas':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <Card>
        <div className="relative overflow-hidden">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
              -{discount}%
            </div>
          )}
          
          {/* Category Badge */}
          <div className={`absolute top-3 right-3 ${getCategoryColor(product.category)} px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1`}>
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
          <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
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
              isHovered ? 'opacity-100' : 'opacity-0'
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

        <CardContent className="p-5">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          
          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{product.instructor}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{product.duration}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {product.rating}
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviews} reseñas)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button
            ref={buttonRef}
            className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer transition-transform hover:scale-105"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Añadir al carrito' : 'Próximamente'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}