import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Calendar, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const [apartmentsCount, personsCount, assembliesCount, pqrsCount] =
    await Promise.all([
      prisma.apartment.count({ where: { deletedAt: null } }),
      prisma.person.count({ where: { deletedAt: null } }),
      prisma.assembly.count({ where: { deletedAt: null } }),
      prisma.pQRSRequest.count({ where: { deletedAt: null } }),
    ])

  const stats = [
    {
      title: "Apartments",
      value: apartmentsCount,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Persons",
      value: personsCount,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Assemblies",
      value: assembliesCount,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "PQRSRequest",
      value: pqrsCount,
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
