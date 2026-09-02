'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCondominiums } from '@/lib/actions/public'

interface Condominium {
  id: string
  name: string
}

export default function LandingPage() {
  const router = useRouter()
  const [condominiums, setCondominiums] = useState<Condominium[]>([])
  const [selectedCondominiumId, setSelectedCondominiumId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCondominiums() {
      try {
        const data = await getCondominiums()
        setCondominiums(data)
      
        // Auto-select if only one
        if (data.length === 1) {
          setSelectedCondominiumId(data[0].id)
        }
      } catch (error) {
        console.error('Error loading condominiums:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCondominiums()
  }, [])

  const handleContinuar = () => {
    if (selectedCondominiumId) {
      router.push(`/condominium/${selectedCondominiumId}`)
    }
  }

  const handlePQRS = () => {
    if (selectedCondominiumId) {
      router.push(`/contacto?clienteId=${selectedCondominiumId}`)
    } else {
      alert('Por favor selecciona una unidad residencial primero')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (condominiums.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">No hay unidades residenciales disponibles</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenido al Sistema GAPH
          </h2>
          <p className="mt-2 text-gray-600">
            Selecciona tu unidad residencial para continuar
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="condominium-select"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Unidad Residencial
          </label>
          
          <select
            id="condominium-select"
            value={selectedCondominiumId}
            onChange={(e) => setSelectedCondominiumId(e.target.value)}
            className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona una opción...</option>
            {condominiums.map((condominium) => (
              <option key={condominium.id} value={condominium.id}>
                {condominium.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleContinuar}
            disabled={!selectedCondominiumId}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Continuar
          </button>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={handlePQRS}
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
          >
            ¿Tienes una petición, queja o sugerencia? Haz clic aquí
          </button>
        </div>
      </div>
    </div>
  )
}
