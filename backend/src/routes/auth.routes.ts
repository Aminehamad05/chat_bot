import { Router, Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { authMiddleware } from '../middleware/auth.middleware'
import { authLimiter } from '../middleware/rateLimiter'
import { AppError } from '../middleware/errorHandler'
import type { RegisterBody, LoginBody } from '../types/auth'

const router = Router()

// ── Validation helpers ────────────────────────────────────────

function validateRegister(body: Partial<RegisterBody>): RegisterBody {
  const { name, email, password } = body

  if (!name?.trim())
    throw new AppError('Name is required', 400)
  if (!email?.trim())
    throw new AppError('Email is required', 400)
  if (!/\S+@\S+\.\S+/.test(email))
    throw new AppError('Invalid email format', 400)
  if (!password)
    throw new AppError('Password is required', 400)
  if (password.length < 6)
    throw new AppError('Password must be at least 6 characters', 400)

  return { name, email, password }
}

function validateLogin(body: Partial<LoginBody>): LoginBody {
  const { email, password } = body

  if (!email?.trim())
    throw new AppError('Email is required', 400)
  if (!password)
    throw new AppError('Password is required', 400)

  return { email, password }
}

// ── Routes ────────────────────────────────────────────────────

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = validateRegister(req.body)
      const result = await authService.register(body)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = validateLogin(req.body)
      const result = await authService.login(body)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/auth/me  — returns the currently logged-in user
router.get(
  '/me',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ user: req.user })
    } catch (err) {
      next(err)
    }
  }
)

export default router