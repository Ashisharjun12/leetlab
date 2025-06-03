import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';

// Accept editorRef prop to expose the editor instance
const ProblemCodeEditor = ({ problem, selectedLanguage, editorRef }) => {
  const [code, setCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Update code when problem or selectedLanguage changes
    if (problem?.codeSnippets?.[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    } else {
      setCode(''); // Clear code if snippet not available
    }
     // If editor is ready and a new snippet is loaded, update the editor value directly
    if (isEditorReady && editorRef.current) {
      editorRef.current.setValue(problem?.codeSnippets?.[selectedLanguage] || '');
    }
  }, [problem, selectedLanguage, isEditorReady, editorRef]); // Added isEditorReady and editorRef dependencies

  const handleEditorDidMount = (editor, monaco) => {
    // Assign the editor instance to the ref
    editorRef.current = editor;
    setIsEditorReady(true);

    // Set initial value after mount if problem data is already available
    if (problem?.codeSnippets?.[selectedLanguage]) {
       editorRef.current.setValue(problem.codeSnippets[selectedLanguage]);
    }
  };

  // Determine the language for the editor, defaulting to plaintext if not recognized
  const editorLanguage = selectedLanguage.toLowerCase() === 'javascript' ? 'javascript' : selectedLanguage.toLowerCase() || 'plaintext';

  return (
    <div className="h-full w-full">
       <Editor
        height="100%"
        language={editorLanguage}
        theme="vs-dark" // Or your preferred dark theme
        value={code} // Use local state for value, but update via ref when snippet changes
        onChange={setCode} // Update local state on change
        onMount={handleEditorDidMount} // Capture editor instance
        options={{
          minimap: { enabled: false },
          // scrollbar: { vertical: 'hidden' }, // Removed as requested
          // Add other desired editor options here
          automaticLayout: true, // Essential for fitting the editor to its container
        }}
      />
    </div>
  );
};

export default ProblemCodeEditor;