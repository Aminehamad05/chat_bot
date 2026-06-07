import { Sun, Moon, MessageSquare, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  isDark: boolean
  onToggleTheme: () => void
}

export function Header({ isDark, onToggleTheme }: Props) {
  const token = useAuthStore((s) => s.token)
  const { user, logout } = useAuth()
  const isLoggedIn = !!token

  return (
    <header className={`w-full flex items-center justify-between px-6 py-3 border-b
      ${isDark
        ? 'bg-gray-900 border-gray-800 text-white'
        : 'bg-white border-gray-200 text-gray-900'}`}>

      {/* Left — brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <MessageSquare size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm">Chatbot</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">

        {/* Theme toggle — always visible */}
        <button
          onClick={onToggleTheme}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors
            ${isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Logged in — user info + logout */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 ml-1">
            {/* Avatar */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={11} className="text-white" />
              </div>
              <span className="hidden sm:block max-w-[140px] truncate">{user?.name ?? user?.email}</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors
                ${isDark
                  ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'}`}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          /* Logged out — nothing extra, just the logo + toggle */
          <div className={`text-xs px-3 py-1.5 rounded-lg border
            ${isDark
              ? 'border-gray-700 text-gray-500'
              : 'border-gray-200 text-gray-400'}`}>
            Not signed in
          </div>
        )}
      </div>
    </header>
  )
}