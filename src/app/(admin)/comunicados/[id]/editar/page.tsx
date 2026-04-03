"use client"

import { updateComunicado, getComunicadoById } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'
import { useEffect, useState, use } from 'react'

interface EditarComunicadoPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditarComunicadoPage({ params }: EditarComunicadoPageProps) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [comunicado, setComunicado] = useState<{ id: string; titulo: string; contenido: string } | null>(null)

  useEffect(() => {
    async function fetchComunicado() {
      const result = await getComunicadoById(resolvedParams.id)
      if (result) {
        setComunicado(result)
      }
      setLoading(false)
    }
    fetchComunicado()
  }, [resolvedParams.id])

  async function handleSubmit(formData: FormData) {
    const result = await updateComunicado(resolvedParams.id, {
      titulo: formData.get('titulo') as string,
      contenido: formData.get('contenido') as string,
    })

    if (result.success) {
      redirect('/comunicados')
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!comunicado) {
    return <div>Comunicado no encontrado</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Comunicado</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" defaultValue={comunicado.titulo} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea id="contenido" name="contenido" rows={8} defaultValue={comunicado.contenido} required />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar Cambios</Button>
              <Button variant="outline" type="button" onClick={() => history.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
