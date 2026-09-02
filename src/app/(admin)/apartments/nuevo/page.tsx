"use client"

import { createApartment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { redirect } from "next/navigation"
import { env } from "@/lib/env"

export default function NuevoApartmentPage() {
  async function handleSubmit(formData: FormData) {
    const result = await createApartment({
      number: formData.get("numero") as string,
      tower: formData.get("torre") as string,
      level: parseInt(formData.get("nivel") as string),
      status: formData.get("estado") as "PROPIO" | "ARRIENDO" | "VACIO",
      observations: (formData.get("observaciones") as string) || undefined,
      inhabitants: parseInt(formData.get("habitantes") as string) || 0,
      condominiumId: env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID,
    })

    if (result.success) {
      redirect("/apartments")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Nuevo Apartmento</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="torre">Torre</Label>
                <Input id="torre" name="torre" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">N&uacute;mero</Label>
                <Input id="numero" name="numero" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel</Label>
                <Input id="nivel" name="nivel" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select name="estado" required>
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
                  defaultValue="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input id="observaciones" name="observaciones" />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Crear Apartmento</Button>
              <Button variant="outline" type="button" onClick={() => history.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
