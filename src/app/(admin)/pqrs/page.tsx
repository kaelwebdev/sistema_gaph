import { getPQRS } from '@/lib/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Calendar } from 'lucide-react'

const tipoColors: Record<string, string> = {
  PREGUNTA: 'bg-blue-100 text-blue-800',
  QUEJA: 'bg-red-100 text-red-800',
  RECLAMO: 'bg-orange-100 text-orange-800',
  SUGERENCIA: 'bg-purple-100 text-purple-800',
}

const tipoLabels: Record<string, string> = {
  PREGUNTA: 'Pregunta',
  QUEJA: 'Queja',
  RECLAMO: 'Reclamo',
  SUGERENCIA: 'Sugerencia',
}

export default async function PQRSPage() {
  const pqrsList = await getPQRS('cliente_default_001')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">PQRS</h1>

      <div className="space-y-4">
        {pqrsList.map((pqrs) => (
          <Card key={pqrs.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${tipoColors[pqrs.tipo]}`}>
                    {tipoLabels[pqrs.tipo]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(pqrs.fecha).toLocaleDateString('es-CO')}
                  </span>
                </div>
                {pqrs.email && (
                  <span className="text-sm text-gray-500">{pqrs.email}</span>
                )}
              </div>
              <p className="text-gray-900 mb-4 whitespace-pre-wrap">{pqrs.descripcion}</p>
              {pqrs.apartamento && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  Torre {pqrs.apartamento.torre}, Apto {pqrs.apartamento.numero}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {pqrsList.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay solicitudes PQRS
          </div>
        )}
      </div>
    </div>
  )
}