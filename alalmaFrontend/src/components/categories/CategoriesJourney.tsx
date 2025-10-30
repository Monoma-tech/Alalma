'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  Compass,
  ArrowRight,
  Star
} from 'lucide-react'

interface JourneyCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  category: string
  count: number
  onClick: () => void
}

function JourneyCard({ icon, title, description, color, category, count, onClick }: JourneyCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">{count} opciones disponibles</span>
          <div className="flex items-center text-purple-600">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm font-medium">Recomendado</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-md cursor-pointer"
          onClick={onClick}
        >
          Explorar {category}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function CategoriesJourney() {
  const router = useRouter()

  const journeyCards = [
    {
      icon: <BookOpen className="w-8 h-8 text-white" />,
      title: "Cursos de Sabiduría",
      description: "Profundiza tu conocimiento espiritual con cursos guiados por maestros experimentados. Transforma tu consciencia paso a paso.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      category: "Cursos",
      count: 3,
      onClick: () => router.push('/dashboard?category=curso')
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Terapias Holísticas",
      description: "Sana tu ser interior con terapias energéticas y técnicas ancestrales. Libera bloqueos y encuentra tu equilibrio.",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      category: "Terapias",
      count: 2,
      onClick: () => router.push('/dashboard?category=terapia')
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "Herramientas Místicas",
      description: "Descubre herramientas sagradas para potenciar tu práctica espiritual. Cristales, cartas y elementos de poder.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      category: "Herramientas",
      count: 3,
      onClick: () => router.push('/dashboard?category=herramienta')
    },
    {
      icon: <Compass className="w-8 h-8 text-white" />,
      title: "Mi Camino Personalizado",
      description: "Explora una selección curada especialmente para tu nivel de consciencia y objetivos espirituales únicos.",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      category: "Todo",
      count: 8,
      onClick: () => router.push('/dashboard')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Categorías
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Elige el camino que resuene con tu alma. Cada senda te llevará a descubrir nuevas dimensiones de sabiduría y crecimiento espiritual.
          </p>
        </div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {journeyCards.map((card, index) => (
            <JourneyCard key={index} {...card} />
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center">
          <div className="mb-6">
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <Compass className="w-4 h-4 mr-2" />
              Explorar todo el catálogo
            </Button>
          </div>
          
          <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-gray-700 font-medium">
              Tu viaje de transformación comienza aquí
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}