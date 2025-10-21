import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Filter, X } from 'lucide-react'

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  hideCategories?: boolean
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  categories,
  hideCategories = false
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    
    onFiltersChange({ ...filters, categories: updatedCategories })
  }

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000000],
      minRating: 0,
      inStock: false
    })
  }

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar cursos, terapias o herramientas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtros</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpiar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`grid grid-cols-1 gap-6 ${hideCategories ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
            {/* Categories - Solo mostrar si no están ocultas */}
            {!hideCategories && (
              <div>
                <h4 className="font-semibold mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        className="mr-2 rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h4 className="font-semibold mb-3">Rango de Precio</h4>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceRange[0]}
                  onChange={(e) => 
                    onFiltersChange({
                      ...filters,
                      priceRange: [Number(e.target.value), filters.priceRange[1]]
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })
                  }
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold mb-3">Calificación Mínima</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === rating}
                      onChange={() => onFiltersChange({ ...filters, minRating: rating })}
                      className="mr-2"
                    />
                    <span className="text-sm">{rating}+ estrellas</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-semibold mb-3">Disponibilidad</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                  className="mr-2 rounded border-gray-300"
                />
                <span className="text-sm">Solo en stock</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}