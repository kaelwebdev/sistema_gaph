'use server'

import { prisma } from '@/lib/db'
import { createAnnouncementSchema, updateAnnouncementSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(data: {
  title: string
  content: string
  condominiumId: string
}) {
  const validated = createAnnouncementSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const announcement = await prisma.announcement.create({
      data: {
        title: validated.data.title,
        content: validated.data.content,
        publishedAt: new Date(),
        condominium: { connect: { id: data.condominiumId } },
      },
    })
    revalidatePath('/announcements')
    return { success: true, data: announcement }
  } catch {
    return { error: 'Error al crear el announcement' }
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/announcements')
  } catch {
    throw new Error('Error al eliminar el announcement')
  }
}

export async function updateAnnouncement(
  id: string,
  data: {
    title: string
    content: string
  }
) {
  const validated = updateAnnouncementSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: validated.data.title,
        content: validated.data.content,
      },
    })
    revalidatePath('/announcements')
    return { success: true, data: announcement }
  } catch {
    return { error: 'Error al actualizar el announcement' }
  }
}

export async function getAnnouncementById(id: string) {
  return prisma.announcement.findUnique({
    where: { id },
  })
}

export async function getAnnouncements(condominiumId: string) {
  return prisma.announcement.findMany({
    where: { condominiumId, deletedAt: null },
    orderBy: { publishedAt: 'desc' },
  })
}