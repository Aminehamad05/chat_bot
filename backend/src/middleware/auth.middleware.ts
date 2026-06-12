import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { authService } from '../services/auth.service'
import { AppError } from './errorHandler'
import type { JwtPayload, SafeUser } from '../types/auth'

// Extend Express Request to carry the user
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]

    let payload: JwtPayload

    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    } catch {
      throw new AppError('Invalid or expired token', 401)
    }

    // Fetch fresh user from DB — catches deleted/suspended accounts
    const user = await authService.getUserById(payload.userId)

    if (!user) {
      throw new AppError('User no longer exists', 401)
    }

    req.user = user
    next()

  } catch (err) {
    next(err)
  }
}