/**
 * ALALMA PROTECTED ROUTE COMPONENT - Componente para rutas protegidas
 * ==================================================================
 * 
 * Componente HOC (Higher Order Component) que protege rutas que requieren
 * autenticación. Redirige al login si el usuario no está autenticado.
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/auth/me - Verificar sesión actual del usuario
 * - GET /api/auth/refresh - Renovar token de autenticación
 */

'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requiredRole?: 'customer' | 'vendor' | 'admin'
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requiredRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null
  }

  // TODO: Implementar verificación de roles cuando se integre con backend
  // if (requiredRole && userRole !== requiredRole) {
  //   return <UnauthorizedPage />
  // }

  return <>{children}</>
}

// Componente para mostrar cuando el usuario no tiene permisos
export function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>
        
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página. Contacta al administrador si crees que esto es un error.
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}