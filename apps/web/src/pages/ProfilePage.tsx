import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Settings, Users, ShieldCheck, LogOut, Save } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, profile, isAdmin, setProfile, signOut } = useAuthStore()
  const { refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    values: {
      fullName: profile?.fullName ?? user?.user_metadata?.full_name ?? '',
    },
  })

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return
    setServerError(null)
    setSaveSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: data.fullName })
      .eq('id', user.id)

    if (error) {
      setServerError(error.message)
      return
    }

    // Refresh profile in store
    await refreshProfile()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-bark-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Use profile data if available, fall back to auth user metadata
  const email = profile?.email ?? user.email ?? ''
  const fullName = profile?.fullName ?? user.user_metadata?.full_name ?? ''
  const role = profile?.role ?? (isAdmin ? 'admin' : 'customer')
  const createdAt = profile?.createdAt ?? user.created_at

  return (
    <>
      <Helmet><title>My Profile — Macramumu</title></Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-bark-600">My Profile</h1>
            <p className="font-sans text-sm text-sand-400 mt-1">{email}</p>
          </div>
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bark-100 text-bark-600 font-sans text-xs font-medium">
              <ShieldCheck size={13} />
              Admin
            </span>
          )}
        </div>

        {/* Admin quick links */}
        {isAdmin && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link
              to="/admin"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand-100 hover:border-bark-200 hover:shadow-soft transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-bark-50 flex items-center justify-center group-hover:bg-bark-100 transition-colors">
                <Settings size={18} className="text-bark-500" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-bark-600">Products</p>
                <p className="font-sans text-xs text-sand-400">Manage catalogue</p>
              </div>
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand-100 hover:border-bark-200 hover:shadow-soft transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-bark-50 flex items-center justify-center group-hover:bg-bark-100 transition-colors">
                <Users size={18} className="text-bark-500" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-bark-600">Customers</p>
                <p className="font-sans text-xs text-sand-400">CRM dashboard</p>
              </div>
            </Link>
          </div>
        )}

        {/* Profile not loaded yet hint */}
        {!profile && (
          <div className="mb-6 p-4 bg-sand-50 border border-sand-200 rounded-2xl">
            <p className="font-sans text-sm text-sand-500">
              Profile is loading from the database. If this persists, try refreshing the page.
            </p>
            <button
              onClick={refreshProfile}
              className="mt-2 font-sans text-xs text-bark-500 hover:text-bark-600 font-medium underline"
            >
              Retry now
            </button>
          </div>
        )}

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-sand-100 p-6 mb-4">
          <h2 className="font-serif text-lg text-bark-600 mb-5">Personal Details</h2>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
              {serverError}
            </div>
          )}
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 font-sans" role="status">
              Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              required
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              disabled
              hint="Email cannot be changed here"
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save size={14} />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Account section */}
        <div className="bg-white rounded-2xl border border-sand-100 p-6">
          <h2 className="font-serif text-lg text-bark-600 mb-5">Account</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-sand-50">
              <div>
                <p className="font-sans text-sm text-bark-600">Role</p>
                <p className="font-sans text-xs text-sand-400 capitalize">{role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sand-50">
              <div>
                <p className="font-sans text-sm text-bark-600">Member since</p>
                <p className="font-sans text-xs text-sand-400">
                  {new Date(createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-sans text-sm text-bark-600">Password</p>
                <p className="font-sans text-xs text-sand-400">Change your password</p>
              </div>
              <Link
                to="/forgot-password"
                className="font-sans text-xs text-bark-500 hover:text-bark-600 font-medium transition-colors"
              >
                Reset
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-sand-100">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 font-sans text-sm text-red-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
