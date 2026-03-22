'use server'

import { prisma } from '@/lib/db'
import { createPersonaSchema, updatePersonaSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPersona(data: {
  nombre: string
  cedula: string
  telefono?: string
  email?: string
  clienteId: string
}) {
  const validated = createPersonaSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const persona = await prisma.persona.create({
      data: validated.data,
    })
    revalidatePath('/personas')
    return { success: true, data: persona }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: 'Ya existe una persona con esta cédula' }
    }
    return { error: 'Error al crear la persona' }
  }
}

export async function updatePersona(id: string, data: Partial<{
  nombre: string
  cedula: string
  telefono?: string
  email?: string
}>) {
  const validated = updatePersonaSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const persona = await prisma.persona.update({
      where: { id },
      data: validated.data,
    })
    revalidatePath('/personas')
    revalidatePath(`/personas/${id}`)
    return { success: true, data: persona }
  } catch {
    return { error: 'Error al actualizar la persona' }
  }
}

export async function deletePersona(id: string) {
  try {
    await prisma.persona.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/personas')
  } catch {
    throw new Error('Error al eliminar la persona')
  }
}

export async function getPersonas(clienteId: string) {
  return prisma.persona.findMany({
    where: { clienteId, deletedAt: null },
    orderBy: { nombre: 'asc' },
  })
}

export async function getPersona(id: string) {
  return prisma.persona.findUnique({
    where: { id },
    include: {
      personasApartamentos: {
        include: { apartamento: true }
      }
    },
  })
}

export async function submitPersonaForm(id: string, formData: FormData) {
  const result = await updatePersona(id, {
    nombre: formData.get("nombre") as string,
    cedula: formData.get("cedula") as string,
    telefono: (formData.get("telefono") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
  })

  if (result.success) {
    redirect("/personas")
  }
}

export async function associatePersonaApartamento(data: {
  personaId: string
  apartamentoId: string
  rol: 'PROPIETARIO' | 'APODERADO' | 'RESIDENTE'
  estadoActivo?: boolean
}) {
  try {
    const association = await prisma.personaApartamento.create({
      data: {
        personaId: data.personaId,
        apartamentoId: data.apartamentoId,
        rol: data.rol,
        estadoActivo: data.estadoActivo ?? true,
      },
    })
    revalidatePath(`/personas/${data.personaId}`)
    revalidatePath(`/apartamentos/${data.apartamentoId}`)
    return { success: true, data: association }
  } catch {
    return { error: 'Error al asociar la persona al apartamento' }
  }
}