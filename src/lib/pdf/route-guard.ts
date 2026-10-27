import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

interface GuardedAssembly {
  condominiumId: string
  deletedAt: Date | null
}

type GuardResult<T extends GuardedAssembly> =
  | { ok: true; assembly: T }
  | { ok: false; response: NextResponse }

/**
 * Authenticates the request before loading the assembly, then enforces
 * existence and condominium scoping. Loading happens through a callback so no
 * database query runs for unauthenticated callers.
 */
export async function guardPdfRequest<T extends GuardedAssembly>(
  loadAssembly: () => Promise<T | null>
): Promise<GuardResult<T>> {
  const session = await auth()

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }

  const assembly = await loadAssembly()

  if (!assembly || assembly.deletedAt) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Asamblea no encontrada' }, { status: 404 }),
    }
  }

  if (session.user.condominiumId && assembly.condominiumId !== session.user.condominiumId) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 403 }),
    }
  }

  return { ok: true, assembly }
}
