import React, { useEffect } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/user/auth/Login'
import SignUp from './pages/user/auth/SignUp'
import Home from './pages/user/Home/Home'
import { useAuthStore } from './store/authStore'
import { Loader } from 'lucide-react'
import Layout from './pages/user/layout/Layout'
import AdminRoute from './pages/admin/routes/AdminRoute'
import AdminDashboard from './pages/admin/pages/AdminDashboard'
import AddProblem from './pages/admin/pages/AddProblem'
import AllProblems from './pages/admin/pages/AllProblems'
import AllUsers from './pages/admin/pages/AllUsers'
import AdminSettings from './pages/admin/pages/AdminSettings'
import AdminLayout from './pages/admin/layout/AdminLayout'
import EditProblem from './pages/admin/pages/EditProblem'
import ProtectedRoute from './pages/user/routes/ProtectedRoute'
import ProblemSet from './pages/user/pages/ProblemSet'
import Interview from './pages/user/pages/Interview'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin text-green-500' />
    </div>;
  }


  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path='/signUp' element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path='/problem-set' element={<ProblemSet />} />
              <Route path='/interview' element={<Interview />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/add-problem' element={<AddProblem />} />
              <Route path='/admin/all-problems' element={<AllProblems />} />
              <Route path='/admin/edit-problem/:id' element={<EditProblem />} />
              <Route path='/admin/all-users' element={<AllUsers />} />
              <Route path='/admin/settings' element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App