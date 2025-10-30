/**
 * ALALMA SIGNIN PAGE - Redirección a Login
 * ========================================
 * 
 * Esta página redirige a la misma AuthForm que login
 * para mantener consistencia en las rutas.
 */

import { AuthForm } from '@/components/auth/AuthForm'

export default function SigninPage() {
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