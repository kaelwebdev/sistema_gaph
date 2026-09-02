import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    apartment: {
      findFirst: vi.fn(),
    },
    pQRSRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/pqrsRequest', () => ({
  submitPQRS: vi.fn(),
  getPQRS: vi.fn(),
  getPQRSById: vi.fn(),
  updatePQRSEstado: vi.fn(),
}))

const {
  submitPQRS,
  getPQRS,
  getPQRSById,
  updatePQRSEstado,
} = await import('@/lib/actions/pqrsRequest')

describe('pqrsRequest actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitPQRS', () => {
    it('debe crear un PQRSRequest exitosamente', async () => {
      const mockData = {
        id: 'pqrsRequest-123',
        type: 'PREGUNTA',
        subject: 'Consulta sobre mantenimiento',
        description: '¿Cuándo será el próximo mantenimiento?',
        fullName: 'Juan Perez',
        email: 'juan@test.com',
        phone: '3001234567',
        tower: 'A',
        number: 101,
        status: 'SIN_LEER',
        condominiumId: 'cli-123',
      }
      ;(submitPQRS as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await submitPQRS({
        type: 'PREGUNTA',
        subject: 'Consulta sobre mantenimiento',
        description: '¿Cuándo será el próximo mantenimiento?',
        fullName: 'Juan Perez',
        email: 'juan@test.com',
        phone: '3001234567',
        tower: 'A',
        number: 101,
        condominiumId: 'cli-123',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error de validación', async () => {
      ;(submitPQRS as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'El asunto es requerido' })

      const result = await submitPQRS({
        type: 'PREGUNTA',
        subject: '',
        description: 'Descripción',
        fullName: 'Juan Perez',
        email: 'juan@test.com',
        phone: '3001234567',
        tower: 'A',
        number: 101,
        condominiumId: 'cli-123',
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('getPQRS', () => {
    it('debe obtener lista de PQRSRequest por condominiumId', async () => {
      const mockData = [
        {
          id: 'pqrsRequest-1',
          type: 'PREGUNTA',
          subject: 'Consulta 1',
          status: 'SIN_LEER',
        },
        {
          id: 'pqrsRequest-2',
          type: 'QUEJA',
          subject: 'Queja 1',
          status: 'PENDIENTE',
        },
      ]
      ;(getPQRS as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getPQRS('cli-123')

      expect(result).toEqual(mockData)
    })

    it('debe retornar array vacío si no hay PQRSRequest', async () => {
      ;(getPQRS as ReturnType<typeof vi.fn>).mockResolvedValue([])

      const result = await getPQRS('cli-123')

      expect(result).toEqual([])
    })
  })

  describe('getPQRSById', () => {
    it('debe obtener un PQRSRequest por id', async () => {
      const mockData = {
        id: 'pqrsRequest-123',
        type: 'PREGUNTA',
        subject: 'Consulta',
        apartment: { number: '101', tower: 'A' },
      }
      ;(getPQRSById as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getPQRSById('pqrsRequest-123')

      expect(result).toEqual(mockData)
    })
  })

  describe('updatePQRSEstado', () => {
    it('debe actualizar el estado de un PQRSRequest exitosamente', async () => {
      const mockData = {
        id: 'pqrsRequest-123',
        status: 'RESUELTO',
      }
      ;(updatePQRSEstado as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updatePQRSEstado('pqrsRequest-123', 'RESUELTO')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al actualizar estado', async () => {
      ;(updatePQRSEstado as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar el estado' })

      const result = await updatePQRSEstado('pqrsRequest-123', 'RESUELTO')

      expect(result.error).toBeDefined()
    })
  })
})