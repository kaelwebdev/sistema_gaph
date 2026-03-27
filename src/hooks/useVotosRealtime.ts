import { useEffect, useState, useCallback } from 'react'
import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
import { getEncuestaResultados } from '@/lib/actions/votos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

const supabase = createClient(supabaseUrl, supabasePublishableKey)

export function useVotosRealtime(encuestaId: string) {
  const [resultados, setResultados] = useState<Awaited<ReturnType<typeof getEncuestaResultados>>>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para cargar resultados
  const fetchResultados = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getEncuestaResultados(encuestaId)
      setResultados(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching resultados:', err)
      setError('Error al cargar resultados')
    } finally {
      setIsLoading(false)
    }
  }, [encuestaId])

  useEffect(() => {
    // Cargar resultados iniciales
    fetchResultados()

    // Suscribirse a cambios en la tabla Voto
    const channel: RealtimeChannel = supabase
      .channel(`votos-encuesta-${encuestaId}`)
      .on(
        'postgres_changes' as any,
        {
          eventType: '*',
          schema: 'public',
          table: 'Voto',
          filter: `encuestaId=eq.${encuestaId}`,
        },
        (payload: any) => {
          console.log('[Realtime] Cambio detectado en votos:', payload)
          // Recargar resultados cuando hay un cambio
          fetchResultados()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [encuestaId, fetchResultados])

  return {
    resultados,
    isLoading,
    error,
    refetch: fetchResultados,
  }
}
