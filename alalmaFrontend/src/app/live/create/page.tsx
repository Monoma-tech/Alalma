'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Radio, 
  ArrowLeft, 
  Camera, 
  Settings, 
  Users, 
  DollarSign,
  Lock,
  Globe
} from 'lucide-react'
import { useLive } from '@/contexts/LiveContext'
import { AnimatedEntry } from '@/components/ui/AnimatedContainer'

const categories = [
  { id: 'curso', name: 'Curso', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  { id: 'terapia', name: 'Terapia', icon: '💆‍♀️', color: 'bg-green-100 text-green-800' },
  { id: 'herramienta', name: 'Herramienta', icon: '🔮', color: 'bg-purple-100 text-purple-800' },
  { id: 'consulta', name: 'Consulta', icon: '💬', color: 'bg-yellow-100 text-yellow-800' }
]

const accessLevels = [
  { id: 'free', name: 'Gratis', description: 'Acceso libre para todos', icon: Globe },
  { id: 'basic', name: 'Plan Básico', description: 'Solo para suscriptores básicos', icon: Users },
  { id: 'intermediate', name: 'Plan Intermedio', description: 'Solo para suscriptores intermedios', icon: Users },
  { id: 'premium', name: 'Plan Premium', description: 'Solo para suscriptores premium', icon: Users },
  { id: 'paid', name: 'Pago Individual', description: 'Requiere pago único', icon: DollarSign }
]

export default function CreateLivePage() {
  const router = useRouter()
  const { createSession, isLoading } = useLive()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'curso' as 'curso' | 'terapia' | 'herramienta' | 'consulta',
    accessLevel: 'free' as 'free' | 'basic' | 'intermediate' | 'premium' | 'paid',
    price: 0,
    maxViewers: 100,
    tags: [] as string[],
    chatEnabled: true,
    recordingEnabled: false
  })
  
  const [newTag, setNewTag] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const sessionData = {
      ...formData,
      price: formData.accessLevel === 'paid' ? formData.price : undefined
    }

    const sessionId = await createSession(sessionData)
    
    if (sessionId) {
      router.push(`/live/${sessionId}`)
    } else {
      alert('Error al crear la sesión. Inténtalo de nuevo.')
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Radio className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Crear Sesión en Vivo</h1>
                  <p className="text-sm text-gray-600">Configura tu transmisión en directo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <AnimatedEntry direction="up" className="space-y-6">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-purple-600" />
                  Información de la Sesión
                </h2>
                
                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Sesión *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: Meditación Guiada Matutina"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 input-enhanced"
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe de qué tratará tu sesión en vivo..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 input-enhanced resize-none"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.id as 'curso' | 'terapia' | 'herramienta' | 'consulta' }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 hover-scale ${
                            formData.category === category.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <div className="text-sm font-medium">{category.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedEntry>

          {/* Configuración de Acceso */}
          <AnimatedEntry direction="up" delay={0.1}>
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-600" />
                  Configuración de Acceso
                </h2>
                
                <div className="space-y-4">
                  {/* Nivel de Acceso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Quién puede acceder a esta sesión?
                    </label>
                    <div className="space-y-3">
                      {accessLevels.map((level) => {
                        const IconComponent = level.icon
                        return (
                          <div key={level.id} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              id={level.id}
                              name="accessLevel"
                              value={level.id}
                              checked={formData.accessLevel === level.id}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                accessLevel: e.target.value as 'free' | 'basic' | 'intermediate' | 'premium' | 'paid' 
                              }))}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <label htmlFor={level.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center space-x-3">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                                <div>
                                  <div className="font-medium text-gray-900">{level.name}</div>
                                  <div className="text-sm text-gray-600">{level.description}</div>
                                </div>
                              </div>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Precio para acceso pagado */}
                  {formData.accessLevel === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Acceso (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          placeholder="10.00"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 input-enhanced"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedEntry>

          {/* Configuración Técnica */}
          <AnimatedEntry direction="up" delay={0.2}>
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Configuración Técnica
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Máximo de espectadores */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Espectadores
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.maxViewers}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxViewers: parseInt(e.target.value) }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 input-enhanced appearance-none"
                      >
                        <option value={50}>50 espectadores</option>
                        <option value={100}>100 espectadores</option>
                        <option value={250}>250 espectadores</option>
                        <option value={500}>500 espectadores</option>
                        <option value={1000}>1000 espectadores</option>
                      </select>
                    </div>
                  </div>

                  {/* Opciones adicionales */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="chatEnabled"
                        checked={formData.chatEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, chatEnabled: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="chatEnabled" className="text-sm font-medium text-gray-700">
                        Habilitar chat en vivo
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="recordingEnabled"
                        checked={formData.recordingEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="recordingEnabled" className="text-sm font-medium text-gray-700">
                        Grabar sesión automáticamente
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas (para facilitar la búsqueda)
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Ej: meditación, relajación..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                    >
                      Agregar
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedEntry>

          {/* Botones de Acción */}
          <AnimatedEntry direction="up" delay={0.3}>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim() || isLoading}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 min-w-[160px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4" />
                    <span>Iniciar Transmisión</span>
                  </div>
                )}
              </Button>
            </div>
          </AnimatedEntry>
        </form>
      </div>
    </div>
  )
}