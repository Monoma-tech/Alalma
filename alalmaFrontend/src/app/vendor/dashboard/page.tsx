/**
 * ALALMA VENDOR DASHBOARD - Panel de control para vendedores/creadores
 * ====================================================================
 * 
 * Dashboard donde los vendedores pueden:
 * - Ver estadísticas de ventas y productos
 * - Gestionar sus cursos, terapias y herramientas
 * - Seguimiento de ingresos y comisiones
 * - Actualizar perfil de vendedor
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/vendor/dashboard - Estadísticas generales del vendedor
 * - GET /api/vendor/products - Lista de productos del vendedor
 * - GET /api/vendor/sales - Historial de ventas
 * - GET /api/vendor/earnings - Ingresos y comisiones
 * - PUT /api/vendor/profile - Actualizar perfil
 */

'use client'

import { useState, useRef } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useUserRole } from '@/contexts/UserRoleContext'
import { 
  Plus, 
  BookOpen, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Users, 
  Package,
  Eye,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  Calendar,
  Download,
  LogOut,
  UserCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react'

// Mock data para productos del vendedor
const mockVendorProducts = [
  {
    id: 1,
    title: 'Curso: Despertando tu Poder Interior',
    type: 'curso',
    status: 'published',
    price: 37.50,
    sales: 45,
    revenue: 1687.50,
    rating: 4.8,
    views: 1200,
    image: '/api/placeholder/200/120'
  },
  {
    id: 2,
    title: 'Terapia: Sesión de Reiki Individual',
    type: 'terapia',
    status: 'published',
    price: 20.00,
    sales: 23,
    revenue: 460.00,
    rating: 4.9,
    views: 580,
    image: '/api/placeholder/200/120'
  },
  {
    id: 3,
    title: 'Meditación: Sanación con Cuencos Tibetanos',
    type: 'herramienta',
    status: 'pending',
    price: 6.25,
    sales: 0,
    revenue: 0,
    rating: 0,
    views: 0,
    image: '/api/placeholder/200/120'
  }
]

function VendorDashboard() {
  const router = useRouter()
  const { vendorProfile, setUserRole } = useUserRole()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sales' | 'profile'>('overview')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Necesitas ser un vendedor para acceder a este panel</p>
          <Button onClick={() => router.push('/dashboard')} className="cursor-pointer">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    setUserRole('customer')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'curso': return <BookOpen className="w-4 h-4" />
      case 'terapia': return <Heart className="w-4 h-4" />
      case 'herramienta': return <Sparkles className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Responsive */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
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
              <span className="ml-4 text-sm text-gray-500 border-l border-gray-300 pl-4">
                Panel de Vendedor
              </span>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <Button 
                size="sm"
                onClick={() => router.push('/vendor/create')}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contenido
              </Button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{vendorProfile.businessName}</p>
                    <p className="text-xs text-gray-500">Vendedor</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setActiveTab('profile')
                        setIsProfileMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400" />
                      Mi Perfil
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/live/create')
                        setIsProfileMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <span className="w-4 h-4 mr-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      </span>
                      Iniciar Sesión Live
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/dashboard')
                        setIsProfileMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                      Vista de Cliente
                    </button>
                    
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

          {/* Mobile Header */}
          <div className="md:hidden py-3">
            <div className="flex items-center justify-between">
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
                <div className="relative" ref={profileMenuRef}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-white" />
                    </div>
                  </Button>
                  
                  {/* Mobile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                      {/* User Info */}
                      <div className="px-4 pb-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{vendorProfile.businessName}</p>
                        <p className="text-xs text-gray-500">Panel de Vendedor</p>
                      </div>

                      {/* Quick Action */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <Button 
                          size="sm"
                          onClick={() => {
                            router.push('/vendor/create')
                            setIsProfileMenuOpen(false)
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nuevo Contenido
                        </Button>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveTab('profile')
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-400" />
                          Mi Perfil
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/live/create')
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <span className="w-4 h-4 mr-3 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          </span>
                          Iniciar Sesión Live
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/dashboard')
                            setIsProfileMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Users className="w-4 h-4 mr-3 text-gray-400" />
                          Vista de Cliente
                        </button>
                        
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
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile subtitle */}
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">Panel de Vendedor</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs - Responsive con scroll horizontal */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Resumen</span>
                <span className="sm:hidden">📊</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'products' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Package className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Mis Productos ({mockVendorProducts.length})</span>
                <span className="sm:hidden">📦</span>
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'sales' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <DollarSign className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ventas e Ingresos</span>
                <span className="sm:hidden">💰</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserCircle className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Mi Perfil</span>
                <span className="sm:hidden">👤</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards - Scroll horizontal en móvil */}
            <div className="md:hidden">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 w-max">
                  <Card className="w-64 flex-shrink-0">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${vendorProfile.earnings.totalEarnings.toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/vendor/earnings')}
                            className="text-xs text-purple-600 hover:text-purple-700 p-0 h-auto mt-1 cursor-pointer"
                          >
                            Ver detalles →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-64 flex-shrink-0">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Productos</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {vendorProfile.stats.totalProducts}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-64 flex-shrink-0">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Ventas</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${vendorProfile.stats.totalSales.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-64 flex-shrink-0">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Calificación</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {vendorProfile.stats.rating}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Desktop Stats Cards */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${vendorProfile.earnings.totalEarnings.toFixed(2)} USD
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/vendor/earnings')}
                        className="text-xs text-purple-600 hover:text-purple-700 p-0 h-auto mt-1 cursor-pointer"
                      >
                        Ver detalles →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Productos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vendorProfile.stats.totalProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ventas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${vendorProfile.stats.totalSales.toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Calificación</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vendorProfile.stats.rating}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Nueva venta</p>
                        <p className="text-sm text-gray-500">Curso: Despertando tu Poder Interior</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Hace 2 horas</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Nueva reseña</p>
                        <p className="text-sm text-gray-500">5 estrellas en Terapia de Reiki</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Hace 1 día</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
                <p className="text-sm text-gray-500 md:hidden mt-1">
                  👈 Desliza para ver más productos
                </p>
              </div>
              <Button 
                onClick={() => router.push('/vendor/create')}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Crear Nuevo</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
            </div>

            {/* Products Grid - Responsive con scroll horizontal en móvil */}
            <div className="md:hidden">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 w-max">
                  {mockVendorProducts.map((product) => (
                    <Card key={product.id} className="w-72 flex-shrink-0 hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image 
                            src={product.image}
                            alt={product.title}
                            width={200}
                            height={120}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status === 'published' ? 'Publicado' : 
                             product.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            {getTypeIcon(product.type)}
                            <span className="ml-2 text-sm text-gray-600 capitalize">{product.type}</span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.title}
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <p>Precio: ${product.price.toFixed(2)}</p>
                              <p>Ventas: {product.sales}</p>
                            </div>
                            <div>
                              <p>Ingresos: ${product.revenue.toLocaleString()}</p>
                              <p>Vistas: {product.views}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">
                                {product.rating > 0 ? product.rating : 'N/A'}
                              </span>
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="cursor-pointer p-1">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="cursor-pointer p-1">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 cursor-pointer p-1">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Products Grid */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockVendorProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image 
                        src={product.image}
                        alt={product.title}
                        width={200}
                        height={120}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status === 'published' ? 'Publicado' : 
                         product.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        {getTypeIcon(product.type)}
                        <span className="ml-2 text-sm text-gray-600 capitalize">{product.type}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <p>Precio: ${product.price.toFixed(2)} USD</p>
                          <p>Ventas: {product.sales}</p>
                        </div>
                        <div>
                          <p>Ingresos: ${product.revenue.toLocaleString()}</p>
                          <p>Vistas: {product.views}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">
                            {product.rating > 0 ? product.rating : 'Sin calificar'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ventas e Ingresos</h2>
            
            {/* Earnings Summary - Scroll horizontal en móvil */}
            <div className="md:hidden">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 w-max">
                  <Card className="w-72 flex-shrink-0">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900">Total Ganado</h3>
                      <p className="text-3xl font-bold text-green-600">
                        ${vendorProfile.earnings.totalEarnings.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-72 flex-shrink-0">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900">Pendiente de Pago</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        ${vendorProfile.earnings.pendingPayments.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-72 flex-shrink-0">
                    <CardContent className="p-6 text-center">
                      <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900">Último Pago</h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {vendorProfile.earnings.lastPayment?.toLocaleDateString('es-ES') || 'N/A'}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 cursor-pointer">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Desktop Earnings Summary */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Total Ganado</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${vendorProfile.earnings.totalEarnings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Pendiente de Pago</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ${vendorProfile.earnings.pendingPayments.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Último Pago</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {vendorProfile.earnings.lastPayment?.toLocaleDateString('es-ES') || 'N/A'}
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 cursor-pointer">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Recibo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mi Perfil de Vendedor</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {vendorProfile.businessName}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {vendorProfile.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Especialidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendorProfile.specialties.map((specialty, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Experiencia</h4>
                        <p className="text-gray-600">{vendorProfile.experience}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Envolver el componente con protección de ruta
export default function ProtectedVendorDashboard() {
  return (
    <ProtectedRoute>
      <VendorDashboard />
    </ProtectedRoute>
  )
}