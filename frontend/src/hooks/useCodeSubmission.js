import { useState } from 'react';
import { executeAPI } from '@/api/api';
import { toast } from 'sonner';

const languageIdMap = {
    'JAVA': 62,
    'PYTHON': 71,
    'JAVASCRIPT': 63,
    'CPP': 54,
    // Add other languages as needed
};

const useCodeSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const submitCode = async ({ problem, selectedLanguage, sourceCode }) => {
    if (!problem?.testCases || problem.testCases.length === 0) {
       toast.warning("No test cases available for this problem.");
       setSubmissionResult(null);
       setRunResults(null);
       return;
    }

    if (!problem?.id) {
        console.error("Problem ID not available.");
        toast.error("Problem information is missing.");
        return;
    }

    setIsLoading(true);
    setRunResults(null);
    setSubmissionResult(null);

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
      source_code: sourceCode,
      language_id: parseInt(language_id, 10),
      stdin,
      expected_outputs
    };

    try {
      console.log("Submitting code with data:", submissionData);
      const response = await executeAPI.createSubmission(problem.id, submissionData);
      console.log("Submission response:", response.data);

      if (response.data.success && response.data.submissions && response.data.submissions.length > 0) {
        const latestSubmission = response.data.submissions[0];
        setSubmissionResult(latestSubmission);
        setRunResults({ // Format submission results to match runResults structure for ProblemTestCases
           allPassed: latestSubmission.status === 'accepted',
           detailedResults: latestSubmission.testCaseResult || []
        });
        toast.success("Code submitted successfully!");
      } else {
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

   const runCode = async ({ problem, selectedLanguage, sourceCode }) => {
        if (!problem?.testCases || problem.testCases.length === 0) {
           toast.warning("No test cases available for this problem.");
           setRunResults(null);
           return;
        }

        setIsLoading(true);
        setRunResults(null);
        setSubmissionResult(null);

        const stdin = problem.testCases.map(tc => tc.input);
        const expected_outputs = problem.testCases.map(tc => tc.output);

         const language_id = languageIdMap[selectedLanguage.toUpperCase()]; // Use selectedLanguage prop

         if (!language_id) {
           console.error("Language ID not available for selected language:", selectedLanguage);
           toast.error(`Language ID is not configured for ${selectedLanguage}.`);
           setIsLoading(false);
           return;
         }

        const executionData = {
          source_code: sourceCode,
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

  const clearResults = () => {
    setRunResults(null);
    setSubmissionResult(null);
  };

  return { 
    isLoading, 
    runResults, 
    submissionResult, 
    submitCode, 
    runCode, 
    clearResults,
    setSubmissionResult
  };
};

export default useCodeSubmission; 