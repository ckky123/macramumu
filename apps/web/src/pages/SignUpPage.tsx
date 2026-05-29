import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  email:    z.string().email('Please enter a valid email'),
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

type SignUpForm = z.infer<typeof signUpSchema>

export function SignUpPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async (data: SignUpForm) => {
    setServerError(null)
    try {
      await authService.signUp(data.email, data.password, data.fullName)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl" aria-hidden="true">✉️</span>
          </div>
          <h2 className="font-serif text-2xl text-bark-600 mb-3">Check your email</h2>
          <p className="font-sans text-sm text-sand-400">
            We've sent a confirmation link to your email. Please verify your account before signing in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Create Account — Macramumu</title></Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl text-bark-600">Macramumu</Link>
            <p className="font-sans text-sm text-sand-400 mt-2">Create your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-sand-100 p-8">
            <h1 className="font-serif text-xl text-bark-600 mb-6">Create account</h1>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
                {serverError}
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
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                hint="Min 8 characters, one uppercase, one number"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                Create account
              </Button>
            </form>

            <p className="font-sans text-sm text-sand-400 text-center mt-6">
              Already have an account?{' '}
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
