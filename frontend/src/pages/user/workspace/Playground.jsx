import React, { useRef } from 'react'
import PreferNav from './PreferNav'
import Split from 'react-split'
import ProblemCodeEditor from './ProblemCodeEditor'
import ProblemTestCases from './ProblemTestCases'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Accept onRun, runResults, isLoading, editorRef, onLanguageChange, and availableLanguages as props
const Playground = ({ problem, selectedLanguage, onLanguageChange, availableLanguages, onRun, runResults, isLoading, editorRef, onSubmission }) => {
    // The editorRef is now passed from the parent (Workspace), so we don't create it here.
    // const editorRef = useRef(null);

    // Function to trigger code formatting
    const handleFormatCode = () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.formatDocument').run();
      }
    };

    // Determine the language for the editor, defaulting to plaintext if not recognized
    const editorLanguage = selectedLanguage.toLowerCase() === 'javascript' ? 'javascript' : selectedLanguage.toLowerCase() || 'plaintext';

    // Playground will contain the PreferNav, CodeEditor, and TestCases
    return (
        <div className="h-full flex flex-col bg-secondary/50 rounded-lg shadow-lg">
            {/* Pass onFormatCode, onRun, onSubmit (placeholder), and isLoading to PreferNav */}
            <PreferNav
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange} // Pass onLanguageChange
                availableLanguages={availableLanguages} // Pass availableLanguages
                onFormatCode={handleFormatCode} // Pass format handler
                onRun={onRun} // Pass run handler
                onSubmit={onSubmission} // Pass the actual submit handler
                isLoading={isLoading} // Pass loading state
            />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60} cursor='row-resize'>
                {/* Pass editorRef, isLoading, onLanguageChange, and availableLanguages to ProblemCodeEditor */}
                <ProblemCodeEditor
                    problem={problem}
                    selectedLanguage={selectedLanguage}
                    editorRef={editorRef} // Pass editor ref
                    isLoading={isLoading} // Pass loading state
                    onLanguageChange={onLanguageChange} // Pass onLanguageChange
                    availableLanguages={availableLanguages} // Pass availableLanguages
                />
                {/* ProblemTestCases needs problem (for test cases) and runResults */}
                <ProblemTestCases 
                   problem={problem}
                   runResults={runResults} // Pass run results
                /> 
            </Split>
            <div className="flex items-center gap-2">
                <Button
                    variant="success"
                    size="sm"
                    onClick={onRun}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Run Code
                </Button>
                <Button
                    variant="success"
                    size="sm"
                    onClick={onSubmission}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Code
                </Button>
            </div>
        </div>
    )
}

export default Playground