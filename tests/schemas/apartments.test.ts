import { describe, it, expect } from 'vitest'
import { createApartmentSchema, updateApartmentSchema } from '@/lib/schemas/apartment'

describe('createApartmentSchema', () => {
  const validData = {
    number: '101',
    tower: 'A',
    level: 1,
    status: 'PROPIO',
    inhabitants: 3,
    condominiumId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createApartmentSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('PROPIO')
    }
  })

  it('should reject empty number', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      number: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty tower', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      tower: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative level', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      level: -1,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid status', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      status: 'INVALIDO',
    })
    expect(result.success).toBe(false)
  })

  it('should accept number as string', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      number: '202',
    })
    expect(result.success).toBe(true)
  })

  it('should coerce string level to number', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      level: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.level).toBe(5)
    }
  })

  it('should default inhabitants to 0', () => {
    const result = createApartmentSchema.safeParse({
      number: '101',
      tower: 'A',
      level: 1,
      status: 'PROPIO',
      condominiumId: 'client-123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.inhabitants).toBe(0)
    }
  })

  it('should accept all valid statuses', () => {
    const statuses = ['PROPIO', 'ARRIENDO', 'VACIO']
    for (const status of statuses) {
      const result = createApartmentSchema.safeParse({ ...validData, status })
      expect(result.success, `status ${status} should be valid`).toBe(true)
    }
  })

  it('should accept optional observations', () => {
    const result = createApartmentSchema.safeParse({
      ...validData,
      observations: 'Some observation',
    })
    expect(result.success).toBe(true)
  })
})

describe('updateApartmentSchema', () => {
  it('should allow partial updates', () => {
    const result = updateApartmentSchema.safeParse({ number: '202' })
    expect(result.success).toBe(true)
  })

  it('should allow empty object', () => {
    const result = updateApartmentSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})