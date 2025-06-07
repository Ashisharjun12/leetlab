import React from 'react'
import HomeCard from '../common/HomeCard'
import { BrainCircuit, Mic, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const companyLogos = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
    alt: 'Meta',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    alt: 'Microsoft',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    alt: 'Google',
  },
]

const features = [
  {
    icon: <BrainCircuit className="w-7 h-7 text-primary" />,
    title: 'AI Solution',
    description: 'Get instant AI-powered explanations, hints, and code reviews for every problem.',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    icon: (
      <div className="flex gap-1 items-center">
        {companyLogos.map((logo, i) => (
          <motion.img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="w-6 h-6 rounded bg-white p-0.5 border border-border"
            style={{ objectFit: 'contain' }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        ))}
      </div>
    ),
    title: 'Top Company Questions',
    description: 'Practice real interview questions asked by Google, Meta, Microsoft, and more.',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: <Mic className="w-7 h-7 text-primary" />,
    title: 'AI Interview Prep',
    description: 'Mock interviews, behavioral questions, and more. (Coming soon!)',
    badge: 'Beta',
    gradient: 'from-orange-500/20 to-red-500/20'
  }
]

const MidSection = () => {
  return (
    <div className="w-full flex flex-col items-center py-16 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
            <Sparkles className="w-6 h-6 inline-block ml-2 text-primary" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to excel in your coding journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`relative group h-full rounded-2xl bg-gradient-to-br ${f.gradient} p-[1px]`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative h-full bg-card rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                  {f.badge && (
                    <div className="mt-4 inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {f.badge}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MidSection