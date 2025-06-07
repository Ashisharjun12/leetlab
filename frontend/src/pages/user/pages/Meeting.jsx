import Vapi from '@vapi-ai/web';
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const Meeting = () => {
    const location = useLocation()
    const { authUser } = useAuthStore()
    const InterviewInfo = location.state.interviewData;
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState(null);
    const [vapi, setVapi] = useState(null);

    useEffect(() => {
        const initVapi = async () => {
            try {
                const vapiInstance = new Vapi('31d956c9-9a86-45ad-8e9d-edb423d404d9');
                setVapi(vapiInstance);

                // Event listeners
                vapiInstance.on('call-start', () => {
                    console.log('Call started');
                    setIsConnected(true);
                    setError(null);
                });

                vapiInstance.on('call-end', () => {
                    console.log('Call ended');
                    setIsConnected(false);
                    setIsSpeaking(false);
                });

                vapiInstance.on('speech-start', () => {
                    console.log('Assistant started speaking');
                    setIsSpeaking(true);
                });

                vapiInstance.on('speech-end', () => {
                    console.log('Assistant stopped speaking');
                    setIsSpeaking(false);
                });

                vapiInstance.on('error', (error) => {
                    console.error('Vapi error:', error);
                    if (error.error?.type === 'ejected') {
                        setIsConnected(false);
                        setIsSpeaking(false);
                        setError('The interview session has ended. Please start a new session.');
                    } else {
                        setError(error.errorMsg || 'An error occurred during the call');
                        setIsConnected(false);
                    }
                });
            } catch (err) {
                console.error('Failed to initialize Vapi:', err);
                setError('Failed to initialize the interview system. Please refresh the page.');
            }
        };

        initVapi();

        return () => {
            if (vapi) {
                vapi.stop();
            }
        };
    }, []);

    const startCall = async () => {
        if (!vapi) {
            setError('Interview system is not initialized. Please refresh the page.');
            return;
        }

        try {
            setError(null);
            let questionList = InterviewInfo?.generatedQuestions?.map(q => q.question).join(', ');

            const assistantOptions = {
                name: "AI Interviewer",
                firstMessage: `Hi ${authUser?.name}, how are you? Ready for your interview on ${InterviewInfo?.jobPosition}?`,
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    temperature: 0.7,
                    messages: [{
                        role: "system",
                        content: `You are an AI voice assistant conducting interviews.
                        Your job is to ask candidates provided interview questions, assess their responses.
                        Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
                        Ask one question at a time and wait for the candidate's response before proceeding.
                        Keep the questions clear and concise. Below are the questions to ask one by one:
                        Questions: ${questionList}
                        If the candidate struggles, offer hints or rephrase the question without giving away the answer.
                        Provide brief, encouraging feedback after each answer.
                        Keep the conversation natural and engaging.
                        After all questions, wrap up the interview smoothly by summarizing their performance.
                        End on a positive note.
                        Key Guidelines:
                        - Be friendly, engaging, and professional
                        - Keep responses short and natural
                        - Adapt based on the candidate's confidence level
                        - Focus on the technical aspects of the role`
                    }]
                },
                voice: {
                    provider: "11labs",
                    voiceId: "21m00Tcm4TlvDq8ikWAM"
                },
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en-US"
                }
            };

            await vapi.start(assistantOptions);
        } catch (err) {
            console.error('Failed to start call:', err);
            setError('Failed to start the interview. Please try again.');
        }
    }

    const endCall = async () => {
        if (!vapi) {
            setError('Interview system is not initialized. Please refresh the page.');
            return;
        }

        try {
            await vapi.stop();
            setIsConnected(false);
            setIsSpeaking(false);
            setError(null);
        } catch (err) {
            console.error('Failed to stop call:', err);
            setError('Failed to end the interview properly. Please refresh the page.');
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">AI Interview Session</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="space-x-4">
                {!isConnected ? (
                    <Button 
                        onClick={startCall} 
                        disabled={!vapi}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Start Interview
                    </Button>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="font-medium">
                                {isSpeaking ? 'Assistant Speaking...' : 'Listening...'}
                            </span>
                        </div>
                        <Button 
                            onClick={endCall}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            End Interview
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Meeting