import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../db/index'
import { users } from '../db/schema'
import { env } from '../config/env'
import { AppError } from '../middleware/errorHandler'
import type { RegisterBody, LoginBody, AuthResponse, SafeUser, JwtPayload } from '../types/auth'

// ── Helpers ───────────────────────────────────────────────────

function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

function stripPassword(user: typeof users.$inferSelect): SafeUser {
  const { password: _, ...safe } = user
  return safe
}

// ── Service ───────────────────────────────────────────────────

export const authService = {

  async register(body: RegisterBody): Promise<AuthResponse> {
    // Check email is not already taken
    console.log(body) // Debugging log
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email.toLowerCase()))
      .limit(1)

    if (existing.length > 0) {
      throw new AppError('An account with this email already exists', 409)
    }

    // Hash password — 12 rounds is a good balance of security vs speed
    const hashed = await bcrypt.hash(body.password, 12)

    // Insert user
    const [user] = await db
      .insert(users)
      .values({
        name:     body.name.trim(),
        email:    body.email.toLowerCase().trim(),
        password: hashed,
      })
      .returning()

    const token = signToken({ userId: user.id, email: user.email })

    return { user: stripPassword(user), token }
  },

  async login(body: LoginBody): Promise<AuthResponse> {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email.toLowerCase()))
      .limit(1)

    if (!user) {
      // Same error for wrong email or wrong password — don't leak which one
      throw new AppError('Invalid email or password', 401)
    }

    // Compare password
    const valid = await bcrypt.compare(body.password, user.password)

    if (!valid) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = signToken({ userId: user.id, email: user.email })

    return { user: stripPassword(user), token }
  },

  async getUserById(userId: string): Promise<SafeUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return user ? stripPassword(user) : null
  },
}