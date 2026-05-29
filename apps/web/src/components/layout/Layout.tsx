import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Chatbot } from '@/components/chatbot/Chatbot'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
