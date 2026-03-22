"use client"

import { createComunicado } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'

export default function NuevoComunicadoPage() {
  async function handleSubmit(formData: FormData) {
    const result = await createComunicado({
      titulo: formData.get('titulo') as string,
      contenido: formData.get('contenido') as string,
      clienteId: 'cliente_default_001',
    })

    if (result.success) {
      redirect('/comunicados')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Nuevo Comunicado</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea id="contenido" name="contenido" rows={8} required />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Publicar Comunicado</Button>
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
