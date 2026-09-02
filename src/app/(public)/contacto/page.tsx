'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { submitPQRS } from '@/lib/actions/pqrsRequest'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectItem } from '@/components/ui/select'

function PQRSPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteId = searchParams.get('clienteId') || ''

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError('')

    const data = {
      type: formData.get('tipo') as 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA',
      subject: formData.get('asunto') as string,
      description: formData.get('descripcion') as string,
      fullName: formData.get('nombreCompleto') as string,
      email: formData.get('email') as string,
      phone: formData.get('telefono') as string,
      tower: formData.get('torre') as string,
      number: parseInt(formData.get('numero') as string),
      condominiumId: clienteId,
    }

    const result = await submitPQRS(data)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setSuccess(true)
      setIsPending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Tu PQRSRequest ha sido registrado exitosamente. Te contactaremos pronto.
            </p>
            <Button onClick={() => router.push('/')}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push(clienteId ? `/?clienteId=${clienteId}` : '/')}
            className="mb-4"
          >
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">PQRSRequest</h1>
          <p className="text-gray-600 mt-2">
            Envíanos tu petición, queja, reclamo, sugerencia
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de solicitud *</Label>
                <Select name="tipo" required defaultValue="">
                  <option value="" disabled>Selecciona el tipo</option>
                  <SelectItem value="PREGUNTA">Pregunta</SelectItem>
                  <SelectItem value="QUEJA">Queja</SelectItem>
                  <SelectItem value="RECLAMO">Reclamo</SelectItem>
                  <SelectItem value="SUGERENCIA">Sugerencia</SelectItem>
                </Select>
              </div>

              <div>
                <Label htmlFor="asunto">Asunto *</Label>
                <Input 
                  id="asunto" 
                  name="asunto" 
                  placeholder="Breve descripción del tema"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea 
                  id="descripcion" 
                  name="descripcion" 
                  placeholder="Describe detalladamente tu solicitud"
                  rows={4}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="nombreCompleto">Nombre completo *</Label>
                <Input 
                  id="nombreCompleto" 
                  name="nombreCompleto" 
                  placeholder="Tu nombre completo"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="torre">Torre *</Label>
                  <Input 
                    id="torre" 
                    name="torre" 
                    placeholder="Ej: A, B, 1"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Apartment *</Label>
                  <Input 
                    id="numero" 
                    name="numero" 
                    type="number"
                    placeholder="Ej: 101"
                    required 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="tu@email.com"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="telefono">Número de contacto *</Label>
                <Input 
                  id="telefono" 
                  name="telefono" 
                  type="tel"
                  placeholder="Ej: 3001234567"
                  required 
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PQRSPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    }>
      <PQRSPageContent />
    </Suspense>
  )
}