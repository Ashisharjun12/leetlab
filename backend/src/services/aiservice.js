import OpenAI from "openai";
import { _config } from "../config/config.js";

const openRouterApiKey =_config.OPEN_ROUTER_API

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openRouterApiKey,
});

export const generateInterviewQuestions = async (jobData) => {
  const prompt = `Generate a technical interview for ${jobData.jobPosition} position.
Difficulty: ${jobData.interviewDifficulty}
Duration: ${jobData.duration}
Type: ${jobData.interviewType}

Your output MUST be ONLY a JSON array of questions in this EXACT format:
[
  {
    "question": "string",
    "type": "string", // e.g., behavioral, technical, situational
    "category": "string", // e.g., JavaScript, React, Node.js, Problem Solving
    "difficulty": "${jobData.interviewDifficulty}",
    "expectedAnswer": "string"
  }
]

## CRUCIAL INSTRUCTIONS - READ CAREFULLY ##
1. Your response MUST contain ONLY the JSON array. NO other text, explanations, introductions, conclusions, or markdown wrapping (like \`\`\`json) whatsoever.
2. Ensure the JSON is perfectly valid, with all keys and string values enclosed in DOUBLE QUOTES ("). Single quotes are NOT allowed for keys or string values.
3. Generate a reasonable number of questions appropriate for a ${jobData.duration} interview.
4. The 'difficulty' field for each question MUST strictly match the requested difficulty "${jobData.interviewDifficulty}".
5. The response should start with a '[' character and end with a ']' character.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-27b-it:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500, 
      
      response_format: { type: "json_object" }, 
    });

    const response = completion.choices[0].message.content.trim();
    
    console.log('Raw AI response before parsing:', response); // Log raw response

    // Attempt to parse the response directly first
    try {
      const parsedResponse = JSON.parse(response);
      if (!Array.isArray(parsedResponse)) {
        console.error('Parsed response is not an array:', parsedResponse);
        throw new Error('AI response is not a JSON array');
      }
      console.log('Successfully parsed AI response directly');
      return parsedResponse;
    } catch (e) {
      console.warn('Direct JSON parsing failed, attempting extraction:', e.message);
      
      // Attempt to extract JSON array by finding the first [ and last ]
      const firstBracketIndex = response.indexOf('[');
      const lastBracketIndex = response.lastIndexOf(']');

      if (firstBracketIndex !== -1 && lastBracketIndex !== -1 && lastBracketIndex > firstBracketIndex) {
        const extractedJsonString = response.substring(firstBracketIndex, lastBracketIndex + 1);
         console.log('Extracted JSON string:', extractedJsonString);
        try {
          const parsedResponse = JSON.parse(extractedJsonString);
          if (!Array.isArray(parsedResponse)) {
             console.error('Parsed extracted response is not an array:', parsedResponse);
            throw new Error('Extracted AI response is not a JSON array');
          }
           console.log('Successfully parsed extracted JSON');
          return parsedResponse;
        } catch (parseError) {
          console.error('Error parsing extracted JSON:', parseError);
          throw new Error('Invalid JSON format extracted from AI response');
        }
      } else {
        console.error('Could not find valid JSON array brackets in response');
         console.error('Final raw AI response that failed parsing:', response);
        throw new Error('Could not find valid JSON array in AI response');
      }
    }
  } catch (error) {
    console.error('Error generating interview questions:', error);
    // Propagate the original error or a more specific one
    if (error.message.includes('AI response') || error.message.includes('JSON format') || error.message.includes('Could not find')) {
       // If it's a known parsing/formatting error, throw the specific error
       throw error; 
    } else {
      // Otherwise, throw a generic communication error
      throw new Error('An unexpected error occurred while communicating with the AI service: ' + error.message);
    }
  }
};

