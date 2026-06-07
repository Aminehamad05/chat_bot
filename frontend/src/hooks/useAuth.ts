import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/authService'
import type { LoginCredentials, RegisterCredentials } from '../types/auth'

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Read state directly from the store
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.logout)

  // Login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate('/chat')
    },
  })

  // Register
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate('/chat')
    },
  })

  // Logout — clears store + React Query cache + redirects
  const logout = async () => {
    await authService.logout()
    clearAuth()
    queryClient.clear() // wipe all cached conversations/messages
    navigate('/login')
  }

  return {
    // State
    user,
    token,
    isAuthenticated: !!token,

    // Actions
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    register: (credentials: RegisterCredentials) => registerMutation.mutate(credentials),
    logout,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,

    // Error messages
    loginError: loginMutation.error?.message ?? null,
    registerError: registerMutation.error?.message ?? null,
  }
}