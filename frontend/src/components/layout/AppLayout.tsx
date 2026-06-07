import { Sidebar } from '../sidebar/Sidebar'

interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  )
}