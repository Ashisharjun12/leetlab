import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { problemAPI } from '@/api/api';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'bg-green-500/10 text-green-500';
    case 'wrong_answer':
      return 'bg-red-500/10 text-red-500';
    case 'time_limit_exceeded':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'runtime_error':
      return 'bg-orange-500/10 text-orange-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const getLanguageName = (languageId) => {
  const languageMap = {
    62: 'JAVA',
    71: 'PYTHON',
    63: 'JAVASCRIPT',
    54: 'CPP'
  };
  return languageMap[languageId] || 'Unknown';
};

const ProfileRecentSubmissionsTable = ({ submissions, isLoading }) => {
  const [problems, setProblems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblemDetails = async () => {
      const problemIds = [...new Set(submissions.map(sub => sub.problemId))];
      const problemDetails = {};
      
      for (const problemId of problemIds) {
        try {
          const response = await problemAPI.getProblem(problemId);
          if (response.data.data[0]) {
            problemDetails[problemId] = response.data.data[0].title;
          }
        } catch (error) {
          console.error(`Error fetching problem ${problemId}:`, error);
        }
      }
      
      setProblems(problemDetails);
    };

    if (submissions.length > 0) {
      fetchProblemDetails();
    }
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem Title</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Submitted Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem Title</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Submitted Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell 
                className="font-medium cursor-pointer hover:text-primary"
                onClick={() => navigate(`/problem/${submission.problemId}`)}
              >
                {problems[submission.problemId] || 'Loading...'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getLanguageName(submission.languageId)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`capitalize ${getStatusColor(submission.status)}`}>
                  {submission.status?.replace('_', ' ') || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {submission.createdAt ? format(new Date(submission.createdAt), 'MM/dd/yyyy') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileRecentSubmissionsTable; 