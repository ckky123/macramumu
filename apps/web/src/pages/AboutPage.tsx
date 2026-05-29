import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Our Story — Macramumu</title>
        <meta name="description" content="Macramumu is a London-based artisan brand run by a couple specialising in Nordic-style handmade macramé homeware and accessories." />
      </Helmet>

      {/* Hero */}
      <section className="bg-cream-100 py-20 px-4 sm:px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-4">Our story</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-bark-600 max-w-2xl mx-auto leading-tight">
          Made with love,<br />in London
        </h1>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="prose prose-sm max-w-none font-sans text-bark-500 leading-relaxed space-y-6">
          <p className="text-lg font-serif text-bark-600 leading-relaxed">
            Macramumu started the way most good things do — with a quiet afternoon, a ball of cotton cord, and a lot of curiosity.
          </p>
          <p>
            We're a couple based in London, and we fell in love with macramé for the same reason we think you will too: it's slow, it's meditative, and the result is something genuinely beautiful that you made with your own hands.
          </p>
          <p>
            Our aesthetic is rooted in Nordic minimalism — clean lines, natural textures, warm neutrals. We believe your home should feel like a sanctuary. Every piece we make is designed to bring a little calm into your space, whether that's a wall hanging above your reading nook, a jewellery dish on your bedside table, or a handmade keyring that makes you smile every time you reach for your keys.
          </p>
          <p>
            We use 100% natural cotton cord and sustainably sourced materials wherever possible. No two pieces are identical — that's the beauty of handmade. The slight variations are features, not flaws.
          </p>
          <p>
            We started selling on Etsy and loved connecting with customers who appreciated handmade things. Now we're building our own little corner of the internet — a place that feels as warm and considered as the pieces we make.
          </p>
          <p className="font-serif text-bark-600 text-lg">
            Thank you for being here. It means everything. 🌿
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button as={Link} to="/shop" rightIcon={<ArrowRight size={16} />}>
            Shop the Collection
          </Button>
          <Button as={Link} to="/contact" variant="outline">
            Get in Touch
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bark-600 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { emoji: '🌿', title: 'Natural', desc: '100% natural cotton cord and sustainably sourced materials' },
            { emoji: '✋', title: 'Handmade', desc: 'Every piece crafted by hand in our London studio' },
            { emoji: '💛', title: 'With Love', desc: 'Made slowly, intentionally, and with genuine care' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="text-cream-50">
              <div className="text-3xl mb-3" aria-hidden="true">{emoji}</div>
              <h3 className="font-serif text-lg mb-2">{title}</h3>
              <p className="font-sans text-sm text-cream-300 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
