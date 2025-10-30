/**
 * ALALMA AUTH FORM - Formulario de autenticación unificado
 * ========================================================
 * 
 * Componente inspirado en el diseño de Udemy que incluye:
 * - Tabs para Login y Registro
 * - Autenticación social (Google, Facebook, Apple)
 * - Validación en tiempo real
 * - Diseño responsive con la esencia de Alalma
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - POST /api/auth/login
 * - POST /api/auth/register  
 * - POST /api/auth/social/google
 * - POST /api/auth/social/facebook
 * - POST /api/auth/social/apple
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User
} from 'lucide-react'

interface AuthFormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

interface AuthFormErrors {
  email?: string
  password?: string
  name?: string
  confirmPassword?: string
}

export function AuthForm() {
  // Estados para el typewriter effect
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Estados del formulario
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<AuthFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Palabras para el efecto typewriter
  const words = useMemo(() => ['Alalma', 'Alma', 'Armonía', 'Ascensión'], [])
  
  // Efecto typewriter
  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1200)
        }
      }
    }, isDeleting ? 60 : 80)
    
    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  const validateForm = (): boolean => {
    const newErrors: AuthFormErrors = {}

    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    // Validaciones adicionales para registro
    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Mínimo 2 caracteres'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      if (activeTab === 'login') {
        const success = await login(formData.email, formData.password)
        
        if (success) {
          router.push('/dashboard')
        } else {
          setErrors({ 
            email: 'Email o contraseña incorrectos' 
          })
        }
      } else {
        // Para registro, simular API call por ahora
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simular registro exitoso y auto-login
        console.log('Register attempt:', formData)
        const loginSuccess = await login(formData.email, formData.password)
        
        if (loginSuccess) {
          router.push('/dashboard')
        } else {
          setErrors({ 
            email: 'Error al crear la cuenta. Inténtalo de nuevo.' 
          })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ 
        email: 'Error de autenticación. Inténtalo de nuevo.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof AuthFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    })
  }

  const handleSocialAuth = (provider: string) => {
    console.log(`Auth with ${provider}`)
    // Aquí implementarías la autenticación social
  }

  return (
    <div className="w-full">
      <Card className="w-full shadow-xl border-0">
        <CardContent className="p-8">
          {/* Header con logo animado y título dinámico */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Image 
                src="/symbol.png" 
                alt="Alalma" 
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentText}
                </span>
                <span className="animate-pulse text-purple-600">|</span>
              </div>
            </h1>
            <p className="text-sm text-gray-600">
              {activeTab === 'login' 
                ? 'Inicia sesión para continuar tu experiencia' 
                : 'Regístrate para comenzar tu transformación'
              }
            </p>
            
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'border-alalma-purple text-alalma-purple'
                  : 'border-transparent text-gray-500 hover:text-alalma-purple'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'border-alalma-purple text-alalma-purple'
                  : 'border-transparent text-gray-500 hover:text-alalma-purple'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de nombre (solo para registro) */}
            {activeTab === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  className="pl-12 py-3 text-base"
                />
              </div>
            )}

            {/* Campo de email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-12 py-3 text-base"
              />
            </div>

            {/* Campo de contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="pl-12 pr-12 py-3 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Campo de confirmar contraseña (solo para registro) */}
            {activeTab === 'register' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  className="pl-12 pr-12 py-3 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Opciones adicionales para login */}
            {activeTab === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 cursor-pointer" />
                  <span className="text-gray-600">Mantenerme conectado</span>
                </label>
                <button type="button" className="text-alalma-purple hover:text-alalma-black cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Términos y condiciones para registro */}
            {activeTab === 'register' && (
              <div className="text-sm text-gray-600">
                Al registrarte, aceptas nuestros{' '}
                <button type="button" className="text-alalma-purple hover:text-alalma-black cursor-pointer">
                  Términos de servicio
                </button>{' '}
                y{' '}
                <button type="button" className="text-alalma-purple hover:text-alalma-black cursor-pointer">
                  Política de privacidad
                </button>
              </div>
            )}

            {/* Botón de submit */}
            <Button 
              type="submit" 
              className="w-full py-3 text-base bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 cursor-pointer" 
              loading={loading}
            >
              {loading 
                ? (activeTab === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') 
                : (activeTab === 'login' ? 'Iniciar sesión' : 'Registrarse')
              }
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Otras opciones de inicio de sesión</span>
            </div>
          </div>

          {/* Botones de autenticación social */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialAuth('google')}
              className="w-full py-3 border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continúa con Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialAuth('facebook')}
              className="w-full py-3 border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continúa con Facebook
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialAuth('apple')}
              className="w-full py-3 border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continúa con Apple
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {activeTab === 'login' ? (
              <span>
                ¿No tienes una cuenta?{' '}
                <button 
                  onClick={() => handleTabChange('register')}
                  className="text-alalma-purple hover:text-alalma-black font-medium cursor-pointer"
                >
                  Regístrate
                </button>
              </span>
            ) : (
              <span>
                ¿Ya tienes una cuenta?{' '}
                <button 
                  onClick={() => handleTabChange('login')}
                  className="text-alalma-purple hover:text-alalma-black font-medium cursor-pointer"
                >
                  Inicia sesión
                </button>
              </span>
            )}
          </div>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center space-y-2">
            <div>
              <button 
                onClick={() => router.push('/instructor/register')}
                className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                ¿Quieres enseñar en Alalma? Conviértete en Instructor
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}