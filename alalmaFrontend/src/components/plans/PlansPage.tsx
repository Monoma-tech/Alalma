'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Zap,
  Heart,
  Shield,
  Search,
  Home
} from 'lucide-react'
import { availablePlans, formatPrice, type PlanLevel } from '@/data/plans'
import { useUserPlan } from '@/contexts/UserPlanContext'
import { useAuth } from '@/contexts/AuthContext'

export function PlansPage() {
  const router = useRouter()
  const { userPlan, setUserPlan } = useUserPlan()
  const { isAuthenticated } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<PlanLevel | null>(null)

  const getPlanIcon = (level: PlanLevel) => {
    switch (level) {
      case 'free': return <Search className="w-8 h-8 text-gray-500" />
      case 'basic': return <Heart className="w-8 h-8 text-blue-500" />
      case 'intermediate': return <Zap className="w-8 h-8 text-purple-500" />
      case 'premium': return <Crown className="w-8 h-8 text-yellow-500" />
    }
  }

  const getPlanGradient = (level: PlanLevel) => {
    switch (level) {
      case 'free': return 'from-gray-50 to-gray-100'
      case 'basic': return 'from-blue-50 to-blue-100'
      case 'intermediate': return 'from-purple-50 to-purple-100'
      case 'premium': return 'from-yellow-50 to-yellow-100'
    }
  }

  const getPlanBorder = (level: PlanLevel, isPopular?: boolean) => {
    if (isPopular) return 'border-purple-500 shadow-purple-200'
    switch (level) {
      case 'free': return 'border-gray-200'
      case 'basic': return 'border-blue-200'
      case 'intermediate': return 'border-purple-200'
      case 'premium': return 'border-yellow-200'
    }
  }

  const handleSelectPlan = (level: PlanLevel) => {
    setSelectedPlan(level)
    
    // Simular selección de plan con feedback visual
    setTimeout(() => {
      const selectedPlanDetails = availablePlans.find(p => p.level === level)
      if (selectedPlanDetails) {
        const newUserPlan = {
          level,
          name: selectedPlanDetails.name,
          monthlyCredits: selectedPlanDetails.monthlyCredits,
          usedCredits: 0,
          features: selectedPlanDetails.features,
          price: billingCycle === 'yearly' ? selectedPlanDetails.yearlyPrice : selectedPlanDetails.price,
          billingCycle,
          isActive: true,
          nextBilling: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
        
        setUserPlan(newUserPlan)
        
        // Mostrar por más tiempo el plan seleccionado antes de navegar
        setTimeout(() => {
          setSelectedPlan(null)
          // Navegar al dashboard con el nuevo plan
          router.push('/dashboard')
        }, 1000)
      }
    }, 800)
  }

  const getCurrentPrice = (plan: typeof availablePlans[0]) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.price
  }

  const getYearlySavings = (plan: typeof availablePlans[0]) => {
    const monthlyCost = plan.price * 12
    const yearlyCost = plan.yearlyPrice
    return monthlyCost - yearlyCost
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header con navegación condicional */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image 
                src="/with_padding.png" 
                alt="Alalma Sabiduría" 
                width={200}
                height={53}
                className="h-12 w-auto cursor-pointer"
                onClick={() => router.push('/')}
                priority
                quality={95}
              />
            </div>
            
            {/* Navegación condicional basada en autenticación */}
            {isAuthenticated && userPlan.isActive && userPlan.level !== 'free' ? (
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="flex items-center cursor-pointer"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Elige tu Camino de Transformación
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Accede a cursos, terapias y herramientas diseñadas para elevar tu consciencia y transformar tu vida. 
            Cada plan está cuidadosamente creado para acompañarte en tu viaje espiritual.
          </p>

          {/* Current Plan Badge - Solo mostrar si tiene un plan activo */}
          {userPlan.isActive && userPlan.level !== 'free' && (
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-8 animate-bounce-in hover-glow">
              <Shield className="w-4 h-4 mr-2 animate-pulse-glow" />
              Plan actual: {userPlan.name}
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="bg-white border border-gray-200 rounded-lg p-1 hover-lift card-enhanced">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer transform ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-sm scale-105'
                  : 'text-gray-700 hover:text-purple-600 hover:scale-105'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 relative cursor-pointer transform ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white shadow-sm scale-105'
                  : 'text-gray-700 hover:text-purple-600 hover:scale-105'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce-in animate-pulse">
                Ahorra
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-animation">
          {availablePlans.map((plan) => (
            <Card 
              key={plan.level} 
              className={`relative overflow-hidden card-enhanced hover-lift-strong border-2 group ${
                selectedPlan === plan.level 
                  ? 'border-green-500 shadow-green-200 scale-105 ring-4 ring-green-200 animate-pulse-glow' 
                  : getPlanBorder(plan.level, plan.popular)
              } ${plan.popular ? 'scale-105 animate-float' : ''} ${
                selectedPlan === plan.level ? 'animate-pulse' : ''
              }`}
            >
              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 text-center py-2 text-sm font-medium text-white z-10 ${
                  plan.popular ? 'bg-purple-600' : 'bg-gray-600'
                }`}>
                  {plan.badge}
                </div>
              )}
              
              {/* Indicador de selección */}
              {selectedPlan === plan.level && (
                <div className="absolute top-0 left-0 right-0 text-center py-2 text-sm font-medium text-white z-20 bg-green-600">
                  ✨ Plan Seleccionado ✨
                </div>
              )}
              
              <CardHeader className={`text-center ${
                selectedPlan === plan.level ? 'pt-12' : plan.badge ? 'pt-12' : 'pt-8'
              } bg-gradient-to-br ${getPlanGradient(plan.level)}`}>
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.level)}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {formatPrice(getCurrentPrice(plan))}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-gray-600">
                      {billingCycle === 'monthly' ? 'por mes' : 'por año'}
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <div className="text-green-600 font-medium">
                          Ahorras ${getYearlySavings(plan).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Credits */}
                {plan.monthlyCredits < 999 ? (
                  <div className="text-sm text-gray-600 mb-4">
                    {plan.monthlyCredits} {plan.monthlyCredits === 1 ? 'curso' : 'cursos'} por mes
                  </div>
                ) : (
                  <div className="text-sm text-purple-600 font-medium mb-4">
                    ✨ Acceso Ilimitado
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6">
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.level)}
                  disabled={userPlan.level === plan.level || selectedPlan === plan.level}
                  className={`w-full cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                      : 'bg-gray-900 hover:bg-gray-800'
                  } ${
                    userPlan.level === plan.level
                      ? 'bg-gray-300 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {selectedPlan === plan.level ? (
                    'Procesando...'
                  ) : userPlan.level === plan.level ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Plan Actual
                    </>
                  ) : plan.level === 'free' ? (
                    'Mantener Gratuito'
                  ) : (
                    'Comenzar Transformación'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, puedes actualizar o degradar tu plan cuando lo desees. Los cambios se aplicarán inmediatamente y ajustaremos la facturación proporcionalmente.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué incluyen las terapias?
              </h3>
              <p className="text-gray-600">
                Las terapias incluyen sesiones personalizadas con terapeutas certificados, seguimiento continuo y material de apoyo. Pueden realizarse presencialmente o a distancia.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Hay permanencia mínima?
              </h3>
              <p className="text-gray-600">
                No hay permanencia mínima. Puedes cancelar tu suscripción en cualquier momento y seguirás teniendo acceso hasta el final de tu período de facturación.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}