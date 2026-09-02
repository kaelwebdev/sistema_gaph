import { getPerson, submitPersonaForm, deletePerson } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect, notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import Link from "next/link"

const rolColors: Record<string, string> = {
  PROPIETARIO: "bg-green-100 text-green-800",
  APODERADO: "bg-blue-100 text-blue-800",
  RESIDENTE: "bg-purple-100 text-purple-800",
}

export default async function EditarPersonaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = await getPerson(id)

  if (!person) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Persona</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={submitPersonaForm.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                name="name"
                defaultValue={person.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">C&eacute;dula</Label>
              <Input
                id="idNumber"
                name="idNumber"
                defaultValue={person.idNumber}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Tel&eacute;fono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={person.phone || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={person.email || ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar Cambios</Button>
              <Button variant="destructive" formAction={deletePerson.bind(null, id)}>
                Eliminar
              </Button>
              <Link href="/persons">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Apartments Asociados</CardTitle>
        </CardHeader>
        <CardContent>
          {person.personApartments.length > 0 ? (
            <div className="space-y-2">
              {person.personApartments.map((pa) => (
                <div
                  key={pa.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        Torre {pa.apartment.tower}, Apto {pa.apartment.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        Nivel {pa.apartment.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={rolColors[pa.role]}>{pa.role}</Badge>
                    {!pa.isActive && (
                      <Badge variant="outline">Inactivo</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay apartments asociados</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
