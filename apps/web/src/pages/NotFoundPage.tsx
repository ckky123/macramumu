import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function NotFoundPage() {
  return (
    <>
      <Helmet><title>Page Not Found — Macramumu</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
        <div>
          <p className="font-serif text-8xl text-cream-300 mb-4" aria-hidden="true">404</p>
          <h1 className="font-serif text-2xl text-bark-600 mb-3">Page not found</h1>
          <p className="font-sans text-sm text-sand-400 mb-8 max-w-xs mx-auto">
            This page seems to have wandered off. Let's get you back to something beautiful.
          </p>
          <Button as={Link} to="/" rightIcon={<ArrowRight size={16} />}>
            Back to Home
          </Button>
        </div>
      </div>
    </>
  )
}
