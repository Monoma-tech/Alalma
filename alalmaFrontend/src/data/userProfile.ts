/**
 * USER PROFILE DATA - Sistema de perfiles de usuario y seguimiento
 * ================================================================
 */

export interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  joinDate: string
  role: 'customer' | 'vendor'
  plan: string
  
  // Información de vendedor (solo si role === 'vendor')
  vendorInfo?: {
    businessName: string
    description: string
    specialties: string[]
    socialLinks: {
      website?: string
      instagram?: string
      facebook?: string
      youtube?: string
      linkedin?: string
      twitter?: string
    }
    stats: {
      totalProducts: number
      totalSales: number
      averageRating: number
      followersCount: number
    }
    isVerified: boolean
    joinedAsVendor: string
  }
  
  // Instructores que sigue
  followingInstructors: number[] // IDs de instructores
  
  // Preferencias
  preferences: {
    notifications: boolean
    newsletter: boolean
    language: string
    currency: string
  }
}

// Mock del perfil del usuario actual
export const mockUserProfile: UserProfile = {
  id: 1,
  name: "Ana Martínez",
  email: "ana@ejemplo.com",
  avatar: "/avatars/user-1.jpg",
  bio: "Exploradora del camino espiritual, buscando equilibrio y sabiduría en cada experiencia.",
  location: "Ciudad de México, México",
  joinDate: "2024-01-15",
  role: "vendor",
  plan: "Transformador",
  
  vendorInfo: {
    businessName: "Sendero de Luz",
    description: "Ofrezco cursos y terapias holísticas para el crecimiento personal y espiritual. Mi enfoque combina técnicas ancestrales con métodos modernos para crear experiencias transformadoras.",
    specialties: ["Meditación", "Mindfulness", "Terapia Energética", "Coaching Espiritual"],
    socialLinks: {
      website: "https://senderode-luz.com",
      instagram: "https://instagram.com/senderodeluz",
      facebook: "https://facebook.com/senderodeluz",
      youtube: "https://youtube.com/@senderodeluz"
    },
    stats: {
      totalProducts: 3,
      totalSales: 150,
      averageRating: 4.8,
      followersCount: 1250
    },
    isVerified: true,
    joinedAsVendor: "2024-02-01"
  },
  
  followingInstructors: [1, 3, 5], // Sigue a María Luna, Luna Cristal y Gabriel Luz
  
  preferences: {
    notifications: true,
    newsletter: true,
    language: "es",
    currency: "USD"
  }
}

// Función para obtener instructores seguidos con información completa
export const getFollowedInstructors = (userProfile: UserProfile) => {
  // En una app real, esto vendría de una API
  // Por ahora simulamos con datos mock
  return userProfile.followingInstructors
}

// Función para seguir/dejar de seguir un instructor
export const toggleFollowInstructor = (instructorId: number): boolean => {
  const currentlyFollowing = mockUserProfile.followingInstructors.includes(instructorId)
  
  if (currentlyFollowing) {
    // Dejar de seguir
    mockUserProfile.followingInstructors = mockUserProfile.followingInstructors.filter(id => id !== instructorId)
    return false
  } else {
    // Seguir
    mockUserProfile.followingInstructors.push(instructorId)
    return true
  }
}

// Función para verificar si sigue a un instructor
export const isFollowingInstructor = (instructorId: number): boolean => {
  return mockUserProfile.followingInstructors.includes(instructorId)
}

// Función para actualizar perfil de vendedor
export const updateVendorProfile = (updates: Partial<UserProfile['vendorInfo']>) => {
  if (mockUserProfile.vendorInfo) {
    mockUserProfile.vendorInfo = {
      ...mockUserProfile.vendorInfo,
      ...updates
    }
  }
}

// Función para actualizar perfil básico
export const updateUserProfile = (updates: Partial<UserProfile>) => {
  Object.assign(mockUserProfile, updates)
}