'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { mockUserProfile, getFollowedInstructors } from '@/data/userProfile'
import { getInstructorById, type InstructorProfile } from '@/data/instructors'
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Calendar, 
  Users, 
  Heart,
  Star,
  Crown,
  Sparkles,
  UserCheck
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user] = useState(mockUserProfile)
  const [followedInstructors, setFollowedInstructors] = useState<InstructorProfile[]>([])

  useEffect(() => {
    // Cargar instructores seguidos
    const followedIds = getFollowedInstructors(user)
    const instructors = followedIds.map(id => getInstructorById(id)).filter((instructor): instructor is InstructorProfile => instructor !== undefined)
    setFollowedInstructors(instructors)
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

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Explorador': return 'from-gray-400 to-gray-500'
      case 'Buscador': return 'from-blue-400 to-blue-500'
      case 'Transformador': return 'from-purple-400 to-purple-600'
      case 'Maestro': return 'from-amber-400 to-amber-600'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Explorador': return <Users className="w-4 h-4" />
      case 'Buscador': return <Heart className="w-4 h-4" />
      case 'Transformador': return <Sparkles className="w-4 h-4" />
      case 'Maestro': return <Crown className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex gap-2">
              {user.role === 'vendor' && (
                <Button
                  onClick={() => router.push('/profile/edit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push('/settings')}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perfil Principal */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              {/* Información Principal */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                      {user.name}
                      {user.vendorInfo?.isVerified && (
                        <UserCheck className="w-5 h-5 text-blue-500 ml-2 inline" />
                      )}
                    </h1>
                    <p className="text-slate-600 mb-3">{user.bio}</p>
                  </div>
                </div>

                {/* Plan Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getPlanColor(user.plan)} mb-4`}>
                  {getPlanIcon(user.plan)}
                  <span className="ml-1">Plan {user.plan}</span>
                </div>

                {/* Información Adicional */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Miembro desde {new Date(user.joinDate).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    Siguiendo a {user.followingInstructors.length} instructor{user.followingInstructors.length !== 1 ? 'es' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Vendedor */}
            {user.vendorInfo && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Información como Vendedor
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.vendorInfo.stats.totalProducts}</div>
                    <div className="text-sm text-blue-700">Productos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user.vendorInfo.stats.totalSales}</div>
                    <div className="text-sm text-green-700">Ventas</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 mr-1" />
                      <span className="text-2xl font-bold text-amber-600">{user.vendorInfo.stats.averageRating}</span>
                    </div>
                    <div className="text-sm text-amber-700">Calificación</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{user.vendorInfo.stats.followersCount}</div>
                    <div className="text-sm text-purple-700">Seguidores</div>
                  </div>
                </div>
                <p className="text-slate-600">{user.vendorInfo.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructores Seguidos */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Instructores que Sigues ({followedInstructors.length})
            </h2>
            
            {followedInstructors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followedInstructors.map((instructor) => (
                  <div key={instructor.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {instructor.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 truncate">{instructor.name}</h3>
                      <p className="text-sm text-slate-500 truncate">{instructor.specialties[0]}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-amber-400 mr-1" />
                        <span className="text-xs text-slate-600">{instructor.stats.averageRating}</span>
                        <span className="text-xs text-slate-400 ml-2">{instructor.stats.totalStudents} estudiantes</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/instructor/${instructor.id}`)}
                        className="cursor-pointer"
                      >
                        Ver Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnfollow(instructor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        Dejar de seguir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No sigues a ningún instructor aún
                </h3>
                <p className="text-gray-500 mb-6">
                  Explora nuestros cursos y comienza a seguir a los instructores que más te inspiren.
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Explorar Cursos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}