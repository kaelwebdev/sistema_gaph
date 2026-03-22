'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createAsamblea(data: {
  titulo: string
  fecha: Date
  estado?: 'ABIERTA' | 'CERRADA'
  clienteId: string
}) {
  console.log('=== CREATE ASAMBLEA ===')
  console.log('Input:', data)
  
  try {
    const asamblea = await prisma.asamblea.create({
      data: {
        titulo: data.titulo,
        fecha: data.fecha,
        estado: data.estado || 'ABIERTA',
        clienteId: data.clienteId,
      },
    })
    console.log('Asamblea creada:', asamblea)
    
    // Forzar revalidación
    revalidatePath('/asambleas')
    revalidatePath('/')
    
    return { success: true, data: asamblea }
  } catch (error) {
    console.error('Error al crear asamblea:', error)
    return { error: `Error al crear la asamblea: ${error}` }
  }
}

export async function updateAsamblea(id: string, data: Partial<{
  titulo: string
  fecha: Date
  estado: 'ABIERTA' | 'CERRADA'
}>) {
  try {
    const asamblea = await prisma.asamblea.update({
      where: { id },
      data,
    })
    revalidatePath('/asambleas')
    revalidatePath(`/asambleas/${id}`)
    return { success: true, data: asamblea }
  } catch {
    return { error: 'Error al actualizar la asamblea' }
  }
}

export async function deleteAsamblea(id: string) {
  try {
    await prisma.asamblea.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath('/asambleas')
    return { success: true }
  } catch {
    return { error: 'Error al eliminar la asamblea' }
  }
}

export async function getAsambleas(clienteId: string) {
  try {
    console.log('=== GET ASAMBLEAS ===')
    console.log('clienteId:', clienteId)
    const result = await prisma.asamblea.findMany({
      where: { clienteId },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        titulo: true,
        fecha: true,
        estado: true
      },
    })
    return result
  } catch (error) {
    console.error('Error en getAsambleas:', error)
    return []
  }
}

export async function getAsamblea(id: string) {
  return prisma.asamblea.findUnique({
    where: { id },
    include: {
      encuestas: {
        include: { opciones: true },
        orderBy: { orden: 'asc' },
      },
      participantes: {
        include: { apartamento: true, persona: true },
      },
    },
  })
}
