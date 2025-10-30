/**
 * ALALMA LOGIN/REGISTER PAGE - Página de autenticación
 * =====================================================
 * 
 * Página inspirada en el diseño de Udemy con la esencia espiritual de Alalma.
 * Incluye tanto login como registro en la misma interfaz con tabs.
 * 
 * FUNCIONALIDADES:
 * 1. Tabs para alternar entre Login y Registro
 * 2. Formularios con validación en tiempo real
 * 3. Autenticación con redes sociales
 * 4. Diseño responsive e inspirado en Udemy
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/register - Registrar usuario
 * - POST /api/auth/google - Autenticación con Google
 * - POST /api/auth/facebook - Autenticación con Facebook
 */

import { AuthForm } from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}