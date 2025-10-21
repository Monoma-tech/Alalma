# Al Alma - Plataforma de Sabiduría y Crecimiento Espiritual 🌟

Al Alma es una plataforma digital enfocada en el crecimiento espiritual y la sabiduría, ofreciendo cursos, terapias y herramientas para el desarrollo personal a través de un modelo de suscripciones.

## 🚀 Tecnologías

- **Next.js 15.5.4** con App Router
- **React 19** con TypeScript
- **Tailwind CSS 4** para estilos
- **Lucide React** para iconografía
- **Node.js 24.4.0**

## 🏗️ Arquitectura del Proyecto

### Modelo de Suscripciones
La plataforma está centrada en un sistema de planes de suscripción que controla el acceso al contenido:

- **Free** - Acceso básico gratuito
- **Basic** - $29.900/mes - Acceso a contenido básico
- **Intermediate** - $49.900/mes - Acceso intermedio + básico
- **Premium** - $89.900/mes - Acceso completo a toda la plataforma

### Flujo de Usuario
1. **Landing Page** (`/`) - Presentación de la plataforma
2. **Login** (`/login`) - Autenticación (redirige a planes)
3. **Planes** (`/plans`) - **Pantalla principal** - Selección de suscripción
4. **Dashboard** (`/dashboard`) - Contenido filtrado por plan del usuario
5. **Productos** (`/product/[id]`) - Detalles individuales de cursos/terapias

## ✅ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- Login funcional con redirección a planes
- Gestión de estado de usuario global

### 💎 Sistema de Planes de Suscripción
- Interfaz de selección de planes como pantalla principal
- Context global para manejo de estado de plan (`UserPlanContext`)
- Persistencia en localStorage
- Control de acceso basado en suscripción

### 🛍️ Ecommerce Espiritual
- Catálogo de productos (cursos, terapias, herramientas)
- Tarjetas de productos con indicadores de acceso por plan
- Sistema de favoritos/wishlist con sidebar
- Carrito de compras con animaciones fly-to-cart
- Navegación con breadcrumbs

### 🎨 Componentes Avanzados
- `WisdomProductCardWithPlan` - Tarjetas con control de acceso visual
- `FavoritesSidebar` - Panel lateral para favoritos
- `PlansPage` - Interfaz principal de suscripciones
- Optimización de imágenes con Next.js Image

### 🔒 Control de Acceso
- Restricciones visuales por nivel de plan
- Badges informativos de planes requeridos
- Redirección automática para actualizaciones
- Precios condicionales según suscripción

## 🚧 En Desarrollo / Pendiente

### 🔄 Integración de Pagos
- [ ] Pasarela de pagos real (Stripe/PayPal)
- [ ] Procesamiento de suscripciones
- [ ] Webhooks para renovaciones

### 🗄️ Backend y Persistencia
- [ ] Base de datos para usuarios y suscripciones
- [ ] API para gestión de cuentas
- [ ] Autenticación robusta con JWT

### 📱 Mejoras de UX/UI
- [ ] Responsive design completo
- [ ] Tema oscuro/claro
- [ ] Notificaciones toast
- [ ] Loading states mejorados

### 📊 Analytics y SEO
- [ ] Google Analytics integración
- [ ] SEO optimization
- [ ] Sitemap y robots.txt

### 🎯 Funcionalidades Adicionales
- [ ] Sistema de progreso en cursos
- [ ] Certificados de finalización
- [ ] Chat de soporte
- [ ] Reseñas y ratings

## 🛠️ Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Dashboard principal con contenido
│   ├── login/             # Autenticación
│   ├── plans/             # Selección de suscripciones (PRINCIPAL)
│   └── product/[id]/      # Detalles de productos
├── components/
│   ├── ecommerce/         # Componentes de ecommerce
│   ├── plans/             # Componentes de suscripciones
│   └── ui/                # Componentes base
├── contexts/              # React Contexts
├── data/                  # Datos mock y configuraciones
└── hooks/                 # Custom hooks
```

## 🔧 Configuración Git

El proyecto está configurado con identidades Git específicas para el contexto Monoma.

---

**Estado Actual**: Arquitectura base completada, sistema de suscripciones funcionando, pendiente integración de pagos reales y backend.

**Próximos Pasos**: Integración de pagos, persistencia de datos y mejoras de UX. 