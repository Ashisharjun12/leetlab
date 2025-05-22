import React from 'react'
import HomeCard from '../common/HomeCard'
import { BrainCircuit, Mic } from 'lucide-react'

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
    description: 'Get instant AI-powered explanations, hints, and code reviews for every problem.'
  },
  {
    icon: (
      <div className="flex gap-1 items-center">
        {companyLogos.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="w-6 h-6 rounded bg-white p-0.5 border border-border"
            style={{ objectFit: 'contain' }}
          />
        ))}
      </div>
    ),
    title: 'Top Company Questions',
    description: 'Practice real interview questions asked by Google, Meta, Microsoft, and more.'
  },
  {
    icon: <Mic className="w-7 h-7 text-primary" />,
    title: 'AI Interview Prep',
    description: 'Mock interviews, behavioral questions, and more. (Coming soon!)',
    badge: 'Coming Soon'
  }
]

const MidSection = () => {
  return (
    <div className="w-full flex flex-col items-center py-12 px-2">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl justify-items-center">
        {features.map((f, i) => (
          <HomeCard key={i} {...f} />
        ))}
      </div>
    </div>
  )
}

export default MidSection