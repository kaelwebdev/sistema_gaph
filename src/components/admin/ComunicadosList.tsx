"use client"

import { deleteComunicado } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Trash2, Calendar, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface Comunicado {
  id: string
  titulo: string
  contenido: string
  fechaPublicacion: Date
}

interface ComunicadosListProps {
  comunicados: Comunicado[]
  clienteId: string
}

export function ComunicadosList({ comunicados, clienteId }: ComunicadosListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteComunicado(deleteId)
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {comunicados.map((comunicado) => (
          <Card key={comunicado.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{comunicado.titulo}</h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{comunicado.contenido}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(comunicado.fechaPublicacion).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/comunicados/${comunicado.id}/editar`}>
                    <Button variant="ghost" size="sm" type="button">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    type="button"
                    onClick={() => setDeleteId(comunicado.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {comunicados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay comunicados publicados
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar Comunicado"
        description="¿Estás seguro de que deseas eliminar este comunicado? Esta acción no se puede deshacer."
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  )
}
