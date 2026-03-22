'use client'

import { useState, useEffect } from 'react'
import { buscarPersonaPorCedula } from '@/lib/actions/public'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


interface Apartamento {
  id: string
  numero: string
  torre: string
}

interface Persona {
  id: string
  nombre: string
  cedula: string
  apartamentos: Apartamento[]
}

interface IdentificacionPanelProps {
  clienteId: string
  onIdentified: (persona: Persona, apartamento: Apartamento) => void
}

export function IdentificacionPanel({ clienteId, onIdentified }: IdentificacionPanelProps) {
  const [cedula, setCedula] = useState('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([])
  const [torresDisponibles, setTorresDisponibles] = useState<string[]>([])
  const [torreSeleccionada, setTorreSeleccionada] = useState<string>('')
  const [apartamentoSeleccionado, setApartamentoSeleccionado] = useState<Apartamento | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Extract unique towers when apartments change
  useEffect(() => {
    if (apartamentos.length > 0) {
      const torres = [...new Set(apartamentos.map((apt) => apt.torre))].sort()
      setTorresDisponibles(torres)
      
      // Auto-select first tower if only one
      if (torres.length === 1 && !torreSeleccionada) {
        setTorreSeleccionada(torres[0])
      }
    }
  }, [apartamentos, torreSeleccionada])

  const handleBuscar = async () => {
    if (!cedula.trim()) {
      setError('Por favor ingresa tu número de cédula')
      return
    }

    setIsLoading(true)
    setError('')
    setPersona(null)
    setApartamentos([])
    setTorreSeleccionada('')
    setApartamentoSeleccionado(null)

    try {
      const result = await buscarPersonaPorCedula(cedula.trim(), clienteId)
      
      if (!result) {
        setError('Cédula no encontrada. Verifica tus datos.')
        return
      }

      if (result.apartamentos.length === 0) {
        setError('Esta persona no tiene apartamentos registrados.')
        return
      }

      setPersona(result)
      setApartamentos(result.apartamentos)
    } catch (err) {
      console.error('Error searching person:', err)
      setError('Error al buscar. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar()
    }
  }

  // Filter apartments by selected tower
  const apartamentosFiltrados = torreSeleccionada
    ? apartamentos.filter((apt) => apt.torre === torreSeleccionada)
    : []

  const handleApartamentoChange = (apartamentoId: string) => {
    const selected = apartamentosFiltrados.find((apt) => apt.id === apartamentoId)
    setApartamentoSeleccionado(selected || null)
  }

  const handleContinuar = () => {
    if (persona && apartamentoSeleccionado) {
      onIdentified(persona, apartamentoSeleccionado)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Identificación del Participante</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cédula Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ingresa tu número de cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleBuscar} 
            disabled={isLoading || !cedula.trim()}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Persona Found - Show Selection */}
        {persona && apartamentos.length > 0 && (
          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <div className="border-b pb-3">
              <p className="font-medium">{persona.nombre}</p>
              <p className="text-sm text-muted-foreground">Cédula: {persona.cedula}</p>
            </div>

            {/* Tower Selection */}
            {torresDisponibles.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecciona la torre:</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={torreSeleccionada}
                  onChange={(e) => {
                    setTorreSeleccionada(e.target.value)
                    setApartamentoSeleccionado(null)
                  }}
                >
                  <option value="">-- Selecciona una torre --</option>
                  {torresDisponibles.map((torre) => (
                    <option key={torre} value={torre}>
                      Torre {torre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Apartment Selection */}
            {torreSeleccionada && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecciona tu apartamento:</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={apartamentoSeleccionado?.id || ''}
                  onChange={(e) => handleApartamentoChange(e.target.value)}
                >
                  <option value="">-- Selecciona un apartamento --</option>
                  {apartamentosFiltrados.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      Apto {apt.numero}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Continue Button */}
            {apartamentoSeleccionado && (
              <Button 
                className="w-full" 
                onClick={handleContinuar}
              >
                Continuar a Votación
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        {!persona && !error && (
          <p className="text-sm text-muted-foreground">
            Ingresa tu número de cédula para identificarte y poder participar en la votación.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
