import { Button } from '@/components/ui/Button'
import { Heart, X, ShoppingCart, Star, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { type Product } from '@/data/products'

interface FavoritesProps {
  items: Product[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (id: number) => void
  onAddToCart: (product: Product) => void
  onMoveAllToCart: () => void
}

export function FavoritesSidebar({
  items,
  isOpen,
  onClose,
  onRemoveItem,
  onAddToCart,
  onMoveAllToCart
}: FavoritesProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-current" />
            <h2 className="font-semibold">Mis Favoritos ({items.length})</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu lista está vacía
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Explora nuestros cursos, terapias y herramientas para encontrar lo que resuene con tu alma.
              </p>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continuar explorando
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0"> 
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            {item.category === 'Cursos' && '🧘'}
                            {item.category === 'Terapias' && '💖'}
                            {item.category === 'Herramientas' && '✨'}
                            <span className="ml-1">{item.category}</span>
                          </span>
                          
                          {/* Rating */}
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-purple-600">
                            ${item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {item.inStock ? 'Al Carrito' : 'Agotado'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{items.length} productos guardados</span>
              <span>{items.filter(item => item.inStock).length} disponibles</span>
            </div>
            
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={onMoveAllToCart}
              disabled={items.filter(item => item.inStock).length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Añadir Todo al Carrito
            </Button>
            
            <Button
              variant="outline"
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-100"
              onClick={onClose}
            >
              Continuar explorando
            </Button>
          </div>
        )}
      </div>
    </>
  )         
}
 