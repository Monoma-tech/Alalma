# Alalma - Plataforma de Sabiduría Espiritual 🌟# Alalma - Plataforma de Sabiduría Espiritual 🌟# Al Alma - Plataforma de Sabiduría y Crecimiento Espiritual 🌟



Repositorio principal del proyecto Alalma, una plataforma digital enfocada en el crecimiento espiritual y la sabiduría.



## 📁 Estructura del ProyectoRepositorio principal del proyecto Alalma, una plataforma digital enfocada en el crecimiento espiritual y la sabiduría.Al Alma es una plataforma digital enfocada en el crecimiento espiritual y la sabiduría, ofreciendo cursos, terapias y herramientas para el desarrollo personal a través de un modelo de suscripciones.



```

Alalma/

├── alalmaFrontend/     # Frontend Next.js - Aplicación principal## 📁 Estructura del Proyecto## 🚀 Tecnologías

│   ├── src/            # Código fuente

│   ├── public/         # Archivos estáticos  

│   ├── package.json    # Dependencias y scripts

│   └── README.md       # Documentación detallada del frontend```- **Next.js 15.5.4** con App Router

└── README.md           # Este archivo

```Alalma/- **React 19** con TypeScript



## 🚀 Comenzar├── alalmaFrontend/     # Frontend Next.js - Aplicación principal- **Tailwind CSS 4** para estilos



### Frontend (Next.js)│   ├── src/            # Código fuente- **Lucide React** para iconografía



```bash│   ├── public/         # Archivos estáticos  - **Node.js 24.4.0**

cd alalmaFrontend

npm install│   ├── package.json    # Dependencias y scripts

npm run dev

```│   └── README.md       # Documentación detallada del frontend## 🏗️ Arquitectura del Proyecto



La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)└── README.md           # Este archivo



## 📋 Roadmap del Proyecto```### Modelo de Suscripciones



- ✅ **Frontend Base** - Aplicación Next.js con sistema de suscripcionesLa plataforma está centrada en un sistema de planes de suscripción que controla el acceso al contenido:

- 🔄 **Backend API** - Gestión de usuarios y pagos (próximamente)

- 🔄 **Base de Datos** - Persistencia de datos (próximamente)## 🚀 Comenzar

- 🔄 **Pasarela de Pagos** - Integración con Stripe/PayPal (próximamente)

- 🔄 **Deployment** - Configuración de producción (próximamente)- **Free** - Acceso básico gratuito



## 🛠️ Tecnologías### Frontend (Next.js)- **Basic** - $29.900/mes - Acceso a contenido básico



- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS- **Intermediate** - $49.900/mes - Acceso intermedio + básico

- **Backend**: Por definir

- **Base de Datos**: Por definir```bash- **Premium** - $89.900/mes - Acceso completo a toda la plataforma

- **Deployment**: Por definir

cd alalmaFrontend

---

npm install### Flujo de Usuario

Para información detallada del frontend, consulta [alalmaFrontend/README.md](./alalmaFrontend/README.md)
npm run dev1. **Landing Page** (`/`) - Presentación de la plataforma

```2. **Login** (`/login`) - Autenticación (redirige a planes)

3. **Planes** (`/plans`) - **Pantalla principal** - Selección de suscripción

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)4. **Dashboard** (`/dashboard`) - Contenido filtrado por plan del usuario

5. **Productos** (`/product/[id]`) - Detalles individuales de cursos/terapias

## 📋 Roadmap del Proyecto

## ✅ Funcionalidades Implementadas

- ✅ **Frontend Base** - Aplicación Next.js con sistema de suscripciones

- 🔄 **Backend API** - Gestión de usuarios y pagos (próximamente)### 🔐 Sistema de Autenticación

- 🔄 **Base de Datos** - Persistencia de datos (próximamente)- Login funcional con redirección a planes

- 🔄 **Pasarela de Pagos** - Integración con Stripe/PayPal (próximamente)- Gestión de estado de usuario global

- 🔄 **Deployment** - Configuración de producción (próximamente)

### 💎 Sistema de Planes de Suscripción

## 🛠️ Tecnologías- Interfaz de selección de planes como pantalla principal

- Context global para manejo de estado de plan (`UserPlanContext`)

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS- Persistencia en localStorage

- **Backend**: Por definir- Control de acceso basado en suscripción

- **Base de Datos**: Por definir

- **Deployment**: Por definir### 🛍️ Ecommerce Espiritual

- Catálogo de productos (cursos, terapias, herramientas)

---- Tarjetas de productos con indicadores de acceso por plan

- Sistema de favoritos/wishlist con sidebar

Para información detallada del frontend, consulta [alalmaFrontend/README.md](./alalmaFrontend/README.md)- Carrito de compras con animaciones fly-to-cart
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