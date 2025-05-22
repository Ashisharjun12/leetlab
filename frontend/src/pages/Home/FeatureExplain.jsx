import React from 'react'

const features1 = [
  { title: 'Coding AI', desc: 'Get instant feedback and AI-powered code suggestions.' },
  { title: 'Smart Hints', desc: 'Unlock hints to guide your problem-solving process.' },
  { title: 'Company Questions', desc: 'Practice with real interview questions from top tech companies.' },
  { title: 'Test Cases', desc: 'Run your code against multiple test cases instantly.' },
]

const features2 = [
  { title: 'AI Interviewer', desc: 'Simulate real interviews with our AI-powered interviewer.' },
  { title: 'Personalized Feedback', desc: 'Get tailored feedback to improve your coding and interview skills.' },
]

const FeatureExplain = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-2 md:px-8 py-16 flex flex-col gap-16">
      {/* First Row: Left text, Right image */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        {/* Left: Features List */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl w-full">
          <h2 className="text-3xl font-bold text-primary mb-2">What We Offer</h2>
          <ul className="space-y-4">
            {features1.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-green-500" />
                <div>
                  <div className="font-semibold text-lg text-foreground">{f.title}</div>
                  <div className="text-muted-foreground text-base">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Image Card */}
        <div className="flex-1 flex justify-center max-w-xl w-full">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden w-full max-w-sm">
            <img src="/coding-ai-illustration.png" alt="Coding AI" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>
      {/* Second Row: Left image, Right text */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10 md:gap-16">
        {/* Right: Features List */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl w-full">
          <h2 className="text-3xl font-bold text-primary mb-2">AI Interview Experience</h2>
          <ul className="space-y-4">
            {features2.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-green-500" />
                <div>
                  <div className="font-semibold text-lg text-foreground">{f.title}</div>
                  <div className="text-muted-foreground text-base">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Left: Image Card */}
        <div className="flex-1 flex justify-center max-w-xl w-full">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden w-full max-w-sm">
            <img src="/ai-interview-illustration.png" alt="AI Interview" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureExplain