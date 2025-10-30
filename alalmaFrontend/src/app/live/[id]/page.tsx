'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Radio, 
  Users, 
  MessageSquare, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  ArrowLeft,
  Heart,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react'
import { useLive } from '@/contexts/LiveContext'
import { AnimatedEntry } from '@/components/ui/AnimatedContainer'

export default function LiveSessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string
  
  const {
    liveSessions,
    liveMessages,
    joinSession,
    leaveSession,
    sendMessage,
    canAccessSession
  } = useLive()

  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Buscar la sesión actual
  const session = liveSessions.find(s => s.id === sessionId)
  const sessionMessages = liveMessages.filter(m => m.sessionId === sessionId)

  useEffect(() => {
    if (!session) {
      router.push('/live')
      return
    }

    // Unirse automáticamente a la sesión
    const connect = async () => {
      const success = await joinSession(sessionId)
      setIsConnected(success)
    }
    
    connect()

    // Cleanup al salir
    return () => {
      if (isConnected) {
        leaveSession(sessionId)
      }
    }
  }, [session, sessionId, joinSession, leaveSession, router, isConnected])

  // Auto-scroll del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [sessionMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    await sendMessage(sessionId, newMessage)
    setNewMessage('')
  }

  const handleLeaveSession = async () => {
    await leaveSession(sessionId)
    router.push('/live')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Sesión no encontrada</h2>
          <p className="text-gray-400 mb-6">La sesión en vivo no existe o ha terminado.</p>
          <Button onClick={() => router.push('/live')}>
            Volver a Sesiones Live
          </Button>
        </div>
      </div>
    )
  }

  if (!canAccessSession(session)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
          <p className="text-gray-400 mb-6">
            {session.accessLevel === 'paid' 
              ? `Esta sesión requiere un pago de $${session.price} USD para acceder.`
              : 'Tu plan actual no incluye acceso a esta sesión en vivo.'
            }
          </p>
          <div className="space-x-3">
            <Button variant="outline" onClick={() => router.push('/live')}>
              Volver
            </Button>
            <Button onClick={() => router.push('/plans')}>
              Ver Planes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header de la sesión */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/live')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-400">EN VIVO</span>
              </div>
              
              <div className="h-6 w-px bg-gray-600"></div>
              
              <div>
                <h1 className="font-semibold">{session.title}</h1>
                <p className="text-sm text-gray-400">{session.hostName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{session.viewers}</span>
            </div>

            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Video principal */}
        <div className={`flex-1 relative bg-black ${isChatOpen ? 'mr-80' : ''} transition-all duration-300`}>
          {/* Video container */}
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              poster={session.thumbnail}
            >
              {/* Aquí iría el stream real */}
            </video>

            {/* Overlay de carga/conectando */}
            {!isConnected && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Conectando a la sesión...</p>
                  <p className="text-gray-400">Esto puede tomar unos segundos</p>
                </div>
              </div>
            )}

            {/* Controles de video */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Controles de audio/video del usuario (si es interactivo) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className={isMuted ? 'text-red-400' : 'text-white'}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={isVideoOff ? 'text-red-400' : 'text-white'}
                    >
                      {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    {/* Control de volumen */}
                    <div 
                      className="relative"
                      onMouseEnter={() => setIsVolumeVisible(true)}
                      onMouseLeave={() => setIsVolumeVisible(false)}
                    >
                      <Button variant="ghost" size="sm">
                        {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      
                      {isVolumeVisible && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 rounded-lg p-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLeaveSession}
                    >
                      <PhoneOff className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de chat */}
        {isChatOpen && (
          <AnimatedEntry direction="right" className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat en vivo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-gray-400">{sessionMessages.length} mensajes</p>
            </div>

            {/* Mensajes */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {sessionMessages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-white">
                      {message.userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">{message.userName}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {message.isHost && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-100 break-words">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  maxLength={500}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </AnimatedEntry>
        )}
      </div>
    </div>
  )
}