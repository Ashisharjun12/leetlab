import React from 'react'
import SocialIcons from '../common/SocialIcons'
import { motion } from 'framer-motion'
import { Code2, Trophy, Mic, User, Shield, FileText, CreditCard, RefreshCw } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'Practice Problems', href: '#', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Competitions', href: '#', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Ai Interviewer', href: '#', icon: <Mic className="w-4 h-4" /> },
    { name: 'Accounts', href: '#', icon: <User className="w-4 h-4" /> },
  ]

  const resources = [
    { name: 'Privacy Policy', href: '#', icon: <Shield className="w-4 h-4" /> },
    { name: 'Terms of Service', href: '#', icon: <FileText className="w-4 h-4" /> },
    { name: 'Pricing Policy', href: '#', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'Refund Policy', href: '#', icon: <RefreshCw className="w-4 h-4" /> },
  ]

  return (
    <footer className="w-full bg-background border-t border-border relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          {/* Left: Logo, tagline, social */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-primary" />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                codesheet.in
              </span>
            </div>
            <p className="text-muted-foreground text-base max-w-sm">
              Master coding with real-world problems and AI-powered guidance
            </p>
            <div className="flex gap-4">
              <SocialIcons />
            </div>
          </motion.div>

          {/* Middle: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-6 text-foreground">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <span className="text-primary/50 group-hover:text-primary transition-colors">
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-6 text-foreground">Resources</h3>
            <ul className="flex flex-col gap-3">
              {resources.map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <span className="text-primary/50 group-hover:text-primary transition-colors">
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border py-8 text-center"
        >
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} codesheet.in. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer