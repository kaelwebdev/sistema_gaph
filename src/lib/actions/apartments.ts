'use server'

import { prisma } from '@/lib/db'
import { createApartmentSchema, updateApartmentSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ApartmentStatus } from '@/types'

interface CreateApartment {
  number: string
  tower: string
  level: number
  status: ApartmentStatus
  observations?: string
  inhabitants: number
  condominiumId: string
}

export async function createApartment(data: CreateApartment) {
  const validated = createApartmentSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const apartment = await prisma.apartment.create({
      data: validated.data,
    })
    revalidatePath('/apartments')
    return { success: true, data: apartment }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: 'Ya existe un apartment con este número y torre' }
    }
    return { error: 'Error al crear el apartment' }
  }
}

export async function updateApartment(id: string, data: Partial<CreateApartment>) {
  const validated = updateApartmentSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const apartment = await prisma.apartment.update({
      where: { id },
      data: validated.data,
    })
    revalidatePath('/apartments')
    revalidatePath(`/apartments/${id}`)
    return { success: true, data: apartment }
  } catch {
    return { error: 'Error al actualizar el apartment' }
  }
}

export async function deleteApartment(id: string) {
  try {
    await prisma.apartment.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/apartments')
  } catch {
    throw new Error('Error al eliminar el apartment')
  }
}

export async function getApartments(condominiumId: string) {
  return prisma.apartment.findMany({
    where: { condominiumId, deletedAt: null },
    orderBy: [{ tower: 'asc' }, { number: 'asc' }],
  })
}

export async function submitApartmentForm(id: string, formData: FormData) {
  const result = await updateApartment(id, {
    number: formData.get("number") as string,
    tower: formData.get("tower") as string,
    level: parseInt(formData.get("level") as string),
    status: formData.get("status") as "PROPIO" | "ARRIENDO" | "VACIO",
    observations: (formData.get("observations") as string) || undefined,
    inhabitants: parseInt(formData.get("inhabitants") as string) || 0,
  })

  if (result.success) {
    redirect("/apartments")
  }
}

export async function getApartment(id: string) {
  return prisma.apartment.findUnique({
    where: { id },
    include: { personApartments: { include: { person: true } } },
  })
}