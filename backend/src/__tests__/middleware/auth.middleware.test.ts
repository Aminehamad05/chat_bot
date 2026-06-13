import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../../middleware/auth.middleware'
import { authService } from '../../services/auth.service'

jest.mock('../../services/auth.service')
jest.mock('../../config/env', () => ({
  env: { jwtSecret: 'test-secret' },
}))

// ── Helpers ───────────────────────────────────────────────────
function mockReq(authHeader?: string): Partial<Request> {
  return {
    headers: { authorization: authHeader },
  }
}

function mockRes(): Partial<Response> {
  return {}
}

function mockNext(): NextFunction {
  return jest.fn()
}

const mockUser = {
  id: 'user-123',
  name: 'Amine',
  email: 'amine@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ── Tests ─────────────────────────────────────────────────────

describe('authMiddleware', () => {
  it('calls next() and attaches user when token is valid', async () => {
    const token = jwt.sign(
      { userId: 'user-123', email: 'amine@example.com' },
      'test-secret'
    )

    ;(authService.getUserById as jest.Mock).mockResolvedValue(mockUser)

    const req = mockReq(`Bearer ${token}`) as Request
    const res = mockRes() as Response
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(req.user).toEqual(mockUser)
    expect(next).toHaveBeenCalledWith()  // called with no args = success
  })

  it('calls next(error) when no token provided', async () => {
    const req = mockReq() as Request
    const res = mockRes() as Response
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'No token provided', statusCode: 401 })
    )
  })

  it('calls next(error) when token is malformed', async () => {
    const req = mockReq('Bearer invalid.token.here') as Request
    const res = mockRes() as Response
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token', statusCode: 401 })
    )
  })

  it('calls next(error) when token is expired', async () => {
    const token = jwt.sign(
      { userId: 'user-123', email: 'amine@example.com' },
      'test-secret',
      { expiresIn: '0s' }
    )

    const req = mockReq(`Bearer ${token}`) as Request
    const res = mockRes() as Response
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('calls next(error) when user no longer exists in DB', async () => {
    const token = jwt.sign(
      { userId: 'deleted-user', email: 'x@x.com' },
      'test-secret'
    )

    ;(authService.getUserById as jest.Mock).mockResolvedValue(null)

    const req = mockReq(`Bearer ${token}`) as Request
    const res = mockRes() as Response
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User no longer exists', statusCode: 401 })
    )
  })
})