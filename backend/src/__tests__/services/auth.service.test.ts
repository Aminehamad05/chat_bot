import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authService } from '../../services/auth.service'
import { AppError } from '../../middleware/errorHandler'

// ── Mock the DB ───────────────────────────────────────────────
jest.mock('../../db/index', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}))

// ── Mock env ──────────────────────────────────────────────────
jest.mock('../../config/env', () => ({
  env: {
    jwtSecret: 'test-secret',
    jwtExpiresIn: '7d',
  },
}))

import { db } from '../../db/index'

// ── Helpers ───────────────────────────────────────────────────
const mockUser = {
  id: 'user-123',
  name: 'Amine',
  email: 'amine@example.com',
  password: '$2a$12$hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
}

function mockSelect(returnValue: unknown[]) {
  const chain = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(returnValue),
  }
  ;(db.select as jest.Mock).mockReturnValue(chain)
  return chain
}

function mockInsert(returnValue: unknown[]) {
  const chain = {
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(returnValue),
  }
  ;(db.insert as jest.Mock).mockReturnValue(chain)
  return chain
}

// ── Tests ─────────────────────────────────────────────────────

describe('authService.register', () => {
  it('creates a new user and returns token', async () => {
    // No existing user
    mockSelect([])
    // Insert returns new user
    mockInsert([mockUser])

    const result = await authService.register({
      name: 'Amine',
      email: 'amine@example.com',
      password: 'password123',
    })

    expect(result.user.email).toBe('amine@example.com')
    expect(result.user).not.toHaveProperty('password')
    expect(result.token).toBeDefined()

    // Verify the token is valid
    const decoded = jwt.verify(result.token, 'test-secret') as { userId: string }
    expect(decoded.userId).toBe('user-123')
  })

  it('throws 409 if email already exists', async () => {
    mockSelect([mockUser]) // email taken

    await expect(
      authService.register({
        name: 'Amine',
        email: 'amine@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(new AppError('An account with this email already exists', 409))
  })

  it('hashes the password before saving', async () => {
    mockSelect([])
    const insertChain = mockInsert([mockUser])

    await authService.register({
      name: 'Amine',
      email: 'amine@example.com',
      password: 'password123',
    })

    const insertedValues = insertChain.values.mock.calls[0][0]
    expect(insertedValues.password).not.toBe('password123')
    expect(insertedValues.password).toMatch(/^\$2[ab]\$/)  // bcrypt hash pattern
  })

  it('normalizes email to lowercase', async () => {
    mockSelect([])
    const insertChain = mockInsert([mockUser])

    await authService.register({
      name: 'Amine',
      email: 'AMINE@EXAMPLE.COM',
      password: 'password123',
    })

    const insertedValues = insertChain.values.mock.calls[0][0]
    expect(insertedValues.email).toBe('amine@example.com')
  })
})

describe('authService.login', () => {
  it('returns user and token with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 12)
    mockSelect([{ ...mockUser, password: hashedPassword }])

    const result = await authService.login({
      email: 'amine@example.com',
      password: 'password123',
    })

    expect(result.user.email).toBe('amine@example.com')
    expect(result.user).not.toHaveProperty('password')
    expect(result.token).toBeDefined()
  })

  it('throws 401 if user not found', async () => {
    mockSelect([]) // no user

    await expect(
      authService.login({
        email: 'nobody@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(new AppError('Invalid email or password', 401))
  })

  it('throws 401 if password is wrong', async () => {
    const hashedPassword = await bcrypt.hash('correctpassword', 12)
    mockSelect([{ ...mockUser, password: hashedPassword }])

    await expect(
      authService.login({
        email: 'amine@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow(new AppError('Invalid email or password', 401))
  })

  it('does not distinguish between wrong email and wrong password', async () => {
    mockSelect([])

    const error = await authService
      .login({ email: 'x@x.com', password: 'x' })
      .catch((e) => e)

    // Same message for both cases — prevents user enumeration
    expect(error.message).toBe('Invalid email or password')
  })
})

describe('authService.getUserById', () => {
  it('returns user without password', async () => {
    mockSelect([mockUser])

    const user = await authService.getUserById('user-123')

    expect(user).not.toBeNull()
    expect(user).not.toHaveProperty('password')
    expect(user?.id).toBe('user-123')
  })

  it('returns null if user not found', async () => {
    mockSelect([])

    const user = await authService.getUserById('nonexistent')

    expect(user).toBeNull()
  })
})