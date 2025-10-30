'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { mockUserProfile, getFollowedInstructors } from '@/data/userProfile'
import { getInstructorById, type InstructorProfile } from '@/data/instructors'
import { 
  ArrowLeft, 
  Heart,
  Star,
  Users,
  BookOpen,
  MessageCircle,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'

export default function FollowingPage() {
  const router = useRouter()
  const [user] = useState(mockUserProfile)
  const [followedInstructors, setFollowedInstructors] = useState<InstructorProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar instructores seguidos
    const followedIds = getFollowedInstructors(user)
    const instructors = followedIds.map(id => getInstructorById(id)).filter((instructor): instructor is InstructorProfile => instructor !== undefined)
    setFollowedInstructors(instructors)
    setLoading(false)
  }, [user])

  const handleUnfollow = (instructorId: number) => {
    // Aquí iría la lógica para dejar de seguir
    setFollowedInstructors(prev => prev.filter(instructor => instructor?.id !== instructorId))
    // Actualizar el perfil del usuario
    const index = user.followingInstructors.indexOf(instructorId)
    if (index > -1) {
      user.followingInstructors.splice(index, 1)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'instagram': return <Instagram className="w-4 h-4" />
      case 'facebook': return <Facebook className="w-4 h-4" />
      case 'youtube': return <Youtube className="w-4 h-4" />
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'linkedin': return <Linkedin className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando instructores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Instructores que Sigo</h1>
                <p className="text-slate-600">Gestiona los instructores que sigues</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-slate-700">
                {followedInstructors.length} instructor{followedInstructors.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {followedInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedInstructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header del Instructor */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">
                        {instructor.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-lg mb-1">{instructor.name}</h3>
                      <p className="text-sm text-slate-500 mb-2">{instructor.specialties[0]}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 mr-1" />
                        <span className="text-sm text-slate-600 mr-3">{instructor.stats.averageRating}</span>
                        <Users className="w-4 h-4 text-slate-400 mr-1" />
                        <span className="text-sm text-slate-500">{instructor.stats.totalStudents}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-blue-700">{instructor.stats.totalCourses}</div>
                      <div className="text-xs text-blue-600">Cursos</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-green-700">{instructor.stats.totalReviews}</div>
                      <div className="text-xs text-green-600">Reviews</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg">
                      <Star className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-amber-700">{instructor.stats.averageRating}</div>
                      <div className="text-xs text-amber-600">Rating</div>
                    </div>
                  </div>

                  {/* Redes Sociales */}
                  {instructor.socialLinks && Object.values(instructor.socialLinks).some(link => link) && (
                    <div className="flex justify-center space-x-3 mb-4">
                      {Object.entries(instructor.socialLinks).map(([platform, url]) => 
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {getSocialIcon(platform)}
                          </a>
                        )
                      )}
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/instructor/${instructor.id}`)}
                      className="flex-1 cursor-pointer"
                    >
                      Ver Perfil
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleUnfollow(instructor.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No sigues a ningún instructor aún
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Descubre instructores increíbles y comienza a seguir a aquellos que más te inspiren en tu camino espiritual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Explorar Cursos
              </Button>
              <Button
                onClick={() => router.push('/instructors')}
                variant="outline"
                className="cursor-pointer"
              >
                Ver Todos los Instructores
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}