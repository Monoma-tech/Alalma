'use client'

import { ReactNode } from 'react'
import { GlobalNavbar } from '@/components/layout/GlobalNavbar'
import { FavoritesCartProvider } from '@/contexts/FavoritesCartContext'

interface AuthenticatedLayoutProps {
  children: ReactNode
  showNavbar?: boolean
  showSearch?: boolean
  searchTerm?: string
  onSearchChange?: (term: string) => void
}

export function AuthenticatedLayout({ 
  children, 
  showNavbar = true,
  showSearch = true,
  searchTerm = '',
  onSearchChange
}: AuthenticatedLayoutProps) {
  return (
    <FavoritesCartProvider>
      <div className="min-h-screen bg-gray-50">
        {showNavbar && (
          <GlobalNavbar 
            showSearch={showSearch}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        )}
        <main className={showNavbar ? '' : 'pt-0'}>
          {children}
        </main>
      </div>
    </FavoritesCartProvider>
  )
}