import { useState } from 'react'
import { AuthInput } from './AuthInput'
import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onSwitch: () => void
  isDark?: boolean
}

export function RegisterForm({ onSwitch, isDark = true }: Props) {
  const { register, isRegisterLoading, registerError } = useAuth()
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirm: '' })

  const validate = () => {
    const next = { name: '', email: '', password: '', confirm: '' }
    if (!fields.name) next.name = 'Name is required'
    if (!fields.email) next.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(fields.email)) next.email = 'Enter a valid email'
    if (!fields.password) next.password = 'Password is required'
    else if (fields.password.length < 6) next.password = 'At least 6 characters'
    if (!fields.confirm) next.confirm = 'Please confirm your password'
    else if (fields.confirm !== fields.password) next.confirm = 'Passwords do not match'
    setErrors(next)
    return !next.name && !next.email && !next.password && !next.confirm
  }

  const handleSubmit = () => {
    if (!validate()) return
    register({ name: fields.name, email: fields.email, password: fields.password })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create account
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Start chatting in seconds
        </p>
      </div>

      {registerError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
          {registerError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <AuthInput label="Name" type="text" placeholder="Your name"
          value={fields.name} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          error={errors.name} disabled={isRegisterLoading} />
        <AuthInput label="Email" type="email" placeholder="you@example.com"
          value={fields.email} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          error={errors.email} disabled={isRegisterLoading} />
        <AuthInput label="Password" type="password" placeholder="••••••••"
          value={fields.password} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, password: e.target.value }))}
          error={errors.password} disabled={isRegisterLoading} />
        <AuthInput label="Confirm password" type="password" placeholder="••••••••"
          value={fields.confirm} isDark={isDark}
          onChange={(e) => setFields((f) => ({ ...f, confirm: e.target.value }))}
          error={errors.confirm} disabled={isRegisterLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
      </div>

      <Button onClick={handleSubmit} isLoading={isRegisterLoading} className="w-full">
        Create account
      </Button>

      <p className={`text-sm text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </button>
      </p>
    </div>
  )
}