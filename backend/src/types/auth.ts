import { User } from '../db/schema'

export type SafeUser = Omit<User, 'password'>

export interface JwtPayload {
  userId: string
  email: string
}

export interface RegisterBody {
  name: string
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface AuthResponse {
  user: SafeUser
  token: string
}