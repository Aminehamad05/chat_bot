import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth'
import { mockAuthService } from '../mocks/auth'

// When your Express backend is ready, replace each mock call with:
// import { api } from './api'
// api.post<AuthResponse>('/auth/login', credentials).then(r => r.data)

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    mockAuthService.login(credentials),

  register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
    mockAuthService.register(credentials),

  logout: (): Promise<void> =>
    mockAuthService.logout(),
}