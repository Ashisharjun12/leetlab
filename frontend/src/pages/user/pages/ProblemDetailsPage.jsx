import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { problemAPI } from '@/api/api';
import { Skeleton } from '@/components/ui/skeleton';
import Workspace from '../workspace/Workspace';

const ProblemDetailsPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('JAVASCRIPT'); // State for selected language

  useEffect(() => {
    async function fetchProblem() {
      setLoading(true);
      try {
        const res = await problemAPI.getProblem(problemId);
        setProblem(res.data.data[0]);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setProblem(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [problemId]);

  // Update selected language when problem data is loaded or changes
  useEffect(() => {
    if (problem?.codeSnippets) {
      const availableLanguages = Object.keys(problem.codeSnippets);
      if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
        // If the currently selected language is not available for the new problem,
        // default to the first available language.
        setSelectedLanguage(availableLanguages[0]);
      } else if (availableLanguages.length > 0 && selectedLanguage === 'JAVASCRIPT') {
          // If JAVASCRIPT is selected but not available, pick the first available.
           if(!availableLanguages.includes('JAVASCRIPT')) {
               setSelectedLanguage(availableLanguages[0]);
           }
      } else if (availableLanguages.length > 0 && !selectedLanguage) {
           // If no language is selected yet, default to the first available language
           setSelectedLanguage(availableLanguages[0]);
      } else if (availableLanguages.length === 0) {
          // If no languages are available, default to JAVASCRIPT or handle appropriately
          setSelectedLanguage('JAVASCRIPT'); // Defaulting even if not available in snippets
      }
      // If the selected language is available, keep it.
    } else {
         // If problem data or codeSnippets are not available, reset language to default
         setSelectedLanguage('JAVASCRIPT');
    }
  }, [problem, selectedLanguage]); // Depend on problem and selectedLanguage to re-evaluate

  if (loading) {
    return <Skeleton className="h-screen w-full" />; // Use full height for skeleton
  }

  if (!problem) {
      return <div className="text-center text-destructive h-screen flex items-center justify-center">Failed to load problem details.</div>; // Center error message
  }

  const availableLanguages = problem?.codeSnippets ? Object.keys(problem.codeSnippets) : [];

  return (
    <Workspace
      problem={problem}
      selectedLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
      availableLanguages={availableLanguages}
    />
  );
};

export default ProblemDetailsPage;

