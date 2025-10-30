export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  inStock: boolean
  duration: string
  instructor: string
  instructorId: number
  description?: string
  modules?: string[]
  features?: string[]
  gallery?: string[]
  accessLevel: 'free' | 'basic' | 'intermediate' | 'premium'
  isIncludedInPlan?: boolean
  planPrice?: number
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Mindfulness y Meditación Profunda',
    price: 22.25,
    originalPrice: 32.25,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 1247,
    category: 'Cursos',
    inStock: true,
    duration: '8 semanas',
    instructor: 'María Luna',
    instructorId: 1,
    accessLevel: 'free',
    isIncludedInPlan: false,
    description: 'Descubre la paz interior a través de técnicas milenarias de mindfulness y meditación guiada.',
    modules: [
      'Fundamentos de Mindfulness',
      'Técnicas de Respiración Consciente',
      'Meditación Guiada',
      'Mindfulness en la Vida Cotidiana',
      'Gestión del Estrés y Ansiedad',
      'Meditación Caminando',
      'Compasión y Autocompasión',
      'Integración y Práctica Continua'
    ],
    features: [
      'Videos HD de alta calidad',
      'Audios meditativos descargables',
      'Manual PDF completo',
      'Certificación al finalizar',
      'Acceso de por vida',
      'Comunidad privada de estudiantes'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
    ]
  },
  {
    id: 2,
    name: 'Terapia de Sanación Emocional',
    price: 37.50,
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 523,
    category: 'Terapias',
    inStock: true,
    duration: '12 sesiones',
    instructor: 'Carlos Viento',
    instructorId: 2,
    accessLevel: 'basic',
    planPrice: 29.99,
    description: 'Un proceso terapéutico profundo diseñado para sanar heridas emocionales, liberar bloqueos energéticos y restaurar tu bienestar interior. Combina técnicas modernas de psicología con sabiduría ancestral.',
    modules: [
      'Evaluación inicial personalizada',
      'Identificación de patrones emocionales',
      'Técnicas de liberación emocional',
      'Sanación de heridas del pasado',
      'Reconstrucción de la autoestima',
      'Gestión de relaciones saludables'
    ],
    features: [
      'Sesiones individuales',
      'Material de apoyo personalizado',
      'Seguimiento continuo',
      'Técnicas de autoregulación',
      'Plan de cuidado post-terapia'
    ]
  },
  {
    id: 3,
    name: 'Kit de Cristales para Equilibrio Energético',
    price: 18.75,
    originalPrice: 23.75,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 892,
    category: 'Herramientas',
    inStock: false,
    duration: 'Uso diario',
    instructor: 'Luna Cristal',
    instructorId: 3,
    accessLevel: 'basic',
    description: 'Conjunto cuidadosamente seleccionado de cristales sagrados para equilibrar tus chakras, purificar tu energía y elevar tu vibración. Cada cristal ha sido energéticamente limpiado y programado.',
    features: [
      '7 cristales para chakras principales',
      'Guía completa de uso',
      'Ritual de activación incluido',
      'Bolsa de terciopelo para almacenaje',
      'Carta de propiedades de cada cristal'
    ]
  },
  {
    id: 4,
    name: 'Curso de Astrología y Autoconocimiento',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 367,
    category: 'Cursos',
    inStock: true,
    duration: '10 semanas',
    instructor: 'Sofía Estrella',
    instructorId: 4,
    accessLevel: 'intermediate',
    isIncludedInPlan: true,
    description: 'Descubre los secretos de tu carta natal y aprende a interpretar el lenguaje de las estrellas. Este curso te llevará en un viaje de autoconocimiento profundo a través de la sabiduría astrológica.',
    modules: [
      'Fundamentos de Astrología',
      'Los Signos Zodiacales',
      'Planetas y sus Significados',
      'Las Casas Astrológicas',
      'Aspectos Planetarios',
      'Interpretación de Carta Natal',
      'Tránsitos y Predicciones',
      'Astrología Kármica'
    ],
    features: [
      'Cálculo de carta natal incluido',
      'Software astrológico gratuito',
      'Interpretación personalizada',
      'Certificación profesional',
      'Masterclass en vivo mensuales'
    ]
  },
  {
    id: 5,
    name: 'Terapia de Reiki y Sanación Energética',
    price: 45.00,
    originalPrice: 55.00,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 756,
    category: 'Terapias',
    inStock: true,
    duration: '6 sesiones',
    instructor: 'Carlos Viento',
    instructorId: 2,
    accessLevel: 'intermediate',
    isIncludedInPlan: true,
    description: 'Experimenta la poderosa energía universal del Reiki en sesiones diseñadas para restaurar tu equilibrio energético, sanar a nivel celular y activar tus capacidades de auto-sanación.',
    modules: [
      'Sesión de diagnóstico energético',
      'Limpieza de chakras',
      'Reiki tradicional Usui',
      'Sanación con cristales',
      'Activación de códigos de luz',
      'Integración y cierre'
    ],
    features: [
      'Sesiones presenciales o a distancia',
      'Maestro Reiki certificado',
      'Técnicas ancestrales auténticas',
      'Seguimiento post-sesión',
      'Material educativo incluido'
    ]
  },
  {
    id: 6,
    name: 'Oracle Cards - Mensajes del Alma',
    price: 11.25,
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 1134,
    category: 'Herramientas',
    inStock: true,
    duration: 'Consulta diaria',
    instructor: 'Sofía Estrella',
    instructorId: 4,
    accessLevel: 'free',
    isIncludedInPlan: true,
    description: 'Baraja de oracle cards canalizada especialmente para conectarte con la sabiduría de tu alma. Cada carta contiene mensajes profundos y guía espiritual para tu camino de evolución.',
    features: [
      '44 cartas de alta calidad',
      'Manual interpretativo completo',
      'Diferentes tipos de tiradas',
      'Caja rígida de protección',
      'Guía de limpieza energética',
      'Acceso a comunidad online'
    ]
  },
  {
    id: 7,
    name: 'Despertar Espiritual - Camino Interior',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviews: 445,
    category: 'Cursos',
    inStock: true,
    duration: '16 semanas',
    instructor: 'Gabriel Luz',
    instructorId: 5,
    accessLevel: 'premium',
    isIncludedInPlan: true,
    description: 'Un profundo viaje de transformación personal que te guiará a través del despertar de tu consciencia superior. Descubre tu verdadero propósito y conecta con tu esencia divina.',
    modules: [
      'Despertar de la Consciencia',
      'Limpieza de Creencias Limitantes',
      'Activación de Dones Espirituales',
      'Conexión con Guías Espirituales',
      'Propósito de Vida y Misión del Alma',
      'Integración de la Sombra',
      'Manifestación Consciente',
      'Servicio y Contribución al Mundo'
    ],
    features: [
      'Sesiones de mentoría 1:1',
      'Meditaciones canalizadas',
      'Rituales de transformación',
      'Certificación como facilitador',
      'Acceso a círculo de maestros',
      'Soporte continuo de por vida'
    ]
  },
  {
    id: 8,
    name: 'Aromaterapia Terapéutica Completa',
    price: 23.75,
    originalPrice: 28.75,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 623,
    category: 'Herramientas',
    inStock: true,
    duration: 'Kit completo',
    instructor: 'Elena Aroma',
    instructorId: 6,
    accessLevel: 'basic',
    description: 'Kit completo de aceites esenciales terapéuticos de grado médico, seleccionados para equilibrar cuerpo, mente y espíritu. Incluye difusor ultrasónico y guía completa de uso.',
    features: [
      '12 aceites esenciales puros',
      'Difusor ultrasónico premium',
      'Manual de aromaterapia holística',
      'Recetas de mezclas terapéuticas',
      'Frascos para crear tus propias mezclas',
      'Certificado de pureza y calidad'
    ]
  }
]

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Cursos': return '🧘'
    case 'Terapias': return '💖'
    case 'Herramientas': return '✨'
    default: return '🌟'
  }
}

export const getCategoryName = (category: string) => {
  switch (category) {
    case 'Cursos': return 'Cursos de Sabiduría'
    case 'Terapias': return 'Terapias Holísticas' 
    case 'Herramientas': return 'Herramientas Místicas'
    default: return category
  }
}

export const findProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === parseInt(id))
}

export const formatProductPrice = (price: number): string => {
  return `$${price.toFixed(2)} USD`
}