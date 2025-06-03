import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, FileText, BookOpen, FlaskConical, History, MessageSquare } from 'lucide-react';
import CompanyBadge from '../components/CompanyBadge'; // Assuming CompanyBadge is in the same directory
// Import new components for tabs
import ProblemDiscussion from './ProblemDiscussion'; // Component for Discussion tab
import ProblemReferenceSolution from './ProblemReferenceSolution'; // Component for Solution tab
import ProblemSubmission from './ProblemSubmission'; // Component for Submissions tab

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/10 text-green-500';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'hard':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const ProblemDescriptionPanel = ({ problem, selectedLanguage }) => {
  const [selectedTab, setSelectedTab] = useState('description'); // State for tabs
  const [showHints, setShowHints] = useState(false); // State to show hints within description if clicked
  const hintsRef = useRef(null); // Ref for scrolling to hints

   // Scroll to hints section when showHints becomes true
   useEffect(() => {
    if (showHints && hintsRef.current) {
      hintsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showHints]);

  if (!problem) return <Skeleton className="h-full w-full" />;

  const hints = problem.hints || [];
  const examplesForSelectedLang = problem.example?.[selectedLanguage] || [];
  const hasMultipleExamples = examplesForSelectedLang.length > 1;

  // Handle click on hints badge in description tab
  const handleHintsClickInDescription = () => {
    setShowHints(!showHints);
     // Scroll to hints section when showing hints
    if (!showHints && hintsRef.current) {
      hintsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'description':
        return (
          <div className="p-4 overflow-y-auto hide-scrollbar h-full">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>

            {/* Row 1: Difficulty, Tags, and Hints Badge */}
            <div className="flex items-center gap-4 mb-2">
              <Badge className={`capitalize ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</Badge>

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex gap-1">
                  {problem.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Hints Badge - aligned right */}
              {hints.length > 0 && (
                <Badge
                  variant="secondary"
                  className={`flex items-center gap-1 cursor-pointer ml-auto ${showHints ? 'bg-green-600 text-white' : ''}`}
                  onClick={handleHintsClickInDescription}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Hint{hints.length > 1 ? 's' : ''}</span>
                </Badge>
              )}
            </div>

            {/* Row 2: Companies */}
            <div className="flex items-center gap-2 mb-4">
              {problem.companies?.map(companyId => (
                 <CompanyBadge key={companyId} companyId={companyId} />
              ))}
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none my-4">
              {problem.description}
            </div>

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-1">Constraints:</div>
                <div className="flex flex-wrap gap-2">
                  {problem.constraints.map((c, i) => (
                    <div key={i} className="bg-muted/90 rounded-lg px-2 py-1 text-sm font-mono">
                       &bull; {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples for Selected Language */}
            {examplesForSelectedLang.length > 0 && examplesForSelectedLang[0].input && (
              <div className="mb-4">
                <div className="font-semibold mb-1">Examples ({selectedLanguage}):</div>
                {examplesForSelectedLang.map((example, index) => (
                  <div key={index} className="mb-4 bg-muted/90 rounded-lg p-2 space-y-2">
                    {hasMultipleExamples && (
                       <div className="font-semibold">Example {index + 1}:</div>
                    )}
                    <div className="text-sm font-mono whitespace-pre-line">
                      <span className="font-semibold">Input:</span> {example.input}
                    </div>
                    <div className="text-sm font-mono whitespace-pre-line">
                      <span className="font-semibold">Output:</span> {example.output}
                    </div>
                    {example.explanation && (
                      <div className=" text-sm font-mono whitespace-pre-line">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hints Content - conditionally shown below examples in description tab */}
             {showHints && hints.length > 0 && (
                <div ref={hintsRef} className="space-y-4 mt-4">
                  {hints.map((hint, index) => (
                    <div key={index} className="bg-muted/70 rounded-lg p-4">
                      <div className="font-semibold mb-2">Hint {index + 1}:</div>
                      <div className="text-sm whitespace-pre-line">{hint}</div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        );
      case 'hints': // Keep hints tab content but remove button
        return (
           <div className="p-4 overflow-y-auto hide-scrollbar h-full">
            {hints.length > 0 ? (
                <div className="space-y-4">
                    {hints.map((hint, index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-4">
                            <div className="font-semibold mb-2">Hint {index + 1}:</div>
                            <div className="text-sm whitespace-pre-line">{hint}</div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-muted-foreground">No hints available.</div>
            )}
           </div>
        );
      case 'discussion': // New discussion tab
          return (
               <div className="p-4 overflow-y-auto hide-scrollbar h-full">
                  <ProblemDiscussion problem={problem} /> {/* Render Discussion component */}
               </div>
          );
      case 'solution':
        return (
             <div className="p-4 overflow-y-auto hide-scrollbar h-full">
                 <ProblemReferenceSolution problem={problem} selectedLanguage={selectedLanguage} /> {/* Render Solution component */}
             </div>
         );
      case 'editorial':
        return <div className="p-4 overflow-y-auto hide-scrollbar h-full text-muted-foreground">Editorial content here.</div>;
      case 'submissions':
        return (
             <div className="p-4 overflow-y-auto hide-scrollbar h-full">
                 <ProblemSubmission problem={problem} /> {/* Render Submissions component */}
             </div>
        );
      default:
        return <div className="p-4 overflow-y-auto hide-scrollbar h-full text-muted-foreground">Select a tab.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center gap-4 border-b border-border px-4 pt-2">
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('description')}
        >
          <FileText className="w-4 h-4"/>
          Description
        </button>
      
       
         {/* Add Discussion button */}
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'discussion' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('discussion')}
        >
          <MessageSquare className="w-4 h-4" />
          Discussion
        </button>
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'solution' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('solution')}
        >
          <FlaskConical className="w-4 h-4"/>
          Solution
        </button>
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'editorial' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('editorial')}
        >
           <BookOpen className="w-4 h-4"/>
          Editorial
        </button>
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'submissions' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('submissions')}
        >
          <History className="w-4 h-4" />
          Submissions ({problem.submissions?.length || 0}) {/* Show submission count */}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
         {renderTabContent()}
      </div>
    </div>
  );
};

export default ProblemDescriptionPanel; 