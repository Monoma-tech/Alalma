/**
 * TIPOS DE DATOS PARA APIS DE ALALMA
 * ==================================
 * 
 * Este archivo define todas las interfaces que esperamos recibir del backend.
 * Lovable debe implementar estas estructuras exactas en las APIs.
 */

// ========================================
// USUARIO Y AUTENTICACIÓN
// ========================================

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  planId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

// ========================================
// PLANES DE SUSCRIPCIÓN
// ========================================

export interface Plan {
  id: string
  name: string
  level: 'free' | 'basic' | 'intermediate' | 'premium'
  price: number
  currency: string
  features: string[]
  maxProducts: number
  hasDownloads: boolean
  hasCommunity: boolean
  hasSupport: boolean
  popular?: boolean
}

// ========================================
// PRODUCTOS Y CONTENIDO
// ========================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  categoryId: string
  instructor: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  rating: number
  reviewCount: number
  students: number
  duration?: string // Para cursos
  sessions?: number // Para terapias
  inStock: boolean
  image: string
  gallery?: string[]
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  language: string
  lastUpdated: string
  createdAt: string
  // Control de acceso por plan
  requiredPlan: 'free' | 'basic' | 'intermediate' | 'premium'
}

// ========================================
// CARRITO Y COMPRAS
// ========================================

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  addedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  currency: string
  updatedAt: string
}

// ========================================
// FAVORITOS
// ========================================

export interface Favorite {
  id: string
  userId: string
  productId: string
  product: Product
  addedAt: string
}

// ========================================
// PROGRESO Y APRENDIZAJE
// ========================================

export interface CourseProgress {
  id: string
  userId: string
  productId: string
  progress: number // 0-100
  completedLessons: string[]
  lastAccessed: string
  startedAt: string
  completedAt?: string
}

// ========================================
// FILTROS Y BÚSQUEDA
// ========================================

export interface ProductFilters {
  categories?: string[]
  priceRange?: [number, number]
  minRating?: number
  difficulty?: string[]
  language?: string
  inStock?: boolean
  tags?: string[]
}

export interface SearchParams {
  query?: string
  category?: string
  filters?: ProductFilters
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest' | 'popular'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  filters: {
    categories: Category[]
    priceRange: [number, number]
    ratings: number[]
    difficulties: string[]
    languages: string[]
  }
}

// ========================================
// ESTADÍSTICAS Y ANALYTICS
// ========================================

export interface SiteStats {
  totalStudents: number
  totalCourses: number
  totalInstructors: number
  totalHours: number
  averageRating: number
}

// ========================================
// RESPUESTAS DE API ESTÁNDAR
// ========================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}