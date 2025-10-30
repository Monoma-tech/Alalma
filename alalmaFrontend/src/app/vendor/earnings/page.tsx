/**
 * ALALMA VENDOR EARNINGS - Página de gestión de ingresos
 * =====================================================
 * 
 * Página donde los vendedores pueden ver sus ingresos detallados,
 * historial de ventas, estadísticas y solicitar pagos.
 * 
 * FUNCIONALIDADES:
 * - Resumen de ingresos con gráficos
 * - Historial detallado de ventas
 * - Solicitud de pagos (payout)
 * - Análisis de rendimiento por contenido
 * - Estadísticas de crecimiento
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/vendor/earnings - Resumen de ingresos
 * - GET /api/vendor/sales - Historial de ventas
 * - POST /api/vendor/payout - Solicitar pago
 * - GET /api/vendor/analytics - Análisis de rendimiento
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useEarnings } from '@/contexts/EarningsContext'
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CreditCard,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react'

function VendorEarnings() {
  const router = useRouter()
  const { 
    earnings, 
    sales, 
    payoutRequests, 
    requestPayout, 
    getTopPerformingContent,
    refreshEarnings
  } = useEarnings()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'payouts' | 'analytics'>('overview')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer')
  const [accountInfo, setAccountInfo] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayoutModal, setShowPayoutModal] = useState(false)

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Por favor, ingresa un monto válido')
      return
    }

    if (!accountInfo.trim()) {
      alert('Por favor, proporciona la información de la cuenta')
      return
    }

    setIsProcessing(true)
    try {
      const success = await requestPayout(
        parseFloat(payoutAmount),
        payoutMethod,
        accountInfo
      )

      if (success) {
        alert('Solicitud de pago enviada exitosamente')
        setShowPayoutModal(false)
        setPayoutAmount('')
        setAccountInfo('')
      } else {
        alert('Error al solicitar el pago')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const topContent = getTopPerformingContent()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/vendor/dashboard')}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Ingresos
                </h1>
                <p className="text-gray-600">
                  Administra tus ganancias, ventas y pagos
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={refreshEarnings}
                className="cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              
              <Image 
                src="/with_padding.png" 
                alt="Alalma" 
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
                quality={95}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings.totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendiente de Pago</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings.pendingEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings.thisMonthEarnings.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    +{earnings.growthPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Venta Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earnings.averageSaleValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de solicitar pago */}
        {earnings.pendingEarnings > 0 && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Fondos Disponibles para Retiro
                    </h3>
                    <p className="text-gray-600">
                      Tienes <span className="font-semibold text-green-600">${earnings.pendingEarnings.toFixed(2)}</span> disponibles para retirar
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowPayoutModal(true)}
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Solicitar Pago
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'overview', label: 'Resumen', icon: TrendingUp },
                { id: 'sales', label: 'Ventas', icon: DollarSign },
                { id: 'payouts', label: 'Pagos', icon: CreditCard },
                { id: 'analytics', label: 'Análisis', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'sales' | 'payouts' | 'analytics')}
                  className={`px-6 py-4 text-sm font-medium cursor-pointer flex items-center ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resumen de Ingresos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Este Mes</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ${earnings.thisMonthEarnings.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        +{earnings.growthPercentage.toFixed(1)}% vs mes anterior
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Total Ventas</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {earnings.totalSales}
                      </p>
                      <p className="text-sm text-gray-600">
                        Promedio: ${earnings.averageSaleValue.toFixed(2)} por venta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Historial de Ventas
                </h3>
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <Card key={sale.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {sale.contentTitle}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Comprado por {sale.buyerName} • {new Date(sale.saleDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${sale.vendorEarning.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              de ${sale.salePrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payouts' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Historial de Pagos
                </h3>
                <div className="space-y-4">
                  {payoutRequests.map((payout) => (
                    <Card key={payout.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              ${payout.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(payout.requestDate).toLocaleDateString()} • {payout.method}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payout.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contenido con Mejor Rendimiento
                </h3>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <Card key={content.contentId}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-purple-600">
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {content.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {content.sales} ventas
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${content.revenue.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">ingresos</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de solicitud de pago */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Solicitar Pago
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto a retirar (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={earnings.pendingEarnings}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Disponible: ${earnings.pendingEarnings.toFixed(2)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de pago
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="bank_transfer">Transferencia bancaria</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {payoutMethod === 'bank_transfer' ? 'Número de cuenta' : 'Email de PayPal'}
                </label>
                <input
                  type={payoutMethod === 'paypal' ? 'email' : 'text'}
                  value={accountInfo}
                  onChange={(e) => setAccountInfo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={payoutMethod === 'bank_transfer' ? '1234567890' : 'email@example.com'}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRequestPayout}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Procesando...' : 'Solicitar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Envolver con protección de ruta
export default function ProtectedVendorEarnings() {
  return (
    <ProtectedRoute>
      <VendorEarnings />
    </ProtectedRoute>
  )
}