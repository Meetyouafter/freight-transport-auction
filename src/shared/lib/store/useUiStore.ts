import { create } from 'zustand'

/**
 * Point-in client UI state (not server state, not domain state).
 * Use Zustand stores like this one for small, cross-component UI flags —
 * e.g. dialog visibility, sidebar collapse, active tab. Server data belongs
 * in TanStack Query, domain logic belongs in entities/features.
 */
interface UiStore {
  isBidDialogOpen: boolean
  openBidDialog: () => void
  closeBidDialog: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  isBidDialogOpen: false,
  openBidDialog: () => set({ isBidDialogOpen: true }),
  closeBidDialog: () => set({ isBidDialogOpen: false }),
}))
