import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
import { getEncuestaResultados } from '@/lib/actions/votos'
import { env } from '@/lib/env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

const supabase = createClient(supabaseUrl, supabasePublishableKey)

export function useVotosRealtime(encuestaId: string) {
  const [resultados, setResultados] = useState<Awaited<ReturnType<typeof getEncuestaResultados>>>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<string | null>(null)
  
  const encuestaIdRef = useRef(encuestaId)
  encuestaIdRef.current = encuestaId
  
  const fetchResultadosRef = useRef<() => Promise<void>>(undefined)

  const fetchResultados = useCallback(async () => {
    const currentEncuestaId = encuestaIdRef.current
    try {
      setIsLoading(true)
      const data = await getEncuestaResultados(currentEncuestaId)
      setResultados(data)
      setError(null)
      console.log('[Realtime] Resultados cargados:', data?.totalVotos, 'votos')
    } catch (err) {
      console.error('Error fetching resultados:', err)
      setError('Error al cargar resultados')
    } finally {
      setIsLoading(false)
    }
  }, [])

  fetchResultadosRef.current = fetchResultados

  useEffect(() => {
    console.log('[Realtime] Iniciando suscripción para encuesta:', encuestaId)
    
    fetchResultados()

    // Escuchar cambios en la tabla Voto
    const channel: RealtimeChannel = supabase.channel(`votos-${encuestaId}`)
    
    channel.on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: 'Voto',
      },
      (payload: any) => {
        console.log('[Realtime] 📡 Cambio detectado en Voto:', payload.event, payload)
        
        setLastEvent(`${payload.event} at ${new Date().toLocaleTimeString()}`)
        
        if (fetchResultadosRef.current) {
          fetchResultadosRef.current()
        }
      }
    )

    channel.subscribe((status) => {
      console.log('[Realtime] Estado de suscripción:', status)
      if (status === 'SUBSCRIBED') {
        setIsConnected(true)
        console.log('[Realtime] ✅ Suscrito correctamente a tabla Voto')
      } else if (status === 'CHANNEL_ERROR') {
        setIsConnected(false)
        console.error('[Realtime] ❌ Error en el canal')
      }
    })

    return () => {
      console.log('[Realtime] Limpiando suscripción...')
      supabase.removeChannel(channel)
      setIsConnected(false)
    }
  }, [encuestaId])

  return {
    resultados,
    isLoading,
    error,
    isConnected,
    lastEvent,
    refetch: fetchResultados,
  }
}
