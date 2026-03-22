'use server'

import { prisma } from '@/lib/db'
import { createParticipanteSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createParticipante(data: {
  asambleaId: string
  cedula: string
  torre: string
  numero: string
  tipo: 'PROPIETARIO' | 'APODERADO'
}) {
  const validated = createParticipanteSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  // Get clienteId from the assembly to scope lookups
  const asamblea = await prisma.asamblea.findUnique({
    where: { id: data.asambleaId },
    select: { clienteId: true },
  })
  if (!asamblea) {
    return { error: 'Asamblea no encontrada' }
  }

  // Find persona by cedula within this cliente
  const persona = await prisma.persona.findFirst({
    where: { cedula: validated.data.cedula, clienteId: asamblea.clienteId },
  })
  if (!persona) {
    return { error: `No se encontró ninguna persona con cédula ${validated.data.cedula}` }
  }

  // Find apartamento by torre + numero within this cliente
  const apartamento = await prisma.apartamento.findFirst({
    where: {
      torre: validated.data.torre.toUpperCase(),
      numero: validated.data.numero,
      clienteId: asamblea.clienteId,
    },
  })
  if (!apartamento) {
    return { error: `No se encontró apartamento Torre ${validated.data.torre.toUpperCase()}, #${validated.data.numero}` }
  }

  try {
    const participante = await prisma.participanteAsamblea.create({
      data: {
        tipo: validated.data.tipo,
        asamblea: { connect: { id: data.asambleaId } },
        apartamento: { connect: { id: apartamento.id } },
        persona: { connect: { id: persona.id } },
      },
    })
    revalidatePath(`/asambleas/${data.asambleaId}`)
    return { success: true, data: participante }
  } catch {
    return { error: 'Este apartamento ya tiene un representante en esta asamblea' }
  }
}

export async function updateParticipante(id: string, data: Partial<{
  personaId: string
  tipo: 'PROPIETARIO' | 'APODERADO'
}>) {
  try {
    const participante = await prisma.participanteAsamblea.update({
      where: { id },
      data,
    })
    revalidatePath(`/asambleas`)
    return { success: true, data: participante }
  } catch {
    return { error: 'Error al actualizar el participante' }
  }
}

export async function deleteParticipante(id: string, asambleaId: string) {
  try {
    await prisma.participanteAsamblea.delete({
      where: { id },
    })
    revalidatePath(`/asambleas/${asambleaId}/participantes`)
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el participante' }
  }
}
