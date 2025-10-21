'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Users, 
  Clock, 
  Sparkles,
  CheckCircle
} from 'lucide-react'
import { findProductById, getCategoryIcon, getCategoryName } from '@/data/products'

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()
  const product = findProductById(productId)
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'instructor'>('overview')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const images = product.gallery || [product.image]

  const handleAddToCart = () => {
    // TODO: Implementar lógica del carrito
    console.log('Agregado al carrito:', product)
  }

  const handleAddToWishlist = () => {
    // TODO: Implementar lógica de wishlist
    console.log('Agregado a favoritos:', product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Alalma Sabiduría</h1>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Espiritual Extendido */}
        <div className="flex items-center mb-8 text-sm text-gray-600">
          <button 
            onClick={() => router.push('/welcome')}
            className="flex items-center hover:text-purple-600 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Mi Camino
          </button>
          <span className="mx-2">{'>'}</span>
          <button
            onClick={() => router.push(`/dashboard?category=${product.category.toLowerCase()}`)}
            className="flex items-center hover:text-purple-600 transition-colors"
          >
            <span className="mr-1">{getCategoryIcon(product.category)}</span>
            {getCategoryName(product.category)}
          </button>
          <span className="mx-2">{'>'}</span>
          <span className="text-purple-600 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-purple-600' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryIcon(product.category)} {product.category}
                </span>
                {!product.inStock && (
                  <span className="ml-3 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Agotado
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900">{product.rating}</span>
                <span className="text-gray-500">({product.reviews.toLocaleString()} reseñas)</span>
              </div>
            </div>

            {/* Precio */}
            <div className="flex items-center gap-4">
              {discount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}% OFF
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Información rápida */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{product.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>{product.instructor}</span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-5 h-5 mr-2" />
                Agregar a Favoritos
              </Button>
            </div>

            {/* Características destacadas */}
            {product.features && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">✨ Incluye:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs de Información Detallada */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'modules', 'instructor'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'overview' | 'modules' | 'instructor')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'overview' && 'Información General'}
                  {tab === 'modules' && 'Contenido'}
                  {tab === 'instructor' && 'Instructor'}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'modules' && product.modules && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Contenido del {product.category === 'Cursos' ? 'curso' : 'programa'}
                </h3>
                <div className="grid gap-3">
                  {product.modules.map((module, index) => (
                    <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold mr-4">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {product.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.instructor}</h3>
                  <p className="text-gray-700">
                    Especialista en {product.category.toLowerCase()} con años de experiencia ayudando a personas en su camino de transformación espiritual.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}