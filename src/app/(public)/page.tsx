'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getClientes } from '@/lib/actions/public'
import Link from 'next/link'

interface Cliente {
  id: string
  nombre: string
}

export default function LandingPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await getClientes()
        setClientes(data)
      
        // Auto-select if only one cliente
        if (data.length === 1) {
          setSelectedClienteId(data[0].id)
        }
      } catch (error) {
        console.error('Error loading clientes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClientes()
  }, [])

  const handleContinuar = () => {
    if (selectedClienteId) {
      router.push(`/unidad/${selectedClienteId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (clientes.length === 0) {
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
            htmlFor="cliente-select"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Unidad Residencial
          </label>
          
          <select
            id="cliente-select"
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
            className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona una opción...</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={handleContinuar}
            disabled={!selectedClienteId}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Continuar
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/contacto" 
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
          >
            ¿Tienes una petición, queja o sugestão? Haz clic aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
