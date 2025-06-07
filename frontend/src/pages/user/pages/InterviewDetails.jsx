import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Target, FileText, BarChart2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/interview')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Interviews
      </Button>

      {/* Interview Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-2 ">{interview.jobPosition}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {interview.interviewType}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {interview.duration}
          </Badge>
          <Badge className={`${getDifficultyColor(interview.interviewDifficulty)} flex items-center gap-1`}>
            <BarChart2 className="w-4 h-4" />
            {interview.interviewDifficulty}
          </Badge>
        </div>
      </div>

      {/* Job Description */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold ">
            <FileText className="w-5 h-5 text-primary" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className=" leading-relaxed">{interview.jobDescription}</p>
        </CardContent>
      </Card>

      {/* Join Interview Button and Feedback Button */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button
          size="lg"
          className="w-full sm:w-auto px-8 py-3 text-base font-semibold"
          onClick={() => navigate(`/start-interview/${interviewId}`, { state: { interviewData: interview } })}
        >
          Join Interview
        </Button>

        {/* Show Feedback Button (Conditional) */}
        {hasFeedback && (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-8 py-3 text-base font-semibold border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => {
              console.log('Show Feedback button clicked for interview:', interviewId);
              // TODO: Implement navigation to feedback details or open feedback dialog
            }}
          >
            Show Feedback
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Instructions</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Listen carefully to the AI interviewer's questions</li>
          <li>• Take your time to think before answering</li>
          <li>• Speak clearly and concisely</li>
          <li>• If you need clarification, feel free to ask</li>
          {interview.duration && <li>• The interview will last approximately {interview.duration}</li>}
          <li>• Make sure you're in a quiet environment</li>
          <li>• Have a stable internet connection</li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewDetails;