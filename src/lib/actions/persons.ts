'use server'

import { prisma } from '@/lib/db'
import { createPersonSchema, updatePersonSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPerson(data: {
  name: string
  idNumber: string
  phone?: string
  email?: string
  condominiumId: string
}) {
  const validated = createPersonSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const person = await prisma.person.create({
      data: validated.data,
    })
    revalidatePath('/persons')
    return { success: true, data: person }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: 'Ya existe una person con esta cédula' }
    }
    return { error: 'Error al crear la person' }
  }
}

export async function updatePerson(id: string, data: Partial<{
  name: string
  idNumber: string
  phone?: string
  email?: string
}>) {
  const validated = updatePersonSchema.safeParse(data)
  if (!validated.success) {
    return { error: validated.error.errors[0].message }
  }

  try {
    const person = await prisma.person.update({
      where: { id },
      data: validated.data,
    })
    revalidatePath('/persons')
    revalidatePath(`/persons/${id}`)
    return { success: true, data: person }
  } catch {
    return { error: 'Error al actualizar la person' }
  }
}

export async function deletePerson(id: string) {
  try {
    await prisma.person.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/persons')
  } catch {
    throw new Error('Error al eliminar la person')
  }
}

export async function getPersons(condominiumId: string) {
  return prisma.person.findMany({
    where: { condominiumId, deletedAt: null },
    orderBy: { name: 'asc' },
  })
}

export async function getPerson(id: string) {
  return prisma.person.findUnique({
    where: { id },
    include: {
      personApartments: {
        include: { apartment: true }
      },
    },
  })
}

export async function submitPersonaForm(id: string, formData: FormData) {
  const result = await updatePerson(id, {
    name: formData.get("name") as string,
    idNumber: formData.get("idNumber") as string,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
  })

  if (result.success) {
    redirect("/persons")
  }
}

export async function associatePersonApartment(data: {
  personId: string
  apartmentId: string
  role: 'PROPIETARIO' | 'APODERADO' | 'RESIDENTE'
  isActive?: boolean
}) {
  try {
    const association = await prisma.personApartment.create({
      data: {
        personId: data.personId,
        apartmentId: data.apartmentId,
        role: data.role,
        isActive: data.isActive ?? true,
      },
    })
    revalidatePath(`/persons/${data.personId}`)
    revalidatePath(`/apartments/${data.apartmentId}`)
    return { success: true, data: association }
  } catch {
    return { error: 'Error al asociar la person al apartment' }
  }
}