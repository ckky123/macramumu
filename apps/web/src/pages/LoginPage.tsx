import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email:    z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    try {
      await authService.signIn(data.email, data.password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    }
  }

  return (
    <>
      <Helmet><title>Sign In — Macramumu</title></Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="font-serif text-2xl text-bark-600">
              Macramumu
            </Link>
            <p className="font-sans text-sm text-sand-400 mt-2">
              Welcome back
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-sand-100 p-8">
            <h1 className="font-serif text-xl text-bark-600 mb-6">Sign in</h1>

            {serverError && (
              <div
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans"
                role="alert"
              >
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

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="self-end text-xs font-sans text-sand-400 hover:text-bark-500 flex items-center gap-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="font-sans text-xs text-sand-400 hover:text-bark-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </form>

            <p className="font-sans text-sm text-sand-400 text-center mt-6">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-bark-500 hover:text-bark-600 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
