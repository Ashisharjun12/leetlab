import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Menu } from 'lucide-react'

const AdminNavigation = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            {/* Admin Panel Text - Hidden on mobile when sidebar is open */}
            <h1 className={`text-xl font-bold ${isSidebarOpen ? 'hidden md:block' : 'block'}`}>
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavigation