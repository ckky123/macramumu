import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Instagram, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { APP_CONFIG } from '@/lib/constants'

const contactSchema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  email:   z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (_data: ContactForm) => {
    // In production, send to a Supabase Edge Function or email service
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact Us — Macramumu</title>
        <meta name="description" content="Get in touch with Macramumu. We'd love to hear from you about custom orders, wholesale, or anything else." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-3">Say hello</p>
          <h1 className="font-serif text-4xl text-bark-600">Get in Touch</h1>
          <p className="font-sans text-sm text-sand-400 mt-3 max-w-md mx-auto">
            We're a small team and we love hearing from you. We aim to reply within 1–2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl" aria-hidden="true">💛</span>
                </div>
                <h2 className="font-serif text-xl text-bark-600 mb-2">Message sent!</h2>
                <p className="font-sans text-sm text-sand-400">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <Input label="Your name" required error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
                <Input label="Subject" required error={errors.subject?.message} {...register('subject')} />
                <div>
                  <label className="block text-sm font-medium text-bark-500 font-sans mb-1.5">
                    Message <span className="text-blush-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-2.5 text-sm text-bark-600 font-sans placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-bark-300 resize-none"
                    placeholder="Tell us about your custom order, question, or just say hi..."
                    aria-invalid={!!errors.message}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" isLoading={isSubmitting} size="lg">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-xl text-bark-600 mb-4">Other ways to reach us</h2>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${APP_CONFIG.email}`}
                  className="flex items-center gap-3 text-bark-500 hover:text-bark-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Email</p>
                    <p className="font-sans text-xs text-sand-400">{APP_CONFIG.email}</p>
                  </div>
                </a>
                <a
                  href={APP_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-bark-500 hover:text-bark-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Instagram</p>
                    <p className="font-sans text-xs text-sand-400">@macramumu</p>
                  </div>
                </a>
                <a
                  href={APP_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-bark-500 hover:text-bark-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
                    <Facebook size={18} />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Facebook</p>
                    <p className="font-sans text-xs text-sand-400">Macramumu</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-5 bg-cream-100 rounded-2xl">
              <h3 className="font-serif text-bark-600 mb-2">Custom Orders</h3>
              <p className="font-sans text-sm text-sand-400 leading-relaxed">
                We love creating bespoke pieces. Tell us your vision — colours, size, style — and we'll bring it to life. Custom orders typically take 1–2 weeks.
              </p>
            </div>

            <div className="p-5 bg-cream-100 rounded-2xl">
              <h3 className="font-serif text-bark-600 mb-2">Based in London</h3>
              <p className="font-sans text-sm text-sand-400 leading-relaxed">
                We ship across the UK via Royal Mail. All orders are packed with care and dispatched within 1–2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
