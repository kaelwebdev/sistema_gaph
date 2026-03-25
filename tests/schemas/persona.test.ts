import { describe, it, expect } from 'vitest'
import { createPersonaSchema, updatePersonaSchema } from '@/lib/schemas/persona'

describe('createPersonaSchema', () => {
  const validData = {
    nombre: 'John Doe',
    cedula: '12345678',
    telefono: '1234567890',
    email: 'john@example.com',
    clienteId: 'client-123',
  }

  it('should validate correct data', () => {
    const result = createPersonaSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty nombre', () => {
    const result = createPersonaSchema.safeParse({
      ...validData,
      nombre: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty cedula', () => {
    const result = createPersonaSchema.safeParse({
      ...validData,
      cedula: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty clienteId', () => {
    const result = createPersonaSchema.safeParse({
      ...validData,
      clienteId: '',
    })
    expect(result.success).toBe(false)
  })

  it('should accept optional telefono', () => {
    const result = createPersonaSchema.safeParse({
      nombre: 'John',
      cedula: '123',
      clienteId: 'client-123',
    })
    expect(result.success).toBe(true)
  })

  it('should accept optional email', () => {
    const result = createPersonaSchema.safeParse({
      nombre: 'John',
      cedula: '123',
      clienteId: 'client-123',
      email: '',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = createPersonaSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('updatePersonaSchema', () => {
  it('should allow partial updates', () => {
    const result = updatePersonaSchema.safeParse({ nombre: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('should allow empty object', () => {
    const result = updatePersonaSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
