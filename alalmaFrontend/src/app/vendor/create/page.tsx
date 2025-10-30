/**
 * ALALMA VENDOR CREATE CONTENT - Formularios para crear contenido
 * ==============================================================
 * 
 * Página donde los vendedores pueden crear y subir:
 * - Cursos con video-lecciones y módulos
 * - Terapias con perfil de terapeuta y servicios
 * - Herramientas como audios, PDFs y meditaciones
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - POST /api/vendor/courses - Crear nuevo curso
 * - POST /api/vendor/therapies - Crear nueva terapia
 * - POST /api/vendor/tools - Crear nueva herramienta
 * - POST /api/upload/video - Subir videos de cursos
 * - POST /api/upload/audio - Subir audios de herramientas
 * - POST /api/upload/pdf - Subir PDFs de herramientas
 * - POST /api/upload/image - Subir imágenes de productos
 */

'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useUserRole } from '@/contexts/UserRoleContext'
import { 
  ArrowLeft,
  BookOpen, 
  Heart, 
  Sparkles,
  Plus,
  X,
  Video,
  FileText,
  Headphones,
  Image as ImageIcon,
  Save,
  Eye
} from 'lucide-react'

type ContentType = 'curso' | 'terapia' | 'herramienta'

interface CourseModule {
  id: string
  title: string
  description: string
  videoFile?: File
  duration: string
}

interface CourseForm {
  title: string
  description: string
  category: string
  price: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  thumbnail?: File
  modules: CourseModule[]
}

interface TherapyForm {
  title: string
  description: string
  category: string
  price: number
  duration: string
  sessionType: 'individual' | 'group' | 'online'
  thumbnail?: File
  specialties: string[]
  prerequisites: string
}

interface ToolForm {
  title: string
  description: string
  category: string
  price: number
  type: 'audio' | 'pdf' | 'meditation' | 'guide'
  thumbnail?: File
  file?: File
  duration?: string
}

function VendorCreateContent() {
  const router = useRouter()
  const { vendorProfile } = useUserRole()
  const [contentType, setContentType] = useState<ContentType | null>(null)


  // Forms state
  const [courseForm, setCourseForm] = useState<CourseForm>({
    title: '',
    description: '',
    category: '',
    price: 0,
    difficulty: 'beginner',
    duration: '',
    modules: []
  })

  const [therapyForm, setTherapyForm] = useState<TherapyForm>({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    sessionType: 'individual',
    specialties: [],
    prerequisites: ''
  })

  const [toolForm, setToolForm] = useState<ToolForm>({
    title: '',
    description: '',
    category: '',
    price: 0,
    type: 'audio'
  })

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Necesitas ser un vendedor para crear contenido</p>
          <Button onClick={() => router.push('/dashboard')} className="cursor-pointer">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const addCourseModule = () => {
    const newModule: CourseModule = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: ''
    }
    setCourseForm(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }))
  }

  const removeCourseModule = (moduleId: string) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }))
  }

  const updateCourseModule = (moduleId: string, field: keyof CourseModule, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId ? { ...m, [field]: value } : m
      )
    }))
  }

  const handleSubmit = async () => {
    // Aquí iría la lógica para enviar el formulario a la API
    console.log('Submitting content:', { contentType, courseForm, therapyForm, toolForm })
    alert('Contenido enviado para revisión!')
    router.push('/vendor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/vendor/dashboard')}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              
              <Image 
                src="/with_padding.png" 
                alt="Alalma" 
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
                quality={95}
              />
              <span className="ml-4 text-sm text-gray-500 border-l border-gray-300 pl-4">
                Crear Contenido
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={handleSubmit}
                disabled={!contentType}
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={!contentType}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                Enviar para Revisión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!contentType ? (
          // Content Type Selection
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Qué quieres crear?</h1>
            <p className="text-gray-600 mb-8">Elige el tipo de contenido que deseas compartir con la comunidad Alalma</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 cursor-pointer hover:shadow-lg transition-all p-6 text-center"
                onClick={() => setContentType('curso')}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Curso</h3>
                <p className="text-gray-600 mb-4">
                  Crea cursos con video-lecciones organizadas por módulos
                </p>
                <ul className="text-sm text-gray-500 text-left">
                  <li>• Videos por módulos</li>
                  <li>• Certificación automática</li>
                  <li>• Sistema de progreso</li>
                  <li>• Comentarios por lección</li>
                </ul>
              </div>

              <div 
                className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 cursor-pointer hover:shadow-lg transition-all p-6 text-center"
                onClick={() => setContentType('terapia')}
              >
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Terapia</h3>
                <p className="text-gray-600 mb-4">
                  Ofrece servicios terapéuticos y sesiones personalizadas
                </p>
                <ul className="text-sm text-gray-500 text-left">
                  <li>• Perfil de terapeuta</li>
                  <li>• Agenda de disponibilidad</li>
                  <li>• Sistema de reservas</li>
                  <li>• Testimonios y calificaciones</li>
                </ul>
              </div>

              <div 
                className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 cursor-pointer hover:shadow-lg transition-all p-6 text-center"
                onClick={() => setContentType('herramienta')}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Herramienta</h3>
                <p className="text-gray-600 mb-4">
                  Comparte recursos como audios, PDFs y meditaciones
                </p>
                <ul className="text-sm text-gray-500 text-left">
                  <li>• Audios meditativos</li>
                  <li>• PDFs descargables</li>
                  <li>• Visualizaciones guiadas</li>
                  <li>• Retos semanales</li>
                </ul>
              </div>
            </div>
          </div>
        ) : contentType === 'curso' ? (
          // Course Creation Form
          <div>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setContentType(null)}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Tipo
              </Button>
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900">Crear Curso</h1>
              </div>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Curso *
                      </label>
                      <input
                        type="text"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Despertando tu Poder Interior"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="espiritualidad">Espiritualidad</option>
                        <option value="salud">Salud</option>
                        <option value="proposito">Propósito</option>
                        <option value="energia">Energía</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio (COP) *
                      </label>
                      <input
                        type="number"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="150000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Dificultad
                      </label>
                      <select
                        value={courseForm.difficulty}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe de qué trata tu curso y qué aprenderán los estudiantes..."
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen de Portada
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Haz clic para subir una imagen</p>
                      <p className="text-sm text-gray-500">PNG, JPG hasta 5MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Módulos del Curso</h2>
                    <Button onClick={addCourseModule} className="cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Módulo
                    </Button>
                  </div>
                  
                  {courseForm.modules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p>Aún no has agregado módulos</p>
                      <p className="text-sm">Haz clic en &quot;Agregar Módulo&quot; para comenzar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courseForm.modules.map((module, index) => (
                        <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Módulo {index + 1}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeCourseModule(module.id)}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título del Módulo
                              </label>
                              <input
                                type="text"
                                value={module.title}
                                onChange={(e) => updateCourseModule(module.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Ej: Introducción a la Meditación"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración
                              </label>
                              <input
                                type="text"
                                value={module.duration}
                                onChange={(e) => updateCourseModule(module.id, 'duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Ej: 15 min"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={module.description}
                              onChange={(e) => updateCourseModule(module.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Describe el contenido de este módulo..."
                            />
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Video del Módulo
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors">
                              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Subir video del módulo</p>
                              <p className="text-xs text-gray-500">MP4, MOV hasta 500MB</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : contentType === 'terapia' ? (
          // Therapy Creation Form
          <div>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setContentType(null)}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Tipo
              </Button>
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-pink-600 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900">Crear Terapia</h1>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Servicio</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Servicio *
                    </label>
                    <input
                      type="text"
                      value={therapyForm.title}
                      onChange={(e) => setTherapyForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Sesión de Reiki Individual"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sesión
                    </label>
                    <select
                      value={therapyForm.sessionType}
                      onChange={(e) => setTherapyForm(prev => ({ ...prev, sessionType: e.target.value as 'individual' | 'group' | 'online' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="individual">Individual</option>
                      <option value="group">Grupal</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio por Sesión (COP) *
                    </label>
                    <input
                      type="number"
                      value={therapyForm.price}
                      onChange={(e) => setTherapyForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="80000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración de la Sesión
                    </label>
                    <input
                      type="text"
                      value={therapyForm.duration}
                      onChange={(e) => setTherapyForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: 60 minutos"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Servicio *
                  </label>
                  <textarea
                    value={therapyForm.description}
                    onChange={(e) => setTherapyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe tu servicio terapéutico, metodología y beneficios..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Tool Creation Form
          <div>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setContentType(null)}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Tipo
              </Button>
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900">Crear Herramienta</h1>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Herramienta</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Herramienta *
                    </label>
                    <input
                      type="text"
                      value={toolForm.title}
                      onChange={(e) => setToolForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Meditación para Dormir Profundo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Herramienta
                    </label>
                    <select
                      value={toolForm.type}
                      onChange={(e) => setToolForm(prev => ({ ...prev, type: e.target.value as 'audio' | 'pdf' | 'meditation' | 'guide' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="audio">Audio</option>
                      <option value="pdf">PDF</option>
                      <option value="meditation">Meditación Guiada</option>
                      <option value="guide">Guía Práctica</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (COP) *
                    </label>
                    <input
                      type="number"
                      value={toolForm.price}
                      onChange={(e) => setToolForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="25000"
                    />
                  </div>
                  
                  {toolForm.type === 'audio' || toolForm.type === 'meditation' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración
                      </label>
                      <input
                        type="text"
                        value={toolForm.duration || ''}
                        onChange={(e) => setToolForm(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ej: 20 minutos"
                      />
                    </div>
                  ) : null}
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={toolForm.description}
                    onChange={(e) => setToolForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe tu herramienta y cómo ayudará a los usuarios..."
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo Principal
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
                    {toolForm.type === 'audio' || toolForm.type === 'meditation' ? (
                      <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    )}
                    <p className="text-gray-600">
                      Subir {toolForm.type === 'audio' || toolForm.type === 'meditation' ? 'audio' : 'archivo'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {toolForm.type === 'audio' || toolForm.type === 'meditation' 
                        ? 'MP3, WAV hasta 100MB' 
                        : 'PDF hasta 10MB'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Envolver el componente con protección de ruta
export default function ProtectedVendorCreateContent() {
  return (
    <ProtectedRoute>
      <VendorCreateContent />
    </ProtectedRoute>
  )
}