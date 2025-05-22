import React, { useEffect } from 'react'

import {Routes , Route , Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home/Home'
import { useAuthStore } from './store/authStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'


const App = () => {

  const { authUser, checkAuth,isCheckingAuth } = useAuthStore();

  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin text-green-500'/>
    </div>;
  }

  
  return (
   <>
   <div>
    <Routes>
      {/* <Route path='/' element={<Layout/>}> */}
      <Route index  element={<Home/>}/>
      {/* </Route> */}
      <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"}/>} />
      <Route path='/signUp' element={!authUser ? <SignUp /> : <Navigate to={"/"}/>} />
    </Routes>
   </div>
   </>
  )
}

export default App