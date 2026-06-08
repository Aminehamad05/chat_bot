import { useState } from 'react'
import { AuthInput } from './AuthInput'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onSwitch: () => void
  isDark?: boolean
}

export function LoginForm({ onSwitch, isDark = true }: Props) {
  const { login, isLoginLoading, loginError } = useAuth()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validate = () => {
    const next = { email: '', password: '' }
    if (!fields.email) next.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(fields.email)) next.email = 'Enter a valid email'
    if (!fields.password) next.password = 'Password is required'
    else if (fields.password.length < 6) next.password = 'At least 6 characters'
    setErrors(next)
    return !next.email && !next.password
  }

  const handleSubmit = () => {
    if (!validate()) return
    login(fields)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Sign in to continue
        </p>
      </div>

      {loginError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
          {loginError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <AuthInput
          label="Email" type="email" placeholder="you@example.com"
          value={fields.email} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          error={errors.email} disabled={isLoginLoading}
        />
        <AuthInput
          label="Password" type="password" placeholder="••••••••"
          value={fields.password} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, password: e.target.value }))}
          error={errors.password} disabled={isLoginLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <Button onClick={handleSubmit} isLoading={isLoginLoading} className="w-full">
        Sign in
      </Button>

      <div className={`border rounded-lg px-4 py-3 text-xs
        ${isDark ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Demo credentials</span><br />
        Email: <span className="text-blue-400">demo@example.com</span><br />
        Password: <span className="text-blue-400">password123</span>
      </div>

      <p className={`text-sm text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-blue-400 hover:text-blue-300 font-medium">
          Sign up
        </button>
      </p>
    </div>
  )
}