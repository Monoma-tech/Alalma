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
 */

// ========================================
// BÚSQUEDA Y FILTROS
// ========================================

/**
 * GET /api/search
 * Query params: SearchParams
 * Response: SearchResponse
 * 
 * Debe incluir productos + filtros disponibles para refinar búsqueda
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
 */