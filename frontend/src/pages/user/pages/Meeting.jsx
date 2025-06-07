import Vapi from '@vapi-ai/web';
import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, MessageSquare, Users, Clock, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const Meeting = () => {
    const location = useLocation()
    const { authUser } = useAuthStore()
    const InterviewInfo = location.state.interviewData;
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState(null);
    const [vapi, setVapi] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const initVapi = async () => {
            try {
                const vapiInstance = new Vapi(import.meta.env.VITE_VAPI_API);
                setVapi(vapiInstance);

                vapiInstance.on('call-start', () => {
                    console.log('Call started');
                    setIsConnected(true);
                    setError(null);
                    startTimer();
                });

                vapiInstance.on('call-end', () => {
                    console.log('Call ended');
                    setIsConnected(false);
                    setIsSpeaking(false);
                    setElapsedTime(0);
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

    useEffect(() => {
        let timer;
        if (isConnected) {
            timer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isConnected]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <Card className="rounded-none border-x-0 border-t-0 h-16">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-lg font-semibold truncate">{InterviewInfo?.jobPosition} Interview</h1>
                        <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                            <Clock className="w-4 h-4" />
                            {formatTime(elapsedTime)}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </Card>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Main Video Area */}
                <div className="flex-1 p-2">
                    <Card className="h-full flex items-center justify-center relative overflow-hidden">
                        {!isConnected ? (
                            <div className="text-center space-y-4">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 mx-auto">
                                        <AvatarImage src="/ai-avatar.png" alt="AI Interviewer" />
                                        <AvatarFallback className="bg-primary/10">
                                            <Bot className="w-12 h-12 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                                            AI Interviewer
                                        </Badge>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold">Ready to start your interview?</h2>
                                <Button 
                                    onClick={startCall} 
                                    disabled={!vapi}
                                    size="lg"
                                    className="px-6"
                                >
                                    Start Interview
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-2 left-2">
                                    <Badge variant="secondary" className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 text-xs",
                                        isSpeaking && "bg-primary text-primary-foreground"
                                    )}>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            isSpeaking ? "bg-primary-foreground animate-pulse" : "bg-primary"
                                        )} />
                                        {isSpeaking ? 'AI Speaking...' : 'Listening...'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src="/ai-avatar.png" alt="AI Interviewer" />
                                        <AvatarFallback className="bg-primary/10">
                                            <Bot className="w-8 h-8 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h3 className="text-base font-semibold">AI Interviewer</h3>
                                        <p className="text-sm text-muted-foreground">Interview in progress</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <Card className="w-64 border-l rounded-none hidden lg:block">
                    <div className="p-2 space-y-2">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-semibold">Participants</h3>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-muted">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={authUser?.avatar} alt={authUser?.name} />
                                    <AvatarFallback className="bg-primary/10 text-xs">
                                        {authUser?.name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate">{authUser?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-muted">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="/ai-avatar.png" alt="AI Interviewer" />
                                    <AvatarFallback className="bg-primary/10">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate">AI Interviewer</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Controls */}
            <Card className="rounded-none border-x-0 border-b-0 h-16">
                <div className="flex items-center justify-center h-full space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-full h-10 w-10",
                            isMuted && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        )}
                        onClick={toggleMute}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "rounded-full h-10 w-10",
                            isVideoOff && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        )}
                        onClick={toggleVideo}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={endCall}
                    >
                        <PhoneOff className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </Button>
                </div>
            </Card>

            {/* Error Message */}
            {error && (
                <div className="fixed top-2 left-1/2 transform -translate-x-1/2">
                    <Badge variant="destructive" className="px-3 py-1 text-xs">
                        {error}
                    </Badge>
                </div>
            )}
        </div>
    )
}

export default Meeting