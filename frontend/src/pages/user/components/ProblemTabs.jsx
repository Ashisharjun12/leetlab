import React from 'react';
import { Menu, Lightbulb, FlaskConical, BookOpen, History, MessageCircle } from 'lucide-react';

const tabs = [
  { label: 'Description', icon: Menu },
  { label: 'Discussion', icon: MessageCircle },
  { label: 'Solution', icon: FlaskConical },
  { label: 'Editorial', icon: BookOpen },
  { label: 'Submissions', icon: History },
];

const ProblemTabs = ({ selected = 0, onSelect }) => {
  return (
    <div className="flex items-center gap-2 border-b pb-2 mb-4">
      {tabs.map((tab, idx) => (
        <button
          key={tab.label}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${selected === idx ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
          onClick={() => onSelect && onSelect(idx)}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProblemTabs; 