'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { X, Crown, Zap, Users, Clock } from 'lucide-react'
import { useLiveUpgradeModal } from '@/contexts/LivePermissionsContext'
import { useUserRole } from '@/contexts/UserRoleContext'

export function LiveUpgradeModal() {
  const router = useRouter()
  const { showModal, upgradeReason, closeModal } = useLiveUpgradeModal()
  const { userRole, setUserRole } = useUserRole()

  if (!showModal) return null

  const handleUpgradePlan = () => {
    closeModal()
    router.push('/plans')
  }

  const handleSwitchToVendor = () => {
    closeModal()
    setUserRole('vendor')
    router.push('/vendor/dashboard')
  }

  const isCustomerRole = userRole === 'customer'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl p-6 text-white">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Live Streaming</h2>
              <p className="text-red-100 text-sm">¡Conecta con tu audiencia en tiempo real!</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4">
              {upgradeReason}
            </p>
            
            {isCustomerRole ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Crown className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 text-sm">Cambiar a Modo Vendedor</h3>
                    <p className="text-purple-700 text-xs mt-1">
                      Los vendedores pueden crear contenido y realizar sesiones live
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <h3 className="font-semibold text-gray-800 text-center">Beneficios del Live Streaming:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>Conecta con tu audiencia en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Sesiones de hasta 4 horas (plan Maestro)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Grabación y moderación de chat</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isCustomerRole ? (
              <>
                <Button
                  onClick={handleSwitchToVendor}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Cambiar a Modo Vendedor
                </Button>
                <Button
                  onClick={handleUpgradePlan}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Ver Planes de Suscripción
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleUpgradePlan}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Actualizar Plan
                </Button>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="w-full"
                >
                  Quizás Más Tarde
                </Button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💡 Los planes de pago desbloquean funciones avanzadas de live streaming
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}