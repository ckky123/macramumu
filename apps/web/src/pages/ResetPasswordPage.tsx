import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error
      navigate('/login', { state: { message: 'Password updated. Please sign in.' } })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to update password.')
    }
  }

  return (
    <>
      <Helmet><title>Reset Password — Macramumu</title></Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl text-bark-600">Macramumu</Link>
            <p className="font-sans text-sm text-sand-400 mt-2">Choose a new password</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-sand-100 p-8">
            <h1 className="font-serif text-xl text-bark-600 mb-6">Set new password</h1>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                required
                hint="Min 8 characters, one uppercase, one number"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                Update password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
