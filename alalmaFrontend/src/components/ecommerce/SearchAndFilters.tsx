import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Filter, X } from 'lucide-react'

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
}

interface SearchAndFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  hideCategories?: boolean
}

export function SearchAndFilters({
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

  const activeFiltersCount = filters.categories.length + (filters.minRating > 0 ? 1 : 0) + (filters.inStock ? 1 : 0)

  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-300 cursor-pointer"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          {filters.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filters.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                  <button
                    onClick={() => onFiltersChange({
                      ...filters,
                      categories: filters.categories.filter(c => c !== category)
                    })}
                    className="hover:text-purple-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtros</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="cursor-pointer">
                  Limpiar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="cursor-pointer">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`grid grid-cols-1 gap-6 ${hideCategories ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
            {!hideCategories && (
              <div>
                <h4 className="font-semibold mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
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

            <div>
              <h4 className="font-semibold mb-3">Rango de Precio</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.priceRange[0]}
                  onChange={(e) => 
                    onFiltersChange({
                      ...filters,
                      priceRange: [Number(e.target.value), filters.priceRange[1]]
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Calificación Mínima</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer">
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

            <div>
              <h4 className="font-semibold mb-3">Disponibilidad</h4>
              <label className="flex items-center cursor-pointer">
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
