# 🏗️ Backend Architecture Plan - AlAlma Platform

## 📋 Overview

Este documento define la arquitectura backend completa necesaria para soportar todas las funcionalidades de la plataforma AlAlma, incluyendo live streaming, ecommerce, gestión de usuarios, y sistema de pagos.

---

## 🎯 Stack Tecnológico Recomendado

### **Opción 1: Stack Completo Premium (Recomendado)**
```
Frontend: Vercel (✅ Ya implementado)
Backend: Next.js 15 API Routes + Prisma ORM
Base de Datos: PostgreSQL (Supabase)
Autenticación: NextAuth.js
Almacenamiento: Cloudinary
Live Streaming: Agora.io
Pagos: Stripe
Email: Resend
WebSocket: Socket.io
Monitoreo: Sentry
CDN: Cloudinary + Vercel Edge

Costo estimado: $50-150 USD/mes
```

### **Opción 2: Stack Económico**
```
Frontend: Vercel (✅ Ya implementado)
Backend: Railway + Node.js/Express
Base de Datos: Railway PostgreSQL
Autenticación: JWT + bcrypt
Almacenamiento: Cloudinary Free Tier
Live Streaming: Agora.io Free Tier
Pagos: Stripe
Email: Nodemailer + Gmail
WebSocket: Socket.io
Monitoreo: LogRocket Free

Costo estimado: $20-50 USD/mes
```

---

## 🗄️ Base de Datos - Esquema Completo

### **Core Tables**

#### **users**
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
name (VARCHAR)
avatar_url (VARCHAR)
role (ENUM: customer, vendor, admin)
plan_id (UUID, FK)
created_at, updated_at (TIMESTAMP)
```

#### **plans**
```sql
id (UUID, PK)
name (VARCHAR) -- Explorador, Buscador, Guía, Maestro
price (DECIMAL)
currency (VARCHAR, default: USD)
features (JSONB)
max_live_duration (INTEGER)
max_live_viewers (INTEGER)
can_record (BOOLEAN)
can_moderate (BOOLEAN)
active (BOOLEAN)
```

#### **instructor_profiles**
```sql
id (UUID, PK)
user_id (UUID, FK)
business_name (VARCHAR)
description (TEXT)
specialties (TEXT[])
experience (TEXT)
verification_status (ENUM)
rating (DECIMAL)
total_reviews (INTEGER)
total_students (INTEGER)
total_earnings (DECIMAL)
```

#### **products**
```sql
id (UUID, PK)
vendor_id (UUID, FK)
title (VARCHAR)
description (TEXT)
category (ENUM: curso, terapia, herramienta)
price (DECIMAL)
currency (VARCHAR)
access_level (ENUM: free, basic, intermediate, premium)
thumbnail_url (VARCHAR)
video_url (VARCHAR)
duration (INTEGER)
rating (DECIMAL)
total_reviews (INTEGER)
total_sales (INTEGER)
tags (TEXT[])
status (ENUM: pending, approved, rejected)
```

### **Live Streaming Tables**

#### **live_sessions**
```sql
id (UUID, PK)
host_id (UUID, FK)
title (VARCHAR)
description (TEXT)
category (VARCHAR)
access_level (VARCHAR)
price (DECIMAL) -- Para sesiones pagadas
max_viewers (INTEGER)
current_viewers (INTEGER)
is_live (BOOLEAN)
start_time (TIMESTAMP)
end_time (TIMESTAMP)
thumbnail_url (VARCHAR)
recording_url (VARCHAR)
agora_channel_name (VARCHAR)
agora_token (TEXT)
chat_enabled (BOOLEAN)
recording_enabled (BOOLEAN)
tags (TEXT[])
```

#### **live_messages**
```sql
id (UUID, PK)
session_id (UUID, FK)
user_id (UUID, FK)
content (TEXT)
message_type (ENUM: message, system, moderator)
is_highlighted (BOOLEAN)
created_at (TIMESTAMP)
```

#### **live_participants**
```sql
id (UUID, PK)
session_id (UUID, FK)
user_id (UUID, FK)
role (ENUM: host, moderator, viewer)
is_muted (BOOLEAN)
joined_at (TIMESTAMP)
left_at (TIMESTAMP)
```

### **Ecommerce Tables**

#### **orders**
```sql
id (UUID, PK)
user_id (UUID, FK)
total_amount (DECIMAL)
currency (VARCHAR)
status (ENUM: pending, completed, failed, refunded)
stripe_payment_intent_id (VARCHAR)
created_at (TIMESTAMP)
```

#### **order_items**
```sql
id (UUID, PK)
order_id (UUID, FK)
product_id (UUID, FK)
price (DECIMAL)
quantity (INTEGER)
```

#### **favorites**
```sql
id (UUID, PK)
user_id (UUID, FK)
product_id (UUID, FK)
created_at (TIMESTAMP)
UNIQUE(user_id, product_id)
```

#### **reviews**
```sql
id (UUID, PK)
user_id (UUID, FK)
product_id (UUID, FK)
instructor_id (UUID, FK)
rating (INTEGER CHECK 1-5)
comment (TEXT)
created_at (TIMESTAMP)
```

#### **earnings**
```sql
id (UUID, PK)
vendor_id (UUID, FK)
order_id (UUID, FK)
gross_amount (DECIMAL)
commission_rate (DECIMAL)
commission_amount (DECIMAL)
net_amount (DECIMAL)
status (ENUM: pending, paid, hold)
paid_at (TIMESTAMP)
```

---

## 🔌 API Endpoints Structure

### **Authentication APIs**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### **User Management APIs**
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/avatar/upload
GET    /api/users/favorites
POST   /api/users/favorites
DELETE /api/users/favorites/[id]
GET    /api/users/orders
GET    /api/users/purchases
```

### **Instructor APIs**
```
GET    /api/instructors              // Lista pública
GET    /api/instructors/[id]         // Perfil individual
POST   /api/instructors/register     // Registro como instructor
PUT    /api/instructors/profile      // Actualizar perfil
GET    /api/instructors/dashboard    // Stats del instructor
GET    /api/instructors/earnings     // Ganancias
```

### **Product APIs**
```
GET    /api/products                 // Lista con filtros
GET    /api/products/[id]           // Detalle individual
POST   /api/products                // Crear (solo vendors)
PUT    /api/products/[id]           // Actualizar
DELETE /api/products/[id]           // Eliminar
POST   /api/products/[id]/review    // Agregar review
GET    /api/products/search         // Búsqueda avanzada
```

### **Live Streaming APIs**
```
GET    /api/live/sessions           // Sesiones activas
GET    /api/live/sessions/[id]      // Sesión específica
POST   /api/live/sessions           // Crear sesión
PUT    /api/live/sessions/[id]      // Actualizar sesión
DELETE /api/live/sessions/[id]      // Terminar sesión
POST   /api/live/sessions/[id]/join // Unirse a sesión
POST   /api/live/sessions/[id]/leave// Salir de sesión
GET    /api/live/sessions/[id]/messages // Chat messages
POST   /api/live/sessions/[id]/messages // Enviar mensaje
POST   /api/live/agora/token        // Generar token Agora
```

### **Ecommerce APIs**
```
GET    /api/cart                    // Carrito actual
POST   /api/cart/add               // Agregar producto
PUT    /api/cart/update            // Actualizar cantidad
DELETE /api/cart/remove/[id]       // Remover producto
POST   /api/cart/checkout          // Procesar compra

GET    /api/orders                 // Historial de órdenes
GET    /api/orders/[id]            // Detalle de orden
POST   /api/orders/[id]/refund     // Solicitar reembolso
```

### **Payment APIs**
```
POST   /api/payments/create-intent  // Crear PaymentIntent
POST   /api/payments/confirm        // Confirmar pago
POST   /api/payments/webhook        // Webhook de Stripe
GET    /api/payments/methods        // Métodos de pago guardados
```

### **Admin APIs**
```
GET    /api/admin/dashboard         // Estadísticas generales
GET    /api/admin/users             // Gestión de usuarios
GET    /api/admin/products/pending  // Productos pendientes
PUT    /api/admin/products/[id]/approve
PUT    /api/admin/products/[id]/reject
GET    /api/admin/instructors/pending
PUT    /api/admin/instructors/[id]/verify
```

---

## 🖼️ Image Management - Cloudinary

### **Folder Structure**
```
alalma/
├── users/avatars/          # Avatares de usuario
├── products/thumbnails/    # Miniaturas de productos
├── instructors/profiles/   # Fotos de instructores
├── live/thumbnails/        # Miniaturas de sesiones live
└── content/videos/         # Videos de cursos
```

### **Image Transformations**
```javascript
transformations: {
  avatar: { width: 200, height: 200, crop: 'fill', quality: 'auto' },
  thumbnail: { width: 400, height: 300, crop: 'fill', quality: 'auto' },
  hero: { width: 1200, height: 600, crop: 'fill', quality: 'auto' },
  video_poster: { width: 800, height: 450, crop: 'fill', quality: 'auto' }
}
```

---

## 🎥 Live Streaming Architecture

### **Agora.io Integration**
```javascript
// Token Generation
POST /api/live/agora/token
{
  channelName: string,
  uid: number,
  role: 'host' | 'audience',
  expirationTime: number
}

// Channel Management
- Create channel on session start
- Generate tokens for participants
- Handle participant join/leave events
- Manage recording if enabled
```

### **Real-time Chat**
```javascript
// WebSocket Events
'session:started': { sessionId, hostInfo }
'session:ended': { sessionId }
'message:new': { sessionId, message }
'user:joined': { sessionId, user }
'user:left': { sessionId, userId }
'viewer:count': { sessionId, count }
```

---

## 💰 Payment Integration - Stripe

### **Payment Flow**
```javascript
1. Create PaymentIntent
2. Confirm payment on frontend
3. Handle webhook for completion
4. Update order status
5. Grant product access
6. Calculate vendor earnings
7. Send confirmation emails
```

### **Subscription Management**
```javascript
// Plan Subscriptions
- Create Stripe Customer
- Attach payment method
- Create subscription
- Handle plan changes
- Process renewals via webhooks
```

---

## 🔐 Security Considerations

### **Authentication**
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Account lockout after failed attempts

### **API Security**
- API key authentication for external services
- CORS configuration
- Input validation and sanitization
- SQL injection prevention with Prisma

### **Data Protection**
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper session management
- Regular security audits

---

## 🚀 Deployment Architecture

### **Production Infrastructure**
```
CDN: Cloudinary + Vercel Edge Network
Frontend: Vercel (Multi-region)
Backend APIs: Vercel Serverless Functions
Database: Supabase PostgreSQL (Multi-region)
Live Streaming: Agora.io Global Network
Payments: Stripe (Global)
Email: Resend (Transactional)
Monitoring: Sentry + Vercel Analytics
```

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# External Services
CLOUDINARY_URL=...
AGORA_APP_ID=...
AGORA_APP_CERTIFICATE=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
RESEND_API_KEY=...

# Security
JWT_SECRET=...
ENCRYPTION_KEY=...
```

---

## 📊 Performance Considerations

### **Database Optimization**
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Caching with Redis for hot data

### **API Performance**
- Response caching
- Pagination for large datasets
- Background job processing
- CDN for static assets

### **Monitoring**
- Error tracking with Sentry
- Performance monitoring
- Database query analysis
- API response time tracking

---

## 🎯 Implementation Priority

### **Phase 1: Foundation (Week 1-2)**
- Database setup and migrations
- NextAuth.js authentication
- Basic user management
- Cloudinary image handling

### **Phase 2: Core Features (Week 3-5)**
- Product CRUD operations
- Instructor profiles
- Basic ecommerce (cart, checkout)
- Stripe payment integration

### **Phase 3: Live Streaming (Week 6-7)**
- Agora.io integration
- WebSocket chat implementation
- Live session management
- Permission-based access control

### **Phase 4: Advanced Features (Week 8-9)**
- Admin dashboard
- Analytics and reporting
- Email notifications
- Advanced search and filtering

### **Phase 5: Optimization (Week 10)**
- Performance optimization
- Security hardening
- Testing and QA
- Production deployment

---

## 💡 Integration with Current Frontend

El frontend actual ya está preparado con:
- ✅ TypeScript interfaces completas
- ✅ Context providers para estado global
- ✅ Componentes UI listos para conectar
- ✅ Sistema de permisos implementado
- ✅ Responsive design completo

Solo necesita conectar las APIs backend para funcionar completamente.

---

## 📝 Next Steps

1. **Choose Technology Stack** - Decidir entre opciones premium vs económica
2. **Database Setup** - Configurar PostgreSQL y crear esquema
3. **Authentication Implementation** - Integrar NextAuth.js
4. **API Development** - Crear endpoints principales
5. **External Services Setup** - Configurar Cloudinary, Stripe, Agora.io
6. **Testing** - Implementar tests unitarios e integración
7. **Deployment** - Configurar CI/CD pipeline

---

**Este plan proporciona una hoja de ruta completa para implementar todo el backend necesario para AlAlma, desde funcionalidades básicas hasta características avanzadas como live streaming y pagos.**