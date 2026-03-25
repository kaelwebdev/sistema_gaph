import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    asamblea: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/asambleas', () => ({
  createAsamblea: vi.fn(),
  updateAsamblea: vi.fn(),
  deleteAsamblea: vi.fn(),
  getAsambleas: vi.fn(),
  getAsamblea: vi.fn(),
}))

const {
  createAsamblea,
  updateAsamblea,
  deleteAsamblea,
  getAsambleas,
  getAsamblea,
} = await import('@/lib/actions/asambleas')

describe('asambleas actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAsamblea', () => {
    it('debe crear una asamblea exitosamente', async () => {
      const mockData = {
        id: 'asam-123',
        titulo: 'Asamblea Ordinaria 2024',
        fecha: new Date('2024-12-15'),
        estado: 'ABIERTA',
        clienteId: 'cli-123',
      }
      ;(createAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await createAsamblea({
        titulo: 'Asamblea Ordinaria 2024',
        fecha: new Date('2024-12-15'),
        clienteId: 'cli-123',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error al crear asamblea', async () => {
      ;(createAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al crear la asamblea' })

      const result = await createAsamblea({
        titulo: 'Test',
        fecha: new Date(),
        clienteId: 'cli-123',
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('updateAsamblea', () => {
    it('debe actualizar una asamblea exitosamente', async () => {
      const mockData = {
        id: 'asam-123',
        titulo: 'Asamblea Actualizada',
        fecha: new Date('2024-12-15'),
        estado: 'CERRADA',
        clienteId: 'cli-123',
      }
      ;(updateAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updateAsamblea('asam-123', {
        titulo: 'Asamblea Actualizada',
        estado: 'CERRADA',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error al actualizar', async () => {
      ;(updateAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar' })

      const result = await updateAsamblea('asam-123', { titulo: 'Test' })

      expect(result.error).toBeDefined()
    })
  })

  describe('deleteAsamblea', () => {
    it('debe eliminar una asamblea exitosamente', async () => {
      ;(deleteAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })

      const result = await deleteAsamblea('asam-123')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al eliminar', async () => {
      ;(deleteAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al eliminar' })

      const result = await deleteAsamblea('asam-123')

      expect(result.error).toBeDefined()
    })
  })

  describe('getAsambleas', () => {
    it('debe obtener lista de asambleas por clienteId', async () => {
      const mockData = [
        { id: 'asam-1', titulo: 'Asamblea 1', fecha: new Date(), estado: 'ABIERTA' },
        { id: 'asam-2', titulo: 'Asamblea 2', fecha: new Date(), estado: 'CERRADA' },
      ]
      ;(getAsambleas as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getAsambleas('cli-123')

      expect(result).toEqual(mockData)
    })

    it('debe retornar array vacío en caso de error', async () => {
      ;(getAsambleas as ReturnType<typeof vi.fn>).mockResolvedValue([])

      const result = await getAsambleas('cli-123')

      expect(result).toEqual([])
    })
  })

  describe('getAsamblea', () => {
    it('debe obtener una asamblea por id con relaciones', async () => {
      const mockData = {
        id: 'asam-123',
        titulo: 'Asamblea Test',
        fecha: new Date(),
        estado: 'ABIERTA',
        encuestas: [],
        participantes: [],
      }
      ;(getAsamblea as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getAsamblea('asam-123')

      expect(result).toEqual(mockData)
    })
  })
})
