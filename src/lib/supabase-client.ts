import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Variable global para mantener la única instancia en memoria (lado cliente)
let clientInstance: SupabaseClient | undefined

export function getSupabaseClient() {
  // 1. Si ya existe en el navegador, devolvemos la misma instancia siempre
  if (typeof window !== 'undefined' && clientInstance) {
    return clientInstance
  }

  // 2. Si no existe, creamos la instancia
  const client = createClient(supabaseUrl, supabasePublishableKey)

  // 3. Guardamos la instancia si estamos en el navegador
  if (typeof window !== 'undefined') {
    clientInstance = client
  }

  return client
}
