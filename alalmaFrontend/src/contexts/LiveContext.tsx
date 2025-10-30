'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tipos para el sistema de Live Streaming
export interface LiveSession {
  id: string
  hostId: string
  hostName: string
  hostAvatar: string
  title: string
  description: string
  category: 'curso' | 'terapia' | 'herramienta' | 'consulta'
  isLive: boolean
  startTime: Date
  viewers: number
  maxViewers: number
  accessLevel: 'free' | 'basic' | 'intermediate' | 'premium' | 'paid'
  price?: number // Para acceso individual
  tags: string[]
  thumbnail: string
  chatEnabled: boolean
  recordingEnabled: boolean
  duration?: number // En minutos
}

export interface LiveMessage {
  id: string
  sessionId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'moderator'
  isHighlighted?: boolean
  isHost?: boolean
}

export interface LiveUser {
  id: string
  name: string
  avatar: string
  role: 'viewer' | 'moderator' | 'host'
  isMuted: boolean
  joinedAt: Date
}

interface LiveContextType {
  // Estado de sesiones
  liveSessions: LiveSession[]
  currentSession: LiveSession | null
  
  // Estado de chat
  liveMessages: LiveMessage[]
  messages: LiveMessage[]
  users: LiveUser[]
  currentUser: LiveUser | null
  
  // Estado de conexión
  isConnected: boolean
  isLoading: boolean
  
  // Acciones de sesión
  joinSession: (sessionId: string) => Promise<boolean>
  leaveSession: (sessionId?: string) => void
  createSession: (sessionData: Partial<LiveSession>) => Promise<string | null>
  endSession: (sessionId: string) => Promise<boolean>
  
  // Acciones de chat
  sendMessage: (sessionId: string, message: string) => void
  deleteMessage: (messageId: string) => void
  
  // Acciones de moderación
  muteUser: (userId: string) => void
  kickUser: (userId: string) => void
  toggleChat: () => void
  
  // Utilidades
  canAccessSession: (session: LiveSession) => boolean
  getActiveSessions: () => LiveSession[]
  getSessionsByCategory: (category: string) => LiveSession[]
}

// Mock messages para las sesiones
const mockMessages: LiveMessage[] = [
  {
    id: '1',
    sessionId: '1',
    userId: 'user-1',
    userName: 'Ana López',
    userAvatar: '/avatars/ana.jpg',
    content: '¡Qué hermosa sesión! Me siento muy relajada 🧘‍♀️',
    timestamp: new Date(Date.now() - 5 * 60000),
    type: 'message',
    isHost: false
  },
  {
    id: '2',
    sessionId: '1',
    userId: 'instructor-1',
    userName: 'María González',
    userAvatar: '/avatars/maria.jpg',
    content: 'Gracias Ana, me alegra mucho saber que te está sirviendo esta práctica',
    timestamp: new Date(Date.now() - 4 * 60000),
    type: 'message',
    isHost: true
  },
  {
    id: '3',
    sessionId: '2',
    userId: 'user-2',
    userName: 'Carlos Ruiz',
    userAvatar: '/avatars/carlos.jpg',
    content: 'Las cartas están muy claras hoy, increíble energía ✨',
    timestamp: new Date(Date.now() - 3 * 60000),
    type: 'message',
    isHost: false
  },
  {
    id: '4',
    sessionId: '3',
    userId: 'user-3',
    userName: 'Laura Silva',
    userAvatar: '/avatars/laura.jpg',
    content: 'Excelente consulta, muy reveladora',
    timestamp: new Date(Date.now() - 2 * 60000),
    type: 'message',
    isHost: false
  }
]

const LiveContext = createContext<LiveContextType | undefined>(undefined)

// Mock data para desarrollo
const mockLiveSessions: LiveSession[] = [
  {
    id: '1',
    hostId: 'instructor-1',
    hostName: 'María González',
    hostAvatar: '/avatars/maria.jpg',
    title: 'Meditación Guiada en Vivo: Conectando con tu Alma',
    description: 'Una sesión íntima de meditación para conectar con tu esencia interior y encontrar paz en medio del caos diario.',
    category: 'terapia',
    isLive: true,
    startTime: new Date(Date.now() - 15 * 60000), // Hace 15 minutos
    viewers: 23,
    maxViewers: 100,
    accessLevel: 'basic',
    tags: ['meditación', 'mindfulness', 'relajación'],
    thumbnail: '/live-thumbnails/meditation.jpg',
    chatEnabled: true,
    recordingEnabled: true,
    duration: 60
  },
  {
    id: '2',
    hostId: 'instructor-2',
    hostName: 'Carlos Mendoza',
    hostAvatar: '/avatars/carlos.jpg',
    title: 'Taller de Tarot: Interpretación Avanzada en Tiempo Real',
    description: 'Aprende técnicas avanzadas de lectura de tarot mientras vemos casos reales y respondemos preguntas.',
    category: 'curso',
    isLive: true,
    startTime: new Date(Date.now() - 30 * 60000), // Hace 30 minutos
    viewers: 45,
    maxViewers: 50,
    accessLevel: 'intermediate',
    tags: ['tarot', 'adivinación', 'espiritualidad'],
    thumbnail: '/live-thumbnails/tarot.jpg',
    chatEnabled: true,
    recordingEnabled: false,
    duration: 90
  },
  {
    id: '3',
    hostId: 'instructor-3',
    hostName: 'Ana Rodríguez',
    hostAvatar: '/avatars/ana.jpg',
    title: 'Consulta Abierta: Preguntas sobre Desarrollo Espiritual',
    description: 'Sesión de preguntas y respuestas sobre cualquier tema relacionado con crecimiento personal.',
    category: 'consulta',
    isLive: true,
    startTime: new Date(Date.now() - 5 * 60000), // Hace 5 minutos
    viewers: 12,
    maxViewers: 30,
    accessLevel: 'premium',
    tags: ['consulta', 'q&a', 'desarrollo personal'],
    thumbnail: '/live-thumbnails/consultation.jpg',
    chatEnabled: true,
    recordingEnabled: true,
    duration: 45
  }
]

interface LiveProviderProps {
  children: ReactNode
}

export function LiveProvider({ children }: LiveProviderProps) {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(mockLiveSessions)
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null)
  const [messages, setMessages] = useState<LiveMessage[]>(mockMessages)
  const [users, setUsers] = useState<LiveUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock user para desarrollo
  const currentUser: LiveUser | null = {
    id: 'current-user',
    name: 'Tú',
    avatar: '/avatars/default.jpg',
    role: 'viewer',
    isMuted: false,
    joinedAt: new Date()
  }

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSessions(prev => prev.map(session => ({
        ...session,
        viewers: session.viewers + Math.floor(Math.random() * 3) - 1, // +/- random viewers
      })))
    }, 10000) // Actualizar cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const joinSession = async (sessionId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const session = liveSessions.find(s => s.id === sessionId)
      if (session) {
        setCurrentSession(session)
        setIsConnected(true)
        
        // Mock inicial de mensajes
        setMessages([
          {
            id: '1',
            sessionId,
            userId: 'system',
            userName: 'Sistema',
            userAvatar: '',
            content: 'Bienvenido a la sesión en vivo',
            timestamp: new Date(),
            type: 'system'
          }
        ])
        
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch {
      setIsLoading(false)
      return false
    }
  }

  const leaveSession = () => {
    setCurrentSession(null)
    setIsConnected(false)
    setMessages([])
    setUsers([])
  }

  const createSession = async (sessionData: Partial<LiveSession>): Promise<string | null> => {
    setIsLoading(true)
    try {
      // Simular creación de sesión
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newSession: LiveSession = {
        id: Date.now().toString(),
        hostId: 'current-user',
        hostName: 'Usuario Actual',
        hostAvatar: '/avatars/default.jpg',
        title: sessionData.title || 'Nueva Sesión',
        description: sessionData.description || '',
        category: sessionData.category || 'curso',
        isLive: true,
        startTime: new Date(),
        viewers: 0,
        maxViewers: sessionData.maxViewers || 100,
        accessLevel: sessionData.accessLevel || 'free',
        price: sessionData.price,
        tags: sessionData.tags || [],
        thumbnail: sessionData.thumbnail || '/live-thumbnails/default.jpg',
        chatEnabled: true,
        recordingEnabled: false,
        ...sessionData
      }
      
      setLiveSessions(prev => [newSession, ...prev])
      setIsLoading(false)
      return newSession.id
    } catch {
      setIsLoading(false)
      return null
    }
  }

  const endSession = async (sessionId: string): Promise<boolean> => {
    try {
      setLiveSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSession?.id === sessionId) {
        leaveSession()
      }
      return true
    } catch {
      return false
    }
  }

  const sendMessage = (sessionId: string, message: string) => {
    const newMessage: LiveMessage = {
      id: Date.now().toString(),
      sessionId,
      userId: 'current-user',
      userName: 'Tú',
      userAvatar: '/avatars/default.jpg',
      content: message,
      timestamp: new Date(),
      type: 'message'
    }
    
    setMessages(prev => [...prev, newMessage])
  }

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  const muteUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isMuted: true } : user
    ))
  }

  const kickUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const toggleChat = () => {
    if (!currentSession) return
    // Implementar toggle del chat
  }

  const canAccessSession = (_session: LiveSession): boolean => {
    // Aquí implementar lógica de acceso basada en plan del usuario
    // Por ahora, acceso libre a todo
    return true
  }

  const getActiveSessions = (): LiveSession[] => {
    return liveSessions.filter(session => session.isLive)
  }

  const getSessionsByCategory = (category: string): LiveSession[] => {
    return liveSessions.filter(session => 
      session.category === category && session.isLive
    )
  }

  const value: LiveContextType = {
    liveSessions,
    currentSession,
    liveMessages: messages,
    messages,
    users,
    currentUser,
    isConnected,
    isLoading,
    joinSession,
    leaveSession,
    createSession,
    endSession,
    sendMessage,
    deleteMessage,
    muteUser,
    kickUser,
    toggleChat,
    canAccessSession,
    getActiveSessions,
    getSessionsByCategory
  }

  return (
    <LiveContext.Provider value={value}>
      {children}
    </LiveContext.Provider>
  )
}

export function useLive() {
  const context = useContext(LiveContext)
  if (context === undefined) {
    throw new Error('useLive must be used within a LiveProvider')
  }
  return context
}