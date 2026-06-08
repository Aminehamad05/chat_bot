import { Sidebar } from '../sidebar/Sidebar'
import { useUiStore } from '../../stores/uiStore'
import {Header} from './Header'
interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen)
  const {isDark, toggleTheme} = useUiStore();
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-200 ease-out ${isSidebarOpen ? 'w-67' : 'w-16'}`}
      >
        <Sidebar />
      </div>

      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
        <Header isDark={isDark} onToggleTheme={toggleTheme} />

        {children}
      </main>
    </div>
  )
}