'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Radio, 
  Clock, 
  Eye, 
  Play, 
  Search,
  ArrowLeft,
  Lock
} from 'lucide-react'
import { useLive } from '@/contexts/LiveContext'
import { AnimatedGrid, AnimatedEntry } from '@/components/ui/AnimatedContainer'

const categories = [
  { id: 'all', name: 'Todos', icon: '🌟' },
  { id: 'curso', name: 'Cursos', icon: '📚' },
  { id: 'terapia', name: 'Terapias', icon: '💆‍♀️' },
  { id: 'herramienta', name: 'Herramientas', icon: '🔮' },
  { id: 'consulta', name: 'Consultas', icon: '💬' }
]

const accessLevelColors = {
  free: 'bg-green-100 text-green-800 border-green-200',
  basic: 'bg-blue-100 text-blue-800 border-blue-200',
  intermediate: 'bg-purple-100 text-purple-800 border-purple-200',
  premium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-red-100 text-red-800 border-red-200'
}

const accessLevelIcons = {
  free: '✨',
  basic: '🔍',
  intermediate: '🌟',
  premium: '👑',
  paid: '💰'
}

export default function LivePage() {
  const router = useRouter()
  const { liveSessions, joinSession, canAccessSession, getActiveSessions } = useLive()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyAccessible, setShowOnlyAccessible] = useState(false)

  // Filtrar sesiones
  const filteredSessions = liveSessions.filter(session => {
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesAccess = !showOnlyAccessible || canAccessSession(session)
    
    return session.isLive && matchesCategory && matchesSearch && matchesAccess
  })

  const activeSessions = getActiveSessions()

  const handleJoinSession = async (sessionId: string) => {
    const success = await joinSession(sessionId)
    if (success) {
      router.push(`/live/${sessionId}`)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getTimeElapsed = (startTime: Date) => {
    const now = new Date()
    const diff = now.getTime() - startTime.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 60) {
      return `${minutes}m`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMins = minutes % 60
      return `${hours}h ${remainingMins}m`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
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
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Radio className="w-6 h-6 text-red-600 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sesiones en Vivo</h1>
                  <p className="text-sm text-gray-600">
                    {activeSessions.length} sesiones activas • {activeSessions.reduce((acc, s) => acc + s.viewers, 0)} espectadores totales
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/live/create')}
                className="btn-animated hover-lift"
              >
                <Radio className="w-4 h-4 mr-2" />
                Iniciar Live
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <AnimatedEntry direction="up" className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Búsqueda */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar sesiones, instructores, temas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 input-enhanced"
                />
              </div>
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-3 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-scale ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Filtros adicionales */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyAccessible}
                  onChange={(e) => setShowOnlyAccessible(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Solo sesiones disponibles</span>
              </label>
            </div>
          </div>
        </AnimatedEntry>

        {/* Grid de Sesiones Live */}
        {filteredSessions.length > 0 ? (
          <AnimatedGrid cols={3} gap={6} staggerDelay={0.1}>
            {filteredSessions.map((session) => {
              const hasAccess = canAccessSession(session)
              const isPaid = session.accessLevel === 'paid'
              
              return (
                <div 
                  key={session.id}
                  className="cursor-pointer"
                  onClick={() => handleJoinSession(session.id)}
                >
                <Card
                  className="overflow-hidden card-enhanced hover-lift-strong group"
                >
                  {/* Thumbnail con overlay de estado live */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={session.thumbnail}
                      alt={session.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 animate-pulse-glow">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <span>EN VIVO</span>
                    </div>

                    {/* Viewers Count */}
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{session.viewers}</span>
                    </div>

                    {/* Duration Badge */}
                    {session.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDuration(session.duration)}
                      </div>
                    )}

                    {/* Access Level Badge */}
                    <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${accessLevelColors[session.accessLevel]}`}>
                      <span className="mr-1">{accessLevelIcons[session.accessLevel]}</span>
                      {session.accessLevel === 'paid' ? `$${session.price}` : session.accessLevel}
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 text-gray-800 ml-1" />
                      </div>
                    </div>

                    {/* Lock Overlay para sesiones sin acceso */}
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {isPaid ? `$${session.price} USD` : 'Plan requerido'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    {/* Host Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {session.hostName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.hostName}</p>
                        <p className="text-xs text-gray-500">Hace {getTimeElapsed(session.startTime)}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                      {session.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {session.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full transition-all duration-300 ${
                        hasAccess
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      disabled={!hasAccess}
                    >
                      {hasAccess ? (
                        <>
                          <Radio className="w-4 h-4 mr-2 animate-pulse" />
                          Unirse Ahora
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          {isPaid ? `Pagar $${session.price}` : 'Plan Requerido'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                </div>
              )
            })}
          </AnimatedGrid>
        ) : (
          <AnimatedEntry direction="up" className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay sesiones en vivo ahora
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Intenta cambiar los filtros o buscar otros términos.'
                  : 'Los instructores no están transmitiendo en este momento. ¡Vuelve pronto!'
                }
              </p>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setShowOnlyAccessible(false)
                  }}
                >
                  Limpiar Filtros
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Ver Cursos
                </Button>
              </div>
            </div>
          </AnimatedEntry>
        )}
      </div>
    </div>
  )
}