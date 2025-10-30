/**
 * ALALMA CONTENT APPROVAL CONTEXT - Sistema de aprobación de contenido
 * ===================================================================
 * 
 * Contexto que maneja el workflow de aprobación de contenido creado por
 * instructores/vendedores. Incluye estados, notificaciones y gestión.
 * 
 * ESTADOS DE CONTENIDO:
 * - draft: Borrador (en creación)
 * - pending: Pendiente de revisión
 * - approved: Aprobado para publicación
 * - rejected: Rechazado (requiere cambios)
 * - published: Publicado y activo
 * - suspended: Suspendido temporalmente
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/admin/content/pending - Contenido pendiente de aprobación
 * - PUT /api/admin/content/:id/approve - Aprobar contenido
 * - PUT /api/admin/content/:id/reject - Rechazar contenido
 * - PUT /api/vendor/content/:id/submit - Enviar para revisión
 * - GET /api/vendor/content/:id/status - Estado del contenido
 */

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'suspended'

export interface ContentItem {
  id: string
  title: string
  type: 'course' | 'therapy' | 'tool'
  vendorId: string
  vendorName: string
  status: ContentStatus
  createdAt: string
  submittedAt?: string
  reviewedAt?: string
  publishedAt?: string
  reviewNotes?: string
  price: number
  description: string
  thumbnail?: string
  category: string
}

export interface ContentApprovalStats {
  pending: number
  approved: number
  rejected: number
  published: number
  totalRevenue: number
}

interface ContentApprovalContextType {
  // Contenido para revisión (admin)
  pendingContent: ContentItem[]
  approvedContent: ContentItem[]
  rejectedContent: ContentItem[]
  
  // Mi contenido (vendor)
  myContent: ContentItem[]
  
  // Estadísticas
  stats: ContentApprovalStats
  
  // Acciones de admin
  approveContent: (id: string, notes?: string) => Promise<boolean>
  rejectContent: (id: string, notes: string) => Promise<boolean>
  
  // Acciones de vendor
  submitForReview: (id: string) => Promise<boolean>
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<boolean>
  
  // Utilidades
  getContentById: (id: string) => ContentItem | undefined
  getContentByStatus: (status: ContentStatus) => ContentItem[]
  refreshContent: () => Promise<void>
}

const ContentApprovalContext = createContext<ContentApprovalContextType | undefined>(undefined)

export function ContentApprovalProvider({ children }: { children: ReactNode }) {
  // Mock data para demostración
  const [pendingContent, setPendingContent] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Meditación para Principiantes',
      type: 'course',
      vendorId: 'vendor-1',
      vendorName: 'Ana Luz Espiritual',
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
      submittedAt: '2024-01-20T14:30:00Z',
      price: 49.99,
      description: 'Curso completo de meditación para comenzar tu práctica espiritual',
      category: 'Meditación',
      thumbnail: '/course-meditation.jpg'
    },
    {
      id: '2',
      title: 'Terapia de Reiki Nivel 1',
      type: 'therapy',
      vendorId: 'vendor-2',
      vendorName: 'Carlos Sanador',
      status: 'pending',
      createdAt: '2024-01-18T09:15:00Z',
      submittedAt: '2024-01-22T11:45:00Z',
      price: 89.99,
      description: 'Sesiones de Reiki para armonizar tu energía vital',
      category: 'Reiki',
      thumbnail: '/therapy-reiki.jpg'
    }
  ])

  const [approvedContent, setApprovedContent] = useState<ContentItem[]>([
    {
      id: '3',
      title: 'Yoga Kundalini Avanzado',
      type: 'course',
      vendorId: 'vendor-3',
      vendorName: 'María Consciousness',
      status: 'approved',
      createdAt: '2024-01-10T08:00:00Z',
      submittedAt: '2024-01-12T16:20:00Z',
      reviewedAt: '2024-01-15T10:30:00Z',
      price: 79.99,
      description: 'Práctica avanzada de Kundalini para despertar la consciencia',
      category: 'Yoga',
      reviewNotes: 'Excelente contenido, muy bien estructurado'
    }
  ])

  const [rejectedContent, setRejectedContent] = useState<ContentItem[]>([])

  const [myContent, setMyContent] = useState<ContentItem[]>([
    ...pendingContent,
    ...approvedContent,
    ...rejectedContent
  ])

  const stats: ContentApprovalStats = {
    pending: pendingContent.length,
    approved: approvedContent.length,
    rejected: rejectedContent.length,
    published: approvedContent.filter(c => c.status === 'published').length,
    totalRevenue: 15420.50 // Mock revenue
  }

  const approveContent = async (id: string, notes?: string): Promise<boolean> => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const contentItem = pendingContent.find(item => item.id === id)
      if (!contentItem) return false

      const approvedItem: ContentItem = {
        ...contentItem,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewNotes: notes
      }

      setPendingContent(prev => prev.filter(item => item.id !== id))
      setApprovedContent(prev => [...prev, approvedItem])
      
      return true
    } catch (error) {
      console.error('Error approving content:', error)
      return false
    }
  }

  const rejectContent = async (id: string, notes: string): Promise<boolean> => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const contentItem = pendingContent.find(item => item.id === id)
      if (!contentItem) return false

      const rejectedItem: ContentItem = {
        ...contentItem,
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewNotes: notes
      }

      setPendingContent(prev => prev.filter(item => item.id !== id))
      setRejectedContent(prev => [...prev, rejectedItem])
      
      return true
    } catch (error) {
      console.error('Error rejecting content:', error)
      return false
    }
  }

  const submitForReview = async (id: string): Promise<boolean> => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar estado del contenido a pending
      setMyContent(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: 'pending', submittedAt: new Date().toISOString() }
          : item
      ))
      
      return true
    } catch (error) {
      console.error('Error submitting for review:', error)
      return false
    }
  }

  const updateContent = async (id: string, updates: Partial<ContentItem>): Promise<boolean> => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMyContent(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ))
      
      return true
    } catch (error) {
      console.error('Error updating content:', error)
      return false
    }
  }

  const getContentById = (id: string): ContentItem | undefined => {
    return [...pendingContent, ...approvedContent, ...rejectedContent].find(item => item.id === id)
  }

  const getContentByStatus = (status: ContentStatus): ContentItem[] => {
    return [...pendingContent, ...approvedContent, ...rejectedContent].filter(item => item.status === status)
  }

  const refreshContent = async (): Promise<void> => {
    // Simular refresh de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    // En producción, aquí se haría fetch de la API
  }

  return (
    <ContentApprovalContext.Provider value={{
      pendingContent,
      approvedContent,
      rejectedContent,
      myContent,
      stats,
      approveContent,
      rejectContent,
      submitForReview,
      updateContent,
      getContentById,
      getContentByStatus,
      refreshContent
    }}>
      {children}
    </ContentApprovalContext.Provider>
  )
}

export function useContentApproval() {
  const context = useContext(ContentApprovalContext)
  if (context === undefined) {
    throw new Error('useContentApproval must be used within a ContentApprovalProvider')
  }
  return context
}