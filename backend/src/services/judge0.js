import axios from "axios"
import { _config } from "../config/config.js"

export const getJudge0LanguageId = (langguage)=>{
    const languageMap = {
        'PYTHON': 71,
        'JAVASCRIPT': 63,
        'CPP': 54
    }

    return languageMap[langguage.toUpperCase()]
}

export const getLanguageName = (languageId)=>{
    const languageMap = {
        71: 'PYTHON',
        63: 'JAVASCRIPT',
        54: 'CPP'
    }
    return languageMap[languageId]
}


// Helper function to format input for different languages
const formatInput = (input, language, stdin) => {
    switch (language.toUpperCase()) {
        case 'JAVASCRIPT':
            return input;
        case 'PYTHON':
            return input;
        case 'CPP':
            return input;
        default:
            return input;
    }
}

// Helper function to add submission ID based on language
const addSubmissionId = (sourceCode, submissionId, language) => {
    const commentSyntax = {
        'PYTHON': '#',
        'JAVASCRIPT': '//',
        'CPP': '//'
    };
    
    const comment = commentSyntax[language] || '//';
    return `${comment} SUBMISSION_ID: ${submissionId}\n${sourceCode}`;
};

export const submitBatch = async(submissions)=>{
    try {
        // Create a map to store submission metadata
        const submissionMap = new Map();
        
        // Format submissions and store metadata
        const formattedSubmissions = submissions.map((sub, index) => {
            const language = getLanguageName(sub.language_id);
            
            // Create a unique identifier for this submission
            const submissionId = `${index}_${sub.language_id}`;
            
            // Store metadata with the submission ID
            submissionMap.set(submissionId, {
                index,
                language,
                expected_output: String(sub.expected_output || '').trim(),
                stdin: String(sub.stdin || '').trim()
            });
            
            // Format the source code with proper comment syntax for the language
            const formattedCode = formatInput(sub.source_code, language, sub.stdin);
            const codeWithId = addSubmissionId(formattedCode, submissionId, language);
            
            return {
                ...sub,
                source_code: codeWithId,
                language_id: sub.language_id
            };
        });

        console.log('Submitting to Judge0:', {
            submissions: formattedSubmissions,
            metadata: Object.fromEntries(submissionMap)
        });

        const {data} = await axios.post(`${_config.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
            submissions: formattedSubmissions
        });
        
        return {
            data,
            submissionMap
        };
    } catch (error) {
        console.error("Error in submitBatch:", error);
        throw error;
    }
}

const sleep = (ms)=> new Promise((resolve)=>setTimeout(resolve , ms))

export const pollbatchResults = async (tokens, submissionMap) => {
    if (!submissionMap) {
        throw new Error("Submission map is required for polling results");
    }

    try {
        while(true) {
            const {data} = await axios.get(`${_config.JUDGE0_URL}/submissions/batch`, {
                params: {
                    tokens: tokens.join(','),
                    base64_encoded: false
                }
            });

            const results = data.submissions;
            console.log("Polling results:", results);

            const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);
            if (isAllDone) {
                // Process results and match with metadata
                const processedResults = results.map((result, index) => {
                    // Try both with and without language_id in the submissionId
                    const submissionId = `${index}_${result.language_id}`;
                    const metadata = submissionMap.get(submissionId);
                    
                    if (!metadata) {
                        console.warn(`No metadata found for submission ${submissionId}`);
                        // Try to find metadata by index only
                        const indexOnlyMetadata = Array.from(submissionMap.values())
                            .find(m => m.index === index);
                        if (indexOnlyMetadata) {
                            return {
                                ...result,
                                index: indexOnlyMetadata.index,
                                language: indexOnlyMetadata.language,
                                expected_output: indexOnlyMetadata.expected_output,
                                stdin: indexOnlyMetadata.stdin,
                                status: {
                                    id: result.status.id,
                                    description: result.status.description
                                }
                            };
                        }
                        return null;
                    }

                    return {
                        ...result,
                        index: metadata.index,
                        language: metadata.language,
                        expected_output: metadata.expected_output,
                        stdin: metadata.stdin,
                        status: {
                            id: result.status.id,
                            description: result.status.description
                        }
                    };
                }).filter(Boolean);

                if (processedResults.length === 0) {
                    console.error('No valid results after processing:', {
                        results,
                        submissionMap: Object.fromEntries(submissionMap)
                    });
                    throw new Error("No valid results found after processing");
                }

                return processedResults;
            }

            await sleep(1000);
        }
    } catch (error) {
        console.error("Error in pollbatchResults:", error);
        throw error;
    }
}