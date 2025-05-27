import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet } from "react-router-dom";
import React from 'react'
import { Loader } from 'lucide-react';

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore()
  if (isCheckingAuth) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='text-green-500 animate-spin' />
    </div>
  }

  if (!authUser || authUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute