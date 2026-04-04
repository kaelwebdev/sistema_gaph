'use client'

import { useState, useEffect } from 'react'
import { getPQRS, updatePQRSEstado, deletePQRS } from '@/lib/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Building2, Trash2 } from 'lucide-react'
import { env } from '@/lib/env'

const tipoColors: Record<string, string> = {
  PREGUNTA: 'bg-blue-100 text-blue-800',
  QUEJA: 'bg-red-100 text-red-800',
  RECLAMO: 'bg-orange-100 text-orange-800',
  SUGERENCIA: 'bg-purple-100 text-purple-800',
}

const tipoLabels: Record<string, string> = {
  PREGUNTA: 'Pregunta',
  QUEJA: 'Queja',
  RECLAMO: 'Reclamo',
  SUGERENCIA: 'Sugerencia',
}

const estadoColors: Record<string, string> = {
  SIN_LEER: 'bg-gray-100 text-gray-800',
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  RESUELTO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
}

const estadoLabels: Record<string, string> = {
  SIN_LEER: 'Sin leer',
  PENDIENTE: 'Pendiente',
  RESUELTO: 'Resuelto',
  RECHAZADO: 'Rechazado',
}

interface PQRS {
  id: string
  tipo: string
  asunto: string
  descripcion: string
  nombreCompleto: string
  email: string
  telefono: string
  torre: string
  numero: number
  estado: string
  fecha: Date
  apartamento: { torre: string; numero: number } | null
}

export default function PQRSPage() {
  const [pqrsList, setPqrsList] = useState<PQRS[]>([])
  const [loading, setLoading] = useState(true)
  const [pqrsToDelete, setPqrsToDelete] = useState<string | null>(null)

  // Fetch on mount
  useEffect(() => {
    async function loadPQRS() {
      try {
        const data = await getPQRS(env.NEXT_PUBLIC_DEFAULT_CLIENT_ID)
        setPqrsList(data as PQRS[])
      } catch (error) {
        console.error('Error loading PQRS:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPQRS()
  }, [])

  async function handleEstadoChange(pqrsId: string, nuevoEstado: string) {
    await updatePQRSEstado(pqrsId, nuevoEstado as any)
    setPqrsList(prev => 
      prev.map(p => p.id === pqrsId ? { ...p, estado: nuevoEstado } : p)
    )
  }

  async function handleDelete(pqrsId: string) {
    const result = await deletePQRS(pqrsId)
    if (result.success) {
      setPqrsList(prev => prev.filter(p => p.id !== pqrsId))
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">PQRS</h1>

      <div className="space-y-4">
        {pqrsList.map((pqrs) => (
          <Card key={pqrs.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${tipoColors[pqrs.tipo]}`}>
                    {tipoLabels[pqrs.tipo]}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${estadoColors[pqrs.estado]}`}>
                    {estadoLabels[pqrs.estado]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(pqrs.fecha).toLocaleDateString('es-CO')}
                  </span>
                </div>
                {pqrs.email && (
                  <span className="text-sm text-gray-500">{pqrs.email}</span>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{pqrs.asunto}</h3>
              <p className="text-gray-900 mb-4 whitespace-pre-wrap">{pqrs.descripcion}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {pqrs.nombreCompleto && (
                  <span>{pqrs.nombreCompleto}</span>
                )}
                {pqrs.telefono && (
                  <span>{pqrs.telefono}</span>
                )}
                {pqrs.apartamento && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Torre {pqrs.apartamento.torre}, Apto {pqrs.apartamento.numero}
                  </div>
                )}
              </div>

              {/* Cambiar estado */}
              <div className="flex gap-2 pt-4 border-t">
                <span className="text-sm text-gray-500 self-center mr-2">Cambiar estado:</span>
                {['PENDIENTE', 'RESUELTO', 'RECHAZADO'].map((estado) => (
                  <Button
                    key={estado}
                    size="sm"
                    variant={pqrs.estado === estado ? 'default' : 'outline'}
                    onClick={() => handleEstadoChange(pqrs.id, estado)}
                  >
                    {estadoLabels[estado]}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-auto"
                  onClick={() => setPqrsToDelete(pqrs.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pqrsList.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay solicitudes PQRS
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pqrsToDelete !== null}
        onOpenChange={(open) => !open && setPqrsToDelete(null)}
        onConfirm={() => {
          if (pqrsToDelete) {
            handleDelete(pqrsToDelete)
          }
        }}
        title="Eliminar PQRS"
        description="¿Estás seguro de que deseas eliminar este PQRS? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}