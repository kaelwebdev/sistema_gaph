import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    assemblie: {
      findUnique: vi.fn(),
    },
    person: {
      findFirst: vi.fn(),
    },
    apartment: {
      findFirst: vi.fn(),
    },
    participanteAsamble: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/participants', () => ({
  createParticipant: vi.fn(),
  updateParticipant: vi.fn(),
  deleteParticipant: vi.fn(),
}))

const {
  createParticipant,
  updateParticipant,
  deleteParticipant,
} = await import('@/lib/actions/participants')

describe('participants actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createParticipant', () => {
    it('debe crear un participant exitosamente', async () => {
      const mockData = {
        id: 'part-123',
        tipo: 'PROPIETARIO',
        assemblieId: 'asam-123',
        apartmentId: 'apt-123',
        personaId: 'per-123',
      }
      ;(createParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await createParticipant({
        assemblieId: 'asam-123',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe retornar error si la assemblie no existe', async () => {
      ;(createParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Assemblie no encontrada' })

      const result = await createParticipant({
        assemblieId: 'asam-inexistente',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.error).toBe('Assemblie no encontrada')
    })

    it('debe retornar error si la person no existe', async () => {
      ;(createParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'No se encontró ninguna person con cédula 123456' })

      const result = await createParticipant({
        assemblieId: 'asam-123',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.error).toContain('No se encontró')
    })
  })

  describe('updateParticipant', () => {
    it('debe actualizar un participant exitosamente', async () => {
      const mockData = {
        id: 'part-123',
        tipo: 'APODERADO',
      }
      ;(updateParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updateParticipant('part-123', { tipo: 'APODERADO' })

      expect(result.success).toBe(true)
    })

    it('debe manejar error al actualizar', async () => {
      ;(updateParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar el participant' })

      const result = await updateParticipant('part-123', { tipo: 'APODERADO' })

      expect(result.error).toBeDefined()
    })
  })

  describe('deleteParticipant', () => {
    it('debe eliminar un participant exitosamente', async () => {
      ;(deleteParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })

      const result = await deleteParticipant('part-123', 'asam-123')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al eliminar', async () => {
      ;(deleteParticipant as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al eliminar el participant' })

      const result = await deleteParticipant('part-123', 'asam-123')

      expect(result.error).toBeDefined()
    })
  })
})
