'use server'

import { prisma } from '@/lib/db'
import { createParticipanteSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function createParticipante(data: {
  asambleaId: string
  apartamentoId: string
  personaId: string
  tipo: 'PROPIETARIO' | 'APODERADO'
}) {
  const validated = createParticipanteSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const participante = await prisma.participanteAsamblea.create({
      data: {
        tipo: validated.data.tipo,
        asamblea: { connect: { id: data.asambleaId } },
        apartamento: { connect: { id: data.apartamentoId } },
        persona: { connect: { id: data.personaId } },
      },
    })
    revalidatePath(`/asambleas/${data.asambleaId}/participantes`)
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
