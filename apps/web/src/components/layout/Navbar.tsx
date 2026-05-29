import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Settings, Users, LogOut, ShieldCheck } from 'lucide-react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const itemCount = useCartStore((s) => s.getItemCount())
  const { user, profile, isAdmin, signOut } = useAuthStore()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setDropdownOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate('/')
  }

  // Initials avatar
  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?'

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
                    isActive ? 'text-bark-600 font-medium' : 'text-sand-400 hover:text-bark-500'
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

          {/* User avatar / dropdown (desktop) */}
          {user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-sand-100 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-bark-200 flex items-center justify-center">
                  <span className="font-sans text-xs font-semibold text-bark-600">{initials}</span>
                </div>
                {isAdmin && (
                  <ShieldCheck size={13} className="text-bark-400" aria-label="Admin" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-sand-100 py-1.5 z-50">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-sand-100">
                    <p className="font-sans text-sm font-medium text-bark-600 truncate">
                      {profile?.fullName ?? 'My Account'}
                    </p>
                    <p className="font-sans text-xs text-sand-400 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs font-sans text-bark-500 font-medium">
                        <ShieldCheck size={11} /> Admin
                      </span>
                    )}
                  </div>

                  {/* Profile link */}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 font-sans text-sm text-bark-600 hover:bg-sand-50 transition-colors"
                  >
                    <User size={14} className="text-sand-400" />
                    My Profile
                  </Link>

                  {/* Admin links */}
                  {isAdmin && (
                    <>
                      <div className="mx-3 my-1 border-t border-sand-100" />
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 font-sans text-sm text-bark-600 hover:bg-sand-50 transition-colors"
                      >
                        <Settings size={14} className="text-sand-400" />
                        Products Dashboard
                      </Link>
                      <Link
                        to="/admin/customers"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 font-sans text-sm text-bark-600 hover:bg-sand-50 transition-colors"
                      >
                        <Users size={14} className="text-sand-400" />
                        CRM Dashboard
                      </Link>
                    </>
                  )}

                  {/* Sign out */}
                  <div className="mx-3 my-1 border-t border-sand-100" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 font-sans text-sm text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
            >
              <User size={14} />
              Sign in
            </Link>
          )}

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
          className="md:hidden border-t border-sand-200 bg-cream-50 px-4 py-4 flex flex-col gap-1 animate-slide-up"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'font-sans text-sm py-2.5 px-2 rounded-lg transition-colors',
                  isActive ? 'text-bark-600 font-medium bg-sand-50' : 'text-sand-400'
                )
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="my-1 border-t border-sand-100" />
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-sans text-sm py-2.5 px-2 rounded-lg text-bark-600 hover:bg-sand-50"
              >
                <User size={15} />
                My Profile
                {isAdmin && <ShieldCheck size={13} className="text-bark-400 ml-auto" />}
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-sans text-sm py-2.5 px-2 rounded-lg text-bark-600 hover:bg-sand-50"
                  >
                    <Settings size={15} />
                    Products Dashboard
                  </Link>
                  <Link
                    to="/admin/customers"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-sans text-sm py-2.5 px-2 rounded-lg text-bark-600 hover:bg-sand-50"
                  >
                    <Users size={15} />
                    CRM Dashboard
                  </Link>
                </>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 font-sans text-sm py-2.5 px-2 rounded-lg text-red-400 hover:bg-red-50 text-left w-full mt-1"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="my-1 border-t border-sand-100" />
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm py-2.5 px-2 text-sand-400"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
