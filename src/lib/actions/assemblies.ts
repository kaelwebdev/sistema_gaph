'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createAssembly(data: {
  title: string
  date: Date
  status?: 'ABIERTA' | 'CERRADA'
  condominiumId: string
}) {
  console.log('=== CREATE ASSEMBLY ===')
  console.log('Input:', data)
  
  try {
    const assembly = await prisma.assembly.create({
      data: {
        title: data.title,
        date: data.date,
        status: data.status || 'ABIERTA',
        condominiumId: data.condominiumId,
      },
    })
    console.log('Assembly created:', assembly)
    
    // Forzar revalidación
    revalidatePath('/assemblies')
    revalidatePath('/')
    
    return { success: true, data: assembly }
  } catch (error) {
    console.error('Error al crear assemblie:', error)
    return { error: `Error al crear la assemblie: ${error}` }
  }
}

export async function updateAssembly(id: string, data: Partial<{
  title: string
  date: Date
  status: 'ABIERTA' | 'CERRADA'
}>) {
  try {
    const assembly = await prisma.assembly.update({
      where: { id },
      data,
    })
    revalidatePath('/assemblies')
    revalidatePath(`/assemblies/${id}`)
    return { success: true, data: assembly }
  } catch {
    return { error: 'Error al actualizar la assemblie' }
  }
}

export async function deleteAssembly(id: string) {
  try {
    await prisma.assembly.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/assemblies')
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la assemblie' }
  }
}

export async function getAssemblies(condominiumId: string) {
  try {
    console.log('=== GET ASSEMBLIES ===')
    console.log('condominiumId:', condominiumId)
    const result = await prisma.assembly.findMany({
      where: { condominiumId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        status: true
      },
    })
    return result.map((a) => ({
      id: a.id,
      titulo: a.title,
      fecha: a.date,
      estado: a.status,
    }))
  } catch (error) {
    console.error('Error en getAssemblies:', error)
    return []
  }
}

export async function getAssembly(id: string) {
  return prisma.assembly.findUnique({
    where: { id },
    include: {
      surveys: {
        include: { options: true },
        orderBy: { order: 'asc' },
      },
      participants: {
        include: { apartment: true, person: true },
      },
    },
  })
}