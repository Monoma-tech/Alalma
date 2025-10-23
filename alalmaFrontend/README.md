# 🌟 ALALMA - Frontend Next.js para Lovable AI

Plataforma de crecimiento espiritual con sistema de suscripciones y marketplace de contenido.

## 🎯 **IMPORTANTE PARA LOVABLE AI**

Este proyecto necesita un backend completo. Toda la documentación necesaria está en:
- **APIs**: `/docs/api-specification.md` - Especificación completa de endpoints
- **Tipos**: `/src/types/api.ts` - Interfaces TypeScript para todas las APIs  
- **Arquitectura**: `/docs/architecture.md` - Estructura del proyecto

## 📡 **APIs Críticas Necesarias**

### Autenticación
```typescript
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/refresh
GET /api/user/profile
```

### Productos y Contenido
```typescript
GET /api/products         // Con filtros y paginación
GET /api/products/:id     // Detalle individual
GET /api/categories       // Cursos, Terapias, Herramientas
GET /api/stats           // Para landing page
```

### Usuario y Carrito
```typescript
GET /api/user/cart       // Carrito persistente
POST /api/user/cart      // Agregar productos
GET /api/user/favorites  // Lista de favoritos
POST /api/user/favorites // Agregar favoritos
```

### Suscripciones
```typescript
GET /api/plans           // 4 niveles: free, basic, intermediate, premium
POST /api/user/subscribe // Cambiar plan con Stripe
```

## 🚀 **Stack Tecnológico**

- **Framework**: Next.js 15 (App Router) + React 19
- **UI**: Tailwind CSS + Lucide Icons  
- **Estado**: React Context + TypeScript
- **Deploy**: Vercel-ready

## 🎯 **Funcionalidades Implementadas**

### ✅ Frontend Completo
- Landing page con animaciones typewriter
- Dashboard estilo Udemy con búsqueda
- Sistema de planes (4 niveles) 
- Carrito y favoritos (localStorage)
- Control de acceso por suscripción
- Responsive design completo

### ⏳ Necesita Backend
- Autenticación JWT real
- Base de datos de productos
- Persistencia de carrito
- Pagos con Stripe
- Progreso de cursos

## 🔄 **Modelo de Suscripciones**

| Plan | Precio | Acceso |
|------|--------|--------|
| **Free** | $0 | Contenido básico gratuito |
| **Basic** | $29/mes | Cursos introductorios |
| **Intermediate** | $59/mes | + Terapias y herramientas |
| **Premium** | $99/mes | Acceso completo + comunidad |

## � **Datos de Ejemplo Necesarios**

### Productos (20+ necesarios)
- **Cursos**: Meditación, Astrología, Numerología, Tarot
- **Terapias**: Reiki, Sanación energética, Bioenergética  
- **Herramientas**: Cristales, Cartas oracle, Inciensos

### Usuarios de Prueba
- Admin, Instructor, Free User, Premium User

## � **Control de Acceso**
```typescript
// Ya implementado en frontend
const canAccess = (userPlan: string, requiredPlan: string) => {
  const hierarchy = ['free', 'basic', 'intermediate', 'premium']
  return hierarchy.indexOf(userPlan) >= hierarchy.indexOf(requiredPlan)
}
```

## 🛠️ **Desarrollo Local**

```bash
npm install
npm run dev     # http://localhost:3000
```

## 📁 **Estructura del Proyecto**

```
src/
├── app/              # Páginas Next.js
│   ├── page.tsx     # Landing page
│   ├── dashboard/   # Portal de usuarios  
│   ├── plans/       # Suscripciones
│   └── login/       # Autenticación
├── components/       # Componentes reutilizables
├── contexts/         # Estado global (UserPlanContext)
├── data/            # Mock data (reemplazar con APIs)
├── types/           # Interfaces para APIs
└── docs/            # Documentación para Lovable
```

## 🔧 **Variables de Entorno**

```env
NEXT_PUBLIC_API_URL=      # URL del backend de Lovable
NEXT_PUBLIC_STRIPE_KEY=   # Stripe public key
NEXTAUTH_SECRET=          # Next.js auth secret
```

## 🎯 **Integración Frontend ↔ Backend**

El frontend está listo para conectarse. Solo necesita:

1. **Reemplazar mocks**: `mockProducts` → fetch a `/api/products`
2. **Conectar auth**: localStorage → JWT + refresh tokens
3. **Carrito real**: localStorage → `/api/user/cart`
4. **Pagos**: Botones → Stripe checkout

## 📝 **Notas para Desarrollo**

### URLs Principales
- `/` - Landing con conversión a suscripciones
- `/plans` - **Pantalla principal** de suscripciones
- `/dashboard` - Portal de contenido por plan
- `/login` - Autenticación simple

### Flujo de Usuario
1. Landing → Explorar
2. Planes → Suscribirse  
3. Dashboard → Consumir contenido
4. Carrito → Comprar adicionales

---

**🌟 Todo listo para que Lovable implemente el backend según las especificaciones** 