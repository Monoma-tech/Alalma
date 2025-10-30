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
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Search, 
  ChevronDown,
  Heart, 
  Sparkles,
  Check,
  Crown,
  Zap,
  BookOpen,
  DollarSign,
  Users
} from 'lucide-react'
import { availablePlans } from '@/data/plans'

export default function Home() {
  const router = useRouter()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExplorarOpen, setIsExplorarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // ==========================================
  // ESTADO DE TABS FUNCIONALES
  // ==========================================
  const [activeTab, setActiveTab] = useState<keyof typeof coursesByCategory>('Meditación');
  
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

  // ========================================
  // FUNCIONES DE UTILIDAD PARA PLANES
  // ========================================
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

  // ========================================
  // CURSOS POR CATEGORÍA - DATOS DEL DASHBOARD
  // ========================================
  /**
   * Cursos organizados por categoría basados en los productos del dashboard
   * NOTA PARA BACKEND: Estos datos deben venir de /api/products filtrados por categoría
   */
  const coursesByCategory = {
    'Meditación': [
      {
        id: 1,
        name: 'Mindfulness y Meditación Profunda',
        instructor: 'Dra. Ana Martínez',
        rating: 4.9,
        reviews: 1247,
        price: 9.99,
        originalPrice: 129000,
        icon: '🧘‍♀️',
        gradient: 'from-purple-100 to-purple-200'
      }
    ],
    'Sanación Energética': [
      {
        id: 5,
        name: 'Terapia de Reiki y Sanación Energética',
        instructor: 'Maestra Rosa Silva',
        rating: 4.9,
        reviews: 756,
        price: 180000,
        originalPrice: 220000,
        icon: '💖',
        gradient: 'from-pink-100 to-pink-200'
      }
    ],
    'Astrología': [
      {
        id: 4,
        name: 'Curso de Astrología y Autoconocimiento',
        instructor: 'Astróloga Luna Vera',
        rating: 4.6,
        reviews: 367,
        price: 120000,
        duration: '10 semanas',
        icon: '🔮',
        gradient: 'from-indigo-100 to-indigo-200'
      }
    ],
    'Cristales': [
      {
        id: 3,
        name: 'Kit de Cristales para Equilibrio Energético',
        instructor: 'Guía incluida',
        rating: 4.7,
        reviews: 892,
        price: 75000,
        originalPrice: 95000,
        icon: '💎',
        gradient: 'from-green-100 to-green-200'
      }
    ],
    'Desarrollo Personal': [
      {
        id: 2,
        name: 'Terapia de Sanación Emocional',
        instructor: 'Psic. Carlos Ruiz',
        rating: 4.8,
        reviews: 523,
        price: 150000,
        duration: '12 sesiones',
        icon: '🌱',
        gradient: 'from-yellow-100 to-yellow-200'
      }
    ],
    'Terapias Holísticas': [
      {
        id: 6,
        name: 'Oracle Cards - Mensajes del Alma',
        instructor: 'Manual incluido',
        rating: 4.5,
        reviews: 1134,
        price: 45000,
        icon: '🔮',
        gradient: 'from-violet-100 to-violet-200'
      }
    ]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ==========================================
          NAVBAR PRINCIPAL DE LANDING PAGE
          ========================================== 
          
          Funcionalidades:
          - Dropdown de exploración por categorías
          - Búsqueda que redirige a /categories?search=query
          - Enlaces a autenticación y planes
          
          APIs necesarias:
          - GET /api/categories (para dropdown)
      */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y navegación izquierda */}
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
            </div>

            {/* Explorar Dropdown */}
            <div className="relative ml-8">
              <button
                onMouseEnter={() => setIsExplorarOpen(true)}
                onMouseLeave={() => setIsExplorarOpen(false)}
                className="flex items-center text-gray-700 hover:text-purple-600 font-medium px-4 py-2 cursor-pointer"
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
                      <Link href="/categories?category=curso" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Comenzar tu crecimiento espiritual
                      </Link>
                      <Link href="/plans" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Prepárate para una transformación
                      </Link>
                      <Link href="/categories?category=terapia" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded">
                        Practica con sanación energética
                      </Link>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Categorías Populares</h4>
                        <Link href="/categories?category=curso" className="block text-gray-600 hover:text-purple-600 py-1">Meditación</Link>
                        <Link href="/categories?category=terapia" className="block text-gray-600 hover:text-purple-600 py-1">Reiki</Link>
                        <Link href="/categories?category=herramienta" className="block text-gray-600 hover:text-purple-600 py-1">Cristales</Link>
                        <Link href="/categories?category=curso" className="block text-gray-600 hover:text-purple-600 py-1">Astrología</Link>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Desarrollo Espiritual</h4>
                        <Link href="/categories" className="block text-gray-600 hover:text-purple-600 py-1">Transformación personal</Link>
                        <Link href="/categories" className="block text-gray-600 hover:text-purple-600 py-1">Sanación emocional</Link>
                        <Link href="/categories" className="block text-gray-600 hover:text-purple-600 py-1">Armonía interior</Link>
                        <Link href="/categories" className="block text-gray-600 hover:text-purple-600 py-1">Ascensión espiritual</Link>
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
                      window.location.href = `/categories?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 bg-white"
                />
              </div>
            </div>

            {/* Navegación derecha */}
            <div className="flex items-center space-x-4">
              {/* Enlace a Planes */}
              <Link href="/plans" className="text-gray-700 hover:text-purple-600 font-medium hidden md:block">
                Planes y precios
              </Link>

              {/* Conviértete en Instructor */}
              <Link href="#creator-section" className="text-gray-700 hover:text-purple-600 font-medium hidden lg:block">
                Conviértete en Instructor
              </Link>

              {/* Botones de autenticación */}
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
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
        </div>
      </section>

      {/* Sección de Categorías Destacadas estilo Udemy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Desarrolla Habilidades Esenciales para tu Alma
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Alalma te ayuda a desarrollar rápidamente habilidades demandadas para impulsar tu 
              crecimiento espiritual en el cambiante mundo laboral.
            </p>
          </div>

          {/* Grid de categorías destacadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meditación y Mindfulness */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 h-48 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <CardContent className="p-6 relative z-10 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm mb-2">🧘 2.3M+ estudiantes</div>
                    <h3 className="text-xl font-bold mb-2">Meditación y Mindfulness</h3>
                    <p className="text-sm opacity-90">
                      Técnicas ancestrales para la paz interior y consciencia plena
                    </p>
                  </div>
                  <Link href="/categories?category=curso" className="inline-flex items-center text-white hover:text-purple-200">
                    Ver cursos <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </div>
            </Card>

            {/* Sanación Energética */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 h-48 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <CardContent className="p-6 relative z-10 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm mb-2">💫 890K+ estudiantes</div>
                    <h3 className="text-xl font-bold mb-2">Sanación Energética</h3>
                    <p className="text-sm opacity-90">
                      Aprende técnicas de Reiki, cristales y terapias holísticas
                    </p>
                  </div>
                  <Link href="/categories?category=terapia" className="inline-flex items-center text-white hover:text-purple-200">
                    Ver terapias <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </div>
            </Card>

            {/* Desarrollo Personal */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-48 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <CardContent className="p-6 relative z-10 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm mb-2">✨ 1.2M+ estudiantes</div>
                    <h3 className="text-xl font-bold mb-2">Desarrollo Personal</h3>
                    <p className="text-sm opacity-90">
                      Herramientas místicas para potenciar tu crecimiento espiritual
                    </p>
                  </div>
                  <Link href="/categories?category=herramienta" className="inline-flex items-center text-white hover:text-purple-200">
                    Ver herramientas <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección de Cursos Populares estilo Udemy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Una amplia selección de cursos espirituales
            </h2>
            <p className="text-lg text-gray-600">
              Elige entre más de 20 cursos, terapias y herramientas espirituales con nuevas adiciones cada mes
            </p>
          </div>

          {/* ==========================================
              TABS DE CATEGORÍAS FUNCIONALES  
              ========================================== 
              
              Funcionalidades:
              - Tabs clickeables para filtrar cursos por categoría
              - Datos sincronizados con dashboard/products
              - Estado local para tab activo
              
              APIs necesarias:
              - GET /api/products?category=X (para filtrar por categoría)
          */}
          <div className="flex flex-wrap gap-4 mb-8 border-b">
            {Object.keys(coursesByCategory).map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category as keyof typeof coursesByCategory)}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
                  activeTab === category
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ==========================================
              GRID DE CURSOS DINÁMICO  
              ========================================== 
              
              Funcionalidades:
              - Muestra cursos filtrados por categoría activa
              - Datos reales del dashboard sincronizados
              - Botones con hover y pointer cursor
              - Precios formateados en pesos colombianos
              
              APIs necesarias:
              - GET /api/products?category=X (categoría activa)
              - POST /api/cart/add (agregar al carrito)
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
            {coursesByCategory[activeTab].map((course) => (
              <Card key={course.id} className="overflow-hidden card-enhanced hover-lift-strong">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 h-32 flex items-center justify-center relative group">
                  <span className="text-4xl animate-float hover-scale transition-transform duration-300">{course.icon}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-purple-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-700 transition-colors duration-200">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 hover:text-purple-600 transition-colors duration-200">{course.instructor}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                    <span className="text-sm text-gray-600 ml-1">{course.rating} ({course.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{formatPrice(course.price)}</span>
                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 cursor-pointer btn-animated hover-lift transform hover:scale-105">
                      Ver curso
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mostrar todos los cursos link */}
          <div className="text-center mt-8 animate-fade-in-up">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer btn-animated hover-lift hover-glow transition-all duration-300 group">
                Mostrar todos los cursos de Desarrollo Espiritual 
                <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección CTA grande estilo Udemy */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Reimagina tu crecimiento espiritual en la era de la consciencia
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Desarrolla habilidades y prácticas de vanguardia con el plan Personal. 
                Accede a una gran variedad de contenido nuevo de expertos con experiencia real.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>Aprende sobre consciencia y otros temas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>Prepárate para una certificación</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>Practica con orientación basada en consciencia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span>Impulsa tu carrera espiritual</span>
                </div>
              </div>
              <Link href="/plans">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer">
                  Más información
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-2">A partir de USD $10 al mes</p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-8xl">🌟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mira lo que están logrando otros gracias al aprendizaje
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                &apos;Alalma cambió mi vida completamente. Los cursos de meditación me ayudaron a encontrar
                paz interior que buscaba hace años. Altamente recomendado.&apos;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-semibold">SP</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sofia Pérez</div>
                  <div className="text-sm text-gray-600">Estudiante de Meditación</div>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      &quot;La calidad de los instructores es excepcional. Aprendí más sobre astrología
                      en 3 meses que en años de estudio autodidacta.&quot;
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-700 font-semibold">MR</span>
                      </div>
                <div>
                  <div className="font-semibold text-gray-900">Miguel Rodríguez</div>
                  <div className="text-sm text-gray-600">Estudiante de Astrología</div>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                &quot;Como terapeuta, necesitaba expandir mis conocimientos. Los cursos de sanación
                energética me dieron herramientas increíbles para ayudar a mis pacientes.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-pink-700 font-semibold">LM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Laura Morales</div>
                  <div className="text-sm text-gray-600">Terapeuta Holística</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECCIÓN DE PLANES ESTILO UDEMY  
          ========================================== 
          
          Funcionalidades:
          - Grid de planes de suscripción
          - Cards con diseño Udemy-style
          - Navegación a página de planes
          
          APIs necesarias:
          - GET /api/plans (obtener todos los planes)
          - POST /api/subscriptions (crear suscripción)
      */}
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
              <div 
                key={plan.level}
                onClick={() => router.push('/plans')}
                className="cursor-pointer"
              >
                <Card 
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

                  <Link href="/login" onClick={(e) => e.stopPropagation()}>
                    <Button
                      className={`w-full cursor-pointer ${
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
          SECCIÓN PARA CREADORES DE CONTENIDO
          ==================================== 
          
          Call-to-action para que instructores, terapeutas y creadores 
          se unan a la plataforma como vendedores.
          
          APIs necesarias:
          - POST /api/creator/register - Registro como creador
          - GET /api/creator/info - Información para creadores
      */}
      <section id="creator-section" className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Tienes sabiduría para compartir?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Únete a nuestra comunidad de instructores y terapeutas. Comparte tu conocimiento y ayuda a transformar vidas mientras generas ingresos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Información para creadores */}
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Crea Cursos Transformadores</h3>
                    <p className="text-gray-600">
                      Diseña cursos con video-lecciones, obtén certificaciones automáticas y recibe comentarios de estudiantes comprometidos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ofrece Terapias Holísticas</h3>
                    <p className="text-gray-600">
                      Conecta con personas que buscan sanación. Gestiona tu agenda, recibe reseñas y construye tu reputación como terapeuta.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Genera Ingresos Pasivos</h3>
                    <p className="text-gray-600">
                      Recibe pagos automáticos, trackea tus ventas en tiempo real y obtén comisiones justas por cada venta.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunidad de Apoyo</h3>
                    <p className="text-gray-600">
                      Únete a una red de instructores y terapeutas que comparten tu pasión por el crecimiento espiritual y la transformación.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Comienza tu Carrera como Instructor
                </h3>
                <p className="text-gray-600 mb-6">
                  Es gratis registrarse. Solo necesitas tu conocimiento y pasión por ayudar a otros.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Registro gratuito y proceso de aprobación rápido</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Herramientas fáciles para crear y gestionar contenido</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Pagos automáticos y reportes detallados</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Soporte dedicado para instructores</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link href="/instructor/register">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg cursor-pointer">
                    Comenzar como Instructor
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Al registrarte, aceptas nuestros términos de servicio para instructores
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Instructores Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-gray-600">Estudiantes Transformados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Pagado a Instructores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image 
              src="/noBgWhite.png" 
              alt="Alalma" 
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-gray-400">
            Tu plataforma de crecimiento espiritual y sabiduría interior
          </p>
        </div>
      </footer>
    </div>
  )
}