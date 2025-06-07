import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Brain, Building2, TestTube2, Mic, MessageSquare } from 'lucide-react'

const features1 = [
  { 
    title: 'Coding AI', 
    desc: 'Get instant feedback and AI-powered code suggestions.',
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  { 
    title: 'Smart Hints', 
    desc: 'Unlock hints to guide your problem-solving process.',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  { 
    title: 'Company Questions', 
    desc: 'Practice with real interview questions from top tech companies.',
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-green-500/20 to-emerald-500/20'
  },
  { 
    title: 'Test Cases', 
    desc: 'Run your code against multiple test cases instantly.',
    icon: <TestTube2 className="w-6 h-6" />,
    color: 'from-orange-500/20 to-red-500/20'
  },
]

const features2 = [
  { 
    title: 'AI Interviewer', 
    desc: 'Simulate real interviews with our AI-powered interviewer.',
    icon: <Mic className="w-6 h-6" />,
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  { 
    title: 'Personalized Feedback', 
    desc: 'Get tailored feedback to improve your coding and interview skills.',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'from-violet-500/20 to-purple-500/20'
  },
]

const FeatureExplain = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* First Row: Left text, Right image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-16 relative z-10"
      >
        {/* Left: Features List */}
        <div className="flex-1 flex flex-col gap-8 max-w-xl w-full">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-primary">What We Offer</h2>
            <p className="text-muted-foreground text-lg">Your journey to coding excellence starts here</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {features1.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative group rounded-2xl bg-gradient-to-br ${f.color} p-[1px]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative bg-card rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{f.title}</h3>
                      <p className="text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Right: Image Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex justify-center max-w-xl w-full"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-card rounded-xl shadow-lg overflow-hidden w-full max-w-sm">
              <img 
                src="/coding-ai-illustration.png" 
                alt="Coding AI" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Second Row: Left image, Right text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row-reverse items-center justify-center gap-16 relative z-10"
      >
        {/* Right: Features List */}
        <div className="flex-1 flex flex-col gap-8 max-w-xl w-full">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-primary">AI Interview Experience</h2>
            <p className="text-muted-foreground text-lg">Master your interview skills with AI guidance</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {features2.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative group rounded-2xl bg-gradient-to-br ${f.color} p-[1px]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative bg-card rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{f.title}</h3>
                      <p className="text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Left: Image Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex justify-center max-w-xl w-full"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-card rounded-xl shadow-lg overflow-hidden w-full max-w-sm">
              <img 
                src="/ai-interview-illustration.png" 
                alt="AI Interview" 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default FeatureExplain