'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useUserRole } from '@/contexts/UserRoleContext'
import { useUserPlan } from '@/contexts/UserPlanContext'

interface LivePermissionsContextType {
  canStartLive: boolean
  canJoinPremiumSessions: boolean
  canModerateChat: boolean
  canRecordSessions: boolean
  maxSessionDuration: number // en minutos
  maxViewers: number
  requiredPlanForLive: string
  checkLivePermissions: () => LivePermissions
}

interface LivePermissions {
  canStart: boolean
  reason?: string
  planRequired?: string
  maxDuration: number
  maxViewers: number
  features: {
    chat: boolean
    recording: boolean
    moderation: boolean
    premiumAccess: boolean
  }
}

const LivePermissionsContext = createContext<LivePermissionsContextType | undefined>(undefined)

interface LivePermissionsProviderProps {
  children: ReactNode
}

export function LivePermissionsProvider({ children }: LivePermissionsProviderProps) {
  const { userRole } = useUserRole()
  const { userPlan } = useUserPlan()
  
  // Configuración de permisos basada en roles y planes
  const getPermissions = (): LivePermissions => {
    // Admins siempre pueden hacer todo
    if (userRole === 'admin') {
      return {
        canStart: true,
        maxDuration: 480, // 8 horas
        maxViewers: 1000,
        features: {
          chat: true,
          recording: true,
          moderation: true,
          premiumAccess: true
        }
      }
    }

    // Vendedores con permisos basados en plan
    if (userRole === 'vendor') {
      switch (userPlan.name.toLowerCase()) {
        case 'explorador': // Free
          return {
            canStart: false,
            reason: 'Necesitas un plan de pago para iniciar sesiones live',
            planRequired: 'Buscador',
            maxDuration: 0,
            maxViewers: 0,
            features: {
              chat: false,
              recording: false,
              moderation: false,
              premiumAccess: false
            }
          }
          
        case 'buscador': // Basic
          return {
            canStart: true,
            maxDuration: 60, // 1 hora
            maxViewers: 50,
            features: {
              chat: true,
              recording: false,
              moderation: true,
              premiumAccess: false
            }
          }
          
        case 'transformador': // Intermediate
          return {
            canStart: true,
            maxDuration: 120, // 2 horas
            maxViewers: 100,
            features: {
              chat: true,
              recording: true,
              moderation: true,
              premiumAccess: true
            }
          }
          
        case 'maestro': // Premium
          return {
            canStart: true,
            maxDuration: 240, // 4 horas
            maxViewers: 500,
            features: {
              chat: true,
              recording: true,
              moderation: true,
              premiumAccess: true
            }
          }
          
        default:
          return {
            canStart: false,
            reason: 'Plan no reconocido',
            maxDuration: 0,
            maxViewers: 0,
            features: {
              chat: false,
              recording: false,
              moderation: false,
              premiumAccess: false
            }
          }
      }
    }

    // Usuarios regulares no pueden iniciar sesiones
    return {
      canStart: false,
      reason: 'Solo vendedores e instructores pueden iniciar sesiones live',
      planRequired: 'Cambiar a modo vendedor',
      maxDuration: 0,
      maxViewers: 0,
      features: {
        chat: false,
        recording: false,
        moderation: false,
        premiumAccess: userPlan.name.toLowerCase() !== 'explorador'
      }
    }
  }

  const permissions = getPermissions()

  const value: LivePermissionsContextType = {
    canStartLive: permissions.canStart,
    canJoinPremiumSessions: permissions.features.premiumAccess,
    canModerateChat: permissions.features.moderation,
    canRecordSessions: permissions.features.recording,
    maxSessionDuration: permissions.maxDuration,
    maxViewers: permissions.maxViewers,
    requiredPlanForLive: permissions.planRequired || 'Buscador',
    checkLivePermissions: () => permissions
  }

  return (
    <LivePermissionsContext.Provider value={value}>
      {children}
    </LivePermissionsContext.Provider>
  )
}

export function useLivePermissions() {
  const context = useContext(LivePermissionsContext)
  if (context === undefined) {
    throw new Error('useLivePermissions must be used within a LivePermissionsProvider')
  }
  return context
}

// Hook para mostrar modal de upgrade cuando sea necesario
export function useLiveUpgradeModal() {
  const [showModal, setShowModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')
  const { checkLivePermissions } = useLivePermissions()

  const checkAndShowUpgrade = () => {
    const permissions = checkLivePermissions()
    
    if (!permissions.canStart) {
      setUpgradeReason(permissions.reason || 'Upgrade requerido')
      setShowModal(true)
      return false
    }
    
    return true
  }

  const closeModal = () => {
    setShowModal(false)
    setUpgradeReason('')
  }

  return {
    showModal,
    upgradeReason,
    checkAndShowUpgrade,
    closeModal
  }
}