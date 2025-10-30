'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Users, 
  BookOpen, 
  Verified,
  ArrowRight
} from 'lucide-react'
import { mockInstructors, formatInstructorStats } from '@/data/instructors'

interface InstructorCarouselProps {
  title?: string
  subtitle?: string
  showAll?: boolean
  limit?: number
}

export function InstructorCarousel({ 
  title = "Nuestros Instructores Destacados",
  subtitle = "Aprende de expertos reconocidos en espiritualidad y bienestar",
  showAll = false,
  limit = 6
}: InstructorCarouselProps) {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const instructors = showAll ? mockInstructors : mockInstructors.slice(0, limit)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' })
    }
  }

  const handleInstructorClick = (instructorId: number) => {
    router.push(`/instructor/${instructorId}`)
  }

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="hidden md:flex w-10 h-10 p-0 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="hidden md:flex w-10 h-10 p-0 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {instructors.map((instructor) => {
            const stats = formatInstructorStats(instructor.stats)
            
            return (
              <div
                key={instructor.id}
                onClick={() => handleInstructorClick(instructor.id)}
                className="flex-none w-64 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-gray-100"
              >
                {/* Content */}
                <div className="p-4">
                  {/* Name and Title */}
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {instructor.name}
                      </h3>
                      {instructor.verified && (
                        <Verified className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {instructor.title}
                    </p>
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
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {instructor.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{instructor.specialties.length - 2}
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
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Ver Todos Card */}
          <div
            onClick={() => router.push('/instructors')}
            className="flex-none w-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1 text-white flex flex-col items-center justify-center p-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base mb-2">Ver Todos</h3>
              <p className="text-xs text-white/80 mb-3">
                Descubre {mockInstructors.length}+ instructores
              </p>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300 text-sm"
              >
                Explorar
                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="w-8 h-8 p-0 rounded-full"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="w-8 h-8 p-0 rounded-full"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorCarousel