import { getComunicados, deleteComunicado } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ComunicadosPage() {
  const comunicados = await getComunicados('cliente_default_001')

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

      <div className="space-y-4">
        {comunicados.map((comunicado) => (
          <Card key={comunicado.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{comunicado.titulo}</h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{comunicado.contenido}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(comunicado.fechaPublicacion).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <form action={deleteComunicado.bind(null, comunicado.id)}>
                  <Button variant="ghost" size="sm" type="submit">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {comunicados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay comunicados publicados
          </div>
        )}
      </div>
    </div>
  )
}