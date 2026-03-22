'use server'

import { prisma } from '@/lib/db'
import { createComunicadoSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createComunicado(data: {
  titulo: string
  contenido: string
  clienteId: string
}) {
  const validated = createComunicadoSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const comunicado = await prisma.comunicado.create({
      data: {
        titulo: validated.data.titulo,
        contenido: validated.data.contenido,
        fechaPublicacion: new Date(),
        cliente: { connect: { id: data.clienteId } },
      },
    })
    revalidatePath('/comunicados')
    return { success: true, data: comunicado }
  } catch {
    return { error: 'Error al crear el comunicado' }
  }
}

export async function deleteComunicado(id: string) {
  try {
    await prisma.comunicado.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/comunicados')
  } catch {
    throw new Error('Error al eliminar el comunicado')
  }
}

export async function getComunicados(clienteId: string) {
  return prisma.comunicado.findMany({
    where: { clienteId, deletedAt: null },
    orderBy: { fechaPublicacion: 'desc' },
  })
}