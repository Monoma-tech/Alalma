/**
 * INSTRUCTORS/VENDORS DATA - Información completa de instructores
 * =============================================================
 * 
 * Mock data para los perfiles públicos de instructores/vendedores
 */

export interface InstructorProfile {
  id: number
  name: string
  title: string
  bio: string
  avatar: string
  coverImage: string
  location: string
  joinedDate: string
  verified: boolean
  stats: {
    totalStudents: number
    totalCourses: number
    averageRating: number
    totalReviews: number
    totalSales: number
  }
  specialties: string[]
  socialLinks: {
    website?: string
    instagram?: string
    youtube?: string
    facebook?: string
  }
  courses: number[] // IDs de productos que ha creado
}

export const mockInstructors: InstructorProfile[] = [
  {
    id: 1,
    name: "María Luna",
    title: "Maestra en Mindfulness y Meditación",
    bio: "Con más de 15 años de experiencia en prácticas contemplativas, María ha dedicado su vida a guiar personas hacia la paz interior. Certificada en Mindfulness-Based Stress Reduction (MBSR) y entrenada en tradiciones budistas tibetanas, combina sabiduría ancestral con técnicas modernas de bienestar.",
    avatar: "/avatars/maria-luna.jpg",
    coverImage: "/covers/meditation-cover.jpg",
    location: "Medellín, Colombia",
    joinedDate: "2020-03-15",
    verified: true,
    stats: {
      totalStudents: 2847,
      totalCourses: 5,
      averageRating: 4.9,
      totalReviews: 342,
      totalSales: 15690
    },
    specialties: ["Mindfulness", "Meditación", "Reducción de Estrés", "Budismo Tibetano"],
    socialLinks: {
      website: "https://marialuna-mindfulness.com",
      instagram: "@marialuna.mindfulness",
      youtube: "María Luna Meditación"
    },
    courses: [1, 5] // Mindfulness y Meditación, Meditación Cuencos
  },
  {
    id: 2,
    name: "Carlos Viento",
    title: "Sanador Energético Certificado",
    bio: "Terapeuta holístico con formación en Reiki, sanación pránica y terapias vibracionales. Durante 12 años ha trabajado con miles de personas ayudándolas a liberar bloqueos emocionales y reconectar con su poder interior. Su enfoque combina técnicas ancestrales con un entendimiento moderno de la energía.",
    avatar: "/avatars/carlos-viento.jpg",
    coverImage: "/covers/healing-cover.jpg",
    location: "Bogotá, Colombia",
    joinedDate: "2019-08-22",
    verified: true,
    stats: {
      totalStudents: 1923,
      totalCourses: 3,
      averageRating: 4.8,
      totalReviews: 287,
      totalSales: 12450
    },
    specialties: ["Reiki", "Sanación Energética", "Liberación Emocional", "Terapias Vibracionales"],
    socialLinks: {
      website: "https://carlosviento-healing.com",
      instagram: "@carlos.viento.healing",
      facebook: "Carlos Viento Sanación"
    },
    courses: [2, 5] // Terapia de Sanación Emocional, Terapia de Reiki
  },
  {
    id: 3,
    name: "Luna Cristal",
    title: "Experta en Cristaloterapia y Gemas",
    bio: "Especialista en el poder sanador de los cristales y piedras preciosas. Con 10 años de estudio en gemología metafísica y cristaloterapia, Luna ha creado métodos únicos para trabajar con la energía de los minerales. Sus kits de cristales han transformado la vida de cientos de personas.",
    avatar: "/avatars/luna-cristal.jpg",
    coverImage: "/covers/crystals-cover.jpg",
    location: "Cartagena, Colombia",
    joinedDate: "2021-01-10",
    verified: true,
    stats: {
      totalStudents: 1456,
      totalCourses: 2,
      averageRating: 4.7,
      totalReviews: 198,
      totalSales: 8930
    },
    specialties: ["Cristaloterapia", "Gemología Metafísica", "Sanación con Piedras", "Energía Mineral"],
    socialLinks: {
      website: "https://lunacristal.co",
      instagram: "@luna.cristal.terapia"
    },
    courses: [3] // Kit de Cristales
  },
  {
    id: 4,
    name: "Sofía Estrella",
    title: "Astróloga y Guía Espiritual",
    bio: "Astróloga profesional con certificación internacional en astrología psicológica y evolutiva. Durante 8 años ha guiado a personas en su autoconocimiento a través de la sabiduría de los astros. Su enfoque combina astrología tradicional con psicología transpersonal.",
    avatar: "/avatars/sofia-estrella.jpg",
    coverImage: "/covers/astrology-cover.jpg",
    location: "Cali, Colombia",
    joinedDate: "2020-11-05",
    verified: true,
    stats: {
      totalStudents: 1789,
      totalCourses: 2,
      averageRating: 4.8,
      totalReviews: 234,
      totalSales: 10670
    },
    specialties: ["Astrología Psicológica", "Astrología Evolutiva", "Cartas Natales", "Tránsitos Planetarios"],
    socialLinks: {
      website: "https://sofiaestrella-astrologia.com",
      instagram: "@sofia.estrella.astro",
      youtube: "Sofía Estrella Astrología"
    },
    courses: [4, 6] // Curso de Astrología, Oracle Cards
  },
  {
    id: 5,
    name: "Gabriel Luz",
    title: "Maestro en Despertar Espiritual",
    bio: "Guía espiritual y facilitador de procesos de despertar de conciencia. Con 20 años de experiencia en meditación Vipassana, filosofía Advaita y enseñanzas no-duales, Gabriel acompaña a buscadores en su camino hacia la realización del Ser. Sus retiros y cursos han impactado miles de vidas.",
    avatar: "/avatars/gabriel-luz.jpg",
    coverImage: "/covers/awakening-cover.jpg",
    location: "Medellín, Colombia",
    joinedDate: "2018-06-12",
    verified: true,
    stats: {
      totalStudents: 3421,
      totalCourses: 3,
      averageRating: 4.9,
      totalReviews: 456,
      totalSales: 21340
    },
    specialties: ["Despertar Espiritual", "No-Dualidad", "Vipassana", "Filosofía Advaita"],
    socialLinks: {
      website: "https://gabrielluz-despertar.com",
      instagram: "@gabriel.luz.despertar",
      youtube: "Gabriel Luz Despertar",
      facebook: "Gabriel Luz Enseñanzas"
    },
    courses: [7] // Despertar Espiritual
  },
  {
    id: 6,
    name: "Elena Aroma",
    title: "Aromaterapeuta Holística",
    bio: "Especialista en aromaterapia terapéutica y aceites esenciales puros. Con formación en Francia e Inglaterra, Elena trae las mejores técnicas europeas de aromaterapia. Sus mezclas personalizadas y tratamientos aromáticos han ayudado a cientos de personas a sanar emocionalmente.",
    avatar: "/avatars/elena-aroma.jpg",
    coverImage: "/covers/aromatherapy-cover.jpg",
    location: "Barranquilla, Colombia",
    joinedDate: "2021-04-18",
    verified: false,
    stats: {
      totalStudents: 892,
      totalCourses: 1,
      averageRating: 4.6,
      totalReviews: 127,
      totalSales: 5680
    },
    specialties: ["Aromaterapia", "Aceites Esenciales", "Sanación Aromática", "Mezclas Terapéuticas"],
    socialLinks: {
      instagram: "@elena.aroma.terapia",
      facebook: "Elena Aroma Terapias"
    },
    courses: [8] // Aromaterapia
  }
]

// Función para obtener instructor por ID
export const getInstructorById = (id: number): InstructorProfile | undefined => {
  return mockInstructors.find(instructor => instructor.id === id)
}

// Función para obtener instructores por producto
export const getInstructorByProductId = (productId: number): InstructorProfile | undefined => {
  return mockInstructors.find(instructor => instructor.courses.includes(productId))
}

// Función para obtener productos de un instructor
export const getInstructorProducts = (instructorId: number) => {
  const instructor = getInstructorById(instructorId)
  return instructor?.courses || []
}

// Función para formatear estadísticas
export const formatInstructorStats = (stats: InstructorProfile['stats']) => {
  return {
    students: stats.totalStudents > 1000 
      ? `${(stats.totalStudents / 1000).toFixed(1)}k` 
      : stats.totalStudents.toString(),
    courses: stats.totalCourses.toString(),
    rating: stats.averageRating.toFixed(1),
    reviews: stats.totalReviews > 1000 
      ? `${(stats.totalReviews / 1000).toFixed(1)}k` 
      : stats.totalReviews.toString(),
    sales: stats.totalSales > 1000 
      ? `$${(stats.totalSales / 1000).toFixed(1)}k` 
      : `$${stats.totalSales}`
  }
}