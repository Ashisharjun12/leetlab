import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Settings,
  FileText,
  Edit
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminLeftSide = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { id: 'add-problem', label: 'Add Problem', icon: <PlusCircle className="w-5 h-5" />, path: '/admin/add-problem' },
    { id: 'problems', label: 'All Problems', icon: <FileText className="w-5 h-5" />, path: '/admin/all-problems' },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/all-users' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
  ]

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="p-4 space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={location.pathname === item.path ? "default" : "ghost"}
          className="w-full justify-start gap-2 cursor-pointer"
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  )
}

export default AdminLeftSide