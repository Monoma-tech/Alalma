/**
 * ALALMA EARNINGS CONTEXT - Gestión de ingresos y comisiones
 * =========================================================
 * 
 * Contexto que maneja el tracking de ventas, cálculo de comisiones
 * y gestión de ingresos para vendedores e instructores.
 * 
 * ESTRUCTURA DE COMISIONES:
 * - Vendedor: 70% del precio de venta
 * - Plataforma: 30% del precio de venta
 * - Procesamiento de pagos: 3.5% (incluido en el 30% de plataforma)
 * 
 * APIS NECESARIAS PARA LOVABLE:
 * - GET /api/vendor/earnings - Ingresos del vendedor
 * - GET /api/vendor/sales - Historial de ventas
 * - POST /api/vendor/payout - Solicitar pago
 * - GET /api/admin/earnings - Ingresos totales de la plataforma
 * - GET /api/admin/commissions - Gestión de comisiones
 */

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Sale {
  id: string
  contentId: string
  contentTitle: string
  contentType: 'course' | 'therapy' | 'tool'
  buyerId: string
  buyerName: string
  buyerEmail: string
  vendorId: string
  vendorName: string
  salePrice: number
  vendorEarning: number
  platformFee: number
  processingFee: number
  saleDate: string
  status: 'completed' | 'pending' | 'refunded'
  paymentMethod: 'card' | 'paypal' | 'bank_transfer'
  region: string
}

export interface EarningsSummary {
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  totalSales: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  growthPercentage: number
  averageSaleValue: number
}

export interface PayoutRequest {
  id: string
  vendorId: string
  amount: number
  requestDate: string
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  method: 'bank_transfer' | 'paypal'
  accountInfo: string
  processedDate?: string
  notes?: string
}

interface EarningsContextType {
  // Datos del vendedor
  earnings: EarningsSummary
  sales: Sale[]
  payoutRequests: PayoutRequest[]
  
  // Datos del admin
  platformEarnings: {
    totalRevenue: number
    totalCommissions: number
    totalPayouts: number
    activeVendors: number
  }
  
  // Acciones
  requestPayout: (amount: number, method: string, accountInfo: string) => Promise<boolean>
  getSalesByPeriod: (startDate: string, endDate: string) => Sale[]
  getTopPerformingContent: () => Array<{
    contentId: string
    title: string
    sales: number
    revenue: number
  }>
  
  // Utilidades
  calculateCommission: (salePrice: number) => {
    vendorEarning: number
    platformFee: number
    processingFee: number
  }
  
  refreshEarnings: () => Promise<void>
}

const EarningsContext = createContext<EarningsContextType | undefined>(undefined)

export function EarningsProvider({ children }: { children: ReactNode }) {
  // Mock data para demostración con precios en USD
  const [sales] = useState<Sale[]>([
    {
      id: 'sale-1',
      contentId: 'course-1',
      contentTitle: 'Meditación para Principiantes',
      contentType: 'course',
      buyerId: 'buyer-1',
      buyerName: 'María González',
      buyerEmail: 'maria@email.com',
      vendorId: 'vendor-1',
      vendorName: 'Ana Luz Espiritual',
      salePrice: 49.99,
      vendorEarning: 34.99, // 70%
      platformFee: 12.25,   // 24.5%
      processingFee: 2.75,  // 5.5%
      saleDate: '2024-01-20T10:30:00Z',
      status: 'completed',
      paymentMethod: 'card',
      region: 'US'
    },
    {
      id: 'sale-2',
      contentId: 'therapy-1',
      contentTitle: 'Sesión de Reiki',
      contentType: 'therapy',
      buyerId: 'buyer-2',
      buyerName: 'Carlos Mendoza',
      buyerEmail: 'carlos@email.com',
      vendorId: 'vendor-2',
      vendorName: 'Luz Sanadora',
      salePrice: 89.99,
      vendorEarning: 62.99,
      platformFee: 22.05,
      processingFee: 4.95,
      saleDate: '2024-01-22T14:15:00Z',
      status: 'completed',
      paymentMethod: 'paypal',
      region: 'US'
    },
    {
      id: 'sale-3',
      contentId: 'tool-1',
      contentTitle: 'Meditación Guiada - Audio',
      contentType: 'tool',
      buyerId: 'buyer-3',
      buyerName: 'Andrea Silva',
      buyerEmail: 'andrea@email.com',
      vendorId: 'vendor-1',
      vendorName: 'Ana Luz Espiritual',
      salePrice: 19.99,
      vendorEarning: 13.99,
      platformFee: 4.90,
      processingFee: 1.10,
      saleDate: '2024-01-25T09:45:00Z',
      status: 'completed',
      paymentMethod: 'card',
      region: 'US'
    }
  ])

  const [payoutRequests] = useState<PayoutRequest[]>([
    {
      id: 'payout-1',
      vendorId: 'vendor-1',
      amount: 248.97,
      requestDate: '2024-01-15T12:00:00Z',
      status: 'paid',
      method: 'bank_transfer',
      accountInfo: '****1234',
      processedDate: '2024-01-18T10:30:00Z'
    },
    {
      id: 'payout-2',
      vendorId: 'vendor-2',
      amount: 125.50,
      requestDate: '2024-01-25T16:20:00Z',
      status: 'pending',
      method: 'paypal',
      accountInfo: 'vendor@email.com'
    }
  ])

  // Calcular earnings summary
  const totalEarnings = sales.reduce((sum, sale) => sum + sale.vendorEarning, 0)
  const totalSales = sales.length
  const averageSaleValue = totalEarnings / totalSales || 0
  
  const earnings: EarningsSummary = {
    totalEarnings: totalEarnings,
    pendingEarnings: 500.25, // Mock pending
    paidEarnings: 748.50,    // Mock paid
    totalSales,
    thisMonthEarnings: 325.75,
    lastMonthEarnings: 280.50,
    growthPercentage: 16.1,
    averageSaleValue
  }

  const platformEarnings = {
    totalRevenue: sales.reduce((sum, sale) => sum + sale.salePrice, 0),
    totalCommissions: sales.reduce((sum, sale) => sum + sale.platformFee, 0),
    totalPayouts: payoutRequests
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
    activeVendors: 125 // Mock
  }

  const calculateCommission = (salePrice: number) => {
    const vendorPercentage = 0.70 // 70% para el vendedor
    const platformPercentage = 0.245 // 24.5% para la plataforma
    const processingPercentage = 0.055 // 5.5% para procesamiento
    
    return {
      vendorEarning: Number((salePrice * vendorPercentage).toFixed(2)),
      platformFee: Number((salePrice * platformPercentage).toFixed(2)),
      processingFee: Number((salePrice * processingPercentage).toFixed(2))
    }
  }

  const requestPayout = async (amount: number, method: string, accountInfo: string): Promise<boolean> => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validar que el vendedor tenga fondos suficientes
      if (amount > earnings.pendingEarnings) {
        throw new Error('Fondos insuficientes')
      }
      
      const newPayout: PayoutRequest = {
        id: `payout-${Date.now()}`,
        vendorId: 'current-vendor',
        amount,
        requestDate: new Date().toISOString(),
        status: 'pending',
        method: method as 'bank_transfer' | 'paypal',
        accountInfo
      }
      
      // En un contexto real, esto se agregaría al estado
      console.log('Payout requested:', newPayout)
      
      return true
    } catch (error) {
      console.error('Error requesting payout:', error)
      return false
    }
  }

  const getSalesByPeriod = (startDate: string, endDate: string): Sale[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate)
      return saleDate >= start && saleDate <= end
    })
  }

  const getTopPerformingContent = () => {
    type ContentPerf = {
      contentId: string
      title: string
      sales: number
      revenue: number
    }

    const contentPerformance = sales.reduce((acc, sale) => {
      if (!acc[sale.contentId]) {
        acc[sale.contentId] = {
          contentId: sale.contentId,
          title: sale.contentTitle,
          sales: 0,
          revenue: 0
        }
      }
      
      acc[sale.contentId].sales += 1
      acc[sale.contentId].revenue += sale.vendorEarning
      
      return acc
    }, {} as Record<string, ContentPerf>)
    
    return Object.values(contentPerformance)
      .sort((a: ContentPerf, b: ContentPerf) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  const refreshEarnings = async (): Promise<void> => {
    // Simular refresh de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    // En producción, aquí se haría fetch de la API
  }

  return (
    <EarningsContext.Provider value={{
      earnings,
      sales,
      payoutRequests,
      platformEarnings,
      requestPayout,
      getSalesByPeriod,
      getTopPerformingContent,
      calculateCommission,
      refreshEarnings
    }}>
      {children}
    </EarningsContext.Provider>
  )
}

export function useEarnings() {
  const context = useContext(EarningsContext)
  if (context === undefined) {
    throw new Error('useEarnings must be used within an EarningsProvider')
  }
  return context
}