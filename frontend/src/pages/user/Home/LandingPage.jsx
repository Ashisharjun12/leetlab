import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Trophy, Users, Zap } from 'lucide-react';

const codeSamples = {
  js: [
    { text: "// Two Sum Problem", color: "text-muted-foreground" },
    { text: "function twoSum(nums, target) {", color: "text-foreground" },
    { text: "  const map = {};", color: "text-foreground" },
    { text: "  for (let i = 0; i < nums.length; i++) {", color: "text-foreground" },
    { text: "    const complement = target - nums[i];", color: "text-foreground" },
    { text: "    if (map[complement] !== undefined) {", color: "text-foreground" },
    { text: "      return [map[complement], i];", color: "text-green-400" },
    { text: "    }", color: "text-foreground" },
    { text: "    map[nums[i]] = i;", color: "text-foreground" },
    { text: "  }", color: "text-foreground" },
    { text: "  return [];", color: "text-red-400" },
    { text: "}", color: "text-foreground" },
  ],
  python: [
    { text: "# Two Sum Problem", color: "text-muted-foreground" },
    { text: "def two_sum(nums, target):", color: "text-foreground" },
    { text: "    map = {}", color: "text-foreground" },
    { text: "    for i, num in enumerate(nums):", color: "text-foreground" },
    { text: "        complement = target - num", color: "text-foreground" },
    { text: "        if complement in map:", color: "text-foreground" },
    { text: "            return [map[complement], i]", color: "text-green-400" },
    { text: "        map[num] = i", color: "text-foreground" },
    { text: "    return []", color: "text-red-400" },
  ],
};

const languages = [
  { key: 'js', label: 'JavaScript' },
  { key: 'python', label: 'Python' },
];

const testCases = [
  { name: "Test case 1", status: "Passed" },
  { name: "Test case 2", status: "Passed" },
  { name: "Test case 3", status: "Failed" },
  { name: "Test case 4", status: "Passed" },
];

const features = [
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Practice Coding",
    description: "Solve real-world coding problems and improve your skills"
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Compete & Win",
    description: "Participate in coding contests and win exciting prizes"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Learn Together",
    description: "Join a community of developers and learn from each other"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast & Efficient",
    description: "Quick feedback and instant results for your solutions"
  }
];

const LandingPage = () => {
  const [lang, setLang] = useState('js');
  const [showAllCode, setShowAllCode] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 pt-10 md:pt-20 relative">
          {/* Left: Headline and description */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                <span className="text-primary">CodeSheet</span>
                <br />
                <span className="text-2xl md:text-4xl text-muted-foreground">Build Your Skills</span>
              </h1>
              <p className="text-base md:text-lg font-medium text-muted-foreground mb-6">
                Practice coding, ace interviews, and grow as a developer.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition group"
                >
                  Start Coding
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Cards */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-4 mt-8 md:mt-0 md:ml-12 w-full md:w-auto"
          >
            {/* Code block with language tabs and icons */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-xl p-3 w-full md:w-80 shadow-lg font-mono text-sm backdrop-blur-sm bg-opacity-80"
            >
              <div className="flex gap-2 mb-2 items-center">
                {languages.map(l => (
                  <button
                    key={l.key}
                    onClick={() => {
                      setLang(l.key);
                      setShowAllCode(false);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
                      lang === l.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${l.key}`}
                      alt={l.label}
                      className="w-4 h-4"
                    />
                    <span className="text-xs">{l.label}</span>
                  </button>
                ))}
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                {(showAllCode ? codeSamples[lang] : codeSamples[lang].slice(0, 7)).map((line, idx) => (
                  <div key={idx} className={`${line.color} text-xs`}>
                    {line.text}
                  </div>
                ))}
                {codeSamples[lang].length > 7 && (
                  <button
                    className="mt-2 text-primary hover:text-primary/80 transition text-xs"
                    onClick={() => setShowAllCode(v => !v)}
                  >
                    {showAllCode ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Test Results block */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-xl p-3 w-full md:w-80 shadow-lg font-mono text-sm backdrop-blur-sm bg-opacity-80"
            >
              <div className="mb-2 font-semibold text-primary flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4" />
                Test Results
              </div>
              <div className="flex flex-col gap-1">
                {testCases.map((tc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/50 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${tc.status === "Passed" ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className="text-foreground">{tc.name}</span>
                    <span className={`ml-auto font-semibold ${tc.status === "Passed" ? "text-green-500" : "text-red-500"}`}>
                      {tc.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition text-xs">
                  Submit Solution
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 md:px-16 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-card border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;