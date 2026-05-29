import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Settings, Users } from 'lucide-react'
import { clsx } from 'clsx'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

const NAV_LINKS = [
  { to: '/shop',    label: 'Shop' },
  { to: '/about',   label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const { user, isAdmin, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-sand-200">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-xl text-bark-600 hover:text-bark-500 transition-colors"
          aria-label="Macramumu home"
        >
          Macramumu
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'font-sans text-sm transition-colors duration-150',
                    isActive
                      ? 'text-bark-600 font-medium'
                      : 'text-sand-400 hover:text-bark-500'
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Admin dashboard */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-bark-500 hover:bg-sand-100 transition-colors"
                aria-label="Products dashboard"
              >
                <Settings size={14} />
                Products
              </Link>
              <Link
                to="/admin/customers"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-bark-500 hover:bg-sand-100 transition-colors"
                aria-label="CRM dashboard"
              >
                <Users size={14} />
                Customers
              </Link>
            </div>
          )}

          {/* Auth */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
            >
              <User size={14} />
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
            >
              <User size={14} />
              Sign in
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-xl text-bark-500 hover:bg-sand-100 transition-colors"
            aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blush-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                aria-hidden="true"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-bark-500 hover:bg-sand-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-sand-200 bg-cream-50 px-4 py-4 flex flex-col gap-3 animate-slide-up"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'font-sans text-sm py-2 transition-colors',
                  isActive ? 'text-bark-600 font-medium' : 'text-sand-400'
                )
              }
            >
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm py-2 text-bark-500 flex items-center gap-2"
              >
                <Settings size={14} />
                Products
              </Link>
              <Link
                to="/admin/customers"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm py-2 text-bark-500 flex items-center gap-2"
              >
                <Users size={14} />
                Customers
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="font-sans text-sm py-2 text-sand-400 text-left"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="font-sans text-sm py-2 text-sand-400"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
