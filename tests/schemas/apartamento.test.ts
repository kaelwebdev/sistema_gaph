import { describe, it, expect } from 'vitest'
import { createApartamentoSchema, updateApartamentoSchema } from '@/lib/schemas/apartamento'

describe('createApartamentoSchema', () => {
  const validData = {
    numero: '101',
    torre: 'A',
    nivel: 1,
    estado: 'PROPIO',
    habitantes: 3,
    clienteId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createApartamentoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.estado).toBe('PROPIO')
    }
  })

  it('should reject empty numero', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      numero: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty torre', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      torre: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative nivel', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      nivel: -1,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid estado', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      estado: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should accept numero as string', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      numero: '202',
    })
    expect(result.success).toBe(true)
  })

  it('should coerce string nivel to number', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      nivel: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.nivel).toBe(5)
    }
  })

  it('should default habitantes to 0', () => {
    const result = createApartamentoSchema.safeParse({
      numero: '101',
      torre: 'A',
      nivel: 1,
      estado: 'PROPIO',
      clienteId: 'client-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.habitantes).toBe(0)
    }
  })

  it('should accept all valid estados', () => {
    const estados = ['PROPIO', 'ARRIENDO', 'VACIO']
    for (const estado of estados) {
      const result = createApartamentoSchema.safeParse({ ...validData, estado })
      expect(result.success, `estado ${estado} should be valid`).toBe(true)
    }
  })

  it('should accept optional observaciones', () => {
    const result = createApartamentoSchema.safeParse({
      ...validData,
      observaciones: 'Some observation',
    })
    expect(result.success).toBe(true)
  })
})

describe('updateApartamentoSchema', () => {
  it('should allow partial updates', () => {
    const result = updateApartamentoSchema.safeParse({ numero: '202' })
    expect(result.success).toBe(true)
  })

  it('should allow empty object', () => {
    const result = updateApartamentoSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
