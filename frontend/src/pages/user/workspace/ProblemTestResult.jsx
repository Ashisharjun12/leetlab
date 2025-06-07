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
  const executionSummary = runResults?.executionSummary;

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'wrong_answer':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto hide-scrollbar">
      {runResults && executionSummary && (
        <div className="space-y-4">
          <div className={`text-lg font-semibold ${getStatusColor(executionSummary.status)}`}>
            {executionSummary.message}
          </div>
          
          {executionSummary.error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm font-mono">
              {executionSummary.error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div>Runtime: {executionSummary.executionTime}ms</div>
            <div>Memory: {executionSummary.memoryUsed}KB</div>
            <div>
              Passed: {executionSummary.passedTestCases} / {executionSummary.totalTestCases}
            </div>
            {executionSummary.failedTestCases > 0 && (
              <div className="text-red-500">
                Failed: {executionSummary.failedTestCases}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {testCasesToDisplay.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-1 rounded-md text-sm font-medium ${
              selectedCaseIndex === index 
                ? 'bg-muted text-foreground' 
                : 'bg-muted/50 text-muted-foreground'
            }`}
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
              {selectedCase.input}
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

          {runResults && selectedCase.error && (
            <div>
              <div className="font-semibold text-red-500 text-sm font-mono mb-1">Error:</div>
              <div className="text-red-500 bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
                {selectedCase.error}
              </div>
            </div>
          )}

          {runResults && (
            <div className="flex gap-4 text-sm text-muted-foreground font-mono">
              <div>Time: {selectedCase.time || 'N/A'}</div>
              <div>Memory: {selectedCase.memory || 'N/A'}</div>
              <div className={`${selectedCase.passed ? 'text-green-500' : 'text-red-500'}`}>
                {selectedCase.passed ? '✓ Passed' : '✗ Failed'}
              </div>
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