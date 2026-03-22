import {
  getApartamento,
  submitApartamentoForm,
  deleteApartamento,
} from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function EditarApartamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const apartamento = await getApartamento(id)

  if (!apartamento) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Apartamento</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={submitApartamentoForm.bind(null, id)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="torre">Torre</Label>
                <Input
                  id="torre"
                  name="torre"
                  defaultValue={apartamento.torre}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">N&uacute;mero</Label>
                <Input
                  id="numero"
                  name="numero"
                  defaultValue={apartamento.numero}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel</Label>
                <Input
                  id="nivel"
                  name="nivel"
                  type="number"
                  defaultValue={apartamento.nivel}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select name="estado" defaultValue={apartamento.estado} required>
                  <SelectItem value="PROPIO">Propio</SelectItem>
                  <SelectItem value="ARRIENDO">Arriendo</SelectItem>
                  <SelectItem value="VACIO">Vac&iacute;o</SelectItem>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="habitantes">Habitantes</Label>
                <Input
                  id="habitantes"
                  name="habitantes"
                  type="number"
                  min="0"
                  defaultValue={apartamento.habitantes}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                name="observaciones"
                defaultValue={apartamento.observaciones || ""}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar Cambios</Button>
              <Button variant="destructive" formAction={deleteApartamento.bind(null, id)}>
                Eliminar
              </Button>
              <Link href="/apartamentos">
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
