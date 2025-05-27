import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Area */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Motor Monitor</h1>
              <p className="text-xs text-gray-400">Real-time IoT Dashboard</p>
            </div>
          </Link>
          
          {/* Navigation Area */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/analytics" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Analytics
            </Link>
            <Link 
              href="/settings" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Settings
            </Link>
          </nav>
          
          {/* Right Status */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              System Status: <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}