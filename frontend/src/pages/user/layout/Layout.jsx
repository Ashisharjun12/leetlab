import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../Home/Navigation'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 px-2 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout