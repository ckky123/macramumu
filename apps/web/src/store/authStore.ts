import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isAdmin: boolean
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAdmin: false,

  setUser: (user) => set({ user }),

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setProfile: (profile) =>
    set({ profile, isAdmin: profile?.isAdmin ?? false }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      user: null,
      session: null,
      profile: null,
      isAdmin: false,
      isLoading: false,
    }),

  signOut: async () => {
    // The onAuthStateChange listener will fire SIGNED_OUT and call reset()
    await supabase.auth.signOut()
  },
}))
