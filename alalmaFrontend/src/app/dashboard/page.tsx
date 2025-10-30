/**
 * ALALMA DASHBOARD - Portal principal de usuarios autenticados
 * ===========================================================
 * 
 * Este es el dashboard principal donde los usuarios exploran y compran contenido.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Navbar con búsqueda integrada (estilo Udemy)
 * 2. Sistema de filtros y categorías
 * 3. Grid de productos con control de acceso por plan
 * 4. Carrito de compras y lista de favoritos
 * 5. Gestión de perfil de usuario
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/products - Lista de productos con filtros
 * - GET /api/user/cart - Carrito del usuario
 * - POST /api/user/cart - Agregar al carrito
 * - GET /api/user/favorites - Lista de favoritos
 * - POST /api/user/favorites - Agregar a favoritos
 * - GET /api/user/profile - Información del usuario
 * - PUT /api/user/profile - Actualizar perfil
 */

'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { WisdomProductCardWithPlan } from '@/components/ecommerce/WisdomProductCardWithPlan'
import { SearchAndFilters } from '@/components/ecommerce/SearchAndFilters'
import { ShoppingCartSidebar } from '@/components/ecommerce/ShoppingCart'
import { FavoritesSidebar } from '@/components/ecommerce/FavoritesSidebar'
import { InstructorCarousel } from '@/components/ecommerce/InstructorCarousel'
import { mockProducts, type Product } from '@/data/products'
import { useUserPlan } from '@/contexts/UserPlanContext'
import { useUserRole } from '@/contexts/UserRoleContext'
import { 
  LogOut, 
  ShoppingCart, 
  Heart, 
  User, 
  Grid3X3,
  List,
  Sparkles,
  Settings,
  ChevronDown,
  UserCircle,
  Search,
  Menu,
  X,
  Radio
} from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userPlan } = useUserPlan()
  const { setUserRole } = useUserRole()
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isPlanTooltipOpen, setIsPlanTooltipOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [activeLivesCount] = useState(3) // Mock data - conectar con API después
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const planTooltipRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 125],
    minRating: 0,
    inStock: false
  })

  // Manejar parámetros de URL para pre-filtrar por categoría y búsqueda
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam) {
      // Mapear parámetro de URL a nombre de categoría
      const categoryMap: { [key: string]: string } = {
        'curso': 'Cursos',
        'terapia': 'Terapias', 
        'herramienta': 'Herramientas'
      }
      
      const mappedCategory = categoryMap[categoryParam.toLowerCase()]
      if (mappedCategory) {
        setFilters(prev => ({
          ...prev,
          categories: [mappedCategory]
        }))
      }
    }
    
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [searchParams])

  // Cerrar dropdown del perfil y tooltip del plan cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
      if (planTooltipRef.current && !planTooltipRef.current.contains(event.target as Node)) {
        setIsPlanTooltipOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen || isPlanTooltipOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen, isPlanTooltipOpen, isMobileMenuOpen])

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const categories = ['Cursos', 'Terapias', 'Herramientas']

  // Filtrar productos
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    const matchesRating = product.rating >= filters.minRating
    const matchesStock = !filters.inStock || product.inStock

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock
  })

  const handleAddToCart = (product: typeof mockProducts[0]) => {
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
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id)
      return
    }
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    )
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id)
      if (existingIndex >= 0) {
        return prev.filter(item => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const handleMoveAllToCart = () => {
    wishlist.filter(item => item.inStock).forEach(product => {
      handleAddToCart(product)
    })
    setWishlist(prev => prev.filter(item => !item.inStock))
    setIsFavoritesOpen(false)
  }

  const handleLogout = () => {
    router.push('/')
  }

  const handleCheckout = () => {
    alert('Continuando compra...')
    setIsCartOpen(false)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Función para cerrar el menú móvil suavemente
  const closeMobileMenu = () => {
    setIsMenuClosing(true)
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMenuClosing(false)
      setIsProfileMenuOpen(false)
      setIsPlanTooltipOpen(false)
    }, 200)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center py-4 space-x-6">
            {/* Logo y título compacto */}
            <div className="flex items-center flex-shrink-0">
              <Image 
                src="/with_padding.png" 
                alt="Alalma" 
                width={150}
                height={40}
                className="h-8 w-auto cursor-pointer"
                onClick={() => router.push('/')}
                priority
                quality={95}
              />
            </div>

            {/* Botón Categorías */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/categories')}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-shrink-0 cursor-pointer"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Categorías
            </Button>

            {/* Barra de búsqueda central */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cursos, terapias, herramientas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      // La búsqueda ya se aplica automáticamente por el estado
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-900 placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Navegación derecha */}
            <div className="flex items-center space-x-3">
              {/* Botón Live */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/live')}
                className="relative cursor-pointer hover-glow group"
              >
                <div className="flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-200">
                    Live
                  </span>
                  {activeLivesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in font-semibold">
                      {activeLivesCount > 9 ? '9+' : activeLivesCount}
                    </span>
                  )}
                </div>
              </Button>

              {/* Indicador del plan actual con tooltip */}
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
                    {/* Flecha del tooltip */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                    
                    {/* Contenido del tooltip */}
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
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer"
                data-cart-button
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFavoritesOpen(true)}
                className="relative cursor-pointer"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
              
              {/* Profile Dropdown */}
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
                
                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
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
                    
                    {/* Menu Items */}
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
                          // Aquí iría configuración cuando la implementemos
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Configuración
                      </button>
                    </div>
                    
                    {/* Separator */}
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

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-3">
              {/* Logo Centrado */}
              <div className="flex-1 flex justify-center">
                <Image 
                  src="/with_padding.png" 
                  alt="Alalma" 
                  width={130}
                  height={35}
                  className="h-8 w-auto cursor-pointer"
                  onClick={() => router.push('/')}
                  priority
                  quality={95}
                />
              </div>

              {/* Mobile Menu Button */}
              <div className="absolute right-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      closeMobileMenu()
                    } else {
                      setIsMobileMenuOpen(true)
                      setIsProfileMenuOpen(false)
                      setIsPlanTooltipOpen(false)
                    }
                  }}
                  className={`p-3 cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 ${
                    isMobileMenuOpen 
                      ? 'bg-purple-100 text-purple-700 shadow-md' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu className="w-6 h-6 transition-transform duration-300" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden animate-fade-in" 
                  onClick={closeMobileMenu}
                />
                {/* Menu - Full Screen */}
                <div className={`fixed inset-0 bg-white z-50 overflow-y-auto ${
                  isMenuClosing ? 'animate-slide-up' : 'animate-slide-down'
                }`} ref={mobileMenuRef}>
                  {/* Menu Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
                    <Image 
                      src="/with_padding.png" 
                      alt="Alalma" 
                      width={120}
                      height={32}
                      className="h-8 w-auto cursor-pointer"
                      onClick={() => {
                        router.push('/')
                        closeMobileMenu()
                      }}
                      priority
                      quality={95}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={closeMobileMenu}
                      className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
                      aria-label="Cerrar menú"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </Button>
                  </div>
                <div className="flex-1 px-6 py-6 space-y-6 min-h-full bg-gradient-to-b from-white to-gray-50">
                  {/* User Info */}
                  <div className="flex items-center pb-6 border-b border-gray-200 animate-fade-in-up" style={{animationDelay: '0.05s'}}>
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-semibold text-gray-900">Usuario</p>
                      <div className="flex items-center mt-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-sm text-purple-700 font-medium">Plan {userPlan.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        router.push('/live')
                        closeMobileMenu()
                      }}
                      className="flex flex-col items-center p-4 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <div className="relative">
                        <Radio className="w-7 h-7 text-red-700 animate-pulse" />
                        {activeLivesCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                            {activeLivesCount > 9 ? '9+' : activeLivesCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-red-800 mt-2 font-semibold">Live</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsCartOpen(true)
                        closeMobileMenu()
                      }}
                      className="flex flex-col items-center p-4 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <div className="relative">
                        <ShoppingCart className="w-7 h-7 text-purple-700" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                            {cartItemCount > 9 ? '9+' : cartItemCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-purple-800 mt-2 font-semibold">Carrito</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsFavoritesOpen(true)
                        closeMobileMenu()
                      }}
                      className="flex flex-col items-center p-4 cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <div className="relative">
                        <Heart className="w-7 h-7 text-pink-700" />
                        {wishlist.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                            {wishlist.length > 9 ? '9+' : wishlist.length}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-pink-800 mt-2 font-semibold">Favoritos</span>
                    </Button>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push('/categories')
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{animationDelay: '0.2s'}}
                    >
                      <Grid3X3 className="w-6 h-6 mr-5 text-gray-500" />
                      Categorías
                    </button>

                    <button
                      onClick={() => {
                        router.push('/profile')
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{animationDelay: '0.25s'}}
                    >
                      <User className="w-6 h-6 mr-5 text-gray-500" />
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        router.push('/profile/following')
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{animationDelay: '0.3s'}}
                    >
                      <Heart className="w-6 h-6 mr-5 text-gray-500" />
                      Instructores que Sigo
                    </button>

                    <button
                      onClick={() => {
                        router.push('/plans')
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{animationDelay: '0.35s'}}
                    >
                      <Settings className="w-6 h-6 mr-5 text-gray-500" />
                      Cambiar Plan
                    </button>
                    
                    <button
                      onClick={() => {
                        setUserRole('vendor')
                        router.push('/vendor/dashboard')
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-purple-700 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up shadow-sm"
                      style={{animationDelay: '0.4s'}}
                    >
                      <Sparkles className="w-6 h-6 mr-5 text-purple-600" />
                      Modo Vendedor
                    </button>
                    
                    <button
                      onClick={() => {
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 animate-fade-in-up"
                      style={{animationDelay: '0.45s'}}
                    >
                      <Settings className="w-6 h-6 mr-5 text-gray-500" />
                      Configuración
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-6 border-t border-gray-200 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className="flex items-center w-full px-6 py-5 text-lg text-red-600 hover:bg-red-50 hover:shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:translate-x-1 font-semibold"
                    >
                      <LogOut className="w-6 h-6 mr-5" />
                      Cerrar Sesión
                    </button>
                  </div>
                  
                  {/* Bottom Spacing for Safe Area */}
                  <div className="h-8"></div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Espiritual */}
        {filters.categories.length > 0 && (
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <button 
              onClick={() => router.push('/categories')}
              className="flex items-center hover:text-purple-600 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Mi Camino
            </button>
            <span className="mx-2">{'>'}</span>
            <span className="flex items-center text-purple-600 font-medium">
              {filters.categories[0] === 'Cursos' && '🧘 Cursos de Sabiduría'}
              {filters.categories[0] === 'Terapias' && '💖 Terapias Holísticas'}
              {filters.categories[0] === 'Herramientas' && '✨ Herramientas Místicas'}
            </span>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          hideCategories={filters.categories.length > 0}
        />

        {/* Instructors Carousel */}
        <InstructorCarousel />

        {/* View Mode & Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-800 font-medium">
            {searchTerm ? (
              filteredProducts.length > 0 
                ? `Se encontraron ${filteredProducts.length} resultado${filteredProducts.length !== 1 ? 's' : ''} para "${searchTerm}"`
                : `No se encontraron resultados para "${searchTerm}"`
            ) : (
              filteredProducts.length > 0 
                ? `Mostrando ${filteredProducts.length} experiencia${filteredProducts.length !== 1 ? 's' : ''} de sabiduría`
                : 'No hay experiencias disponibles con los filtros aplicados'
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="cursor-pointer"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="cursor-pointer"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredProducts.map(product => (
            <WisdomProductCardWithPlan
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              isInWishlist={wishlist.some(item => item.id === product.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg mb-2">
              {searchTerm 
                ? `No se encontraron resultados para "${searchTerm}"`
                : 'No se encontraron experiencias de sabiduría con los filtros aplicados'
              }
            </p>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otra búsqueda o explora nuestras categorías'
                : 'Intenta ajustar los filtros para encontrar lo que buscas'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilters({
                  categories: [],
                  priceRange: [0, 125],
                  minRating: 0,
                  inStock: false
                })
              }}
              className="mt-4 cursor-pointer"
            >
              {searchTerm ? 'Limpiar búsqueda' : 'Limpiar filtros'}
            </Button>
          </div>
        )}
      </main>

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Favorites Sidebar */}
      <FavoritesSidebar
        items={wishlist}
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onRemoveItem={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onMoveAllToCart={handleMoveAllToCart}
      />
    </div>
  )
}

export default function EcommercePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}