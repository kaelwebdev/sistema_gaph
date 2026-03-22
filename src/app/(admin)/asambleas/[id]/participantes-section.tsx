'use client'

import { useState, startTransition } from 'react'
import { createParticipante, deleteParticipante } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransition } from 'react'
import { Plus, Trash2, User, Building2 } from 'lucide-react'

interface Participante {
  id: string
  tipo: 'PROPIETARIO' | 'APODERADO'
  persona: { id: string; nombre: string; cedula: string }
  apartamento: { id: string; numero: string; torre: string }
}

interface Props {
  asambleaId: string
  participantes: Participante[]
}

export function ParticipantesSection({ asambleaId, participantes }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleAdd(formData: FormData) {
    setIsPending(true)
    const result = await createParticipante({
      asambleaId,
      apartamentoId: formData.get('apartamentoId') as string,
      personaId: formData.get('personaId') as string,
      tipo: formData.get('tipo') as 'PROPIETARIO' | 'APODERADO',
    })
    setIsPending(false)
    if (result.error) {
      alert(result.error)
    } else {
      setShowForm(false)
    }
  }

  async function handleDelete(id: string) {
    setIsPending(true)
    await deleteParticipante(id, asambleaId)
    setIsPending(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {participantes.length} Participante{participantes.length !== 1 && 's'}
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Participante
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nuevo Participante</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Apartamento</Label>
                <Input name="apartamentoId" placeholder="ID del apartamento" required />
              </div>
              <div className="space-y-2">
                <Label>Persona</Label>
                <Input name="personaId" placeholder="ID de la persona" required />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select name="tipo" className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-transparent px-3 py-2 text-sm" required>
                  <option value="">Seleccionar</option>
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="APODERADO">Apoderado</option>
                </select>
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Agregando...' : 'Agregar'}
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {participantes.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{p.persona.nombre}</p>
                  <p className="text-sm text-gray-500">CC: {p.persona.cedula}</p>
                </div>
                <div className="mx-4 h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>Torre {p.apartamento.torre}, Apto {p.apartamento.numero}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm border rounded px-2 py-1">{p.tipo}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {participantes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay participantes registrados
          </div>
        )}
      </div>
    </div>
  )
}