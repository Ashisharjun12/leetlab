import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavigation from '../components/AdminNavigation'
import AdminLeftSide from '../components/AdminLeftSide'
import AdminRightSide from '../components/AdminRightSide'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNavigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-20 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Left Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-40 md:z-auto
          w-64 border-r border-border bg-card
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:flex-shrink-0 overflow-y-hidden
        `}>
          <AdminLeftSide onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area (now AdminRightSide)*/}
        <AdminRightSide>
           <Outlet />
        </AdminRightSide>
      </div>
    </div>
  )
}

export default AdminLayout 