'use client'

import { getApartments, deleteApartment, searchApartment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, Trash2, Funnel } from "lucide-react"
import { env } from "@/lib/env"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const statusColors: Record<string, string> = {
  PROPIO: "bg-green-100 text-green-800",
  ARRIENDO: "bg-yellow-100 text-yellow-800",
  VACIO: "bg-gray-100 text-gray-800",
}

export default function ApartmentsPageContent( ) {
  const [allApartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  const handleVerTodos = async () => {
    setLoading(true);
    try {
      const allApartments = await getApartments(env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID)
      if (allApartments) setApartments(allApartments);
    } catch (error) {
      console.error("Error al cargar todos los apartamentos", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Apartamentos</h1>
        <Link href="/apartments/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Apartamento
          </Button>
        </Link>
          
      </div>
      
      <div>
        <Button  onClick={handleVerTodos} disabled={loading}>
            <Funnel className="h-4 w-4 mr-2" />
            <div > Consultar todos los apartamentos</div> 
          </Button>
      </div>
      <div>
        <Input className="w-30 mb-4"
          type="text"
          maxLength={6}
          placeholder="Ej: 1 101"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const input = e.currentTarget.value;
              const [tower, number] = input.split(" ");
              const apartment = await searchApartment(tower, number, env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID);
              if (apartment) {
                setApartments([apartment]);
              }
            }
          }}
        />
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
                {allApartments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{apt.tower}</td>
                    <td className="px-4 py-3 text-sm font-medium">{apt.number}</td>
                    <td className="px-4 py-3 text-sm">{apt.level}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[apt.status]}>
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{apt.inhabitants}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/apartments/${apt.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deleteApartment.bind(null, apt.id)}>
                          <Button variant="ghost" size="sm" type="submit">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {allApartments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Intenta usar un filtro.
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