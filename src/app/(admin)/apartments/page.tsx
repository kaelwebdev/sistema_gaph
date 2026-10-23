
import ApartmentsPageContent from "./ApartamentsPageContent"

const statusColors: Record<string, string> = {
  PROPIO: "bg-green-100 text-green-800",
  ARRIENDO: "bg-yellow-100 text-yellow-800",
  VACIO: "bg-gray-100 text-gray-800",
}

export default async function ApartmentsPage() {

  return (
    <ApartmentsPageContent  />
  )
}