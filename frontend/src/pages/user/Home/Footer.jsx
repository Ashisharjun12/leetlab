import React from 'react'
import SocialIcons from '../common/SocialIcons'

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo, tagline, social */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            
            <span className="font-bold text-2xl text-primary">codesheet.in</span>
          </div>
          <div className="text-muted-foreground text-base">Practice coding with real problems</div>
          <SocialIcons />
          <div className="text-muted-foreground text-sm mt-2">&copy; {new Date().getFullYear()} codesheet.in. All rights reserved.</div>
        </div>
        {/* Middle: Products */}
        <div>
          <div className="font-bold text-lg mb-3 text-foreground">Quick Links</div>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li><a href="/courses" className="hover:text-primary transition-colors">Practice Problems</a></li>
            <li><a href="/cohort" className="hover:text-primary transition-colors">Competitions</a></li>
            <li><a href="/coding-hero" className="hover:text-primary transition-colors">Ai Interviewer</a></li>
            <li><a href="/freeapi" className="hover:text-primary transition-colors">Accounts</a></li>
           
          </ul>
        </div>
        {/* Right: Resources */}
        <div>
          <div className="font-bold text-lg mb-3 text-foreground">Resources</div>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing Policy</a></li>
            <li><a href="/refund" className="hover:text-primary transition-colors">Refund Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer