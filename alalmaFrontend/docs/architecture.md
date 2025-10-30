# Arquitectura AlAlma Frontend

## Overview
AlAlma es una plataforma de bienestar espiritual y personal que conecta usuarios con instructores especializados en cursos, terapias, herramientas de crecimiento personal y **sesiones de live streaming**. La plataforma ofrece una experiencia completa desde contenido grabado hasta interacciones en tiempo real.

## Tecnologías
- **Framework**: Next.js 15.5.4 con App Router y Turbopack
- **UI**: TailwindCSS para styling
- **Estado**: React Context API para manejo de estado global
- **Tipado**: TypeScript para type safety
- **Live Streaming**: Arquitectura preparada para Agora.io
- **Real-time Chat**: WebSocket ready con Socket.io
- **Payments**: Stripe integration ready

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js 15 (App Router)
│   ├── page.tsx           # Landing page principal
│   ├── dashboard/         # Portal de usuarios autenticados
│   ├── plans/            # Página de suscripciones
│   ├── login/            # Autenticación
│   ├── signin/           # Registro de usuarios
│   ├── live/             # 🆕 Live streaming pages
│   │   ├── page.tsx      # Sessions listing
│   │   ├── [id]/         # Individual session
│   │   └── create/       # Create session
│   ├── instructors/      # 🆕 Instructors directory
│   ├── categories/       # Navegación de categorías
│   ├── vendor/           # Panel de vendedores
│   ├── admin/            # Interface de administración
│   ├── profile/          # Perfil de usuario
│   └── product/          # Detalle de productos
│
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   │   └── AnimatedContainer.tsx  # 🆕 Smooth animations
│   ├── auth/             # Componentes de autenticación
│   ├── ecommerce/        # Carrito, productos, filtros
│   │   ├── InstructorCarousel.tsx  # 🆕 Featured instructors
│   │   ├── ProductCard.tsx
│   │   ├── SearchAndFilters.tsx
│   │   └── ShoppingCart.tsx
│   ├── layout/           # Navigation & layout
│   │   ├── GlobalNavbar.tsx
│   │   └── AuthenticatedLayout.tsx
│   ├── live/             # 🆕 Live streaming components
│   │   ├── SessionCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── ChatBox.tsx
│   │   └── StreamControls.tsx
│   ├── plans/            # Componentes de suscripciones
│   └── product/          # Detalle y cards de productos
│
├── contexts/             # Estado global con React Context
│   ├── AuthContext.tsx           # Autenticación de usuarios
│   ├── UserRoleContext.tsx       # Roles y perfiles
│   ├── UserPlanContext.tsx       # Planes de suscripción
│   ├── FavoritesCartContext.tsx  # Carrito y favoritos
│   ├── LiveContext.tsx           # 🆕 Live streaming state
│   ├── EarningsContext.tsx       # Ingresos de vendors
│   └── ContentApprovalContext.tsx # Aprobación de contenido
│
├── data/                 # Datos mock y configuración
│   ├── products.ts       # Productos de ejemplo
│   ├── plans.ts          # Planes de suscripción
│   ├── instructors.ts    # 🆕 Instructors data
│   └── userProfile.ts    # Perfiles de usuario
│
├── hooks/                # Custom hooks
│   └── useFlyToCart.ts   # 🆕 Cart animations
│
├── lib/                  # Utilidades y configuración
│   └── utils.ts
│
└── types/                # Definiciones de TypeScript
    └── api.ts            # Interfaces completas para APIs
```

## Contextos Principales

### AuthContext
Maneja la autenticación de usuarios y persistencia de sesión.

### UserRoleContext  
Gestiona roles de usuario (customer, vendor, admin, **instructor**) y perfiles.

### UserPlanContext
Controla los planes de suscripción y acceso a contenido premium + **live sessions**.

### FavoritesCartContext
Maneja el carrito de compras y lista de favoritos.

### LiveContext 🆕
**Funcionalidades completas de live streaming:**
- Gestión de sesiones activas y programadas
- Chat en tiempo real con moderación
- Control de acceso basado en planes
- Sistema de pagos para sesiones premium
- Estado de participantes y viewers
- Join/leave session management
- Message system con delete/moderate
- Category filtering y búsqueda

### LivePermissionsContext 🆕
**Sistema robusto de permisos para live streaming:**
- Permission matrix basada en roles y planes
- Automatic upgrade modal triggering
- Feature restrictions por nivel de plan
- Integration con todos los user contexts
- Real-time permission checking
- Integración lista para Agora.io

## Páginas Principales

- **Landing (/)**: Página de inicio con showcase de cursos + **instructor carousel**
- **Dashboard (/dashboard)**: Panel de usuario con recomendaciones + **instructor carousel**
- **Vendor Dashboard (/vendor/dashboard)**: Panel de creadores de contenido
- **Admin (/admin)**: Interface de administración
- **Product Detail (/product/[id])**: Detalles de cursos y servicios
- **Live Sessions (/live)** 🆕: Lista de sesiones activas y programadas
- **Live Session Detail (/live/[id])** 🆕: Sala de streaming con video y chat
- **Create Session (/live/create)** 🆕: Crear nueva sesión en vivo
- **Instructors Directory (/instructors)** 🆕: Directorio completo con filtros avanzados

## Features Implementadas

### Core Features ✅
- ✅ Sistema de autenticación
- ✅ Roles de usuario (Customer, Vendor, Admin, **Instructor**)  
- ✅ Planes de suscripción (Free, Basic, Intermediate, Premium)
- ✅ Carrito de compras y favoritos
- ✅ Gestión de productos y categorías
- ✅ Dashboard de vendedor con métricas
- ✅ Sistema de aprobación de contenido (Admin)
- ✅ Navegación sticky en todos los navbars
- ✅ Conversión completa a USD

### Live Streaming System ✅ 🆕
- ✅ **Interfaz completa de live streaming** con UI/UX profesional
- ✅ **LiveContext** con manejo de estado global para sesiones
- ✅ **Páginas de streaming** (lista, detalle, creación)
- ✅ **Chat en tiempo real** (UI preparada para WebSockets)
- ✅ **Control de acceso** basado en planes de usuario
- ✅ **Sistema de pagos** para sesiones premium
- ✅ **Arquitectura escalable** lista para Agora.io
- ✅ **Responsive design** optimizado para móvil

### Instructor Management System ✅ 🆕
- ✅ **Instructor Carousel** en dashboard y home
- ✅ **Directorio completo** de instructores con `/instructors`
- ✅ **Búsqueda avanzada** por nombre y especialidad
- ✅ **Filtros múltiples** por especialidad, rating, experiencia
- ✅ **Vista grid/list** con switching dinámico
- ✅ **Cards responsivas** con información detallada
- ✅ **Routing completo** a perfiles individuales
- ✅ **Mock data** completo con 20+ instructores

### Advanced UI Features ✅ 🆕
- ✅ **Animaciones suaves** con AnimatedContainer
- ✅ **Cards clickables** con manejo correcto de eventos
- ✅ **Carousels horizontales** con scroll controlado
- ✅ **Search & filters** con estado persistente
- ✅ **Responsive design** móvil-first
- ✅ **Loading states** y error handling

### Live Streaming Access Control ✅ 🆕
- ✅ **FloatingLiveButton** - Botón flotante para acceso rápido
- ✅ **Permission System** - Control granular basado en roles/planes
- ✅ **Upgrade Modals** - Prompts automáticos para upgrades
- ✅ **Multiple Access Points** - Navbar, vendor dashboard, floating button
- ✅ **Auto-hide behavior** - Smart UX con scroll detection
- ✅ **Mobile optimization** - Perfect responsive experience
- ✅ **Role-based navigation** - Different options per user type

## Live Streaming Architecture 🆕

### Frontend Implementation
```typescript
// Complete TypeScript interfaces
interface LiveSession {
  id: string
  hostId: string
  title: string
  description: string
  category: 'curso' | 'terapia' | 'herramienta' | 'consulta'
  accessLevel: 'free' | 'basic' | 'intermediate' | 'premium' | 'paid'
  price?: number
  isLive: boolean
  viewers: number
  maxViewers: number
  startTime: Date
  endTime?: Date
  tags: string[]
  thumbnail: string
}

interface LiveMessage {
  id: string
  sessionId: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  isHighlighted: boolean
}
```

### Ready for Backend Integration
- **Agora.io Integration**: Token generation y canal management
- **WebSocket Server**: Real-time chat y notifications  
- **Payment Processing**: Stripe para sesiones premium
- **Database Schema**: Completo para sesiones, mensajes, participantes
- **API Endpoints**: Especificación completa en docs

### Mock Data & Testing
- 12+ sesiones de ejemplo con diferentes categorías
- Chat messages simulados para testing
- Access control testing con diferentes planes
- Responsive testing en múltiples dispositivos

## Instructor System Architecture 🆕

### Data Structure
```typescript
interface Instructor {
  id: string
  name: string
  specialties: string[]
  rating: number
  experience: string
  students: number
  isVerified: boolean
  bio: string
  image: string
  hourlyRate: number
}
```

### Features
- **Search Engine**: Full-text search por nombre y especialidad
- **Advanced Filters**: Por especialidad, rating, experiencia
- **Sorting Options**: Por rating, estudiantes, tarifa
- **Responsive Cards**: Grid adaptativo 1-4 columnas
- **List View**: Información detallada en formato lista
- **Routing**: Navegación a `/instructor/[id]` preparada

## Technical Specifications

### Performance Optimizations
- **Lazy Loading**: Componentes y imágenes optimizadas
- **Code Splitting**: Rutas separadas por funcionalidad
- **Context Optimization**: Evitar re-renders innecesarios
- **Mock Data**: Simulación realista para development

### Scalability Considerations  
- **Modular Architecture**: Fácil extensión de funcionalidades
- **TypeScript**: Type safety en toda la aplicación
- **Context Separation**: Estado aislado por funcionalidad
- **Component Reusability**: UI components reutilizables

### Security & Access Control
- **Role-based Access**: Control granular por roles
- **Plan-based Content**: Restricción de contenido premium
- **Session Validation**: Control de acceso a live streams
- **Payment Verification**: Validación de pagos para contenido

## Documentation Status

### Completed Documentation ✅
- ✅ **LIVE_STREAMING_IMPLEMENTATION.md**: Guía completa de implementación
- ✅ **LOGOUT_REDIRECT_UPDATE.md**: Actualización de flujo de logout
- ✅ **NAVBAR_STICKY_UPDATE.md**: Navegación sticky unificada
- ✅ **USD_CONVERSION_SUMMARY.md**: Conversión monetaria completa
- ✅ **api-specification.md**: Especificación de APIs para backend
- ✅ **architecture.md**: Este documento actualizado

### Pending Documentation 🔄
- 🔄 **Components Documentation**: Guía de componentes UI
- 🔄 **Deployment Guide**: Setup de producción
- 🔄 **Development Setup**: Guía para desarrolladores
- 🔄 **Testing Strategy**: Estrategia de testing

## Estado Actual

### Production Ready Features ✅
- **Frontend Completo**: UI/UX totalmente funcional
- **Mock Data**: Datos realistas para testing
- **Responsive Design**: Optimizado para todos los dispositivos
- **TypeScript**: 100% type safety
- **Context Management**: Estado global optimizado

### Ready for Backend Integration 🚀
- **API Contracts**: Interfaces completas definidas
- **Error Handling**: Manejo robusto de errores
- **Loading States**: UX optimizada durante carga
- **Payment Flow**: Integración Stripe preparada
- **Live Streaming**: Agora.io integration ready

**La aplicación está completamente funcional con mock data y lista para integración con backend real. El sistema de live streaming está UI-complete y preparado para integración con servicios de terceros.**
- APIs con MSW (Mock Service Worker)
- E2E con Playwright

# 📝 Notas para Lovable

## Datos de Prueba Necesarios
1. **Usuarios**: Admin, instructor, estudiantes con diferentes planes
2. **Productos**: 20+ productos distribuidos en categorías
3. **Contenido**: Descripciones realistas, imágenes de placeholder
4. **Ratings**: Reviews y calificaciones variadas

## Funcionalidades Críticas
1. **Control de acceso por plan** - Más importante que pagos
2. **Búsqueda y filtros** - Core de la experiencia
3. **Carrito persistente** - UX fluida
4. **Progreso de cursos** - Engagement

## APIs Prioritarias
1. `/api/auth/*` - Autenticación básica
2. `/api/products` - Lista y filtros
3. `/api/user/cart` - Carrito básico
4. `/api/plans` - Sistema de suscripciones