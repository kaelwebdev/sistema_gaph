'use server'

import { prisma } from '@/lib/db'
import { createParticipantSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createParticipant(data: {
  assemblyId: string
  idNumber: string
  tower: string
  number: string
  type: 'PROPIETARIO' | 'APODERADO'
}) {
  const validated = createParticipantSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Get condominiumId from the assembly to scope lookups
  const assembly = await prisma.assembly.findUnique({
    where: { id: data.assemblyId },
    select: { condominiumId: true },
  })
  if (!assembly) {
    return { error: 'Assemblie no encontrada' }
  }

  // Find person by idNumber within this condominium
  const person = await prisma.person.findFirst({
    where: { idNumber: validated.data.idNumber, condominiumId: assembly.condominiumId },
  })
  if (!person) {
    return { error: `No se encontró ninguna person con cédula ${validated.data.idNumber}` }
  }

  // Find apartment by tower + number within this condominium
  const apartment = await prisma.apartment.findFirst({
    where: {
      tower: validated.data.tower.toUpperCase(),
      number: validated.data.number,
      condominiumId: assembly.condominiumId,
    },
  })
  if (!apartment) {
    return { error: `No se encontró apartment Torre ${validated.data.tower.toUpperCase()}, #${validated.data.number}` }
  }

  try {
    const participant = await prisma.assemblyParticipant.create({
      data: {
        type: validated.data.type,
        assembly: { connect: { id: data.assemblyId } },
        apartment: { connect: { id: apartment.id } },
        person: { connect: { id: person.id } },
      },
    })
    revalidatePath(`/assemblies/${data.assemblyId}`)
    return { success: true, data: participant }
  } catch {
    return { error: 'Este apartment ya tiene un representante en esta assemblie' }
  }
}

export async function updateParticipant(id: string, data: Partial<{
  personId: string
  type: 'PROPIETARIO' | 'APODERADO'
}>) {
  try {
    const participant = await prisma.assemblyParticipant.update({
      where: { id },
      data,
    })
    revalidatePath(`/assemblies`)
    return { success: true, data: participant }
  } catch {
    return { error: 'Error al actualizar el participant' }
  }
}

export async function deleteParticipant(id: string, assemblyId: string) {
  try {
    await prisma.assemblyParticipant.delete({
      where: { id },
    })
    revalidatePath(`/assemblies/${assemblyId}/participants`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el participant' }
  }
}