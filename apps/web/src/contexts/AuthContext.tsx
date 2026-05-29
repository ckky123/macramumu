import React, { createContext, useContext, useEffect } from 'react'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

interface AuthContextValue {
  isReady: boolean
}

const AuthContext = createContext<AuthContextValue>({ isReady: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setProfile, setLoading, reset } = useAuthStore()

  useEffect(() => {
    // Load initial session
    authService.getSession().then(async (session) => {
      setSession(session)
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id)
        setProfile(profile)
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          const profile = await authService.getProfile(session.user.id)
          setProfile(profile)
        } else {
          reset()
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setSession, setProfile, setLoading, reset])

  const isReady = !useAuthStore((s) => s.isLoading)

  return (
    <AuthContext.Provider value={{ isReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
