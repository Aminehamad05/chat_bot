import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth'
import { mockAuthService } from '../mocks/auth'
import { api } from './api';

// When your Express backend is ready, replace each mock call with:
// import { api } from './api'
// api.post<AuthResponse>('/auth/login', credentials).then(r => r.data)

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> =>{
    const res = await api.post<AuthResponse>('/auth/login', credentials)
    return res.data;
  },
    

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> =>{
    const res = await api.post<AuthResponse>('/auth/register', credentials)
    return res.data;
  },

  logout: async (): Promise<void> =>{
    localStorage.removeItem("token");
    return Promise.resolve();
  }
}