/**
 * ALALMA USER ROLE CONTEXT - Sistema de roles para usuarios
 * =========================================================
 * 
 * Maneja los diferentes roles de usuario en la plataforma:
 * - customer: Usuario estándar que compra contenido
 * - vendor: Creador de contenido (cursos, terapias, herramientas)
 * - admin: Administrador del sistema
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/user/role - Obtener rol del usuario actual
 * - POST /api/user/role - Cambiar rol del usuario
 * - GET /api/vendor/profile - Perfil del vendedor
 * - PUT /api/vendor/profile - Actualizar perfil del vendedor
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'customer' | 'vendor' | 'admin'

export interface VendorProfile {
  id: string
  businessName: string
  description: string
  avatar?: string
  specialties: string[]
  experience: string
  certifications: string[]
  contactInfo: {
    email: string
    phone?: string
    website?: string
    social?: {
      instagram?: string
      facebook?: string
      linkedin?: string
    }
  }
  stats: {
    totalSales: number
    totalProducts: number
    rating: number
    reviews: number
  }
  earnings: {
    totalEarnings: number
    pendingPayments: number
    lastPayment?: Date
  }
  isVerified: boolean
  joinedAt: Date
}

interface UserRoleContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  vendorProfile: VendorProfile | null
  setVendorProfile: (profile: VendorProfile | null) => void
  isVendor: boolean
  isAdmin: boolean
  isCustomer: boolean
  canCreateContent: boolean
  canModerateContent: boolean
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

// Mock data para el perfil de vendedor
const mockVendorProfile: VendorProfile = {
  id: 'vendor-1',
  businessName: 'Alma Sanadora',
  description: 'Especialista en terapias holísticas y crecimiento espiritual con más de 10 años de experiencia.',
  avatar: '/api/placeholder/150/150',
  specialties: ['Reiki', 'Terapia Cuántica', 'Constelaciones Familiares'],
  experience: '10+ años',
  certifications: ['Maestro Reiki', 'Terapeuta Holístico Certificado', 'Coach Espiritual'],
  contactInfo: {
    email: 'alma@sanadora.com',
    phone: '+57 300 123 4567',
    website: 'https://almasanadora.com',
    social: {
      instagram: '@almasanadora',
      facebook: 'almasanadoraoficial'
    }
  },
  stats: {
    totalSales: 3250.00,
    totalProducts: 15,
    rating: 4.8,
    reviews: 127
  },
  earnings: {
    totalEarnings: 2275.00,
    pendingPayments: 325.00,
    lastPayment: new Date('2024-10-15')
  },
  isVerified: true,
  joinedAt: new Date('2023-08-01')
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('customer')
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null)

  // Computed properties
  const isVendor = userRole === 'vendor'
  const isAdmin = userRole === 'admin'
  const isCustomer = userRole === 'customer'
  const canCreateContent = userRole === 'vendor' || userRole === 'admin'
  const canModerateContent = userRole === 'admin'

  // Simular persistencia en localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole')
    const savedVendorProfile = localStorage.getItem('vendorProfile')
    
    if (savedRole) {
      try {
        const parsedRole = JSON.parse(savedRole) as UserRole
        setUserRole(parsedRole)
        
        // Si es vendor, cargar perfil mock
        if (parsedRole === 'vendor') {
          if (savedVendorProfile) {
            setVendorProfile(JSON.parse(savedVendorProfile))
          } else {
            setVendorProfile(mockVendorProfile)
          }
        }
      } catch (error) {
        console.error('Error loading user role:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('userRole', JSON.stringify(userRole))
    
    if (userRole === 'vendor' && !vendorProfile) {
      setVendorProfile(mockVendorProfile)
    } else if (userRole !== 'vendor') {
      setVendorProfile(null)
    }
  }, [userRole, vendorProfile])

  useEffect(() => {
    if (vendorProfile) {
      localStorage.setItem('vendorProfile', JSON.stringify(vendorProfile))
    } else {
      localStorage.removeItem('vendorProfile')
    }
  }, [vendorProfile])

  return (
    <UserRoleContext.Provider value={{
      userRole,
      setUserRole,
      vendorProfile,
      setVendorProfile,
      isVendor,
      isAdmin,
      isCustomer,
      canCreateContent,
      canModerateContent
    }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }
  return context
}