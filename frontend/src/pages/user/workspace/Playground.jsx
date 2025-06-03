import React, { useRef } from 'react'
import PreferNav from './PreferNav'
import Split from 'react-split'
import ProblemCodeEditor from './ProblemCodeEditor'
import ProblemTestCases from './ProblemTestCases'

const Playground = ({ problem, selectedLanguage, onLanguageChange, availableLanguages }) => {
    // Create a ref to hold the Monaco Editor instance
    const editorRef = useRef(null);

    // Function to trigger code formatting
    const handleFormatCode = () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.formatDocument').run();
      }
    };

    // Playground will contain the PreferNav, CodeEditor, and TestCases
    return (
        <div className="h-full flex flex-col">
            {/* Pass onFormatCode and problem to PreferNav */}
            <PreferNav
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
                availableLanguages={availableLanguages}
                onFormatCode={handleFormatCode}
                problem={problem} // Passing problem to PreferNav for potential future use, though not strictly needed for current formatting.
            />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60} cursor='row-resize'>
                {/* Pass editorRef to ProblemCodeEditor */}
                <ProblemCodeEditor
                    problem={problem}
                    selectedLanguage={selectedLanguage}
                    editorRef={editorRef}
                />
                {/* ProblemTestCases needs problem (for test cases) and selectedCase */}
                <ProblemTestCases problem={problem} /> {/* Assuming selectedCase will be managed within TestCases or passed down */}
            </Split>
        </div>
    )
}

export default Playground