import { Link } from 'react-router-dom'
import { Instagram, Facebook } from 'lucide-react'
import { APP_CONFIG } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bark-600 text-cream-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-xl text-cream-50 mb-3">Macramumu</h2>
            <p className="font-sans text-sm text-cream-300 leading-relaxed max-w-xs">
              Handcrafted macramé homeware and accessories, made with love in London.
              Nordic-inspired, naturally beautiful.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={APP_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-bark-500 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={APP_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-bark-500 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={18} />
              </a>
              {/* Pinterest SVG (lucide doesn't have it) */}
              <a
                href={APP_CONFIG.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-bark-500 transition-colors"
                aria-label="Follow us on Pinterest"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-cream-300 mb-4">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/shop?category=hair-clips', label: 'Hair Clips' },
                { to: '/shop?category=keyrings', label: 'Key Rings' },
                { to: '/shop?category=wall-hangings', label: 'Wall Hangings' },
                { to: '/shop?category=jewellery-dishes', label: 'Jewellery Dishes' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-sans text-sm text-cream-300 hover:text-cream-50 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-cream-300 mb-4">
              Info
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {[
                { to: '/about',   label: 'Our Story' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq',     label: 'FAQ' },
                { to: '/delivery',label: 'Delivery & Returns' },
                { to: '/privacy', label: 'Privacy Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-sans text-sm text-cream-300 hover:text-cream-50 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bark-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-cream-400">
            © {year} Macramumu. All rights reserved. Made with ♥ in London.
          </p>
          <p className="font-sans text-xs text-cream-400">
            Secure payments by Stripe
          </p>
        </div>
      </div>
    </footer>
  )
}
