import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'bg-green-500/10 text-green-500';
    case 'wrong_answer':
    case 'time_limit_exceeded':
    case 'memory_limit_exceeded':
    case 'runtime_error':
    case 'compilation_error':
    case 'internal_error':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const ProblemTestResult = ({ runResults, problemTestCases, isLoading }) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  useEffect(() => {
    setSelectedCaseIndex(0);
  }, [runResults]);

  const testCasesToDisplay = runResults?.detailedResults || problemTestCases || [];
  const selectedCase = testCasesToDisplay[selectedCaseIndex];

  if (isLoading && !runResults) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  }

  if (testCasesToDisplay.length === 0) {
    return <div className="text-muted-foreground p-4">No test cases available.</div>;
  }

  const overallStatus = runResults?.allPassed ? 'Accepted' : (runResults ? 'Wrong Answer' : '');
  const runtime = runResults?.detailedResults[0]?.time || 'N/A';
  const passedCount = runResults ? runResults.detailedResults.filter(c => c.passed).length : 0;

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto hide-scrollbar">
      {runResults && (
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-lg font-semibold ${runResults.allPassed ? 'text-green-500' : 'text-red-500'}`}>
            {overallStatus}
          </div>
          <div className="text-muted-foreground text-sm">Runtime: {runtime}</div>
          <div className="text-muted-foreground text-sm">Passed: {passedCount} / {testCasesToDisplay.length}</div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        {testCasesToDisplay.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-1 rounded-md text-sm font-medium ${selectedCaseIndex === index ? 'bg-muted text-foreground' : 'bg-muted/50 text-muted-foreground'}`}
            onClick={() => setSelectedCaseIndex(index)}
          >
            Case {index + 1}
          </button>
        ))}
      </div>

      {selectedCase && (
        <div className="space-y-4">
          <div>
            <div className="text-sm font-mono text-muted-foreground mb-1">Input</div>
            <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
              {runResults ? selectedCase.input : selectedCase.input}
            </div>
          </div>

          {runResults && selectedCase.stdOut !== undefined && (
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-1">Output</div>
              <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
                {selectedCase.stdOut}
              </div>
            </div>
          )}

          {runResults && selectedCase.expectedOut !== undefined && (
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-1">Expected</div>
              <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
                {selectedCase.expectedOut}
              </div>
            </div>
          )}

          {runResults && selectedCase.stderr && (
            <div>
              <div className="font-semibold text-red-500 text-sm font-mono mb-1">Stderr:</div>
              <div className="text-red-500 bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">{selectedCase.stderr}</div>
            </div>
          )}
          {runResults && selectedCase.compileOut && (
            <div>
              <div className="font-semibold text-red-500 text-sm font-mono mb-1">Compile Output:</div>
              <div className="text-red-500 bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">{selectedCase.compileOut}</div>
            </div>
          )}

          {runResults && (
            <div className="flex gap-4 text-sm text-muted-foreground font-mono">
              <div>Time: {selectedCase.time || 'N/A'}</div>
              <div>Memory: {selectedCase.memory || 'N/A'}</div>
            </div>
          )}
        </div>
      )}

      {!runResults && testCasesToDisplay.length > 0 && (
        <div className="text-muted-foreground">Run the code to see test results.</div>
      )}
    </div>
  );
};

export default ProblemTestResult; 