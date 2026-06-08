import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { Header } from '../components/layout/Header'
import { useAuthStore } from '../stores/authStore'
import { useUiStore } from '../stores/uiStore'
import { MessageSquare } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const token = useAuthStore((s) => s.token)
  const { isDark, toggleTheme } = useUiStore()

  if (token) return <Navigate to="/" replace />

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="flex flex-1">
        {/* Left panel — branding */}
        <div className={`hidden lg:flex flex-1 flex-col items-center justify-center p-12 border-r
          ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-sm text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your AI assistant
              </h2>
              <p className={`mt-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ask anything, get instant answers. Powered by the latest AI models.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full mt-4">
              {['Fast streaming responses', 'Full conversation history', 'Markdown & code support'].map((f) => (
                <div key={f} className={`flex items-center gap-3 rounded-lg px-4 py-3
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {mode === 'login'
              ? <LoginForm onSwitch={() => setMode('register')} isDark={isDark} />
              : <RegisterForm onSwitch={() => setMode('login')} isDark={isDark} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}