import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet } from "react-router-dom";
import React from 'react'
import { Loader } from 'lucide-react';

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore()

  if (isCheckingAuth) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='text-green-500 animate-spin' />
    </div>
  }

  if (!authUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute 