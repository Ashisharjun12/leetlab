import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Target, FileText, BarChart2, ArrowLeft, Mic, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        setError('No interview ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await InterviewAPI.getInterviewById(interviewId);
        if (response.data.success) {
          setInterview(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load interview');
          toast.error(response.data.message || 'Failed to load interview');
        }
      } catch (err) {
        console.error('Error fetching interview:', err);
        setError('Failed to load interview details');
        toast.error('Failed to load interview details');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 font-semibold text-lg">
        Error: {error}
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-semibold text-lg">
        Interview not found
      </div>
    );
  }

  const hasFeedback = interview.feedback && Object.keys(interview.feedback).length > 0;

  return (
    <motion.div 
      className="container mx-auto p-4 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
        onClick={() => navigate('/interview')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Interviews
      </Button>

      {/* Interview Header */}
      <motion.div 
        className="mb-8 pb-6 border-b border-green-100 dark:border-green-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
          {interview.jobPosition}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 border-green-200 dark:border-green-800">
            <Target className="w-4 h-4 text-green-500 dark:text-green-400" />
            {interview.interviewType}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 border-green-200 dark:border-green-800">
            <Clock className="w-4 h-4 text-green-500 dark:text-green-400" />
            {interview.duration}
          </Badge>
          <Badge className={`${getDifficultyColor(interview.interviewDifficulty)} flex items-center gap-1 px-3 py-1 border`}>
            <BarChart2 className="w-4 h-4" />
            {interview.interviewDifficulty}
          </Badge>
        </div>
      </motion.div>

      {/* Job Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-600 dark:text-green-400">
              <FileText className="w-5 h-5" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base text-muted-foreground">
              {interview.jobDescription}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>

      {/* Join Interview Button and Feedback Button */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          size="lg"
          className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => navigate(`/start-interview/${interviewId}`, { state: { interviewData: interview } })}
        >
          <Mic className="w-5 h-5 mr-2" />
          Join Interview
        </Button>

        {hasFeedback && (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950 dark:text-green-400 dark:border-green-400 transition-all duration-300"
            onClick={() => {
              console.log('Show Feedback button clicked for interview:', interviewId);
            }}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Show Feedback
          </Button>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600 dark:text-green-400">
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                Listen carefully to the AI interviewer's questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                Take your time to think before answering
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                Speak clearly and concisely
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                If you need clarification, feel free to ask
              </li>
              {interview.duration && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  The interview will last approximately {interview.duration}
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                Make sure you're in a quiet environment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400">•</span>
                Have a stable internet connection
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InterviewDetails;