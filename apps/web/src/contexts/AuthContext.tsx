import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

interface AuthContextValue {
  isReady: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setProfile, setLoading, reset } = useAuthStore()

  // Profile fetch — completely independent of auth flow
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) return

      const isAdmin = data.is_admin === true
      setProfile({
        id: data.id,
        email: data.email,
        fullName: data.full_name ?? undefined,
        isAdmin,
        role: isAdmin ? 'admin' : ((data.role as UserRole) ?? 'customer'),
        createdAt: data.created_at,
      })
    } catch {
      // Silently fail — user stays signed in, just no profile data
    }
  }, [setProfile])

  useEffect(() => {
    let mounted = true

    // The onAuthStateChange callback MUST be synchronous to avoid
    // the navigator.locks contention issue. Profile fetch is fire-and-forget.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT' || !session) {
          reset()
          return
        }

        // Set session but DON'T set loading to false yet — wait for profile
        setSession(session)

        // Load profile, then mark as ready
        loadProfile(session.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Safety: if after 2 seconds we're still loading, force it done
  useEffect(() => {
    const timeout = setTimeout(() => {
      const state = useAuthStore.getState()
      if (state.isLoading) {
        setLoading(false)
      }
    }, 2000)
    return () => clearTimeout(timeout)
  }, [setLoading])

  const refreshProfile = useCallback(async () => {
    const user = useAuthStore.getState().user
    if (user) {
      await loadProfile(user.id)
    }
  }, [loadProfile])

  const isReady = !useAuthStore((s) => s.isLoading)

  return (
    <AuthContext.Provider value={{ isReady, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
