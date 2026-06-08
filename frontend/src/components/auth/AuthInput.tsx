interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isDark?: boolean
}

export function AuthInput({ label, error, isDark = true, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        className={`border rounded-lg px-4 py-2.5 text-sm placeholder-gray-500
          outline-none transition-colors
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isDark
            ? 'bg-gray-800 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'}
          ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}