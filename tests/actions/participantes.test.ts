import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    asamblea: {
      findUnique: vi.fn(),
    },
    persona: {
      findFirst: vi.fn(),
    },
    apartamento: {
      findFirst: vi.fn(),
    },
    participanteAsamble: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/participantes', () => ({
  createParticipante: vi.fn(),
  updateParticipante: vi.fn(),
  deleteParticipante: vi.fn(),
}))

const {
  createParticipante,
  updateParticipante,
  deleteParticipante,
} = await import('@/lib/actions/participantes')

describe('participantes actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createParticipante', () => {
    it('debe crear un participante exitosamente', async () => {
      const mockData = {
        id: 'part-123',
        tipo: 'PROPIETARIO',
        asambleaId: 'asam-123',
        apartamentoId: 'apt-123',
        personaId: 'per-123',
      }
      ;(createParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await createParticipante({
        asambleaId: 'asam-123',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe retornar error si la asamblea no existe', async () => {
      ;(createParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Asamblea no encontrada' })

      const result = await createParticipante({
        asambleaId: 'asam-inexistente',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.error).toBe('Asamblea no encontrada')
    })

    it('debe retornar error si la persona no existe', async () => {
      ;(createParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'No se encontró ninguna persona con cédula 123456' })

      const result = await createParticipante({
        asambleaId: 'asam-123',
        cedula: '123456',
        torre: 'A',
        numero: '101',
        tipo: 'PROPIETARIO',
      })

      expect(result.error).toContain('No se encontró')
    })
  })

  describe('updateParticipante', () => {
    it('debe actualizar un participante exitosamente', async () => {
      const mockData = {
        id: 'part-123',
        tipo: 'APODERADO',
      }
      ;(updateParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updateParticipante('part-123', { tipo: 'APODERADO' })

      expect(result.success).toBe(true)
    })

    it('debe manejar error al actualizar', async () => {
      ;(updateParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar el participante' })

      const result = await updateParticipante('part-123', { tipo: 'APODERADO' })

      expect(result.error).toBeDefined()
    })
  })

  describe('deleteParticipante', () => {
    it('debe eliminar un participante exitosamente', async () => {
      ;(deleteParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })

      const result = await deleteParticipante('part-123', 'asam-123')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al eliminar', async () => {
      ;(deleteParticipante as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al eliminar el participante' })

      const result = await deleteParticipante('part-123', 'asam-123')

      expect(result.error).toBeDefined()
    })
  })
})
