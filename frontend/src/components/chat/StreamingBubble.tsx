import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useUiStore } from '../../stores/uiStore'

interface Props {
  content: string
}

export function StreamingBubble({ content }: Props) {
  const isDark = useUiStore((s) => s.isDark)

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center
        justify-center text-xs font-bold
        ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
        AI
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed
        ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
        {/* Blinking cursor */}
        <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />
      </div>
    </div>
  )
}