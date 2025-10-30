/**
 * ESPECIFICACIÓN DE APIS PARA LOVABLE
 * ===================================
 * 
 * Este archivo especifica exactamente qué endpoints necesita crear Lovable
 * para que el frontend de Alalma funcione completamente.
 * 
 * IMPORTANTE: Todas las respuestas deben seguir el formato ApiResponse<T>
 * definido en /src/types/api.ts
 */

// ========================================
// AUTENTICACIÓN Y USUARIOS
// ========================================

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Response: ApiResponse<AuthResponse>
 */

/**
 * POST /api/auth/register
 * Body: { email: string, password: string, name: string }
 * Response: ApiResponse<AuthResponse>
 */

/**
 * POST /api/auth/refresh
 * Headers: { Authorization: "Bearer <refreshToken>" }
 * Response: ApiResponse<{ token: string }>
 */

/**
 * POST /api/auth/logout
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 */

/**
 * GET /api/user/profile
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<User>
 */

/**
 * PUT /api/user/profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name?: string, avatar?: string }
 * Response: ApiResponse<User>
 */

// ========================================
// PLANES DE SUSCRIPCIÓN
// ========================================

/**
 * GET /api/plans
 * Response: ApiResponse<Plan[]>
 * 
 * Debe retornar los 4 planes: free, basic, intermediate, premium
 * con exactamente las propiedades definidas en la interfaz Plan
 */

/**
 * POST /api/user/subscribe
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { planId: string, paymentMethodId: string }
 * Response: ApiResponse<{ subscriptionId: string, user: User }>
 */

// ========================================
// PRODUCTOS Y CONTENIDO
// ========================================

/**
 * GET /api/products
 * Query params: SearchParams (ver types/api.ts)
 * Response: PaginatedResponse<Product>
 * 
 * Ejemplos de uso:
 * - /api/products?category=cursos&limit=12
 * - /api/products?query=meditacion&sortBy=rating
 * - /api/products?minRating=4&priceRange=0,50000
 */

/**
 * GET /api/products/:id
 * Response: ApiResponse<Product>
 */

/**
 * GET /api/categories
 * Response: ApiResponse<Category[]>
 * 
 * Debe incluir: Cursos, Terapias, Herramientas con sus conteos
 */

// ========================================
// CARRITO DE COMPRAS
// ========================================

/**
 * GET /api/user/cart
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<Cart>
 */

/**
 * POST /api/user/cart
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { productId: string, quantity: number }
 * Response: ApiResponse<Cart>
 */

/**
 * PUT /api/user/cart/:itemId
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { quantity: number }
 * Response: ApiResponse<Cart>
 */

/**
 * DELETE /api/user/cart/:itemId
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<Cart>
 */

/**
 * POST /api/user/cart/checkout
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { paymentMethodId: string }
 * Response: ApiResponse<{ orderId: string, success: boolean }>
 */

// ========================================
// LISTA DE FAVORITOS
// ========================================

/**
 * GET /api/user/favorites
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<Favorite[]>
 */

/**
 * POST /api/user/favorites
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { productId: string }
 * Response: ApiResponse<Favorite>
 */

/**
 * DELETE /api/user/favorites/:productId
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 */

// ========================================
// PROGRESO Y APRENDIZAJE
// ========================================

/**
 * GET /api/user/progress
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<CourseProgress[]>
 */

/**
 * POST /api/user/progress
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { productId: string, lessonId: string, progress: number }
 * Response: ApiResponse<CourseProgress>
 */

// ========================================
// LIVE STREAMING
// ========================================

/**
 * GET /api/live/sessions
 * Query params: { category?: string, status?: 'live' | 'scheduled', page?: number }
 * Response: PaginatedResponse<LiveSession>
 * 
 * Retorna sesiones de live streaming activas y programadas
 */

/**
 * POST /api/live/sessions
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { title: string, description?: string, category: string, accessLevel: string, price?: number, scheduledFor?: Date }
 * Response: ApiResponse<LiveSession>
 * 
 * Crear nueva sesión de live streaming
 */

/**
 * GET /api/live/sessions/:id
 * Response: ApiResponse<LiveSession>
 * 
 * Obtener detalles de sesión específica
 */

/**
 * POST /api/live/sessions/:id/join
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ agoraToken: string, channelName: string, uid: number }>
 * 
 * Unirse a sesión live - retorna token de Agora para video
 */

/**
 * POST /api/live/sessions/:id/leave
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 * 
 * Salir de sesión live
 */

/**
 * GET /api/live/sessions/:id/messages
 * Query params: { page?: number, limit?: number }
 * Response: PaginatedResponse<LiveMessage>
 * 
 * Obtener mensajes del chat de la sesión
 */

/**
 * POST /api/live/sessions/:id/messages
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { content: string }
 * Response: ApiResponse<LiveMessage>
 * 
 * Enviar mensaje al chat de la sesión
 */

/**
 * DELETE /api/live/sessions/:id/messages/:messageId
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 * 
 * Eliminar mensaje del chat (solo moderadores/host)
 */

// ========================================
// INSTRUCTORES
// ========================================

/**
 * GET /api/instructors
 * Query params: { search?: string, specialty?: string, sortBy?: 'rating' | 'students' | 'rate', page?: number }
 * Response: PaginatedResponse<Instructor>
 * 
 * Directorio de instructores con filtros y búsqueda
 */

/**
 * GET /api/instructors/:id
 * Response: ApiResponse<Instructor>
 * 
 * Perfil completo de instructor específico
 */

/**
 * GET /api/instructors/featured
 * Response: ApiResponse<Instructor[]>
 * 
 * Instructores destacados para carousel en home/dashboard
 */

/**
 * POST /api/instructors/:id/follow
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 * 
 * Seguir a un instructor
 */

/**
 * DELETE /api/instructors/:id/follow
 * Headers: { Authorization: "Bearer <token>" }
 * Response: ApiResponse<{ success: boolean }>
 * 
 * Dejar de seguir a un instructor
 */

// ========================================
// ESTADÍSTICAS GENERALES
// ========================================

/**
 * GET /api/stats
 * Response: ApiResponse<SiteStats>
 * 
 * Para mostrar en la landing page:
 * - Número total de estudiantes
 * - Número total de cursos
 * - Número total de instructores
 * - Rating promedio
 * - Sesiones live activas
 */

// ========================================
// BÚSQUEDA Y FILTROS
// ========================================

/**
 * GET /api/search
 * Query params: SearchParams & { type?: 'products' | 'instructors' | 'live' }
 * Response: SearchResponse
 * 
 * Búsqueda unificada que incluye productos, instructores y sesiones live
 */

// ========================================
// NOTAS IMPORTANTES PARA LOVABLE
// ========================================

/**
 * 1. AUTENTICACIÓN:
 *    - Usar JWT tokens con expiración de 1 hora
 *    - Refresh tokens con expiración de 30 días
 *    - Middleware de autenticación en rutas protegidas
 * 
 * 2. CONTROL DE ACCESO:
 *    - Verificar userPlan vs product.requiredPlan
 *    - Free users solo pueden ver contenido gratuito
 *    - Planes superiores incluyen acceso a inferiores
 * 
 * 3. FILTROS:
 *    - Implementar búsqueda full-text en productos
 *    - Filtros combinables (categoría + precio + rating)
 *    - Ordenamiento múltiple
 * 
 * 4. DATOS DE PRUEBA:
 *    - Crear al menos 20 productos de ejemplo
 *    - 3 categorías principales: Cursos, Terapias, Herramientas
 *    - Productos para cada nivel de plan
 *    - Instructores con ratings y avatars
 * 
 * 5. PAGOS:
 *    - Integrar con Stripe para suscripciones
 *    - Webhooks para actualizar planes de usuario
 *    - Manejo de fallos y reintento de pagos
 *    - Pagos individuales para sesiones live premium
 * 
 * 6. LIVE STREAMING:
 *    - Integración con Agora.io para video/audio
 *    - WebSocket server para chat en tiempo real
 *    - Control de acceso basado en planes
 *    - Sistema de moderación para chat
 *    - Grabación opcional de sesiones
 * 
 * 7. INSTRUCTORES:
 *    - Sistema de verificación de instructores
 *    - Ratings y reviews de estudiantes
 *    - Seguimiento de instructores favoritos
 *    - Dashboard para gestión de sesiones
 *    - Estadísticas de engagement
 * 
 * 8. WEBSOCKETS:
 *    - Chat en tiempo real para live sessions
 *    - Notificaciones push para nuevas sesiones
 *    - Actualización de viewer count en tiempo real
 *    - Estados de conexión de usuarios
 */