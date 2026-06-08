import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const fakeUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
  },
]

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800)

    const match = fakeUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    )

    if (!match) throw new Error('Invalid email or password')

    const { password: _, ...safeUser } = match

    return {
      user: safeUser,
      token: `mock-jwt-${safeUser.id}-${Date.now()}`,
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay(800)

    const exists = fakeUsers.find((u) => u.email === credentials.email)
    if (exists) throw new Error('An account with this email already exists')

    const newUser = {
      id: crypto.randomUUID(),
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    }

    fakeUsers.push(newUser)

    const { password: _, ...safeUser } = newUser

    return {
      user: safeUser,
      token: `mock-jwt-${safeUser.id}-${Date.now()}`,
    }
  },

  logout: async (): Promise<void> => {
    await delay(200)
  },
}