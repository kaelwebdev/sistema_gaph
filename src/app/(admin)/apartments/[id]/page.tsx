import {
  getApartment,
  submitApartmentForm,
  deleteApartment,
} from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function EditarApartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const apartment = await getApartment(id)

  if (!apartment) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Apartment</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={submitApartmentForm.bind(null, id)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tower">Torre</Label>
                <Input
                  id="tower"
                  name="tower"
                  defaultValue={apartment.tower}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">N&uacute;mero</Label>
                <Input
                  id="number"
                  name="number"
                  defaultValue={apartment.number}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Nivel</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  defaultValue={apartment.level}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue={apartment.status} required>
                  <SelectItem value="PROPIO">Propio</SelectItem>
                  <SelectItem value="ARRIENDO">Arriendo</SelectItem>
                  <SelectItem value="VACIO">Vac&iacute;o</SelectItem>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inhabitants">Habitantes</Label>
                <Input
                  id="inhabitants"
                  name="inhabitants"
                  type="number"
                  min="0"
                  defaultValue={apartment.inhabitants}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Input
                id="observations"
                name="observations"
                defaultValue={apartment.observations || ""}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar Cambios</Button>
              <Button variant="destructive" formAction={deleteApartment.bind(null, id)}>
                Eliminar
              </Button>
              <Link href="/apartments">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
