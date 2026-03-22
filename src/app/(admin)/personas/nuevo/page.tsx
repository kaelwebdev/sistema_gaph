"use client"

import { createPersona } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation"

export default function NuevaPersonaPage() {
  async function handleSubmit(formData: FormData) {
    const result = await createPersona({
      nombre: formData.get("nombre") as string,
      cedula: formData.get("cedula") as string,
      telefono: (formData.get("telefono") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      clienteId: "cliente_default_001",
    })

    if (result.success) {
      redirect("/personas")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Nueva Persona</h1>

      <Card>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input id="nombre" name="nombre" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">C&eacute;dula</Label>
              <Input id="cedula" name="cedula" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Tel&eacute;fono</Label>
                <Input id="telefono" name="telefono" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Crear Persona</Button>
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
