"use client"

import { updateAnnouncement, getAnnouncementById } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'
import { useEffect, useState, use } from 'react'

interface EditarAnnouncementPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditarAnnouncementPage({ params }: EditarAnnouncementPageProps) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState<{ id: string; title: string; content: string } | null>(null)

  useEffect(() => {
    async function fetchAnnouncement() {
      const result = await getAnnouncementById(resolvedParams.id)
      if (result) {
        setAnnouncement(result)
      }
      setLoading(false)
    }
    fetchAnnouncement()
  }, [resolvedParams.id])

  async function handleSubmit(formData: FormData) {
    const result = await updateAnnouncement(resolvedParams.id, {
      title: formData.get('titulo') as string,
      content: formData.get('contenido') as string,
    })

    if (result.success) {
      redirect('/announcements')
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!announcement) {
    return <div>Anuncio no encontrado</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Anuncio</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" defaultValue={announcement.title} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea id="contenido" name="contenido" rows={8} defaultValue={announcement.content} required />
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
