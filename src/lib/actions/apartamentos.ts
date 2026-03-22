'use server'

import { prisma } from '@/lib/db'
import { createApartamentoSchema, updateApartamentoSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { EstadoApartamento } from '@/types'

interface CreateApartamento {
  numero: string
  torre: string
  nivel: number
  estado: EstadoApartamento
  observaciones?: string
  habitantes: number
  clienteId: string
}

export async function createApartamento(data: CreateApartamento) {
  const validated = createApartamentoSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const apartamento = await prisma.apartamento.create({
      data: validated.data,
    })
    revalidatePath('/apartamentos')
    return { success: true, data: apartamento }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: 'Ya existe un apartamento con este número y torre' }
    }
    return { error: 'Error al crear el apartamento' }
  }
}

export async function updateApartamento(id: string, data: Partial<CreateApartamento>) {
  const validated = updateApartamentoSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const apartamento = await prisma.apartamento.update({
      where: { id },
      data: validated.data,
    })
    revalidatePath('/apartamentos')
    revalidatePath(`/apartamentos/${id}`)
    return { success: true, data: apartamento }
  } catch {
    return { error: 'Error al actualizar el apartamento' }
  }
}

export async function deleteApartamento(id: string) {
  try {
    await prisma.apartamento.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/apartamentos')
  } catch {
    throw new Error('Error al eliminar el apartamento')
  }
}

export async function getApartamentos(clienteId: string) {
  return prisma.apartamento.findMany({
    where: { clienteId, deletedAt: null },
    orderBy: [{ torre: 'asc' }, { numero: 'asc' }],
  })
}

export async function submitApartamentoForm(id: string, formData: FormData) {
  const result = await updateApartamento(id, {
    numero: formData.get("numero") as string,
    torre: formData.get("torre") as string,
    nivel: parseInt(formData.get("nivel") as string),
    estado: formData.get("estado") as "PROPIO" | "ARRIENDO" | "VACIO",
    observaciones: (formData.get("observaciones") as string) || undefined,
    habitantes: parseInt(formData.get("habitantes") as string) || 0,
  })

  if (result.success) {
    redirect("/apartamentos")
  }
}

export async function getApartamento(id: string) {
  return prisma.apartamento.findUnique({
    where: { id },
    include: { personasApartamentos: { include: { persona: true } } },
  })
}