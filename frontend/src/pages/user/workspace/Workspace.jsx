import React, { useState, useRef } from 'react'
import Split from 'react-split'
import ProblemDescriptionPanel from './ProblemDescriptionPanel'
import Playground from './Playground'
import { executeAPI } from '@/api/api';
import { toast } from 'sonner';

// Add this mapping object
const languageIdMap = {
    'JAVA': 62,
    'PYTHON': 71,
    'JAVASCRIPT': 63,
    'CPP': 54,
    // Add other languages as needed
};

const Workspace = ({ problem, selectedLanguage, onLanguageChange, availableLanguages }) => {
  const [runResults, setRunResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);
  const [submissionResult, setSubmissionResult] = useState(null); // State for submission results

  const handleRunCode = async () => {
    if (!editorRef.current) {
      console.error("Editor not ready or ref not assigned.");
      toast.error("Code editor not ready. Please wait.");
      return;
    }

    if (!problem?.testCases || problem.testCases.length === 0) {
       toast.warning("No test cases available for this problem.");
       setRunResults(null);
       return;
    }

    setIsLoading(true);
    setRunResults(null);

    const source_code = editorRef.current.getValue();
    const stdin = problem.testCases.map(tc => tc.input);
    const expected_outputs = problem.testCases.map(tc => tc.output);

     // Get the Judge0 language_id based on the selectedLanguage string
     const language_id = languageIdMap[selectedLanguage.toUpperCase()]; // Use selectedLanguage prop

     if (!language_id) {
       console.error("Language ID not available for selected language:", selectedLanguage);
       toast.error(`Language ID is not configured for ${selectedLanguage}.`);
       setIsLoading(false);
       return;
     }

    const executionData = {
      source_code,
      language_id: parseInt(language_id, 10),
      stdin,
      expected_outputs
    };

    try {
      console.log("Executing code with data:", executionData);
      const response = await executeAPI.executeCode(executionData);
      console.log("Execution response:", response.data);

      if (response.data.success) {
        setRunResults(response.data.data);
        toast.success("Code executed successfully!");
      } else {
         // Handle potential errors returned in the success: false case
        setRunResults(response.data.data || null);
        toast.error(response.data.message || "Code execution failed.");
      }
    } catch (error) {
      console.error("Error during code execution:", error);
      toast.error("An error occurred during code execution.");
       setRunResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    console.log("Submit button clicked, handleSubmitCode triggered.");
    console.log("Problem object structure:", problem);
    if (!editorRef.current) {
      console.error("Editor not ready or ref not assigned.");
      toast.error("Code editor not ready. Please wait.");
      return;
    }

    if (!problem?.testCases || problem.testCases.length === 0) {
       toast.warning("No test cases available for this problem.");
       setSubmissionResult(null); // Clear previous submission results
       return;
    }

    if (!problem?.id) {
        console.error("Problem ID not available.");
        toast.error("Problem information is missing.");
        return;
    }

    setIsLoading(true);
    setRunResults(null); // Clear run results when submitting
    setSubmissionResult(null); // Clear previous submission results

    const source_code = editorRef.current.getValue();
    const stdin = problem.testCases.map(tc => tc.input);
    const expected_outputs = problem.testCases.map(tc => tc.output);

     const language_id = languageIdMap[selectedLanguage.toUpperCase()];

     if (!language_id) {
       console.error("Language ID not available for selected language:", selectedLanguage);
       toast.error(`Language ID is not configured for ${selectedLanguage}.`);
       setIsLoading(false);
       return;
     }

    const submissionData = {
      source_code,
      language_id: parseInt(language_id, 10),
      stdin,
      expected_outputs
    };

    try {
      console.log("Submitting code with data:", submissionData);
      // problem._id is available from the problem prop
      const response = await executeAPI.createSubmission(problem.id, submissionData);
      console.log("Submission response:", response.data);

      if (response.data.success && response.data.submissions && response.data.submissions.length > 0) {
        // Assuming the first submission in the array is the relevant one
        setSubmissionResult(response.data.submissions[0]);
        setRunResults({ // Format submission results to match runResults structure for ProblemTestCases
           allPassed: response.data.submissions[0].status === 'accepted',
           detailedResults: response.data.submissions[0].testCaseResult || []
        });
        toast.success("Code submitted successfully!");
      } else {
         // Handle potential errors returned in the success: false case or empty submissions array
         setSubmissionResult(null);
         setRunResults(null);
         toast.error(response.data.message || "Code submission failed.");
      }
    } catch (error) {
      console.error("Error during code submission:", error);
      toast.error("An error occurred during code submission.");
      setSubmissionResult(null);
      setRunResults(null);
    } finally {
      setIsLoading(false);
    }
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
           <ProblemDescriptionPanel problem={problem} selectedLanguage={selectedLanguage} submissionResult={submissionResult} />
        </div>

        {/* Right Panel: Playground (Code Editor and Test Cases) */}
        <div className="h-full overflow-hidden">
          <Playground
            problem={problem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            availableLanguages={availableLanguages}
            editorRef={editorRef}
            onRun={handleRunCode}
            onSubmission={handleSubmitCode}
            runResults={runResults}
            isLoading={isLoading}
          />
        </div>
      </Split>
    </div>
  );
};

export default Workspace;