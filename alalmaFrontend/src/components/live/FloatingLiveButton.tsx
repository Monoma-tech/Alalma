'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { X, Video, Lock } from 'lucide-react'
import { useLivePermissions, useLiveUpgradeModal } from '@/contexts/LivePermissionsContext'
import { useAuth } from '@/contexts/AuthContext'

interface FloatingLiveButtonProps {
  /**
   * Páginas donde NO mostrar el botón flotante
   * Por defecto se oculta en páginas de live streaming
   */
  hiddenOnPages?: string[]
  
  /**
   * Posición del botón flotante
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  
  /**
   * Función callback cuando se inicia una sesión
   */
  onStartSession?: () => void
  
  /**
   * Controlar si el usuario puede iniciar sesiones live
   * En el futuro se controlará por rol/plan
   */
  canStartLive?: boolean
}

export function FloatingLiveButton({ 
  hiddenOnPages = ['/live', '/live/create'],
  position = 'bottom-right',
  onStartSession
}: FloatingLiveButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Verificar autenticación primero
  const { isAuthenticated, isLoading } = useAuth()
  
  // Usar permisos de live streaming
  const { canStartLive } = useLivePermissions()
  const { checkAndShowUpgrade } = useLiveUpgradeModal()

  // Auto-hide en scroll down, show en scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false)
        setIsExpanded(false)
      } else {
        // Scrolling up - show
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // No mostrar en páginas específicas
  const shouldHide = hiddenOnPages.some(page => pathname.startsWith(page))
  
  // CRÍTICO: No mostrar si el usuario NO está autenticado o si está cargando
  if (shouldHide || !isAuthenticated || isLoading || !canStartLive) {
    return null
  }

  const handleStartLive = () => {
    // Verificar permisos antes de permitir iniciar live
    if (checkAndShowUpgrade()) {
      onStartSession?.()
      router.push('/live/create')
    }
    // Si no tiene permisos, checkAndShowUpgrade() mostrará el modal de upgrade
  }

  const handleViewLive = () => {
    router.push('/live')
  }

  // Posición del botón
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6', 
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6'
  }

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      {/* Botón Principal */}
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center justify-center group cursor-pointer"
          title="Iniciar Sesión Live"
        >
          <div className="relative">
            {/* Icono principal */}
            <Video className="w-6 h-6 text-white" />
            
            {/* Indicador live pulsante */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 group-hover:opacity-30"></div>
        </Button>
      ) : (
        /* Menú Expandido */
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 min-w-[280px] animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Live Streaming</h3>
                <p className="text-xs text-gray-500">Conecta con tu audiencia</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            {/* Iniciar Sesión Live */}
            <Button
              onClick={handleStartLive}
              disabled={!canStartLive}
              className={`w-full flex items-center justify-center space-x-2 ${
                canStartLive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2">
                {canStartLive ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-medium">Iniciar Live</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Live Bloqueado</span>
                  </>
                )}
              </div>
            </Button>

            {/* Ver Sesiones Activas */}
            <Button
              onClick={handleViewLive}
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Ver Lives Activos</span>
            </Button>
          </div>

          {/* Quick Stats/Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>🔴 12 lives activos</span>
              <span>👥 1.2K viewers</span>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            💡 Tip: Usa el live para conectar en tiempo real
          </div>
        </div>
      )}
    </div>
  )
}

// Hook para controlar el floating button globalmente
export function useFloatingLiveButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [canStartLive, setCanStartLive] = useState(true)

  const showButton = () => setIsVisible(true)
  const hideButton = () => setIsVisible(false)
  const enableLive = () => setCanStartLive(true)
  const disableLive = () => setCanStartLive(false)

  return {
    isVisible,
    canStartLive,
    showButton,
    hideButton,
    enableLive,
    disableLive
  }
}