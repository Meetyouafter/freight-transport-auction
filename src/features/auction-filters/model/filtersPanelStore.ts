import { create } from 'zustand'

interface FiltersPanelState {
  isOpen: boolean
  toggle: () => void
}

export const useFiltersPanelStore = create<FiltersPanelState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
