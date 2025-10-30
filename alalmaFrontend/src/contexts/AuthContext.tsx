/**
 * ALALMA AUTH CONTEXT - Contexto básico de autenticación
 * =====================================================
 * 
 * Contexto simple para manejar estado de autenticación hasta que
 * se integre con el backend real. Permite determinar si el usuario
 * está logueado y acceder a rutas protegidas.
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/auth/me - Verificar sesión actual
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/logout - Cerrar sesión
 * - POST /api/auth/register - Registrar usuario
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthStatus = () => {
    // Simular verificación de autenticación
    // En backend real, aquí se haría una llamada a /api/auth/me
    const token = localStorage.getItem('auth-token')
    const sessionExpiry = localStorage.getItem('session-expiry')
    
    if (token && sessionExpiry) {
      const expiryDate = new Date(sessionExpiry)
      const now = new Date()
      
      if (now < expiryDate) {
        setIsAuthenticated(true)
      } else {
        // Token expirado
        localStorage.removeItem('auth-token')
        localStorage.removeItem('session-expiry')
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular API call de login
      // En backend real: const response = await fetch('/api/auth/login', ...)
      
      // Simulación de validación básica
      if (email && password.length >= 8) {
        // Simular token y expiración (24 horas)
        const fakeToken = btoa(`${email}:${Date.now()}`)
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
        
        localStorage.setItem('auth-token', fakeToken)
        localStorage.setItem('session-expiry', expiry.toISOString())
        
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('session-expiry')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userPlan')
    localStorage.removeItem('vendorProfile')
    setIsAuthenticated(false)
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}