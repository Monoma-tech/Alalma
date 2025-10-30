/**
 * ALALMA ADMIN DASHBOARD - Panel principal de administración
 * =========================================================
 * 
 * Dashboard principal para administradores donde pueden acceder a:
 * - Gestión de contenido (aprobación/rechazo)
 * - Estadísticas de la plataforma
 * - Gestión de usuarios y vendedores
 * - Configuración de comisiones
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/admin/stats - Estadísticas generales
 * - GET /api/admin/users - Gestión de usuarios
 * - GET /api/admin/revenue - Ingresos de la plataforma
 * - GET /api/admin/content/stats - Estadísticas de contenido
 */

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useContentApproval } from '@/contexts/ContentApprovalContext'
import { useEarnings } from '@/contexts/EarningsContext'
import { 
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Shield
} from 'lucide-react'

function AdminDashboard() {
  const router = useRouter()
  const { stats: contentStats } = useContentApproval()
  const { platformEarnings } = useEarnings()

  const quickActions = [
    {
      title: 'Aprobar Contenido',
      description: 'Revisar contenido pendiente de aprobación',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      path: '/admin/content',
      badge: contentStats.pending > 0 ? contentStats.pending : null
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar cuentas de usuarios y vendedores',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      path: '/admin/users'
    },
    {
      title: 'Análisis Financiero',
      description: 'Ver ingresos, comisiones y estadísticas',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple',
      path: '/admin/finance'
    },
    {
      title: 'Configuración',
      description: 'Ajustar comisiones, políticas y configuración',
      icon: <Settings className="w-6 h-6" />,
      color: 'gray',
      path: '/admin/settings'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600 hover:bg-green-200'
      case 'blue': return 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      case 'purple': return 'bg-purple-100 text-purple-600 hover:bg-purple-200'
      case 'gray': return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-gray-600">
                  Gestiona la plataforma Alalma
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="cursor-pointer"
              >
                Ver Sitio Web
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
                    ${platformEarnings.totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600">USD</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendedores Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformEarnings.activeVendors}
                  </p>
                  <p className="text-sm text-blue-600">+12 este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contentStats.pending}
                  </p>
                  <p className="text-sm text-yellow-600">Por revisar</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Comisiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${platformEarnings.totalCommissions.toFixed(2)}
                  </p>
                  <p className="text-sm text-purple-600">Este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de contenido pendiente */}
        {contentStats.pending > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Contenido Pendiente de Revisión
                  </h3>
                  <p className="text-yellow-700">
                    Tienes {contentStats.pending} elementos esperando aprobación. 
                    Los instructores están esperando tu revisión.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/admin/content')}
                  className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                >
                  Revisar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(action.path)}
              >
                <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(action.color)}`}>
                      {action.icon}
                    </div>
                    {action.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FileText className="w-5 h-5 inline mr-2" />
                Contenido por Estado
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pendientes</span>
                  <span className="font-semibold text-yellow-600">{contentStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aprobados</span>
                  <span className="font-semibold text-green-600">{contentStats.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rechazados</span>
                  <span className="font-semibold text-red-600">{contentStats.rejected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Publicados</span>
                  <span className="font-semibold text-blue-600">{contentStats.published}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <DollarSign className="w-5 h-5 inline mr-2" />
                Finanzas de la Plataforma
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ingresos Totales</span>
                  <span className="font-semibold text-green-600">
                    ${platformEarnings.totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comisiones</span>
                  <span className="font-semibold text-purple-600">
                    ${platformEarnings.totalCommissions.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pagos Realizados</span>
                  <span className="font-semibold text-blue-600">
                    ${platformEarnings.totalPayouts.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ganancia Neta</span>
                  <span className="font-semibold text-gray-900">
                    ${(platformEarnings.totalCommissions - platformEarnings.totalPayouts).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Envolver con protección de ruta
export default function ProtectedAdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}