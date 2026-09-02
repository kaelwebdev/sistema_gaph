'use server'

import { prisma } from '@/lib/db'
import { createPQRSSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function submitPQRS(data: {
  type: 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'
  subject: string
  description: string
  fullName: string
  email: string
  phone: string
  tower: string
  number: number
  condominiumId: string
}) {
  const validated = createPQRSSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    // Find apartment by tower, number and condominiumId
    const apartment = await prisma.apartment.findFirst({
      where: {
        tower: validated.data.tower,
        number: validated.data.number.toString(),
        condominiumId: validated.data.condominiumId,
      },
    })

    const pqrsRequest = await prisma.pQRSRequest.create({
      data: {
        type: validated.data.type,
        subject: validated.data.subject,
        description: validated.data.description,
        fullName: validated.data.fullName,
        email: validated.data.email,
        phone: validated.data.phone,
        tower: validated.data.tower,
        number: validated.data.number,
        status: 'SIN_LEER',
        condominiumId: validated.data.condominiumId,
        apartmentId: apartment?.id || undefined,
      },
    })
    revalidatePath('/pqrsRequest')
    return { success: true, data: pqrsRequest }
  } catch (e) {
    console.error('Error creating PQRSRequest:', e)
    return { error: 'Error al enviar la solicitud' }
  }
}

export async function getPQRS(condominiumId: string) {
  return prisma.pQRSRequest.findMany({
    where: { 
      deletedAt: null,
      condominiumId,
    },
    include: {
      apartment: true,
    },
    orderBy: { date: 'desc' },
  })
}

export async function getPQRSById(id: string) {
  return prisma.pQRSRequest.findUnique({
    where: { id },
    include: { apartment: true },
  })
}

export async function updatePQRSEstado(id: string, status: 'PENDIENTE' | 'RESUELTO' | 'RECHAZADO' | 'SIN_LEER') {
  try {
    const pqrsRequest = await prisma.pQRSRequest.update({
      where: { id },
      data: { status },
    })
    return { success: true, data: pqrsRequest }
  } catch {
    return { error: 'Error al actualizar el estado' }
  }
}

export async function deletePQRS(id: string) {
  try {
    await prisma.pQRSRequest.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el PQRSRequest' }
  }
}