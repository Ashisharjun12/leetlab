import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAuthStore } from '@/store/authStore'



const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const {authUser ,logout} = useAuthStore()

 
  useEffect(()=>{
    setIsLoggedIn(!!authUser);
    console.log("authusr",authUser)
  }, [authUser , logout])


  // Example user data
  const user = {
    name: authUser?.name,
    email: authUser?.email,
    avatar: authUser?.avatar
  };

  const handleLogout = async() => {
    try {
      await logout();
      navigate('/');
      
    } catch (error) {
      console.error("logged out error:",error );
      
    }
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  }

  const handleSignup = () => {
    navigate('/signup');
  }

  return (
    <nav className="w-full border-b border-border bg-background">
      <div className="flex flex-col md:flex-row justify-between items-center p-3 md:p-4 gap-2 md:gap-0">
        {/* Logo, Title, Hamburger (mobile) */}
        <div className="w-full flex items-center justify-between md:justify-start">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">CodeSheet</h1>
          </div>
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open menu"
            >
              {/* Hamburger icon */}
              <svg
                className="w-7 h-7 text-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Desktop Auth/User + ModeToggle */}
        <div className="hidden md:flex items-center relative">
          {/* Mode Toggle first */}
          <ModeToggle />
          <div className="ml-4 flex gap-2 items-center">
            {!isLoggedIn ? (
              <>
                <Button className="cursor-pointer" variant="outline" onClick={handleLogin}>Login</Button>
                <Button className="cursor-pointer" variant="default" onClick={handleSignup}>Sign Up</Button>
              </>
            ) : (
              <HoverCard openDelay={0} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer select-none">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-border"
                    />
                    <span className="font-semibold text-foreground">{user.name}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="min-w-[220px] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                    <div>
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start w-full cursor-pointer"
                      onClick={() => navigate('/myprofile')}
                    >
                      My Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start w-full cursor-pointer"
                      onClick={() => navigate('/settings')}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 font-semibold cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && !isLoggedIn && (
        <div className="md:hidden flex flex-col gap-2 px-4 py-3 bg-card border-t border-border shadow-lg animate-in fade-in-0 slide-in-from-top-2 rounded-b-lg">
          <ModeToggle />
          <div className="mt-2 flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => {setMenuOpen(false); handleLogin()}}>
              Login
            </Button>
            <Button variant="default" className="w-full" onClick={() => {setMenuOpen(false); handleSignup()}}>
              Sign Up
            </Button>
          </div>
        </div>
      )}
      {menuOpen && isLoggedIn && (
        <div className="md:hidden flex flex-col gap-2 px-4 py-3 bg-card border-t border-border shadow-lg animate-in fade-in-0 slide-in-from-top-2 rounded-b-lg">
          <ModeToggle />
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-border" />
              <span className="font-semibold text-foreground">{user.name}</span>
            </div>
            <Button variant="ghost" className="justify-start w-full" onClick={() => { setMenuOpen(false); navigate('/myprofile'); }}>
              My Profile
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>
              Settings
            </Button>
            <Button variant="ghost" className="justify-start text-red-600 font-semibold" onClick={() => { setMenuOpen(false); handleLogout(); }}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation