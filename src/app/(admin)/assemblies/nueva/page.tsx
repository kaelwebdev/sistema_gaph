"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createAssembly } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { env } from '@/lib/env'

export default function NuevaAssembliesPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const title = formData.get('titulo') as string
    const date = formData.get('fecha') as string
    
    // Obtener la sesión
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const condominiumId = session?.user?.clienteId || env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID
    
    console.log('Creando asamblea:', { title, date, condominiumId })
    
    const result = await createAssembly({
      title,
      date: new Date(date),
      condominiumId,
    })

    setIsSubmitting(false)

    if (result.success) {
      console.log('Assemblies creada, redirigiendo...')
      router.refresh()
      router.push('/assemblies')
    } else {
      console.error('Error al crear:', result.error)
      setError(result.error || 'Error desconocido al crear la assemblie')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Nueva Asamblea</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" placeholder="Primera Asamblea Ordinaria 2024" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="datetime-local" required />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Asamblea'}
              </Button>
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
