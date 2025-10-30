/**
 * ALALMA ADMIN CONTENT APPROVAL - Panel de administración para aprobar contenido
 * =============================================================================
 * 
 * Página donde los administradores pueden revisar, aprobar o rechazar
 * el contenido enviado por instructores/vendedores.
 * 
 * FUNCIONALIDADES:
 * - Lista de contenido pendiente de aprobación
 * - Vista previa del contenido
 * - Aprobación/rechazo con notas
 * - Estadísticas de aprobación
 * - Historial de revisiones
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/admin/content/pending - Contenido pendiente
 * - PUT /api/admin/content/:id/approve - Aprobar contenido
 * - PUT /api/admin/content/:id/reject - Rechazar contenido
 * - GET /api/admin/stats/approval - Estadísticas de aprobación
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useContentApproval } from '@/contexts/ContentApprovalContext'
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  FileText,
  Calendar,
  User,
  Tag,
  MessageSquare
} from 'lucide-react'

function AdminContentApproval() {
  const router = useRouter()
  const { 
    pendingContent, 
    approvedContent, 
    rejectedContent, 
    stats, 
    approveContent, 
    rejectContent 
  } = useContentApproval()
  
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async (id: string) => {
    setIsProcessing(true)
    try {
      const success = await approveContent(id, reviewNotes)
      if (success) {
        setSelectedContent(null)
        setReviewNotes('')
        alert('Contenido aprobado exitosamente')
      } else {
        alert('Error al aprobar el contenido')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!reviewNotes.trim()) {
      alert('Por favor, proporciona una razón para el rechazo')
      return
    }
    
    setIsProcessing(true)
    try {
      const success = await rejectContent(id, reviewNotes)
      if (success) {
        setSelectedContent(null)
        setReviewNotes('')
        alert('Contenido rechazado')
      } else {
        alert('Error al rechazar el contenido')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'pending':
        return pendingContent
      case 'approved':
        return approvedContent
      case 'rejected':
        return rejectedContent
      default:
        return []
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <FileText className="w-5 h-5" />
      case 'therapy': return <User className="w-5 h-5" />
      case 'tool': return <Tag className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/admin')}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Panel Admin
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Aprobación de Contenido
                </h1>
                <p className="text-gray-600">
                  Revisa y gestiona el contenido enviado por instructores
                </p>
              </div>
            </div>

            <div className="flex items-center">
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
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rechazados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-medium cursor-pointer ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Pendientes ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-4 text-sm font-medium cursor-pointer ${
                  activeTab === 'approved'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Aprobados ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-6 py-4 text-sm font-medium cursor-pointer ${
                  activeTab === 'rejected'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Rechazados ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Lista de contenido */}
          <div className="p-6">
            {getTabContent().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay contenido
                </h3>
                <p className="text-gray-600">
                  No se encontró contenido en esta categoría.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTabContent().map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getTypeIcon(item.type)}
                            <h3 className="ml-2 text-lg font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {item.vendorName}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${item.price}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {item.reviewNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">
                                <MessageSquare className="w-4 h-4 inline mr-1" />
                                {item.reviewNotes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-6 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContent(selectedContent === item.id ? null : item.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {selectedContent === item.id ? 'Ocultar' : 'Revisar'}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Panel de revisión */}
                      {selectedContent === item.id && activeTab === 'pending' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas de revisión
                              </label>
                              <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Agrega comentarios sobre la revisión..."
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => handleApprove(item.id)}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Procesando...' : 'Aprobar'}
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => handleReject(item.id)}
                                disabled={isProcessing || !reviewNotes.trim()}
                                className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Procesando...' : 'Rechazar'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Envolver con protección de ruta
export default function ProtectedAdminContentApproval() {
  return (
    <ProtectedRoute>
      <AdminContentApproval />
    </ProtectedRoute>
  )
}