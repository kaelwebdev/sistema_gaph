import { describe, it, expect } from 'vitest'
import { createPersonSchema, updatePersonSchema } from '@/lib/schemas/person'

describe('createPersonSchema', () => {
  const validData = {
    name: 'John Doe',
    idNumber: '12345678',
    phone: '1234567890',
    email: 'john@example.com',
    condominiumId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createPersonSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = createPersonSchema.safeParse({
      ...validData,
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty idNumber', () => {
    const result = createPersonSchema.safeParse({
      ...validData,
      idNumber: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty condominiumId', () => {
    const result = createPersonSchema.safeParse({
      ...validData,
      condominiumId: '',
    })
    expect(result.success).toBe(false)
  })

  it('should accept optional phone', () => {
    const result = createPersonSchema.safeParse({
      name: 'John',
      idNumber: '123',
      condominiumId: 'client-123',
    })
    expect(result.success).toBe(true)
  })

  it('should accept optional email', () => {
    const result = createPersonSchema.safeParse({
      name: 'John',
      idNumber: '123',
      condominiumId: 'client-123',
      email: '',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = createPersonSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('updatePersonSchema', () => {
  it('should allow partial updates', () => {
    const result = updatePersonSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('should allow empty object', () => {
    const result = updatePersonSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})