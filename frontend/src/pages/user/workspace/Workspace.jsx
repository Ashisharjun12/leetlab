import React from 'react'
import Split from 'react-split'
import ProblemDescriptionPanel from './ProblemDescriptionPanel'
import Playground from './Playground'

const Workspace = ({ problem, selectedLanguage, onLanguageChange, availableLanguages }) => {
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
           <ProblemDescriptionPanel problem={problem} selectedLanguage={selectedLanguage} />
        </div>

        {/* Right Panel: Playground (Code Editor and Test Cases) */}
        <div className="h-full overflow-hidden">
          <Playground
            problem={problem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            availableLanguages={availableLanguages}
            // Other props for Playground (e.g., test cases, run results) would be passed here
          />
        </div>
      </Split>
    </div>
  );
};

export default Workspace;