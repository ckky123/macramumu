import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'shop',         element: <ShopPage /> },
      { path: 'shop/:slug',   element: <ProductDetailPage /> },
      { path: 'cart',         element: <CartPage /> },
      { path: 'about',        element: <AboutPage /> },
      { path: 'contact',      element: <ContactPage /> },
      { path: 'login',        element: <LoginPage /> },
      { path: 'signup',       element: <SignUpPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
