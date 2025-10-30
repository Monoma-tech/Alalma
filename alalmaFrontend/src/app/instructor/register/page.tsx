/**
 * ALALMA INSTRUCTOR REGISTRATION - Registro específico para instructores
 * ====================================================================
 * 
 * Página dedicada al registro de instructores/vendedores con información
 * específica y proceso optimizado para creadores de contenido.
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - POST /api/auth/register/instructor - Registro específico para instructores
 * - GET /api/instructor/requirements - Requisitos para ser instructor
 * - POST /api/instructor/application - Aplicación para ser instructor
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useUserRole } from '@/contexts/UserRoleContext'
import { 
  ArrowLeft,
  BookOpen, 
  Heart, 
  Sparkles,
  Check,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react'

export default function InstructorRegistration() {
  const router = useRouter()
  const { setUserRole } = useUserRole()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    experience: '',
    specialties: '',
    motivation: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validaciones
  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    // Validar contraseña con requisitos de seguridad
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else {
      const password = formData.password
      const hasMinLength = password.length >= 8
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)

      if (!hasMinLength) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!hasUpperCase) {
        newErrors.password = 'La contraseña debe tener al menos una mayúscula'
      } else if (!hasLowerCase) {
        newErrors.password = 'La contraseña debe tener al menos una minúscula'
      } else if (!hasNumber) {
        newErrors.password = 'La contraseña debe tener al menos un número'
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {}
    
    // Validar nombre del negocio
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido'
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = 'El nombre debe tener al menos 3 caracteres'
    }
    
    // Validar experiencia
    if (!formData.experience) {
      newErrors.experience = 'Selecciona tu nivel de experiencia'
    }
    
    // Validar especialidades
    if (!formData.specialties.trim()) {
      newErrors.specialties = 'Las especialidades son requeridas'
    } else if (formData.specialties.trim().length < 5) {
      newErrors.specialties = 'Describe mejor tus especialidades (mínimo 5 caracteres)'
    }
    
    // Validar motivación
    if (!formData.motivation.trim()) {
      newErrors.motivation = 'La motivación es requerida'
    } else if (formData.motivation.trim().length < 20) {
      newErrors.motivation = 'Cuéntanos más sobre tu motivación (mínimo 20 caracteres)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular registro exitoso
      alert('¡Registro exitoso! Te hemos enviado un email de confirmación. Tu cuenta será revisada y aprobada en 24-48 horas.')
      
      // Cambiar a rol de vendor y redirigir
      setUserRole('vendor')
      router.push('/vendor/dashboard')
    } catch (error) {
      alert('Error al registrarse. Por favor, intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Ingresos Pasivos',
      description: 'Gana dinero mientras duermes con cursos y contenido digital'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Audiencia Global',
      description: 'Conecta con estudiantes de todo el mundo interesados en tu tema'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Crecimiento Profesional',
      description: 'Construye tu marca personal y reputación como experto'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Plataforma Segura',
      description: 'Pagos seguros, protección de contenido y soporte 24/7'
    }
  ]

  const contentTypes = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: 'Cursos Online',
      description: 'Crea cursos completos con videos, ejercicios y certificados',
      examples: ['Meditación', 'Yoga', 'Desarrollo Personal', 'Espiritualidad']
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: 'Terapias',
      description: 'Ofrece sesiones individuales y servicios terapéuticos',
      examples: ['Reiki', 'Terapia Cuántica', 'Constelaciones', 'Coaching']
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: 'Herramientas',
      description: 'Comparte recursos digitales y herramientas prácticas',
      examples: ['Audios', 'Meditaciones', 'Guías PDF', 'Plantillas']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
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
                Registro de Instructores
              </span>
            </div>

            <div className="text-sm text-gray-600">
              ¿Ya tienes cuenta? <Link href="/login" className="text-purple-600 hover:text-purple-700 cursor-pointer">Iniciar sesión</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información y beneficios */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Comparte tu Sabiduría con el Mundo
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Únete a cientos de instructores que están transformando vidas y generando ingresos compartiendo su conocimiento espiritual.
              </p>
            </div>

            {/* Beneficios */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tipos de contenido */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué puedes crear?</h3>
              <div className="space-y-4">
                {contentTypes.map((type, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 flex-shrink-0">{type.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{type.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {type.examples.map((example, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de registro */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Comenzar como Instructor
                  </h2>
                  <p className="text-gray-600">
                    Completa tu registro y comienza a crear contenido hoy mismo
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, name: e.target.value }))
                              if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Tu nombre completo"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, email: e.target.value }))
                              if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="tu@email.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña *
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, password: e.target.value }))
                              if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Mínimo 8 caracteres con mayúscula, minúscula y número"
                          />
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña *
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Repetir contraseña"
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      <Button 
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                      >
                        Continuar
                      </Button>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de tu Negocio/Marca *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, businessName: e.target.value }))
                            if (errors.businessName) setErrors(prev => ({ ...prev, businessName: '' }))
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.businessName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ej: Alma Sanadora, Centro Holístico..."
                        />
                        {errors.businessName && (
                          <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Años de Experiencia *
                        </label>
                        <select
                          required
                          value={formData.experience}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, experience: e.target.value }))
                            if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }))
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer ${
                            errors.experience ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Selecciona tu experiencia</option>
                          <option value="0-1">Menos de 1 año</option>
                          <option value="1-3">1-3 años</option>
                          <option value="3-5">3-5 años</option>
                          <option value="5-10">5-10 años</option>
                          <option value="10+">Más de 10 años</option>
                        </select>
                        {errors.experience && (
                          <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialidades *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.specialties}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, specialties: e.target.value }))
                            if (errors.specialties) setErrors(prev => ({ ...prev, specialties: '' }))
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.specialties ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ej: Reiki, Meditación, Yoga, Terapia Cuántica..."
                        />
                        {errors.specialties && (
                          <p className="mt-1 text-sm text-red-600">{errors.specialties}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ¿Por qué quieres ser instructor en Alalma? *
                        </label>
                        <textarea
                          required
                          value={formData.motivation}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, motivation: e.target.value }))
                            if (errors.motivation) setErrors(prev => ({ ...prev, motivation: '' }))
                          }}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.motivation ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Cuéntanos tu motivación para enseñar..."
                        />
                        {errors.motivation && (
                          <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
                        )}
                      </div>

                      <div className="flex space-x-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 cursor-pointer"
                        >
                          Volver
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta de Instructor'}
                        </Button>
                      </div>
                    </>
                  )}
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Proceso de aprobación en 24-48 horas</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Soporte dedicado para instructores</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}