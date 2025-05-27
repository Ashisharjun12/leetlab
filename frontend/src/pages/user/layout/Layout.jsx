import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../Home/Navigation'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout