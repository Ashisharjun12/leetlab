import React from 'react'

import {Routes , Route , Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home/Home'

const App = () => {

  let authUser = null;
  return (
   <>
   <div>
    <Routes>
      <Route path='/' element={ <Home/>}/>
      <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"}/>} />
      <Route path='/signUp' element={!authUser ? <SignUp /> : <Navigate to={"/"}/>} />
    </Routes>
   </div>
   </>
  )
}

export default App