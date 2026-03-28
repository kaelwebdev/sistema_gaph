import { getApartamentos, deleteApartamento } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { env } from "@/lib/env"

const estadoColors: Record<string, string> = {
  PROPIO: "bg-green-100 text-green-800",
  ARRIENDO: "bg-yellow-100 text-yellow-800",
  VACIO: "bg-gray-100 text-gray-800",
}

export default async function ApartamentosPage() {
  const apartamentos = await getApartamentos(env.NEXT_PUBLIC_DEFAULT_CLIENT_ID)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Apartamentos</h1>
        <Link href="/apartamentos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Apartamento
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Torre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    N&uacute;mero
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Nivel
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Habitantes
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apartamentos.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{apt.torre}</td>
                    <td className="px-4 py-3 text-sm font-medium">{apt.numero}</td>
                    <td className="px-4 py-3 text-sm">{apt.nivel}</td>
                    <td className="px-4 py-3">
                      <Badge className={estadoColors[apt.estado]}>
                        {apt.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{apt.habitantes}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/apartamentos/${apt.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deleteApartamento.bind(null, apt.id)}>
                          <Button variant="ghost" size="sm" type="submit">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {apartamentos.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No hay apartamentos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
