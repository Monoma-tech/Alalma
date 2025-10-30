export type PlanLevel = 'free' | 'basic' | 'intermediate' | 'premium'

export interface UserPlan {
  level: PlanLevel
  name: string
  monthlyCredits: number
  usedCredits: number
  features: string[]
  price: number
  billingCycle: 'monthly' | 'yearly'
  nextBilling?: string
  isActive: boolean
}

export interface PlanDetails {
  level: PlanLevel
  name: string
  price: number
  yearlyPrice: number
  monthlyCredits: number
  features: string[]
  badge?: string
  color: string
  popular?: boolean
}

export const availablePlans: PlanDetails[] = [
  {
    level: 'free',
    name: 'Explorador',
    price: 0,
    yearlyPrice: 0,
    monthlyCredits: 1,
    features: [
      '1 curso gratuito por mes',
      'Acceso a herramientas básicas',
      'Comunidad general',
      'Contenido introductorio'
    ],
    color: 'gray',
    badge: 'Gratis'
  },
  {
    level: 'basic',
    name: 'Buscador',
    price: 7.99,
    yearlyPrice: 79.99,
    monthlyCredits: 3,
    features: [
      '3 cursos por mes',
      'Herramientas completas',
      '50% descuento en terapias',
      'Acceso a meditaciones guiadas',
      'Soporte por email'
    ],
    color: 'blue'
  },
  {
    level: 'intermediate',
    name: 'Transformador',
    price: 12.99,
    yearlyPrice: 129.99,
    monthlyCredits: 999, // Ilimitado
    features: [
      'Cursos ilimitados',
      '2 terapias incluidas por mes',
      'Contenido exclusivo premium',
      'Masterclasses en vivo',
      'Acceso anticipado a nuevo contenido',
      'Soporte prioritario'
    ],
    color: 'purple',
    popular: true,
    badge: 'Más Popular'
  },
  {
    level: 'premium',
    name: 'Maestro',
    price: 24.99,
    yearlyPrice: 249.99,
    monthlyCredits: 999, // Ilimitado
    features: [
      'Todo lo anterior',
      'Terapias 1:1 ilimitadas',
      'Mentoría personalizada',
      'Comunidad privada de maestros',
      'Certificaciones oficiales',
      'Acceso a retiros virtuales',
      'Consulta astrológica mensual',
      'Soporte telefónico 24/7'
    ],
    color: 'gold',
    badge: 'Máximo Nivel'
  }
]

// Usuario actual simulado
export const currentUserPlan: UserPlan = {
  level: 'free',
  name: 'Explorador',
  monthlyCredits: 1,
  usedCredits: 0,
  features: availablePlans[0].features,
  price: 0,
  billingCycle: 'monthly',
  isActive: true
}

export const getPlanByLevel = (level: PlanLevel): PlanDetails | undefined => {
  return availablePlans.find(plan => plan.level === level)
}

export const canAccessContent = (userPlan: PlanLevel, requiredLevel: PlanLevel): boolean => {
  const levels = ['free', 'basic', 'intermediate', 'premium']
  const userIndex = levels.indexOf(userPlan)
  const requiredIndex = levels.indexOf(requiredLevel)
  return userIndex >= requiredIndex
}

export const getPlanColor = (level: PlanLevel): string => {
  const plan = getPlanByLevel(level)
  return plan?.color || 'gray'
}

export const formatPrice = (price: number): string => {
  return price === 0 ? 'Gratis' : `$${price.toFixed(2)} USD`
}