import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

const LandingPage = () => {
  const [lang, setLang] = useState('js');
  const [showAllCode, setShowAllCode] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      {/* Main content */}
      <div className="flex flex-col md:flex-row justify-between items-center px-2 md:px-16 pt-10 md:pt-24">
        {/* Left: Headline and description */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-8">
            Build your <span className="text-primary">&lt;skills&gt;</span><br />
            with <span className="text-primary">codesheet.in</span>
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-muted-foreground mb-10">
            Practice coding, ace interviews, and grow as a developer.<br />
            The next-gen platform for coding challenges, contests, and learning.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition mt-6 cursor-pointer"
          >
            Solve Problem
          </Button>
        </motion.div>

        {/* Right: Cards */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-6 mt-12 md:mt-0 md:ml-12 w-full md:w-auto"
        >
          {/* Code block with language tabs and icons */}
          <div className="bg-card border border-border rounded-xl p-2 md:p-4 w-full md:w-96 shadow-lg font-mono text-xs md:text-sm">
            <div className="flex gap-2 mb-2 items-center">
              {languages.map(l => (
                <button
                  key={l.key}
                  onClick={() => {
                    setLang(l.key);
                    setShowAllCode(false); // Reset show more when switching language
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                    lang === l.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <img
                    src={`https://skillicons.dev/icons?i=${l.key}`}
                    alt={l.label}
                    className="w-5 h-5"
                  />
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
            <div>
              {(showAllCode ? codeSamples[lang] : codeSamples[lang].slice(0, 7)).map((line, idx) => (
                <div key={idx} className={line.color}>
                  {line.text}
                </div>
              ))}
              {codeSamples[lang].length > 7 && (
                <button
                  className="mt-2 text-primary underline text-xs"
                  onClick={() => setShowAllCode(v => !v)}
                >
                  {showAllCode ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>

          {/* Test Results block */}
          <div className="bg-card border border-border rounded-xl p-2 md:p-4 w-full md:w-96 shadow-lg font-mono text-xs md:text-sm">
            <div className="mb-2 font-semibold text-primary">Test Results</div>
            <div className="flex flex-col gap-2">
              {testCases.map((tc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full inline-block ${tc.status === "Passed" ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-foreground">{tc.name}</span>
                  <span className={`ml-auto font-semibold ${tc.status === "Passed" ? "text-green-500" : "text-red-500"}`}>
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
                Submit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;