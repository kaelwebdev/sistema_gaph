import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    apartamento: {
      findFirst: vi.fn(),
    },
    pQRS: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/pqrs', () => ({
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
} = await import('@/lib/actions/pqrs')

describe('pqrs actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitPQRS', () => {
    it('debe crear un PQRS exitosamente', async () => {
      const mockData = {
        id: 'pqrs-123',
        tipo: 'PREGUNTA',
        asunto: 'Consulta sobre mantenimiento',
        descripcion: '¿Cuándo será el próximo mantenimiento?',
        nombreCompleto: 'Juan Perez',
        email: 'juan@test.com',
        telefono: '3001234567',
        torre: 'A',
        numero: 101,
        estado: 'SIN_LEER',
        clienteId: 'cli-123',
      }
      ;(submitPQRS as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await submitPQRS({
        tipo: 'PREGUNTA',
        asunto: 'Consulta sobre mantenimiento',
        descripcion: '¿Cuándo será el próximo mantenimiento?',
        nombreCompleto: 'Juan Perez',
        email: 'juan@test.com',
        telefono: '3001234567',
        torre: 'A',
        numero: 101,
        clienteId: 'cli-123',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error de validación', async () => {
      ;(submitPQRS as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'El asunto es requerido' })

      const result = await submitPQRS({
        tipo: 'PREGUNTA',
        asunto: '',
        descripcion: 'Descripción',
        nombreCompleto: 'Juan Perez',
        email: 'juan@test.com',
        telefono: '3001234567',
        torre: 'A',
        numero: 101,
        clienteId: 'cli-123',
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('getPQRS', () => {
    it('debe obtener lista de PQRS por clienteId', async () => {
      const mockData = [
        {
          id: 'pqrs-1',
          tipo: 'PREGUNTA',
          asunto: 'Consulta 1',
          estado: 'SIN_LEER',
        },
        {
          id: 'pqrs-2',
          tipo: 'QUEJA',
          asunto: 'Queja 1',
          estado: 'PENDIENTE',
        },
      ]
      ;(getPQRS as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getPQRS('cli-123')

      expect(result).toEqual(mockData)
    })

    it('debe retornar array vacío si no hay PQRS', async () => {
      ;(getPQRS as ReturnType<typeof vi.fn>).mockResolvedValue([])

      const result = await getPQRS('cli-123')

      expect(result).toEqual([])
    })
  })

  describe('getPQRSById', () => {
    it('debe obtener un PQRS por id', async () => {
      const mockData = {
        id: 'pqrs-123',
        tipo: 'PREGUNTA',
        asunto: 'Consulta',
        apartamento: { numero: '101', torre: 'A' },
      }
      ;(getPQRSById as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getPQRSById('pqrs-123')

      expect(result).toEqual(mockData)
    })
  })

  describe('updatePQRSEstado', () => {
    it('debe actualizar el estado de un PQRS exitosamente', async () => {
      const mockData = {
        id: 'pqrs-123',
        estado: 'RESUELTO',
      }
      ;(updatePQRSEstado as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updatePQRSEstado('pqrs-123', 'RESUELTO')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al actualizar estado', async () => {
      ;(updatePQRSEstado as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar el estado' })

      const result = await updatePQRSEstado('pqrs-123', 'RESUELTO')

      expect(result.error).toBeDefined()
    })
  })
})
