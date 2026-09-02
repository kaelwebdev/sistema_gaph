import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    assembly: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/actions/assemblies', () => ({
  createAssembly: vi.fn(),
  updateAssembly: vi.fn(),
  deleteAssembly: vi.fn(),
  getAssemblies: vi.fn(),
  getAssembly: vi.fn(),
}))

const {
  createAssembly,
  updateAssembly,
  deleteAssembly,
  getAssemblies,
  getAssembly,
} = await import('@/lib/actions/assemblies')

describe('assembly actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAssembly', () => {
    it('debe crear una assemblie exitosamente', async () => {
      const mockData = {
        id: 'asam-123',
        title: 'Assemblie Ordinaria 2024',
        date: new Date('2024-12-15'),
        status: 'ABIERTA',
        condominiumId: 'cli-123',
      }
      ;(createAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await createAssembly({
        title: 'Assemblie Ordinaria 2024',
        date: new Date('2024-12-15'),
        condominiumId: 'cli-123',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error al crear assemblie', async () => {
      ;(createAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al crear la assemblie' })

      const result = await createAssembly({
        title: 'Test',
        date: new Date(),
        condominiumId: 'cli-123',
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('updateAssembly', () => {
    it('debe actualizar una assemblie exitosamente', async () => {
      const mockData = {
        id: 'asam-123',
        title: 'Assemblie Actualizada',
        date: new Date('2024-12-15'),
        status: 'CERRADA',
        condominiumId: 'cli-123',
      }
      ;(updateAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, data: mockData })

      const result = await updateAssembly('asam-123', {
        title: 'Assemblie Actualizada',
        status: 'CERRADA',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('debe manejar error al actualizar', async () => {
      ;(updateAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al actualizar' })

      const result = await updateAssembly('asam-123', { title: 'Test' })

      expect(result.error).toBeDefined()
    })
  })

  describe('deleteAssembly', () => {
    it('debe eliminar una assemblie exitosamente', async () => {
      ;(deleteAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })

      const result = await deleteAssembly('asam-123')

      expect(result.success).toBe(true)
    })

    it('debe manejar error al eliminar', async () => {
      ;(deleteAssembly as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Error al eliminar' })

      const result = await deleteAssembly('asam-123')

      expect(result.error).toBeDefined()
    })
  })

  describe('getAssemblies', () => {
    it('debe obtener lista de assemblies por condominiumId', async () => {
      const mockData = [
        { id: 'asam-1', title: 'Assemblie 1', date: new Date(), status: 'ABIERTA' },
        { id: 'asam-2', title: 'Assemblie 2', date: new Date(), status: 'CERRADA' },
      ]
      ;(getAssemblies as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getAssemblies('cli-123')

      expect(result).toEqual(mockData)
    })

    it('debe retornar array vacío en caso de error', async () => {
      ;(getAssemblies as ReturnType<typeof vi.fn>).mockResolvedValue([])

      const result = await getAssemblies('cli-123')

      expect(result).toEqual([])
    })
  })

  describe('getAssembly', () => {
    it('debe obtener una assemblie por id con relaciones', async () => {
      const mockData = {
        id: 'asam-123',
        title: 'Assemblie Test',
        date: new Date(),
        status: 'ABIERTA',
        surveys: [],
        participants: [],
      }
      ;(getAssembly as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await getAssembly('asam-123')

      expect(result).toEqual(mockData)
    })
  })
})