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

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { WisdomProductCardWithPlan } from '@/components/ecommerce/WisdomProductCardWithPlan'
import { SearchAndFilters } from '@/components/ecommerce/SearchAndFilters'
import { ShoppingCartSidebar } from '@/components/ecommerce/ShoppingCart'
import { FavoritesSidebar } from '@/components/ecommerce/FavoritesSidebar'
import { mockProducts, type Product } from '@/data/products'
import { useUserPlan } from '@/contexts/UserPlanContext'
import { 
  LogOut, 
  ShoppingCart, 
  Heart, 
  User, 
  Grid3X3,
  List,
  Sparkles,
  Settings,
  CreditCard,
  ChevronDown,
  UserCircle,
  Search
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

export default function EcommercePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userPlan, canAccess } = useUserPlan()
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 500000],
    minRating: 0,
    inStock: false
  })

  // Manejar parámetros de URL para pre-filtrar por categoría
  useEffect(() => {
    const categoryParam = searchParams.get('category')
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
  }, [searchParams])

  // Cerrar dropdown del perfil cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

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
    router.push('/login')
  }

  const handleCheckout = () => {
    alert('Continuando compra...')
    setIsCartOpen(false)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 space-x-6">
            {/* Logo y título compacto */}
            <div className="flex items-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Alalma</h1>
            </div>

            {/* Botón Categorías */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/welcome')}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-shrink-0"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Navegación derecha */}
            <div className="flex items-center space-x-3">
              {/* Indicador del plan actual */}
              <button
                onClick={() => router.push('/plans')}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-200 cursor-pointer flex-shrink-0"
                title="Cambiar plan"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                {userPlan.name}
              </button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
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
                className="relative"
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
                  className="flex items-center space-x-2"
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
                          router.push('/plans')
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                        Cambiar Plan
                      </button>
                      
                      <button
                        onClick={() => {
                          // Aquí iría configuración cuando la implementemos
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Espiritual */}
        {filters.categories.length > 0 && (
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <button 
              onClick={() => router.push('/welcome')}
              className="flex items-center hover:text-purple-600 transition-colors"
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          hideCategories={filters.categories.length > 0}
        />

        {/* View Mode & Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProducts.length} experiencias de sabiduría
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
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
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron experiencias de sabiduría</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilters({
                  categories: [],
                  priceRange: [0, 500000],
                  minRating: 0,
                  inStock: false
                })
              }}
              className="mt-4"
            >
              Limpiar filtros
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