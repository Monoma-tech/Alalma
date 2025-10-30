# 🧩 Components Documentation - AlAlma Platform

## 📋 Overview

Esta documentación detalla todos los componentes, contextos, hooks y utilidades del sistema AlAlma Frontend. Cada sección incluye props, funcionalidades, y ejemplos de uso.

---

## 🎨 UI Components (`/src/components/ui/`)

### Button.tsx
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```

**Funcionalidades:**
- 4 variantes de diseño con colores del tema espiritual
- Estados de loading con spinner automático
- Fully accessible con ARIA attributes
- Responsive design automático

**Ejemplo de uso:**
```tsx
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Suscribirse Ahora
</Button>
```

### Card.tsx
```typescript
interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
}
```

**Funcionalidades:**
- Card base reutilizable con shadows y borders
- Hover effects opcionales
- Clickable variant para navegación
- Responsive padding automático

### Input.tsx
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
}
```

**Funcionalidades:**
- Labels flotantes con animación
- Estados de error con validation
- Icons support para mejor UX
- Accesibilidad completa con ARIA

### AnimatedContainer.tsx 🆕
```typescript
interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}
```

**Funcionalidades:**
- Animaciones de entrada suaves con Framer Motion
- 4 direcciones de animación configurables
- Delays escalonados para efectos en cascada
- Performance optimizado con viewport detection

---

## 🔐 Auth Components (`/src/components/auth/`)

### AuthForm.tsx
```typescript
interface AuthFormProps {
  mode: 'login' | 'register'
  onSubmit: (data: AuthData) => Promise<void>
  loading?: boolean
  error?: string
}
```

**Funcionalidades:**
- Formulario dual para login/registro
- Validación en tiempo real con Zod
- Error handling integrado
- Responsive design móvil-first

### LoginForm.tsx
```typescript
interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>
  redirectTo?: string
}
```

**Funcionalidades:**
- Form específico para login
- Remember me functionality
- Redirect logic post-login
- Integration con AuthContext

### ProtectedRoute.tsx
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'customer' | 'vendor' | 'admin' | 'instructor'
  requiredPlan?: 'free' | 'basic' | 'intermediate' | 'premium'
  fallback?: React.ReactNode
}
```

**Funcionalidades:**
- HOC para proteger rutas por rol/plan
- Redirección automática a login
- Fallback components personalizables
- Integration completa con contexts

---

## 🛒 Ecommerce Components (`/src/components/ecommerce/`)

### ProductCard.tsx
```typescript
interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
  showAddToCart?: boolean
  showFavorite?: boolean
}
```

**Funcionalidades:**
- Cards responsivas con grid/list views
- Add to cart con animación fly-to-cart
- Favorite toggle con persist
- Access control basado en plan de usuario

### WisdomProductCard.tsx
```typescript
interface WisdomProductCardProps {
  product: Product
  userPlan: UserPlan
  onAccessDenied: () => void
}
```

**Funcionalidades:**
- Product cards con control de acceso
- Premium lock states con upgrade CTA
- Animaciones suaves de hover
- Integration con UserPlanContext

### WisdomProductCardWithPlan.tsx
```typescript
interface WisdomProductCardWithPlanProps {
  product: Product
  showPlanUpgrade?: boolean
  compact?: boolean
}
```

**Funcionalidades:**
- Card especializada con plan information
- Upgrade prompts contextuales
- Compact mode para sidebars
- Plan badge integration

### SearchAndFilters.tsx
```typescript
interface SearchAndFiltersProps {
  onSearchChange: (query: string) => void
  onFiltersChange: (filters: FilterState) => void
  categories: Category[]
  priceRange: [number, number]
}
```

**Funcionalidades:**
- Full-text search con debounce
- Multi-select category filters
- Price range slider con USD format
- Rating filters con star display
- Clear filters functionality

### ShoppingCart.tsx
```typescript
interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}
```

**Funcionalidades:**
- Sliding cart sidebar con overlay
- Quantity controls con validation
- Remove items con confirmation
- Price calculations con taxes
- Checkout flow integration

### FavoritesSidebar.tsx
```typescript
interface FavoritesSidebarProps {
  isOpen: boolean
  onClose: () => void
  favorites: Product[]
  onRemoveFavorite: (id: string) => void
}
```

**Funcionalidades:**
- Favorites management sidebar
- Quick add to cart desde favorites
- Remove favorites con animation
- Empty state con CTA

### InstructorCarousel.tsx 🆕
```typescript
interface InstructorCarouselProps {
  instructors: Instructor[]
  title?: string
  showViewAll?: boolean
}
```

**Funcionalidades:**
- Horizontal scrolling carousel
- Featured instructors con verification badges
- Click navigation a perfiles individuales
- Responsive con diferentes breakpoints
- "View All" CTA para directorio completo

---

## 🎥 Live Streaming Components (`/src/components/live/`)

### FloatingLiveButton.tsx 🆕
```typescript
interface FloatingLiveButtonProps {
  hiddenOnPages?: string[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onStartSession?: () => void
  canStartLive?: boolean
}
```

**Funcionalidades:**
- Botón flotante para acceso rápido a live streaming
- Auto-hide en scroll down, show en scroll up
- Menú expandible con opciones de inicio y visualización
- Permission checks integrados con LivePermissionsContext
- Animaciones suaves con indicador pulsante
- Responsive design con posicionamiento configurable
- Integration con sistema de upgrade cuando faltan permisos

### LiveUpgradeModal.tsx 🆕
```typescript
interface LiveUpgradeModalProps {
  // Props son manejadas internamente por LivePermissionsContext
}
```

**Funcionalidades:**
- Modal automático para upgrades de plan/rol
- Mensajes contextuales basados en rol actual
- Botones de acción para cambiar rol a vendedor
- Links directos para upgrade de plan
- Auto-close y cleanup de estado
- Integration completa con contexts de usuario
- Responsive design móvil-first

### SessionCard.tsx 🆕
```typescript
interface SessionCardProps {
  session: LiveSession
  variant?: 'grid' | 'featured'
  onClick: (sessionId: string) => void
}
```

**Funcionalidades:**
- Cards para sesiones live con estado visual
- Live indicator con pulsing animation
- Access control con plan badges
- Thumbnail con overlay information
- Viewer count con live updates

### VideoPlayer.tsx 🆕
```typescript
interface VideoPlayerProps {
  track: IAgoraVideoTrack | null
  uid: number
  isLocal?: boolean
  muted?: boolean
}
```

**Funcionalidades:**
- Video player para Agora.io integration
- Local/remote video handling
- Mirror effect para video local
- Mute/unmute controls
- Full screen capability

### ChatBox.tsx 🆕
```typescript
interface ChatBoxProps {
  sessionId: string
  messages: LiveMessage[]
  onSendMessage: (content: string) => void
  currentUser: User
}
```

**Funcionalidades:**
- Real-time chat interface
- Message formatting con timestamps
- User role badges (Host, Moderator, Viewer)
- Emoji support y link detection
- Auto-scroll to latest messages
- Message moderation controls

### StreamControls.tsx 🆕
```typescript
interface StreamControlsProps {
  isHost: boolean
  isMuted: boolean
  isVideoOff: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onEndSession?: () => void
  onLeaveSession: () => void
}
```

**Funcionalidades:**
- Controls unificados para streaming
- Host vs Viewer permission handling
- Visual feedback para estados
- End session confirmation para hosts
- Leave session con cleanup

---

## 🏗️ Layout Components (`/src/components/layout/`)

### GlobalNavbar.tsx
```typescript
interface GlobalNavbarProps {
  variant?: 'default' | 'authenticated' | 'minimal'
  sticky?: boolean
  showSearch?: boolean
}
```

**Funcionalidades:**
- Navigation principal con responsive behavior
- Authentication state awareness
- Search integration en navbar
- Mobile hamburger menu con overlay
- Cart/Favorites counters con live updates
- User profile dropdown con role-based options
- **🆕 Live Streaming Access**: Botón "Iniciar Sesión Live" en perfil
- **🆕 Role Switching**: Opción "Modo Vendedor" integrada
- **🆕 Mobile Optimization**: Menú móvil con acceso a live streaming
- Plan badge display en profile info
- Logout functionality con cleanup de estado
- Quick actions para cart y favorites

### AuthenticatedLayout.tsx
```typescript
interface AuthenticatedLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  currentPage?: string
}
```

**Funcionalidades:**
- Layout wrapper para páginas autenticadas
- Sidebar navigation opcional
- Breadcrumb generation automático
- Page title management
- Mobile-responsive sidebar collapse

---

## 🎯 Plan Components (`/src/components/plans/`)

### PlansPage.tsx
```typescript
interface PlansPageProps {
  currentPlan?: UserPlan
  onSelectPlan: (planId: string) => Promise<void>
  loading?: boolean
}
```

**Funcionalidades:**
- Pricing table responsive
- Current plan highlighting
- Feature comparison matrix
- Upgrade/downgrade logic
- Payment integration ready
- Mobile-optimized layout

---

## 📱 Product Components (`/src/components/product/`)

### ProductDetail.tsx
```typescript
interface ProductDetailProps {
  product: Product
  onAddToCart: () => void
  onToggleFavorite: () => void
  reviews: Review[]
}
```

**Funcionalidades:**
- Product detail page completa
- Image gallery con thumbnails
- Price display con plan access info
- Add to cart con quantity selector
- Reviews section con ratings
- Related products suggestions

---

## 🧠 React Contexts (`/src/contexts/`)

### AuthContext.tsx
```typescript
interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}
```

**Funcionalidades:**
- Estado global de autenticación
- Persistent sessions con localStorage
- JWT token management
- Auto-refresh de tokens
- Login/logout flows completos

### UserRoleContext.tsx
```typescript
interface UserRoleContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  vendorProfile: VendorProfile | null
  updateVendorProfile: (profile: VendorProfile) => void
  isAdmin: boolean
  isVendor: boolean
  isInstructor: boolean
}
```

**Funcionalidades:**
- Role-based access control
- Vendor profile management
- Admin capabilities detection
- Instructor permissions
- Role switching functionality

### UserPlanContext.tsx
```typescript
interface UserPlanContextType {
  currentPlan: Plan
  canAccess: (requiredPlan: PlanType) => boolean
  upgradeRequired: (requiredPlan: PlanType) => boolean
  purchasedProducts: string[]
  upgradePlan: (planId: string) => Promise<boolean>
}
```

**Funcionalidades:**
- Plan-based content access
- Upgrade requirement detection
- Purchased products tracking
- Plan comparison logic
- Payment integration ready

### FavoritesCartContext.tsx
```typescript
interface FavoritesCartContextType {
  // Cart functionality
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartTotal: number
  
  // Favorites functionality
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  
  // UI state
  isCartOpen: boolean
  isFavoritesOpen: boolean
  toggleCart: () => void
  toggleFavorites: () => void
}
```

**Funcionalidades:**
- Cart management completo
- Favorites system
- Local persistence
- Price calculations
- UI state management para sidebars

### LiveContext.tsx 🆕
```typescript
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
```

**Funcionalidades:**
- Live streaming state management completo
- Session lifecycle management con create/join/leave/end
- Real-time chat con moderación integrada
- User management con roles y permisos
- Connection state monitoring
- Mock data para desarrollo
- Access control basado en planes de usuario
- Categoria filtering para sesiones
- Auto-update de viewer counts
- Message management con delete capabilities

### LivePermissionsContext.tsx 🆕
```typescript
interface LivePermissionsContextType {
  // Permission checking
  canStartLive: boolean
  checkLivePermissions: () => LivePermissions
  
  // Upgrade modal control
  showUpgradeModal: boolean
  checkAndShowUpgrade: () => boolean
  closeUpgradeModal: () => void
}

interface LivePermissions {
  canStart: boolean
  reason?: string
  planRequired?: string
  maxDuration: number
  maxViewers: number
  features: {
    chat: boolean
    recording: boolean
    moderation: boolean
    premiumAccess: boolean
  }
}
```

**Funcionalidades:**
- Sistema completo de permisos para live streaming
- Role-based access control (customer, vendor, admin)
- Plan-based feature control con matrix de permisos
- Automatic upgrade modal triggering
- Feature restriction enforcement
- Integration con UserRoleContext y UserPlanContext
- Mensajes contextuales para diferentes tipos de usuarios
- Permission caching para performance

### EarningsContext.tsx
```typescript
interface EarningsContextType {
  earnings: EarningsData
  transactions: Transaction[]
  updateEarnings: (data: EarningsData) => void
  getEarningsByPeriod: (period: TimePeriod) => EarningsData
}
```

**Funcionalidades:**
- Vendor earnings tracking
- Transaction history
- Period-based filtering
- Earnings calculations

### ContentApprovalContext.tsx
```typescript
interface ContentApprovalContextType {
  pendingContent: ContentItem[]
  approveContent: (id: string) => void
  rejectContent: (id: string, reason: string) => void
  getContentStats: () => ContentStats
}
```

**Funcionalidades:**
- Admin content approval workflow
- Approval/rejection handling
- Content statistics
- Batch operations support

---

## 🎣 Custom Hooks (`/src/hooks/`)

### useFlyToCart.ts 🆕
```typescript
interface UseFlyToCartReturn {
  triggerFlyToCart: (productId: string, startElement: HTMLElement) => void
  isAnimating: boolean
}
```

**Funcionalidades:**
- Animación de productos volando al carrito
- Automatic cart icon highlighting
- Performance optimized con cleanup
- Cross-browser compatible

**Ejemplo de uso:**
```tsx
const { triggerFlyToCart } = useFlyToCart()

const handleAddToCart = (productId: string, event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement
  triggerFlyToCart(productId, element)
  addToCart(product)
}
```

### useFloatingLiveButton.ts 🆕
```typescript
interface UseFloatingLiveButtonReturn {
  isVisible: boolean
  canStartLive: boolean
  showButton: () => void
  hideButton: () => void
  enableLive: () => void
  disableLive: () => void
}
```

**Funcionalidades:**
- Control global del floating live button
- Show/hide programático del botón
- Enable/disable live streaming capability
- State management independiente del componente
- Integration con permission system

**Ejemplo de uso:**
```tsx
const { hideButton, enableLive } = useFloatingLiveButton()

// Ocultar botón en ciertas páginas
useEffect(() => {
  if (pathname.includes('/live/')) {
    hideButton()
  }
}, [pathname])
```

### useLivePermissions.ts 🆕 (via LivePermissionsContext)
```typescript
interface UseLivePermissionsReturn {
  canStartLive: boolean
  permissions: LivePermissions
  checkAndShowUpgrade: () => boolean
  checkLivePermissions: () => LivePermissions
}
```

**Funcionalidades:**
- Hook para verificar permisos de live streaming
- Integration con user role y plan contexts
- Automatic upgrade modal triggering
- Permission object con detailed capabilities
- Real-time permission updates

**Ejemplo de uso:**
```tsx
const { canStartLive, checkAndShowUpgrade } = useLivePermissions()

const handleStartLive = () => {
  if (checkAndShowUpgrade()) {
    router.push('/live/create')
  }
  // Si no tiene permisos, se muestra el modal automáticamente
}
```

---

## 🛠️ Utilities (`/src/lib/`)

### utils.ts
```typescript
// Formatting utilities
export const formatPrice = (price: number): string
export const formatDate = (date: Date): string
export const formatDuration = (minutes: number): string

// Validation utilities
export const validateEmail = (email: string): boolean
export const validatePassword = (password: string): boolean
export const sanitizeInput = (input: string): string

// UI utilities
export const cn = (...classes: string[]): string // className merger
export const truncateText = (text: string, maxLength: number): string
export const generateId = (): string
```

**Funcionalidades:**
- Price formatting con USD currency
- Date/time formatting utilities
- Input validation helpers
- CSS class name management
- Text processing utilities

---

## 📊 Mock Data (`/src/data/`)

### products.ts
```typescript
export const mockProducts: Product[] = [
  // 20+ productos de ejemplo con diferentes categorías
  // Precios en USD, ratings, categorías, access levels
]

export const categories: Category[] = [
  // Cursos, Terapias, Herramientas con conteos
]
```

### plans.ts
```typescript
export const plans: Plan[] = [
  // Free, Basic, Intermediate, Premium plans
  // Features completas, precios USD, access levels
]
```

### instructors.ts 🆕
```typescript
export const mockInstructors: Instructor[] = [
  // 20+ instructores con especialidades
  // Ratings, experience, student counts, verification status
]
```

### userProfile.ts
```typescript
export const mockUserProfile: UserProfile = {
  // Profile completo con preferences
  // Purchase history, favorites, plan info
}
```

---

## 🔧 TypeScript Types (`/src/types/`)

### api.ts
```typescript
// Core interfaces
export interface User { ... }
export interface Product { ... }
export interface Plan { ... }
export interface Category { ... }

// Live streaming interfaces
export interface LiveSession { ... }
export interface LiveMessage { ... }
export interface LiveUser { ... }

// Instructor interfaces
export interface Instructor { ... }
export interface InstructorProfile { ... }

// API response wrappers
export interface ApiResponse<T> { ... }
export interface PaginatedResponse<T> { ... }
export interface SearchResponse { ... }

// Search and filter interfaces
export interface SearchParams { ... }
export interface FilterState { ... }

// Cart and favorites
export interface CartItem { ... }
export interface Favorite { ... }

// Authentication
export interface AuthData { ... }
export interface RegisterData { ... }
```

**Funcionalidades:**
- Type safety completo en toda la app
- Interfaces compartidas para frontend/backend
- Extensible para nuevas features
- Documentation inline con JSDoc

---

## 🎨 Design System

### Color Palette
```scss
// Primary colors (spiritual theme)
--primary-purple: #7c3aed  // Purple-600
--primary-pink: #ec4899    // Pink-500  
--primary-indigo: #4f46e5  // Indigo-600

// Semantic colors
--success: #10b981  // Green-500
--warning: #f59e0b  // Yellow-500
--error: #ef4444    // Red-500

// Neutral colors
--gray-50 to --gray-900    // Full gray scale
```

### Typography Scale
```scss
// Headers
.text-4xl    // 36px - Main titles
.text-3xl    // 30px - Section titles
.text-2xl    // 24px - Card titles
.text-xl     // 20px - Subtitles

// Body text
.text-lg     // 18px - Large body
.text-base   // 16px - Default body
.text-sm     // 14px - Small text
.text-xs     // 12px - Captions
```

### Spacing System
```scss
// Consistent spacing scale
.space-1     // 4px
.space-2     // 8px
.space-4     // 16px
.space-6     // 24px
.space-8     // 32px
.space-12    // 48px
.space-16    // 64px
```

### Component Patterns
- **Cards**: Consistent shadow, border-radius, padding
- **Buttons**: 4 variants, 3 sizes, consistent hover states
- **Forms**: Floating labels, error states, validation
- **Navigation**: Sticky behavior, responsive collapse
- **Modals**: Overlay, slide-in animations, escape handling

---

## 🚀 Performance Considerations

### Code Splitting
- Route-based splitting con Next.js App Router
- Component-level lazy loading
- Context providers separados por funcionalidad

### Memory Management
- Cleanup de event listeners en useEffect
- WebSocket connection management
- Image optimization con next/image

### State Optimization
- Context providers solo donde necesario
- Memoization con useMemo/useCallback
- Debounced search inputs

### Bundle Optimization
- Tree shaking de librerías no usadas
- Dynamic imports para componentes pesados
- CSS purging con Tailwind

---

## 🧪 Testing Patterns

### Component Testing
```typescript
// Ejemplo de test pattern
describe('ProductCard', () => {
  it('should display product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
  })
  
  it('should handle add to cart action', () => {
    const onAddToCart = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id)
  })
})
```

### Context Testing
```typescript
// Testing React Context
const renderWithContext = (component: ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <UserPlanContext.Provider value={mockPlanValue}>
        {component}
      </UserPlanContext.Provider>
    </AuthContext.Provider>
  )
}
```

### Integration Testing
```typescript
// Testing complete user flows
describe('Purchase Flow', () => {
  it('should complete purchase successfully', async () => {
    // Multi-step test covering:
    // 1. Product selection
    // 2. Add to cart
    // 3. Checkout process
    // 4. Payment confirmation
  })
})
```

---

## 📚 Usage Examples

### Creating a New Page
```tsx
// Example: /app/new-page/page.tsx
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function NewPage() {
  return (
    <ProtectedRoute requiredPlan="basic">
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            New Page
          </h1>
          {/* Page content */}
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  )
}
```

### Adding a New Context
```tsx
// Example: New feature context
interface NewFeatureContextType {
  featureData: FeatureData[]
  loading: boolean
  error: string | null
  updateFeature: (id: string, data: Partial<FeatureData>) => void
}

const NewFeatureContext = createContext<NewFeatureContextType | undefined>(undefined)

export function useNewFeature() {
  const context = useContext(NewFeatureContext)
  if (!context) {
    throw new Error('useNewFeature must be used within NewFeatureProvider')
  }
  return context
}
```

### Creating Reusable Components
```tsx
// Example: Reusable card component
interface CustomCardProps {
  title: string
  description?: string
  image?: string
  actions?: React.ReactNode
  variant?: 'default' | 'featured'
}

export function CustomCard({ 
  title, 
  description, 
  image, 
  actions, 
  variant = 'default' 
}: CustomCardProps) {
  return (
    <Card className={`${variant === 'featured' ? 'ring-2 ring-purple-500' : ''}`}>
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
        {actions && (
          <div className="mt-4 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </Card>
  )
}
```

---

## 🔄 Future Enhancements

### Planned Components
- **Video Player**: Advanced player para cursos grabados
- **Calendar Component**: Para agendar sesiones live
- **File Upload**: Para subir contenido multimedia
- **Rich Text Editor**: Para crear descripciones de productos
- **Chart Components**: Para analytics y estadísticas

### Performance Improvements
- **Virtual Scrolling**: Para listas largas de productos
- **Image Lazy Loading**: Optimización avanzada
- **Service Worker**: Para caching offline
- **Web Workers**: Para procesamiento pesado

### Accessibility Enhancements
- **Screen Reader**: Optimización completa
- **Keyboard Navigation**: Mejorada para todos los componentes
- **Color Contrast**: Verificación automática
- **Focus Management**: Mejor UX para navegación por teclado

---

**Esta documentación es living documentation y se actualiza con cada nueva feature o componente agregado al sistema.**