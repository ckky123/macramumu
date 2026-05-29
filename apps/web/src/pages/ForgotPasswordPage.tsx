import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await authService.resetPassword(data.email)
      setSent(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl" aria-hidden="true">✉️</span>
          </div>
          <h2 className="font-serif text-2xl text-bark-600 mb-3">Check your email</h2>
          <p className="font-sans text-sm text-sand-400 mb-6">
            We've sent a password reset link to your email. It may take a minute to arrive.
          </p>
          <Link to="/login" className="font-sans text-sm text-bark-500 hover:text-bark-600 font-medium transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Forgot Password — Macramumu</title></Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl text-bark-600">Macramumu</Link>
            <p className="font-sans text-sm text-sand-400 mt-2">Reset your password</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-sand-100 p-8">
            <h1 className="font-serif text-xl text-bark-600 mb-2">Forgot password?</h1>
            <p className="font-sans text-sm text-sand-400 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                Send reset link
              </Button>
            </form>

            <p className="font-sans text-sm text-sand-400 text-center mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-bark-500 hover:text-bark-600 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
