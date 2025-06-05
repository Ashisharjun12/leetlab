import React, { useState, useRef } from 'react'
import Split from 'react-split'
import ProblemDescriptionPanel from './ProblemDescriptionPanel'
import Playground from './Playground'
import { toast } from 'sonner';
import useCodeSubmission from '@/hooks/useCodeSubmission';

const Workspace = ({ problem, selectedLanguage, onLanguageChange, availableLanguages }) => {
  // Use the custom hook for code submission and execution, get setSubmissionResult
  const { isLoading, runResults, submissionResult, submitCode, runCode, clearResults, setSubmissionResult } = useCodeSubmission();

  const editorRef = useRef(null);

  // Modify handleRunCode to use the hook's runCode function
  const handleRunCode = async () => {
    if (!editorRef.current) {
      console.error("Editor not ready or ref not assigned.");
      toast.error("Code editor not ready. Please wait.");
      return;
    }
    const sourceCode = editorRef.current.getValue();
    runCode({ problem, selectedLanguage, sourceCode });
  };

  // Modify handleSubmitCode to use the hook's submitCode function
  const handleSubmitCode = async () => {
    if (!editorRef.current) {
      console.error("Editor not ready or ref not assigned.");
      toast.error("Code editor not ready. Please wait.");
      return;
    }
    const sourceCode = editorRef.current.getValue();
    submitCode({ problem, selectedLanguage, sourceCode });
  };

   // Add a handler to clear submission results when the ProblemDescriptionPanel requests it
   const handleClearSubmissionResult = () => {
      clearResults();
   };

   // Handler for when a submission is selected from the ProblemSubmission list
   const handleSubmissionSelectedFromList = (submission) => {
       setSubmissionResult(submission); // Update the submissionResult state in Workspace
   };

  // Workspace component will structure the main split view
  return (
    <div className="h-screen">
      <Split
        sizes={[50, 50]}
        minSize={300}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className="flex h-full"
      >
        {/* Left Panel: Problem Description */}
        <div className="h-full overflow-hidden">
           {/* Pass submissionResult, the clear handler, and the submission select handler to ProblemDescriptionPanel */}
           <ProblemDescriptionPanel 
              problem={problem} 
              selectedLanguage={selectedLanguage} 
              submissionResult={submissionResult} 
              onClearSubmissionResult={handleClearSubmissionResult}
              onSubmissionSelected={handleSubmissionSelectedFromList} // Pass the new handler
            />
        </div>

        {/* Right Panel: Playground (Code Editor and Test Cases) */}
        <div className="h-full overflow-hidden">
          <Playground
            problem={problem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            availableLanguages={availableLanguages}
            editorRef={editorRef}
            onRun={handleRunCode} // Pass modified run handler
            onSubmission={handleSubmitCode} // Pass modified submit handler
            runResults={runResults}
            isLoading={isLoading} // Use loading state from hook
          />
        </div>
      </Split>
    </div>
  );
};

export default Workspace;