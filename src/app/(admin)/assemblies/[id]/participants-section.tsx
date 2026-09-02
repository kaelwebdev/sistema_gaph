'use client'

import { useState } from 'react'
import { createParticipant, deleteParticipant } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, User, Building2 } from 'lucide-react'

interface Participant {
  id: string
  type: 'PROPIETARIO' | 'APODERADO'
  person: { id: string; name: string; idNumber: string }
  apartment: { id: string; number: string; tower: string }
}

interface Props {
  assemblyId: string
  participants: Participant[]
}

export function ParticipantsSection({ assemblyId, participants }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleAdd(formData: FormData) {
    setIsPending(true)
    const result = await createParticipant({
      assemblyId,
      idNumber: formData.get('cedula') as string,
      tower: formData.get('torre') as string,
      number: formData.get('numero') as string,
      type: formData.get('tipo') as 'PROPIETARIO' | 'APODERADO',
    })
    setIsPending(false)
    if (result?.error) {
      alert(result.error)
    } else {
      setShowForm(false)
    }
  }

  async function handleDelete(id: string) {
    setIsPending(true)
    await deleteParticipant(id, assemblyId)
    setIsPending(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Participantes
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
            <form action={handleAdd} className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Cédula</Label>
                <Input name="cedula" placeholder="Ej: 12345678" required />
              </div>
              <div className="space-y-2">
                <Label>Torre</Label>
                <Input name="torre" placeholder="Ej: A, 10" required maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input name="numero" placeholder="Ej: 101" required />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select name="tipo" className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-transparent px-3 py-2 text-sm" required>
                  <option value="">Seleccionar</option>
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="APODERADO">Apoderado</option>
                </select>
              </div>
              <div className="md:col-span-4 flex gap-2">
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
        {participants.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{p.person.name}</p>
                  <p className="text-sm text-gray-500">CC: {p.person.idNumber}</p>
                </div>
                <div className="mx-4 h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>Torre {p.apartment.tower}, Apto {p.apartment.number}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm border rounded px-2 py-1">{p.type}</span>
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
        {participants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay participantes registrados
          </div>
        )}
      </div>
    </div>
  )
}