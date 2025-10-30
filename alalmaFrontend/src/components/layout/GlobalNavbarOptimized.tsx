'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ShoppingCartSidebar } from '@/components/ecommerce/ShoppingCart'
import { FavoritesSidebar } from '@/components/ecommerce/FavoritesSidebar'
import { useFavoritesCart } from '@/contexts/FavoritesCartContext'
import { useUserPlan } from '@/contexts/UserPlanContext'
import { useUserRole } from '@/contexts/UserRoleContext'
import { 
  LogOut, 
  ShoppingCart, 
  Heart, 
  User, 
  Grid3X3,
  Sparkles,
  Settings,
  ChevronDown,
  UserCircle,
  Search
} from 'lucide-react'

interface GlobalNavbarProps {
  searchTerm?: string
  onSearchChange?: (term: string) => void
  showSearch?: boolean
}

export function GlobalNavbarOptimized({ 
  searchTerm = '', 
  onSearchChange, 
  showSearch = true 
}: GlobalNavbarProps) {
  const router = useRouter()
  const { userPlan } = useUserPlan()
  const { setUserRole } = useUserRole()
  const { 
    favorites, 
    cartItems, 
    cartItemCount, 
    addToCart, 
    removeFromCart, 
    updateQuantity
  } = useFavoritesCart()
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isPlanTooltipOpen, setIsPlanTooltipOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const planTooltipRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdowns cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
      if (planTooltipRef.current && !planTooltipRef.current.contains(event.target as Node)) {
        setIsPlanTooltipOpen(false)
      }
    }

    if (isProfileMenuOpen || isPlanTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen, isPlanTooltipOpen])

  const handleLogout = () => {
    router.push('/')
  }

  const handleCheckout = () => {
    alert('Continuando compra...')
    setIsCartOpen(false)
  }

  const handleRemoveFromFavorites = () => {
    // La función ya está en el contexto, se maneja automáticamente
  }

  const handleMoveAllToCart = () => {
    favorites.filter(item => item.inStock).forEach(product => {
      addToCart(product)
    })
    setIsFavoritesOpen(false)
  }

  // Función para obtener la descripción del plan
  const getPlanDescription = (planName: string) => {
    switch (planName) {
      case 'Explorador':
        return {
          description: 'Plan gratuito con acceso limitado',
          features: ['Contenido básico gratuito', 'Comunidad limitada'],
          price: 'Gratis'
        }
      case 'Buscador':
        return {
          description: 'Plan básico para comenzar tu viaje espiritual',
          features: ['Acceso a cursos básicos', 'Meditaciones guiadas', 'Comunidad básica'],
          price: '$7.99 USD/mes'
        }
      case 'Transformador':
        return {
          description: 'Plan intermedio para profundizar tu práctica',
          features: ['Todos los cursos intermedios', 'Terapias exclusivas', 'Comunidad avanzada'],
          price: '$12.99 USD/mes'
        }
      case 'Maestro':
        return {
          description: 'Plan premium con acceso completo',
          features: ['Acceso completo a todo el contenido', 'Sesiones 1:1', 'Comunidad VIP', 'Contenido exclusivo'],
          price: '$24.99 USD/mes'
        }
      default:
        return {
          description: 'Plan personalizado',
          features: [],
          price: ''
        }
    }
  }

  const currentPlanInfo = getPlanDescription(userPlan.name)

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 space-x-4 lg:space-x-6">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Image 
                src="/with_padding.png" 
                alt="Alalma" 
                width={150}
                height={40}
                className="h-8 w-auto cursor-pointer"
                onClick={() => router.push('/dashboard')}
                priority
                quality={75}
              />
            </div>

            {/* Categorías - oculto en móvil */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/categories')}
              className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50 flex-shrink-0 cursor-pointer"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Categorías
            </Button>

            {/* Búsqueda */}
            {showSearch && (
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-900"
                  />
                </div>
              </div>
            )}

            {/* Navegación derecha */}
            <div className="flex items-center space-x-3">
              {/* Plan */}
              <div className="relative" ref={planTooltipRef}>
                <button
                  onClick={() => setIsPlanTooltipOpen(!isPlanTooltipOpen)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-200 cursor-pointer flex-shrink-0"
                  title="Ver detalles del plan"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {userPlan.name}
                </button>
                
                {/* Tooltip del plan */}
                {isPlanTooltipOpen && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-5 z-50">
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg">Plan {userPlan.name}</h3>
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {currentPlanInfo.price}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {currentPlanInfo.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800 text-sm">Incluye:</h4>
                        <ul className="space-y-1">
                          {currentPlanInfo.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <span className="text-green-500 mr-2 mt-0.5">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Carrito */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              
              {/* Favoritos */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFavoritesOpen(true)}
                className="relative cursor-pointer"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
              
              {/* Perfil */}
              <div className="relative" ref={profileMenuRef}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <UserCircle className="w-5 h-5" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Usuario</p>
                          <p className="text-xs text-gray-500">{userPlan.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push('/profile')
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Mi Perfil
                      </button>

                      <button
                        onClick={() => {
                          router.push('/profile/following')
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 mr-3 text-gray-400" />
                        Instructores que Sigo
                      </button>

                      <button
                        onClick={() => {
                          router.push('/plans')
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Cambiar Plan
                      </button>
                      
                      <button
                        onClick={() => {
                          setUserRole('vendor')
                          router.push('/vendor/dashboard')
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 mr-3 text-purple-400" />
                        Modo Vendedor
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Configuración
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Favorites Sidebar */}
      <FavoritesSidebar
        items={favorites}
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onRemoveItem={handleRemoveFromFavorites}
        onAddToCart={addToCart}
        onMoveAllToCart={handleMoveAllToCart}
      />
    </>
  )
}