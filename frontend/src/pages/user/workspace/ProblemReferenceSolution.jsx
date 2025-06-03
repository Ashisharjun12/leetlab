import React from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProblemReferenceSolution = ({ problem, selectedLanguage }) => {
  // This component will display the reference solution for the selected language

  const referenceSolution = problem?.reference_solution?.[selectedLanguage];

  if (!problem) {
    return <div className="text-muted-foreground">Loading solution...</div>;
  }

  if (!referenceSolution) {
    return <div className="text-muted-foreground">No reference solution available for {selectedLanguage}.</div>;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referenceSolution);
    toast.success('Code copied to clipboard!');
  };

  // Use Monaco Editor to display the code
  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reference Solution ({selectedLanguage})</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyCode}
          className="hover:bg-muted"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-lg overflow-hidden h-[calc(100%-40px)]">
        <Editor
          height="100%"
          theme="vs-dark"
          language={selectedLanguage.toLowerCase() === 'javascript' ? 'javascript' : selectedLanguage.toLowerCase()}
          value={referenceSolution}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden' },
            folding: false,
            lineNumbers: 'off',
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default ProblemReferenceSolution; 