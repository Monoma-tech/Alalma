'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CategoriesJourney } from '@/components/categories/CategoriesJourney'

function CategoriesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')

  useEffect(() => {
    // Si hay una búsqueda, redirigir al dashboard con el término de búsqueda
    if (searchQuery) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`)
      return
    }
  }, [searchQuery, router])

  // Si hay búsqueda, no mostrar nada (estamos redirigiendo)
  if (searchQuery) {
    return null
  }

  return <CategoriesJourney />
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando categorías...</p>
      </div>
    </div>}>
      <CategoriesContent />
    </Suspense>
  )
}