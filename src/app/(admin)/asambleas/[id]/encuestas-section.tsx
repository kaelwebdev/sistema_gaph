'use client'

import { useState } from 'react'
import { createEncuesta, createOpcion, deleteEncuesta, updateEncuesta } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Lock, Unlock } from 'lucide-react'

interface Opcion {
  id: string
  texto: string
  orden: number
}

interface Encuesta {
  id: string
  pregunta: string
  tipo: 'BINARIA' | 'MULTIPLE'
  estado: 'ACTIVA' | 'CERRADA'
  orden: number
  opciones: Opcion[]
}

interface Props {
  asambleaId: string
  encuestas: Encuesta[]
}

export function EncuestasSection({ asambleaId, encuestas }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newOptions, setNewOptions] = useState<string[]>([''])

  async function handleCreateEncuesta(formData: FormData) {
    const opciones = newOptions.filter(o => o.trim())
    
    setIsPending(true)
    const result = await createEncuesta({
      pregunta: formData.get('pregunta') as string,
      tipo: (formData.get('tipo') as 'BINARIA' | 'MULTIPLE') || 'MULTIPLE',
      orden: parseInt(formData.get('orden') as string) || 0,
      asambleaId,
    })

    if (result.success && result.data && opciones.length > 0) {
      for (let i = 0; i < opciones.length; i++) {
        await createOpcion({
          texto: opciones[i],
          orden: i,
          encuestaId: result.data.id,
        })
      }
      setShowForm(false)
      setNewOptions([''])
    }
    setIsPending(false)
  }

  async function handleToggleEstado(encuesta: Encuesta) {
    setIsPending(true)
    const newEstado = encuesta.estado === 'ACTIVA' ? 'CERRADA' : 'ACTIVA'
    await updateEncuesta(encuesta.id, { estado: newEstado }, asambleaId)
    setIsPending(false)
  }

  async function handleDelete(id: string) {
    setIsPending(true)
    await deleteEncuesta(id, asambleaId)
    setIsPending(false)
  }

  function addOption() {
    setNewOptions([...newOptions, ''])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {encuestas.length} Encuesta{encuestas.length !== 1 && 's'}
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Encuesta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nueva Encuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreateEncuesta} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-2">
                  <Label>Pregunta</Label>
                  <Input name="pregunta" placeholder="¿Está de acuerdo con...?" required />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select name="tipo" className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-transparent px-3 py-2 text-sm" defaultValue="MULTIPLE">
                    <option value="BINARIA">Binaria (Sí/No)</option>
                    <option value="MULTIPLE">Múltiple</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Orden</Label>
                <Input name="orden" type="number" defaultValue="0" className="w-24" />
              </div>

              <div className="space-y-2">
                <Label>Opciones de respuesta</Label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions]
                        updated[i] = e.target.value
                        setNewOptions(updated)
                      }}
                      placeholder={`Opción ${i + 1}`}
                    />
                    {newOptions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar opción
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creando...' : 'Crear Encuesta'}
                </Button>
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {encuestas.map((encuesta) => (
          <Card key={encuesta.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{encuesta.pregunta}</h3>
                    <span className="text-xs border rounded px-2 py-1">{encuesta.tipo}</span>
                    <span className={`text-xs rounded px-2 py-1 ${encuesta.estado === 'ACTIVA' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {encuesta.estado}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {encuesta.opciones.map((op) => (
                      <span key={op.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {op.texto}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleEstado(encuesta)}
                    disabled={isPending}
                  >
                    {encuesta.estado === 'ACTIVA' ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(encuesta.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {encuestas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay encuestas creadas
          </div>
        )}
      </div>
    </div>
  )
}