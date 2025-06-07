import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Clock, BarChart2 } from 'lucide-react';

const UserInterviews = ({ interviews }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <Card
          key={interview.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/interview-details/${interview.id}`)}
        >
          <CardHeader>
            <CardTitle className="text-xl">{interview.jobPosition}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
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
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">{interview.jobDescription}</p>
            <div className="mt-4 flex justify-between items-center">
              <Badge variant="secondary">
                {interview.generatedQuestions.length} Questions
              </Badge>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserInterviews; 