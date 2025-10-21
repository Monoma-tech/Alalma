'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type PlanLevel, type UserPlan, currentUserPlan, canAccessContent } from '@/data/plans'

interface UserPlanContextType {
  userPlan: UserPlan
  setUserPlan: (plan: UserPlan) => void
  canAccess: (requiredLevel: PlanLevel) => boolean
  upgradeRequired: (requiredLevel: PlanLevel) => boolean
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined)

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const [userPlan, setUserPlan] = useState<UserPlan>(currentUserPlan)

  const canAccess = (requiredLevel: PlanLevel): boolean => {
    return canAccessContent(userPlan.level, requiredLevel)
  }

  const upgradeRequired = (requiredLevel: PlanLevel): boolean => {
    return !canAccessContent(userPlan.level, requiredLevel)
  }

  // Simular persistencia del plan en localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan')
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan)
        setUserPlan(parsedPlan)
      } catch (error) {
        console.error('Error loading user plan:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('userPlan', JSON.stringify(userPlan))
  }, [userPlan])

  return (
    <UserPlanContext.Provider value={{ userPlan, setUserPlan, canAccess, upgradeRequired }}>
      {children}
    </UserPlanContext.Provider>
  )
}

export function useUserPlan() {
  const context = useContext(UserPlanContext)
  if (context === undefined) {
    throw new Error('useUserPlan must be used within a UserPlanProvider')
  }
  return context
}