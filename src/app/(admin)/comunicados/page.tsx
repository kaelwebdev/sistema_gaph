import { getComunicados } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { ComunicadosList } from '@/components/admin/ComunicadosList'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { env } from '@/lib/env'

export default async function ComunicadosPage() {
  const comunicados = await getComunicados(env.NEXT_PUBLIC_DEFAULT_CLIENT_ID)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Comunicados</h1>
        <Link href="/comunicados/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Comunicado
          </Button>
        </Link>
      </div>

      <ComunicadosList 
        comunicados={comunicados} 
        clienteId={env.NEXT_PUBLIC_DEFAULT_CLIENT_ID} 
      />
    </div>
  )
}