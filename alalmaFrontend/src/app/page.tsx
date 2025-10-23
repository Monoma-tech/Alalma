/**
 * ALALMA LANDING PAGE - Página principal de la plataforma
 * =====================================================
 * 
 * Esta es la landing page de Alalma, plataforma de crecimiento espiritual.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Navbar con búsqueda y navegación
 * 2. Hero section con texto animado (typewriter effect)
 * 3. Grid de categorías destacadas
 * 4. Showcase de planes de suscripción
 * 5. Testimonios y footer
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/plans - Planes de suscripción
 * - GET /api/categories - Categorías de productos
 * - GET /api/stats - Estadísticas generales (estudiantes, cursos)
 */

'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Search, 
  ChevronDown,
  Heart, 
  ShoppingCart,
  Sparkles,
  Crown,
  Zap,
  Check
} from 'lucide-react'
import { availablePlans, formatPrice } from '@/data/plans'

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExplorarOpen, setIsExplorarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Palabras para el efecto typewriter (pueden venir del backend en el futuro)
  const words = useMemo(() => ['Alalma', 'Alma', 'Armonía', 'Ascensión'], [])
  
  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (isDeleting) {
        // Borrando letra por letra - MÁS RÁPIDO
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        // Escribiendo letra por letra - MÁS RÁPIDO
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        
        if (currentText === currentWord) {
          // Pausa más corta antes de empezar a borrar
          setTimeout(() => setIsDeleting(true), 1200)
        }
      }
    }, isDeleting ? 60 : 80) // VELOCIDADES MÁS RÁPIDAS
    
    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  const getPlanIcon = (level: string) => {
    switch (level) {
      case 'free': return <Search className="w-8 h-8 text-gray-500" />
      case 'basic': return <Heart className="w-8 h-8 text-blue-500" />
      case 'intermediate': return <Zap className="w-8 h-8 text-purple-500" />
      case 'premium': return <Crown className="w-8 h-8 text-yellow-500" />
      default: return <Sparkles className="w-8 h-8 text-gray-500" />
    }
  }

  const getPlanGradient = (level: string) => {
    switch (level) {
      case 'free': return 'from-gray-50 to-gray-100'
      case 'basic': return 'from-blue-50 to-blue-100'
      case 'intermediate': return 'from-purple-50 to-purple-100'
      case 'premium': return 'from-yellow-50 to-yellow-100'
      default: return 'from-gray-50 to-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ==========================================
          NAVBAR PRINCIPAL DE LANDING PAGE
          ========================================== 
          
          Funcionalidades:
          - Dropdown de exploración por categorías
          - Búsqueda que redirige a /welcome?search=query
          - Enlaces a autenticación y planes
          
          APIs necesarias:
          - GET /api/categories (para dropdown)
      */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y navegación izquierda */}
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Alalma</span>
            </div>

            {/* Explorar Dropdown */}
            <div className="relative ml-8">
              <button
                onMouseEnter={() => setIsExplorarOpen(true)}
                onMouseLeave={() => setIsExplorarOpen(false)}
                className="flex items-center text-gray-700 hover:text-purple-600 font-medium px-4 py-2"
              >
                Explorar
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {/* Dropdown de Explorar */}
              {isExplorarOpen && (
                <div 
                  className="absolute top-full left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setIsExplorarOpen(true)}
                  onMouseLeave={() => setIsExplorarOpen(false)}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      <h3 className="font-semibold text-gray-900 mb-2">Explorar por objetivo</h3>
                      <Link href="/welcome?category=curso" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Comenzar tu crecimiento espiritual
                      </Link>
                      <Link href="/plans" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Prepárate para una transformación
                      </Link>
                      <Link href="/welcome?category=terapia" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Practica con sanación energética
                      </Link>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Categorías Populares</h4>
                        <Link href="/welcome?category=curso" className="block text-gray-600 hover:text-purple-600 py-1">Meditación</Link>
                        <Link href="/welcome?category=terapia" className="block text-gray-600 hover:text-purple-600 py-1">Reiki</Link>
                        <Link href="/welcome?category=herramienta" className="block text-gray-600 hover:text-purple-600 py-1">Cristales</Link>
                        <Link href="/welcome?category=curso" className="block text-gray-600 hover:text-purple-600 py-1">Astrología</Link>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Desarrollo Espiritual</h4>
                        <Link href="/welcome" className="block text-gray-600 hover:text-purple-600 py-1">Transformación personal</Link>
                        <Link href="/welcome" className="block text-gray-600 hover:text-purple-600 py-1">Sanación emocional</Link>
                        <Link href="/welcome" className="block text-gray-600 hover:text-purple-600 py-1">Armonía interior</Link>
                        <Link href="/welcome" className="block text-gray-600 hover:text-purple-600 py-1">Ascensión espiritual</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cursos, terapias, herramientas de crecimiento espiritual..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/welcome?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navegación derecha */}
            <div className="flex items-center space-x-4">
              {/* Enlace a Planes */}
              <Link href="/plans" className="text-gray-700 hover:text-purple-600 font-medium hidden md:block">
                Planes y precios
              </Link>

              {/* Alalma for Business */}
              <Link href="/plans" className="text-gray-700 hover:text-purple-600 font-medium hidden lg:block">
                Alalma for Business
              </Link>

              {/* Botones de autenticación */}
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/plans">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Alalma</span>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cursos, terapias, herramientas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navegación */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/welcome" className="text-gray-700 hover:text-purple-600 font-medium">
                  Categorías
                </Link>
                <Link href="/plans" className="text-gray-700 hover:text-purple-600 font-medium">
                  Planes
                </Link>
              </nav>

              {/* Iconos de acción */}
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>

              {/* Botones de autenticación */}
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/plans">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Subido más arriba */}
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a{' '}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-200 ease-in-out"
            >
              {currentText}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Tu camino hacia la sabiduría interior y el crecimiento personal
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Cursos, terapias y herramientas para transformar tu vida
          </p>
          <Link href="/plans">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-4 text-lg">
              Iniciar mi Transformación
            </Button>
          </Link>
        </div>
      </section>

      {/* Sección de Planes estilo Udemy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elige tu Camino de Transformación
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planes diseñados para acompañarte en cada etapa de tu viaje espiritual
            </p>
          </div>

          {/* Grid de Planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePlans.map((plan) => (
              <Card 
                key={plan.level} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-purple-200 scale-105' 
                    : 'border-gray-200 hover:scale-105'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute top-0 left-0 right-0 text-center py-2 text-sm font-medium text-white ${
                    plan.popular ? 'bg-purple-600' : 'bg-gray-600'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.badge ? 'pt-12' : 'pt-8'} bg-gradient-to-br ${getPlanGradient(plan.level)}`}>
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.level)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {formatPrice(plan.price)}
                    </div>
                    {plan.price > 0 && (
                      <div className="text-sm text-gray-600">por mes</div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/plans">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {plan.level === 'free' ? 'Comenzar Gratis' : 'Comenzar Transformación'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-xl font-bold">Alalma</span>
          </div>
          <p className="text-gray-400">
            Tu plataforma de crecimiento espiritual y sabiduría interior
          </p>
        </div>
      </footer>
    </div>
  )
}