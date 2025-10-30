/**
 * INSTRUCTOR PROFILE PAGE - Perfil público del instructor/vendedor
 * ================================================================
 * 
 * Página que muestra el perfil completo de un instructor incluyendo:
 * - Información personal y profesional
 * - Estadísticas y credenciales  
 * - Todos sus cursos y productos
 * - Reviews y testimonios
 * 
 * Ruta: /instructor/[id]
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { WisdomProductCardWithPlan } from '@/components/ecommerce/WisdomProductCardWithPlan'
import { getInstructorById, formatInstructorStats, type InstructorProfile } from '@/data/instructors'
import { mockProducts } from '@/data/products'
import { toggleFollowInstructor, isFollowingInstructor } from '@/data/userProfile'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  MessageCircle,
  CheckCircle,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Heart
} from 'lucide-react'

export default function InstructorProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null)
  const [instructorProducts, setInstructorProducts] = useState<typeof mockProducts>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followingLoading, setFollowingLoading] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    if (id) {
      const instructorData = getInstructorById(Number(id))
      if (instructorData) {
        setInstructor(instructorData)
        // Filtrar productos del instructor
        const products = mockProducts.filter(product => 
          instructorData.courses.includes(product.id)
        )
        setInstructorProducts(products)
        
        // Verificar si ya sigue a este instructor
        setIsFollowing(isFollowingInstructor(Number(id)))
      }
      setLoading(false)
    }
  }, [id])

  const handleFollowToggle = async () => {
    if (!instructor) return
    
    setFollowingLoading(true)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newFollowingState = toggleFollowInstructor(instructor.id)
      setIsFollowing(newFollowingState)
      
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error)
    } finally {
      setFollowingLoading(false)
    }
  }

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    // Implementar lógica de carrito
    console.log('Agregar al carrito:', product)
  }

  const handleAddToWishlist = (product: typeof mockProducts[0]) => {
    setWishlist(prev => {
      if (prev.includes(product.id)) {
        // Remover de favoritos
        return prev.filter(id => id !== product.id)
      } else {
        // Agregar a favoritos  
        return [...prev, product.id]
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil del instructor...</p>
        </div>
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Instructor no encontrado</h1>
          <p className="text-gray-600 mb-6">El perfil que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const stats = formatInstructorStats(instructor.stats)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleFollowToggle}
                disabled={followingLoading}
                variant={isFollowing ? "default" : "outline"}
                className={`${isFollowing 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "border-blue-200 text-blue-700 hover:bg-blue-50"
                } cursor-pointer`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {followingLoading 
                  ? 'Procesando...' 
                  : isFollowing 
                    ? 'Siguiendo' 
                    : 'Seguir Instructor'
                }
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{instructor.name}</h1>
            <p className="text-xl opacity-90">{instructor.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Información del instructor */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Avatar y verificación */}
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {instructor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {instructor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-slate-800">{instructor.name}</h2>
                    {instructor.verified && (
                      <span className="inline-flex items-center text-sm text-blue-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Instructor Verificado
                      </span>
                    )}
                  </div>
                </div>

                {/* Información básica */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{instructor.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Miembro desde {new Date(instructor.joinedDate).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-600 mr-1" />
                    </div>
                    <div className="text-lg font-bold text-slate-800">{stats.students}</div>
                    <div className="text-xs text-slate-600">Estudiantes</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="w-4 h-4 text-indigo-600 mr-1" />
                    </div>
                    <div className="text-lg font-bold text-slate-800">{stats.courses}</div>
                    <div className="text-xs text-slate-600">Cursos</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-amber-600 mr-1" />
                    </div>
                    <div className="text-lg font-bold text-slate-800">{stats.rating}</div>
                    <div className="text-xs text-slate-600">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <MessageCircle className="w-4 h-4 text-emerald-600 mr-1" />
                    </div>
                    <div className="text-lg font-bold text-slate-800">{stats.reviews}</div>
                    <div className="text-xs text-slate-600">Reviews</div>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enlaces sociales */}
                {Object.keys(instructor.socialLinks).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Enlaces</h3>
                    <div className="space-y-2">
                      {instructor.socialLinks.website && (
                        <a
                          href={instructor.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Sitio Web
                        </a>
                      )}
                      {instructor.socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${instructor.socialLinks.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          {instructor.socialLinks.instagram}
                        </a>
                      )}
                      {instructor.socialLinks.youtube && (
                        <a
                          href={`https://youtube.com/@${instructor.socialLinks.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-red-600 hover:text-red-700 text-sm"
                        >
                          <Youtube className="w-4 h-4 mr-2" />
                          {instructor.socialLinks.youtube}
                        </a>
                      )}
                      {instructor.socialLinks.facebook && (
                        <a
                          href={`https://facebook.com/${instructor.socialLinks.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-800 hover:text-blue-900 text-sm"
                        >
                          <Facebook className="w-4 h-4 mr-2" />
                          {instructor.socialLinks.facebook}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Biografía */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre {instructor.name}</h2>
                <p className="text-slate-600 leading-relaxed">{instructor.bio}</p>
              </CardContent>
            </Card>

            {/* Cursos del instructor */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Cursos de {instructor.name} ({instructorProducts.length})
                </h2>
              </div>

              {instructorProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructorProducts.map(product => (
                    <WisdomProductCardWithPlan
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={wishlist.includes(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      No hay cursos disponibles
                    </h3>
                    <p className="text-slate-600">
                      {instructor.name} aún no ha publicado cursos en la plataforma.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}