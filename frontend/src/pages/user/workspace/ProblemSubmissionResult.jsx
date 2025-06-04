import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStatusColor } from './ProblemTestResult'; // Reuse the status color helper
import { Editor } from '@monaco-editor/react'; // Import Editor component
import { Button } from '@/components/ui/button'; // Import Button component
import { Copy } from 'lucide-react'; // Import Copy icon
import { toast } from 'sonner'; // Import toast for feedback
import { Clock, MemoryStick } from 'lucide-react'; // Import icons for Runtime and Memory

const ProblemSubmissionResult = ({ submissionResult, problem }) => {
  if (!submissionResult) {
    return <div className="text-muted-foreground">No submission data available.</div>;
  }

  const { status, sourceCode, testCaseResult, time, memory, stdIn, stdOut, stdErr, compileOut } = submissionResult;

  // Safely parse stdIn if it's a JSON string
  let parsedStdIn = [];
  try {
      parsedStdIn = stdIn ? JSON.parse(stdIn) : [];
  } catch (e) {
      console.error("Failed to parse stdIn JSON string:", e);
      parsedStdIn = []; // Set to empty array on error
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto hide-scrollbar h-full"> {/* Add padding and make scrollable */}
      {/* Overall Status */}
      <div className="flex items-center gap-4">
        <h3 className={`text-xl font-semibold ${getStatusColor(status)}`}>
          Status: {status.replace(/_/g, ' ')}
        </h3>
        {time && Array.isArray(JSON.parse(time)) && (
           <div className="text-sm text-yellow-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Runtime: {`${(JSON.parse(time).reduce((sum, t) => sum + parseFloat(t), 0)).toFixed(3)}ms (Avg)`}</div>
        )}
         {memory && Array.isArray(JSON.parse(memory)) && (
            <div className="text-sm text-blue-500 flex items-center gap-1"><MemoryStick className="w-4 h-4" /> Memory: {`${(JSON.parse(memory).reduce((sum, m) => sum + parseFloat(m), 0)).toFixed(2)}KB (Avg)`}</div>
         )}
      </div>

      <Separator />

      {/* Test Case Results */}
      {testCaseResult && testCaseResult.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-2">Test Case Results:</h4>
          <div className="rounded-md border overflow-hidden"> {/* Add border and overflow for table container */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Case</TableHead> {/* Adjust width */}
                    <TableHead className="w-[120px]">Status</TableHead> {/* Adjust width */}
                    <TableHead>Runtime</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Expected Output</TableHead>
                    {/* Removed Stderr and Compile Output from main table */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCaseResult.map((result, index) => (
                    <TableRow key={index} className={result.passed ? 'bg-green-500/5' : 'bg-red-500/5'}> {/* Add subtle row background color */}
                      <TableCell className="font-medium">{result.testCase}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                       <TableCell>{result.time || 'N/A'}</TableCell>
                       <TableCell>{result.memory || 'N/A'}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-pre-wrap max-w-[200px]">{parsedStdIn[index] || 'N/A'}</TableCell> {/* Use parsedStdIn */}
                      <TableCell className="font-mono text-xs whitespace-pre-wrap max-w-[200px]">{result.stdOut || 'N/A'}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-pre-wrap max-w-[200px]">{result.expectedOut || 'N/A'}</TableCell>
                      {/* Removed Stderr and Compile Output cells */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        </div>
      )}

       {/* Source Code displayed using Monaco Editor */}
       {sourceCode && (
           <div>
               <div className="flex items-center justify-between mb-2">
                   <h4 className="text-lg font-semibold">Submitted Code:</h4>
                   <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                           navigator.clipboard.writeText(sourceCode);
                           toast.success("Source code copied to clipboard!");
                       }}
                       className="flex items-center gap-1 px-2 py-1"
                   >
                       <Copy className="w-4 h-4" />
                       Copy
                   </Button>
               </div>
               <div className="rounded-md overflow-hidden border border-border" style={{ height: '300px' }}> {/* Set a height for the editor */}
                  <Editor
                      height="100%"
                      language="javascript" // You might need to determine this dynamically based on problem.selectedLanguage or submission data
                      theme="vs-dark" // Use your preferred theme
                      value={sourceCode}
                      options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          folding: false,
                          wordWrap: "on",
                          lineNumbers: "on",
                          glyphMargin: false,
                          foldingHighlight: false,
                          hideCursorInOverviewRuler: true,
                          overviewRulerBorder: false,
                          scrollbar: { vertical: 'hidden' },
                          renderLineHighlight: 'none',
                          overviewRulerLanes: 0,
                          selectOnLineNumbers: false,
                      }}
                  />
               </div>
           </div>
       )}

       {/* Display Stderr or Compile Output below the table if they exist */}
       {(stdErr || compileOut) && (
           <div>
               <h4 className="text-lg font-semibold mb-2">Error Details:</h4>
                {stdErr && (
                   <div>
                       <div className="font-semibold text-red-500 text-sm font-mono mb-1">Stderr:</div>
                       <pre className="text-red-500 bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">{stdErr}</pre>
                   </div>
                )}
                {compileOut && (
                     <div>
                         <div className="font-semibold text-red-500 text-sm font-mono mb-1">Compile Output:</div>
                         <pre className="text-red-500 bg-muted rounded-md p-3 text-sm font-mono whitespace-pre-wrap">{compileOut}</pre>
                     </div>
                )}
           </div>
       )}
    </div>
  );
};
export default ProblemSubmissionResult; 
