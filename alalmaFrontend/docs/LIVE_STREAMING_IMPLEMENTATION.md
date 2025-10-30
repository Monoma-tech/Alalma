# 🎥 Live Streaming Implementation Guide - AlAlma Platform

## 📋 Overview

Este documento detalla la implementación completa del sistema de live streaming para la plataforma AlAlma, incluyendo arquitectura frontend/backend, integración con servicios de terceros, y consideraciones técnicas.

## 🏗️ Current State (Frontend Implementation)

### ✅ Already Implemented

- **Frontend Architecture**: Sistema completo de UI/UX para live streaming
- **React Context**: `LiveContext` y `LivePermissionsContext` para manejo de estado global
- **Pages Structure**:
  - `/live` - Lista de sesiones activas
  - `/live/[id]` - Página de streaming individual
  - `/live/create` - Crear nueva sesión
- **Components**: Sistema completo de componentes reutilizables
- **Mock Data**: Datos simulados para desarrollo y testing
- **Access Control**: Sistema de permisos completo basado en roles y planes
- **🆕 User Access Points**: Multiple entry points para facilitar acceso
  - FloatingLiveButton con menu expandible
  - Navbar integration (desktop + mobile)
  - Vendor dashboard integration
- **🆕 Permission System**: Control granular con upgrade modals automáticos
- **🆕 Responsive Design**: Optimizado para móvil con scroll behavior
- **🆕 Mock Live Sessions**: 3 sesiones activas simuladas con different categories

### 📁 Frontend File Structure
```
src/
├── contexts/
│   ├── LiveContext.tsx             # Estado global de live streaming
│   └── LivePermissionsContext.tsx # Sistema de permisos y access control
├── app/
│   ├── live/
│   │   ├── page.tsx               # Lista de sesiones
│   │   ├── [id]/page.tsx          # Sesión individual
│   │   └── create/page.tsx        # Crear sesión
│   ├── vendor/dashboard/page.tsx   # Dashboard con live streaming access
│   └── layout.tsx                 # Layout con LiveUpgradeModal
├── components/
│   ├── live/
│   │   ├── FloatingLiveButton.tsx # 🆕 Botón flotante para acceso rápido
│   │   └── LiveUpgradeModal.tsx   # 🆕 Modal de upgrade automático
│   ├── layout/
│   │   └── GlobalNavbar.tsx       # 🆕 Navbar con live streaming options
│   └── ui/
       └── AnimatedContainer.tsx   # Componentes de animación
```

---

## 🎯 Implementation Roadmap

## Phase 1: Backend Infrastructure

### 1.1 Database Schema

```sql
-- Tabla de sesiones live
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('curso', 'terapia', 'herramienta', 'consulta')),
    access_level VARCHAR(20) CHECK (access_level IN ('free', 'basic', 'intermediate', 'premium', 'paid')),
    price DECIMAL(10,2), -- Para acceso individual
    max_viewers INTEGER DEFAULT 100,
    current_viewers INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    thumbnail_url VARCHAR(500),
    tags TEXT[], -- Array de tags
    chat_enabled BOOLEAN DEFAULT TRUE,
    recording_enabled BOOLEAN DEFAULT FALSE,
    agora_channel_name VARCHAR(255), -- Canal de Agora
    agora_token TEXT, -- Token temporal de Agora
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes de chat
CREATE TABLE live_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'message' CHECK (message_type IN ('message', 'system', 'moderator')),
    is_highlighted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de participantes en sesión
CREATE TABLE live_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('host', 'moderator', 'viewer')),
    is_muted BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    UNIQUE(session_id, user_id)
);

-- Índices para optimización
CREATE INDEX idx_live_sessions_is_live ON live_sessions(is_live);
CREATE INDEX idx_live_sessions_category ON live_sessions(category);
CREATE INDEX idx_live_sessions_host_id ON live_sessions(host_id);
CREATE INDEX idx_live_messages_session_id ON live_messages(session_id);
CREATE INDEX idx_live_participants_session_id ON live_participants(session_id);
```

### 1.2 API Endpoints

```typescript
// Backend API Structure

// GET /api/live/sessions - Obtener sesiones activas
interface LiveSessionsResponse {
  sessions: LiveSession[]
  total: number
  page: number
}

// POST /api/live/sessions - Crear nueva sesión
interface CreateSessionRequest {
  title: string
  description?: string
  category: 'curso' | 'terapia' | 'herramienta' | 'consulta'
  accessLevel: 'free' | 'basic' | 'intermediate' | 'premium' | 'paid'
  price?: number
  maxViewers: number
  tags: string[]
  chatEnabled: boolean
  recordingEnabled: boolean
}

// GET /api/live/sessions/:id - Obtener sesión específica
// PUT /api/live/sessions/:id - Actualizar sesión
// DELETE /api/live/sessions/:id - Eliminar sesión

// POST /api/live/sessions/:id/join - Unirse a sesión
interface JoinSessionRequest {
  sessionId: string
}

interface JoinSessionResponse {
  success: boolean
  agoraToken: string
  channelName: string
  uid: number
}

// POST /api/live/sessions/:id/leave - Salir de sesión
// GET /api/live/sessions/:id/messages - Obtener mensajes del chat
// POST /api/live/sessions/:id/messages - Enviar mensaje

// WebSocket Events para tiempo real
interface WebSocketEvents {
  'session:started': { sessionId: string }
  'session:ended': { sessionId: string }
  'message:new': { sessionId: string, message: LiveMessage }
  'user:joined': { sessionId: string, user: LiveUser }
  'user:left': { sessionId: string, userId: string }
  'viewer:count': { sessionId: string, count: number }
}
```

### 1.3 Backend Services Structure

```typescript
// services/liveStreamingService.ts
class LiveStreamingService {
  // Gestión de sesiones
  async createSession(hostId: string, sessionData: CreateSessionRequest): Promise<LiveSession>
  async getActiveSessions(filters?: SessionFilters): Promise<LiveSession[]>
  async getSessionById(sessionId: string): Promise<LiveSession | null>
  async updateSession(sessionId: string, updates: Partial<LiveSession>): Promise<LiveSession>
  async endSession(sessionId: string): Promise<boolean>

  // Gestión de participantes
  async joinSession(sessionId: string, userId: string): Promise<JoinResult>
  async leaveSession(sessionId: string, userId: string): Promise<boolean>
  async getSessionParticipants(sessionId: string): Promise<LiveUser[]>

  // Gestión de chat
  async sendMessage(sessionId: string, userId: string, content: string): Promise<LiveMessage>
  async getSessionMessages(sessionId: string, page?: number): Promise<LiveMessage[]>
  async deleteMessage(messageId: string): Promise<boolean>

  // Integración con Agora
  async generateAgoraToken(channelName: string, uid: number, role: 'host' | 'audience'): Promise<string>
  async createAgoraChannel(sessionId: string): Promise<string>
}

// services/agoraService.ts
class AgoraService {
  private appId: string
  private appCertificate: string

  async generateToken(channelName: string, uid: number, role: RtcRole): Promise<string>
  async createChannel(channelName: string): Promise<ChannelInfo>
  async getChannelUsers(channelName: string): Promise<UserInfo[]>
}
```

---

## Phase 2: Agora.io Integration

### 2.1 Agora Setup & Configuration

#### 2.1.1 Account & Credentials
```bash
# 1. Crear cuenta en https://agora.io
# 2. Crear nuevo proyecto
# 3. Obtener credenciales:
AGORA_APP_ID=your_app_id_here
AGORA_APP_CERTIFICATE=your_app_certificate_here
```

#### 2.1.2 Backend Token Server
```typescript
// utils/agoraTokenGenerator.ts
import { RtcTokenBuilder, RtcRole } from 'agora-token'

export class AgoraTokenGenerator {
  private appId: string
  private appCertificate: string

  constructor(appId: string, appCertificate: string) {
    this.appId = appId
    this.appCertificate = appCertificate
  }

  generateToken(channelName: string, uid: number, role: 'host' | 'audience'): string {
    const expirationTimeInSeconds = 3600 // 1 hora
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER

    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      agoraRole,
      privilegeExpiredTs
    )
  }
}
```

### 2.2 Frontend Integration

#### 2.2.1 Package Installation
```bash
npm install agora-rtc-react agora-rtc-sdk-ng
```

#### 2.2.2 Agora React Hook
```typescript
// hooks/useAgoraRTC.ts
import { useRTCClient, useLocalCameraTrack, useLocalMicrophoneTrack, useRemoteUsers } from 'agora-rtc-react'

export const useAgoraRTC = (appId: string) => {
  const agoraClient = useRTCClient()
  const { localCameraTrack } = useLocalCameraTrack()
  const { localMicrophoneTrack } = useLocalMicrophoneTrack()
  const remoteUsers = useRemoteUsers()

  const joinChannel = async (token: string, channelName: string, uid: number) => {
    await agoraClient.join(appId, channelName, token, uid)
    
    if (localCameraTrack && localMicrophoneTrack) {
      await agoraClient.publish([localCameraTrack, localMicrophoneTrack])
    }
  }

  const leaveChannel = async () => {
    await agoraClient.leave()
    localCameraTrack?.close()
    localMicrophoneTrack?.close()
  }

  return {
    agoraClient,
    localCameraTrack,
    localMicrophoneTrack,
    remoteUsers,
    joinChannel,
    leaveChannel
  }
}
```

#### 2.2.3 Updated LiveContext with Agora
```typescript
// contexts/LiveContext.tsx - Enhanced version
export function LiveProvider({ children }: LiveProviderProps) {
  const [agoraClient, setAgoraClient] = useState<IAgoraRTCClient | null>(null)
  const [localTracks, setLocalTracks] = useState({
    videoTrack: null as ILocalVideoTrack | null,
    audioTrack: null as ILocalAudioTrack | null
  })

  const joinSession = async (sessionId: string): Promise<boolean> => {
    try {
      // 1. Solicitar token al backend
      const response = await fetch(`/api/live/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const { agoraToken, channelName, uid } = await response.json()

      // 2. Inicializar cliente Agora
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      
      // 3. Unirse al canal
      await client.join(AGORA_APP_ID, channelName, agoraToken, uid)
      
      // 4. Crear tracks locales (solo para host)
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      
      // 5. Publicar tracks
      await client.publish([audioTrack, videoTrack])
      
      setAgoraClient(client)
      setLocalTracks({ audioTrack, videoTrack })
      setIsConnected(true)
      
      return true
    } catch (error) {
      console.error('Error joining session:', error)
      return false
    }
  }

  // ... resto de la implementación
}
```

### 2.3 Video Components Update

```typescript
// components/live/VideoPlayer.tsx
interface VideoPlayerProps {
  track: IRemoteVideoTrack | ILocalVideoTrack | null
  uid: number
  isLocal?: boolean
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ track, uid, isLocal = false }) => {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (track && videoRef.current) {
      track.play(videoRef.current)
    }

    return () => {
      track?.stop()
    }
  }, [track])

  return (
    <div 
      ref={videoRef} 
      className={`w-full h-full ${isLocal ? 'transform scale-x-[-1]' : ''}`}
      style={{ background: '#000' }}
    />
  )
}

// components/live/LiveStreamingRoom.tsx
export const LiveStreamingRoom: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { agoraClient, localTracks, remoteUsers, joinChannel, leaveChannel } = useAgoraRTC(AGORA_APP_ID)
  const [isHost, setIsHost] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const handleJoin = async () => {
    const response = await fetch(`/api/live/sessions/${sessionId}/join`, { method: 'POST' })
    const { agoraToken, channelName, uid, role } = await response.json()
    
    setIsHost(role === 'host')
    await joinChannel(agoraToken, channelName, uid)
  }

  const toggleMute = async () => {
    if (localTracks.audioTrack) {
      await localTracks.audioTrack.setEnabled(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = async () => {
    if (localTracks.videoTrack) {
      await localTracks.videoTrack.setEnabled(!isVideoOff)
      setIsVideoOff(!isVideoOff)
    }
  }

  return (
    <div className="live-streaming-room">
      {/* Host Video */}
      {isHost && localTracks.videoTrack && (
        <VideoPlayer track={localTracks.videoTrack} uid={0} isLocal={true} />
      )}
      
      {/* Remote Users Videos */}
      {remoteUsers.map((user) => (
        <VideoPlayer key={user.uid} track={user.videoTrack} uid={user.uid} />
      ))}
      
      {/* Controls */}
      <div className="controls">
        <button onClick={toggleMute}>
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button onClick={toggleVideo}>
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>
        <button onClick={leaveChannel}>
          <PhoneOff />
        </button>
      </div>
    </div>
  )
}
```

---

## Phase 3: Real-time Chat Implementation

### 3.1 WebSocket Backend Setup

```typescript
// websocket/liveStreamingSocket.ts
import { Server as SocketIOServer } from 'socket.io'

export class LiveStreamingSocket {
  private io: SocketIOServer

  constructor(io: SocketIOServer) {
    this.io = io
    this.setupHandlers()
  }

  private setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Unirse a sala de sesión
      socket.on('join:session', async ({ sessionId, userId }) => {
        socket.join(`session:${sessionId}`)
        
        // Notificar a otros usuarios
        socket.to(`session:${sessionId}`).emit('user:joined', {
          userId,
          socketId: socket.id
        })
        
        // Actualizar contador de viewers
        const viewerCount = await this.getSessionViewerCount(sessionId)
        this.io.to(`session:${sessionId}`).emit('viewer:count', { count: viewerCount })
      })

      // Enviar mensaje
      socket.on('message:send', async ({ sessionId, content, userId }) => {
        const message = await this.saveMessage(sessionId, userId, content)
        
        this.io.to(`session:${sessionId}`).emit('message:new', message)
      })

      // Salir de sesión
      socket.on('leave:session', async ({ sessionId, userId }) => {
        socket.leave(`session:${sessionId}`)
        
        socket.to(`session:${sessionId}`).emit('user:left', { userId })
        
        const viewerCount = await this.getSessionViewerCount(sessionId)
        this.io.to(`session:${sessionId}`).emit('viewer:count', { count: viewerCount })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }

  private async getSessionViewerCount(sessionId: string): Promise<number> {
    const sockets = await this.io.in(`session:${sessionId}`).fetchSockets()
    return sockets.length
  }

  private async saveMessage(sessionId: string, userId: string, content: string): Promise<LiveMessage> {
    // Guardar mensaje en base de datos
    // Retornar mensaje formateado
  }
}
```

### 3.2 Frontend WebSocket Integration

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useWebSocket = (sessionId: string) => {
  const socketRef = useRef<Socket | null>(null)
  const { addMessage, updateViewerCount } = useLive()

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001')
    
    const socket = socketRef.current

    // Unirse a la sesión
    socket.emit('join:session', { sessionId, userId: 'current-user' })

    // Listeners
    socket.on('message:new', (message: LiveMessage) => {
      addMessage(message)
    })

    socket.on('viewer:count', ({ count }: { count: number }) => {
      updateViewerCount(sessionId, count)
    })

    socket.on('user:joined', ({ userId }: { userId: string }) => {
      console.log('User joined:', userId)
    })

    socket.on('user:left', ({ userId }: { userId: string }) => {
      console.log('User left:', userId)
    })

    return () => {
      socket.emit('leave:session', { sessionId, userId: 'current-user' })
      socket.disconnect()
    }
  }, [sessionId])

  const sendMessage = (content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('message:send', {
        sessionId,
        content,
        userId: 'current-user'
      })
    }
  }

  return { sendMessage }
}
```

---

## Phase 4: Payment Integration

### 4.1 Stripe Integration for Individual Sessions

```typescript
// Backend: Payment processing
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export class PaymentService {
  async createPaymentIntent(sessionId: string, userId: string): Promise<string> {
    const session = await LiveSession.findById(sessionId)
    
    if (!session || session.accessLevel !== 'paid') {
      throw new Error('Session not available for payment')
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(session.price * 100), // Convertir a centavos
      currency: 'usd',
      metadata: {
        sessionId,
        userId,
        type: 'live_session_access'
      }
    })

    return paymentIntent.client_secret!
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      // Otorgar acceso a la sesión
      await this.grantSessionAccess(
        paymentIntent.metadata.sessionId,
        paymentIntent.metadata.userId
      )
      return true
    }
    
    return false
  }
}
```

### 4.2 Frontend Payment Component

```typescript
// components/payments/SessionPayment.tsx
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const SessionPayment: React.FC<{ sessionId: string, price: number }> = ({ sessionId, price }) => {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })
    .then(res => res.json())
    .then(data => setClientSecret(data.clientSecret))
  }, [sessionId])

  return (
    <div className="payment-modal">
      <h3>Acceder a Sesión - ${price} USD</h3>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm sessionId={sessionId} />
        </Elements>
      )}
    </div>
  )
}
```

---

## Phase 5: Security & Performance

### 5.1 Security Considerations

```typescript
// Security measures
export const SecurityMiddleware = {
  // Validar acceso a sesión
  validateSessionAccess: async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.params
    const userId = req.user.id
    
    const hasAccess = await checkSessionAccess(sessionId, userId)
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    next()
  },

  // Rate limiting para mensajes
  messageRateLimit: rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10, // 10 mensajes por minuto
    message: 'Too many messages sent'
  }),

  // Validar tokens de Agora
  validateAgoraToken: (token: string, channelName: string): boolean => {
    // Implementar validación de token
    return true
  }
}
```

### 5.2 Performance Optimizations

```typescript
// Caching strategy
export class CacheService {
  // Cache de sesiones activas
  async getActiveSessions(): Promise<LiveSession[]> {
    const cacheKey = 'live:active-sessions'
    
    let sessions = await redis.get(cacheKey)
    
    if (!sessions) {
      sessions = await LiveSession.find({ isLive: true })
      await redis.setex(cacheKey, 30, JSON.stringify(sessions)) // Cache por 30 segundos
    }
    
    return JSON.parse(sessions)
  }

  // Cache de mensajes de chat
  async getSessionMessages(sessionId: string, page: number = 1): Promise<LiveMessage[]> {
    const cacheKey = `live:messages:${sessionId}:${page}`
    
    let messages = await redis.get(cacheKey)
    
    if (!messages) {
      messages = await LiveMessage.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(50)
        .skip((page - 1) * 50)
      
      await redis.setex(cacheKey, 60, JSON.stringify(messages))
    }
    
    return JSON.parse(messages)
  }
}
```

---

## 🚀 Deployment & Infrastructure

### 6.1 Environment Variables

```bash
# .env.production
AGORA_APP_ID=your_production_app_id
AGORA_APP_CERTIFICATE=your_production_certificate
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
REDIS_URL=redis://your-redis-url
DATABASE_URL=postgresql://your-db-url
WEBSOCKET_PORT=3001
```

### 6.2 Docker Configuration

```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000 3001

CMD ["npm", "run", "start:prod"]
```

### 6.3 Load Balancing Considerations

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: alalma
      POSTGRES_USER: alalma_user
      POSTGRES_PASSWORD: secure_password
  
  redis:
    image: redis:7-alpine
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## 📊 Monitoring & Analytics

### 7.1 Metrics to Track

```typescript
// Analytics events
export const LiveStreamingAnalytics = {
  // Métricas de sesión
  trackSessionStart: (sessionId: string, hostId: string) => {
    analytics.track('Live Session Started', {
      sessionId,
      hostId,
      timestamp: new Date()
    })
  },

  trackUserJoin: (sessionId: string, userId: string) => {
    analytics.track('User Joined Live Session', {
      sessionId,
      userId,
      timestamp: new Date()
    })
  },

  trackMessageSent: (sessionId: string, userId: string) => {
    analytics.track('Live Chat Message Sent', {
      sessionId,
      userId,
      timestamp: new Date()
    })
  },

  // Métricas de rendimiento
  trackStreamQuality: (sessionId: string, quality: 'poor' | 'fair' | 'good' | 'excellent') => {
    analytics.track('Stream Quality', {
      sessionId,
      quality,
      timestamp: new Date()
    })
  }
}
```

---

## 💰 Cost Estimation

### Agora.io Pricing
- **Audio/Video**: $0.99 por 1,000 minutos
- **Chat**: Incluido
- **Recording**: $4.99 por 1,000 minutos

### Example Monthly Costs (1000 active users)
- 10 sesiones diarias de 1 hora cada una
- Promedio 20 participantes por sesión
- Total: ~6,000 minutos/mes
- **Costo estimado**: $6-10 USD/mes

### Alternatives Comparison
| Service | Cost (per 1K minutes) | Features | Pros | Cons |
|---------|----------------------|----------|------|------|
| Agora.io | $0.99 | Video, Audio, Chat | Fácil integración | Costo medio |
| Twilio Video | $1.50 | Video, Audio | Muy confiable | Más caro |
| AWS IVS | $0.015/hour | Live streaming | Escalable | Más complejo |
| WebRTC | Free | P2P streaming | Gratuito | Complejo setup |

---

## 🔧 Testing Strategy

### 8.1 Unit Tests

```typescript
// tests/liveStreaming.test.ts
describe('Live Streaming Service', () => {
  test('should create new live session', async () => {
    const sessionData = {
      title: 'Test Session',
      category: 'curso',
      accessLevel: 'free'
    }
    
    const session = await liveStreamingService.createSession('host-1', sessionData)
    
    expect(session.id).toBeDefined()
    expect(session.title).toBe('Test Session')
    expect(session.isLive).toBe(true)
  })

  test('should generate valid Agora token', async () => {
    const token = await agoraService.generateToken('test-channel', 12345, 'host')
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})
```

### 8.2 Integration Tests

```typescript
// tests/integration/liveStreamingAPI.test.ts
describe('Live Streaming API', () => {
  test('should join session with valid access', async () => {
    const response = await request(app)
      .post('/api/live/sessions/test-session-id/join')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200)
    
    expect(response.body.agoraToken).toBeDefined()
    expect(response.body.channelName).toBeDefined()
  })
})
```

---

## 📚 Documentation & Resources

### API Documentation
- Complete OpenAPI/Swagger documentation
- Postman collection for testing
- SDK documentation for mobile apps

### Developer Resources
- Setup guides for development environment
- Code examples and snippets
- Troubleshooting guides

### External Resources
- [Agora.io Documentation](https://docs.agora.io/)
- [Stripe Integration Guide](https://stripe.com/docs)
- [WebSocket.io Documentation](https://socket.io/docs/)

---

## 🎯 Success Metrics

### Technical Metrics
- **Uptime**: >99.9%
- **Latency**: <200ms for chat messages
- **Video Quality**: 720p minimum, 1080p preferred
- **Concurrent Users**: Support for 10,000+ simultaneous users

### Business Metrics
- **User Engagement**: Average session duration >30 minutes
- **Revenue**: Track paid session conversions
- **Growth**: Monitor new session creation rate

---

## 📝 Next Steps

1. **Phase 1**: Backend infrastructure (2-3 weeks)
2. **Phase 2**: Agora integration (1-2 weeks)
3. **Phase 3**: Real-time chat (1 week)
4. **Phase 4**: Payment integration (1-2 weeks)
5. **Phase 5**: Security & performance (1 week)
6. **Testing & Deployment**: (1-2 weeks)

**Total Estimated Time**: 7-11 weeks for complete implementation

---

## 🤝 Team Responsibilities

### Frontend Team
- Integration with existing UI components
- Real-time state management
- Payment flow implementation
- Mobile responsiveness

### Backend Team
- API development
- Database schema implementation
- WebSocket server setup
- Agora token server
- Security implementation

### DevOps Team
- Infrastructure setup
- Monitoring implementation
- Deployment automation
- Load balancing configuration

This comprehensive guide provides everything needed to implement a production-ready live streaming system for AlAlma! 🚀