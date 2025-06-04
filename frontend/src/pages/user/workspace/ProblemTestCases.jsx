import React, { useState } from 'react';
import { ChevronRight, SquareCheck } from 'lucide-react';
import ProblemTestResult from './ProblemTestResult';

const ProblemTestCases = ({ problem, runResults }) => {
  const [selectedTab, setSelectedTab] = useState('testcase');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  React.useEffect(() => {
    if (runResults) {
      setSelectedTab('test-result');
    }
  }, [runResults]);

  if (!problem) {
    return <div className="text-muted-foreground p-4">Loading test cases...</div>;
  }

  const testCases = problem.testCases || [];
  const selectedCase = testCases[selectedCaseIndex];

  // Simple function to parse input string like "var="value""
  // This might need to be more robust depending on actual input formats
  // Keeping this function for now, but will display the raw input string in the UI




  const renderTabContent = () => {
    switch (selectedTab) {
      case 'testcase':
        return (
          <div className="p-4 h-full overflow-y-auto hide-scrollbar">
            {/* Test Case Buttons */}
            <div className="flex items-center gap-2 mb-4">
              {testCases.map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-1 rounded-md text-sm font-medium ${selectedCaseIndex === index ? 'bg-muted text-foreground' : 'bg-muted/50 text-muted-foreground'}`}
                  onClick={() => setSelectedCaseIndex(index)}
                >
                  Case {index + 1}
                </button>
              ))}
            
            </div>

            {/* Input and Output Fields for Selected Case */}
            {selectedCase && (
              <div className="space-y-4">
                {/* Input Field */}
                <div>
                  {/* Changed label to match image */}
                  <div className="text-sm font-mono text-muted-foreground mb-1">Input</div>
                  {/* Display raw input string */}
                  <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
                     {selectedCase.input}
                  </div>
                </div>

                {/* Output Field */}
                {
                    // Check if output exists before rendering
                    selectedCase.output !== undefined && (
                        <div>
                            {/* Changed label to match image */}
                            <div className="text-sm font-mono text-muted-foreground mb-1">Output</div>
                             {/* Display raw output string */}
                            <div className="bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
                                {selectedCase.output}
                            </div>
                        </div>
                    )
                }
              </div>
            )}

             {testCases.length === 0 && (
                 <div className="text-muted-foreground">No test cases available for this problem.</div>
             )}
          </div>
        );
      case 'test-result':
        return (
          <div className="p-4 h-full overflow-y-auto hide-scrollbar">
            {/* Render the ProblemTestResult component */}
            <ProblemTestResult runResults={runResults} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center gap-4 border-b border-border px-4 pt-2">
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'testcase' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('testcase')}
        >
           <SquareCheck/>
          Testcase
        </button>
        <button
          className={`pb-2 text-sm font-medium flex items-center gap-1 ${selectedTab === 'test-result' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setSelectedTab('test-result')}
        >
           <ChevronRight className="h-4 w-4" /> {/* Placeholder icon */}
          Test Result
        </button>
        {/* Add more tabs here if needed, e.g., Output, Debug Console */}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProblemTestCases;