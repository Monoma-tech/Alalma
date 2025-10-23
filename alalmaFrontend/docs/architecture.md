/**
 * ARQUITECTURA DEL FRONTEND ALALMA
 * ================================
 * 
 * Este documento explica la estructura y organización del código
 * para que Lovable pueda entender el proyecto completo.
 */

# 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js 15 (App Router)
│   ├── page.tsx           # Landing page principal
│   ├── dashboard/         # Portal de usuarios autenticados
│   ├── plans/            # Página de suscripciones
│   ├── login/            # Autenticación
│   ├── welcome/          # Onboarding y categorías
│   └── product/          # Detalle de productos
│
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── auth/             # Componentes de autenticación
│   ├── ecommerce/        # Carrito, productos, filtros
│   ├── plans/            # Componentes de suscripciones
│   ├── product/          # Detalle y cards de productos
│   └── welcome/          # Onboarding y navegación
│
├── contexts/             # Estado global con React Context
│   └── UserPlanContext.tsx  # Gestión de planes de usuario
│
├── data/                 # Datos mock y configuración
│   ├── products.ts       # Productos de ejemplo
│   └── plans.ts          # Planes de suscripción
│
├── hooks/                # Custom hooks
│
├── lib/                  # Utilidades y configuración
│
└── types/                # Definiciones de TypeScript
    └── api.ts            # Interfaces para APIs
```

# 🎯 Componentes Principales

## Landing Page (`/app/page.tsx`)
- **Propósito**: Conversión y presentación de la plataforma
- **APIs necesarias**: `/api/plans`, `/api/stats`, `/api/categories`
- **Estado**: Animaciones locales, búsqueda temporal

## Dashboard (`/app/dashboard/page.tsx`)
- **Propósito**: Portal principal de usuarios autenticados
- **APIs necesarias**: `/api/products`, `/api/user/cart`, `/api/user/favorites`
- **Estado**: Filtros, carrito, favoritos, perfil de usuario

## Context de Planes (`/contexts/UserPlanContext.tsx`)
- **Propósito**: Gestión global del plan del usuario
- **Funciones**: `canAccess()`, `upgradeRequired()`
- **Estado**: Plan actual, funciones de control de acceso

## Componentes de Ecommerce (`/components/ecommerce/`)
- **WisdomProductCardWithPlan**: Card de producto con control de acceso
- **SearchAndFilters**: Búsqueda y filtros avanzados
- **ShoppingCartSidebar**: Carrito lateral
- **FavoritesSidebar**: Lista de favoritos

# 🔄 Flujo de Datos

## 1. Autenticación
```
Login → JWT Token → UserPlanContext → Control de acceso global
```

## 2. Navegación de Productos
```
Landing → Welcome (categorías) → Dashboard (productos) → Detalle
```

## 3. Compras
```
Producto → Verificar plan → Carrito → Checkout → Confirmación
```

# 📡 Integraciones Necesarias

## Estado de Autenticación
- El contexto `UserPlanContext` debe conectarse con `/api/user/profile`
- Persistir sesión con localStorage/cookies
- Renovación automática de tokens

## Datos de Productos
- Reemplazar `mockProducts` con llamadas a `/api/products`
- Filtros en tiempo real
- Paginación infinita o tradicional

## Sistema de Carrito
- Persistir carrito en backend (`/api/user/cart`)
- Sincronización entre dispositivos
- Checkout con Stripe

# 🎨 Patrones de Diseño

## Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid adaptativo para productos

## Tema Espiritual
- Colores: Purple-600, Pink-500, Indigo-600
- Iconos: Lucide React con temática espiritual
- Gradientes suaves y efectos sutiles

## UX Patterns
- Dropdown navigation (estilo Udemy)
- Infinite scroll o paginación
- Loading states y skeletons
- Error boundaries

# 🚀 Performance

## Optimizaciones Implementadas
- Next.js 15 con Turbopack
- Componentes lazy loading
- Imágenes optimizadas con next/image
- CSS-in-JS con Tailwind

## Por Implementar con Backend
- ISR (Incremental Static Regeneration) para productos
- CDN para imágenes y videos
- Caching de APIs con SWR/React Query

# 🧪 Testing Strategy

## Unit Tests
- Componentes UI con Jest + React Testing Library
- Hooks personalizados
- Utilidades y helpers

## Integration Tests
- Flujos de usuario completos
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