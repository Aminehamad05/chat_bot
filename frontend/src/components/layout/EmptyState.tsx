import { MessageSquare, Zap, Shield, Code } from 'lucide-react'
import { useUiStore } from '../../stores/uiStore'

const suggestions = [
  { icon: Zap, text: 'Explain how React Query works' },
  { icon: Code, text: 'Write a TypeScript utility type' },
  { icon: Shield, text: 'What is JWT and how does it work?' },
  { icon: MessageSquare, text: 'Help me design a REST API' },
]

interface Props {
  onSuggestionClick: (text: string) => void
}

export function EmptyState({ onSuggestionClick }: Props) {
  const isDark = useUiStore((s) => s.isDark)

  return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-8 px-6 py-12
      ${isDark ? 'text-white' : 'text-gray-900'}`}>

      {/* Icon + greeting */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <MessageSquare size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">How can I help you?</h2>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Start a new conversation or pick a suggestion below
          </p>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map(({ icon: Icon, text }) => (
          <button
            key={text}
            onClick={() => onSuggestionClick(text)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left
              transition-all duration-150 group
              ${isDark
                ? 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 hover:text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
              }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
              ${isDark
                ? 'bg-gray-700 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                : 'bg-gray-100 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
              <Icon size={14} />
            </div>
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}