import { getAnnouncements } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { AnnouncementsList } from '@/components/admin/AnnouncementsList'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { env } from '@/lib/env'

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements(env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Anuncios</h1>
        <Link href="/announcements/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Anuncio
          </Button>
        </Link>
      </div>

      <AnnouncementsList 
        announcements={announcements} 
        clienteId={env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID} 
      />
    </div>
  )
}