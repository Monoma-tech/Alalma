'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { mockUserProfile, updateVendorProfile, updateUserProfile } from '@/data/userProfile'
import { 
  ArrowLeft, 
  Save, 
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Plus,
  X,
  AlertCircle
} from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  
  // Estados para el formulario
  const [basicInfo, setBasicInfo] = useState({
    name: mockUserProfile.name,
    bio: mockUserProfile.bio || '',
    location: mockUserProfile.location || ''
  })
  
  const [vendorInfo, setVendorInfo] = useState({
    businessName: mockUserProfile.vendorInfo?.businessName || '',
    description: mockUserProfile.vendorInfo?.description || '',
    specialties: mockUserProfile.vendorInfo?.specialties || [],
    socialLinks: mockUserProfile.vendorInfo?.socialLinks || {
      website: '',
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: '',
      linkedin: ''
    }
  })
  
  const [newSpecialty, setNewSpecialty] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleVendorInfoChange = (field: string, value: string) => {
    setVendorInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setVendorInfo(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !vendorInfo.specialties.includes(newSpecialty.trim())) {
      setVendorInfo(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialtyToRemove: string) => {
    setVendorInfo(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialtyToRemove)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar información básica
      updateUserProfile({
        name: basicInfo.name,
        bio: basicInfo.bio,
        location: basicInfo.location
      })
      
      // Actualizar información de vendedor
      updateVendorProfile({
        businessName: vendorInfo.businessName,
        description: vendorInfo.description,
        specialties: vendorInfo.specialties,
        socialLinks: vendorInfo.socialLinks
      })
      
      setSuccessMessage('Perfil actualizado exitosamente')
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'instagram': return <Instagram className="w-4 h-4" />
      case 'facebook': return <Facebook className="w-4 h-4" />
      case 'youtube': return <Youtube className="w-4 h-4" />
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'linkedin': return <Linkedin className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Perfil
            </Button>
            
            <div className="flex items-center gap-4">
              {successMessage && (
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {successMessage}
                </div>
              )}
              
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información Básica */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Información Básica
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={basicInfo.name}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Biografía Personal
                </label>
                <textarea
                  value={basicInfo.bio}
                  onChange={(e) => handleBasicInfoChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Cuéntanos un poco sobre ti y tu camino espiritual..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={basicInfo.location}
                  onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ciudad, País"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Vendedor */}
        {mockUserProfile.role === 'vendor' && (
          <>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  Información Profesional
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre del Negocio
                    </label>
                    <input
                      type="text"
                      value={vendorInfo.businessName}
                      onChange={(e) => handleVendorInfoChange('businessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de tu marca o negocio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descripción Profesional
                    </label>
                    <textarea
                      value={vendorInfo.description}
                      onChange={(e) => handleVendorInfoChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe tu experiencia, enfoque y lo que ofreces a tus estudiantes..."
                    />
                  </div>
                  
                  {/* Especialidades */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Especialidades
                    </label>
                    
                    {/* Especialidades actuales */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {vendorInfo.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {specialty}
                          <button
                            type="button"
                            onClick={() => removeSpecialty(specialty)}
                            className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    {/* Agregar nueva especialidad */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Agregar especialidad"
                      />
                      <Button
                        type="button"
                        onClick={addSpecialty}
                        variant="outline"
                        className="flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  Redes Sociales y Enlaces
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(vendorInfo.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                        <div className="flex items-center">
                          {getSocialIcon(platform)}
                          <span className="ml-2">
                            {platform === 'website' ? 'Sitio Web' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                        </div>
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`https://${platform === 'website' ? 'tu-sitio' : platform}.com/tu-perfil`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium mb-1">Tip profesional</p>
                      <p className="text-blue-700">
                        Completar tus redes sociales y sitio web ayuda a generar confianza con tus estudiantes potenciales 
                        y puede aumentar tus ventas hasta un 40%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}