'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Search, 
  Star, 
  Users, 
  BookOpen, 
  Verified,
  ArrowLeft,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Grid3X3,
  List
} from 'lucide-react'
import { mockInstructors, formatInstructorStats } from '@/data/instructors'

const specialtyCategories = [
  'Todos',
  'Mindfulness',
  'Meditación',
  'Sanación Energética',
  'Cristaloterapia',
  'Astrología',
  'Despertar Espiritual',
  'Aromaterapia',
  'Reiki',
  'Tarot'
]

export default function InstructorsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todos')
  const [sortBy, setSortBy] = useState<'rating' | 'students' | 'courses' | 'newest'>('rating')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Filtrar y ordenar instructores
  const filteredAndSortedInstructors = useMemo(() => {
    const filtered = mockInstructors.filter(instructor => {
      // Filtro por búsqueda
      const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Filtro por especialidad
      const matchesSpecialty = selectedSpecialty === 'Todos' || 
                              instructor.specialties.includes(selectedSpecialty)
      
      // Filtro por verificación
      const matchesVerified = !showVerifiedOnly || instructor.verified

      return matchesSearch && matchesSpecialty && matchesVerified
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.stats.averageRating - a.stats.averageRating
        case 'students':
          return b.stats.totalStudents - a.stats.totalStudents
        case 'courses':
          return b.stats.totalCourses - a.stats.totalCourses
        case 'newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedSpecialty, sortBy, showVerifiedOnly])

  const handleInstructorClick = (instructorId: number) => {
    router.push(`/instructor/${instructorId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover-lift"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Instructores</h1>
                <p className="text-gray-600">
                  Descubre a nuestros {mockInstructors.length} expertos en espiritualidad y bienestar
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o habilidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters */}
          <div className={`space-y-4 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
            {/* Specialty Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Especialidades
              </label>
              <div className="flex flex-wrap gap-2">
                {specialtyCategories.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSpecialty === specialty
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Additional Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'students' | 'courses' | 'newest')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="rating">Mejor valorados</option>
                  <option value="students">Más estudiantes</option>
                  <option value="courses">Más cursos</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVerifiedOnly}
                    onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Solo verificados</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-800 font-medium">
            {searchTerm || selectedSpecialty !== 'Todos' || showVerifiedOnly ? (
              filteredAndSortedInstructors.length > 0 
                ? `Se encontraron ${filteredAndSortedInstructors.length} instructor${filteredAndSortedInstructors.length !== 1 ? 'es' : ''}`
                : 'No se encontraron instructores con los filtros aplicados'
            ) : (
              `Mostrando ${filteredAndSortedInstructors.length} instructores`
            )}
          </p>

          <div className="md:hidden flex items-center space-x-2">
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

        {/* Instructors Grid/List */}
        {filteredAndSortedInstructors.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedInstructors.map((instructor) => {
              const stats = formatInstructorStats(instructor.stats)
              
              if (viewMode === 'list') {
                return (
                  <div
                    key={instructor.id}
                    onClick={() => handleInstructorClick(instructor.id)}
                    className="cursor-pointer"
                  >
                  <Card
                    className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar for list view */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg text-gray-900 hover:text-purple-600 transition-colors">
                                  {instructor.name}
                                </h3>
                                {instructor.verified && (
                                  <Verified className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{instructor.title}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {instructor.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Desde {new Date(instructor.joinedDate).getFullYear()}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-medium text-gray-700">{stats.rating}</span>
                                <span className="text-sm text-gray-500">({stats.reviews})</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {stats.students} estudiantes
                              </div>
                            </div>
                          </div>

                          {/* Specialties */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {instructor.specialties.slice(0, 4).map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {instructor.specialties.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{instructor.specialties.length - 4}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {instructor.bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                )
              }

              // Grid view
              return (
                <div
                  key={instructor.id}
                  onClick={() => handleInstructorClick(instructor.id)}
                  className="cursor-pointer"
                >
                <Card
                  className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                >
                  <CardContent className="p-6">
                    {/* Name and Title */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {instructor.name}
                        </h3>
                        {instructor.verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {instructor.title}
                      </p>
                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{instructor.location}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium text-gray-700">{stats.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{stats.reviews} reseñas</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Users className="w-3 h-3 text-purple-500" />
                          <span className="text-xs font-medium text-gray-700">{stats.students}</span>
                        </div>
                        <p className="text-xs text-gray-500">estudiantes</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <BookOpen className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-medium text-gray-700">{stats.courses}</span>
                        </div>
                        <p className="text-xs text-gray-500">cursos</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {instructor.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {instructor.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{instructor.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
                    >
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron instructores
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta cambiar los filtros o usar otros términos de búsqueda.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialty('Todos')
                  setShowVerifiedOnly(false)
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}