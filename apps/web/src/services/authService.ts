import { supabase } from '@/lib/supabase'
import type { UserProfile, UserRole } from '@/types'

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    if (error) throw error
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // not found
      throw error
    }

    return mapRowToProfile(data as Record<string, unknown>)
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  // ─── Admin: user management ───────────────────────────────────────────────

  async getAllProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row) => mapRowToProfile(row as Record<string, unknown>))
  },

  async updateProfileRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role, is_admin: role === 'admin' })
      .eq('id', userId)

    if (error) throw error
  },

  async inviteStaff(email: string): Promise<void> {
    // Creates a pending invite row — the invited user signs up normally
    // and their role is set to 'staff' on first profile creation via the trigger
    const { error } = await supabase
      .from('staff_invites')
      .insert({ email, invited_at: new Date().toISOString() })

    if (error) throw error
  },

  async getPendingInvites(): Promise<{ id: string; email: string; invitedAt: string }[]> {
    const { data, error } = await supabase
      .from('staff_invites')
      .select('*')
      .eq('accepted', false)
      .order('invited_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row) => ({
      id: row.id as string,
      email: row.email as string,
      invitedAt: row.invited_at as string,
    }))
  },

  async revokeInvite(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff_invites')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

function mapRowToProfile(data: Record<string, unknown>): UserProfile {
  const role = (data.role as UserRole | null) ?? (data.is_admin ? 'admin' : 'customer')
  return {
    id: data.id as string,
    email: data.email as string,
    fullName: (data.full_name as string) ?? undefined,
    isAdmin: (data.is_admin as boolean) ?? false,
    role,
    createdAt: data.created_at as string,
  }
}
