import { getPersons, deletePerson } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { env } from "@/lib/env"

export default async function personsPage() {
  const persons = await getPersons(env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
        <Link href="/persons/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Persona
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
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    C&eacute;dula
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Tel&eacute;fono
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {persons.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {person.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{person.idNumber}</td>
                    <td className="px-4 py-3 text-sm">
                      {person.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {person.email || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/persons/${person.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deletePerson.bind(null, person.id)}>
                          <Button variant="ghost" size="sm" type="submit">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {persons.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No hay personas registradas
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
