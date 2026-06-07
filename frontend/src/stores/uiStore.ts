import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  // Theme
  isDark: boolean
  toggleTheme: () => void

  // Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // Theme — defaults to dark
      isDark: true,
      toggleTheme: () => set((s) => ({ isDark: !s.isDark })),

      // Sidebar — open by default on desktop, closed on mobile
      isSidebarOpen: window.innerWidth >= 768,
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
      // Only persist theme — sidebar state resets on refresh based on screen size
      partialize: (s) => ({ isDark: s.isDark }),
    }
  )
)