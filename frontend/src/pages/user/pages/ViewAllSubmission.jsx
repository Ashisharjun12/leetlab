import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { submissionAPI, problemAPI } from '@/api/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useParams, useNavigate } from 'react-router-dom';

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

const ViewAllSubmission = () => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [problems, setProblems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthStore();
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await submissionAPI.getAllSubmissions(userId);
        setAllSubmissions(response.data.data);
      } catch (error) {
        console.error("Error fetching all submissions:", error);
        toast.error("Failed to fetch submissions");
        setAllSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSubmissions();
  }, [userId]);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (allSubmissions.length === 0) return;

      const problemIds = [...new Set(allSubmissions.map(sub => sub.problemId))];
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

    fetchProblemDetails();
  }, [allSubmissions]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">All Submissions</h1>
        <div className="overflow-x-auto rounded-md overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead className="text-right">Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">All Submissions</h1>
        {allSubmissions.length > 0 ? (
            <div className="overflow-x-auto rounded-md overflow-hidden border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Problem Title</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Runtime</TableHead>
                            <TableHead>Memory</TableHead>
                            <TableHead className="text-right">Submitted Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allSubmissions.map((submission) => (
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
                                <TableCell className="text-yellow-500">
                                    {submission.time ? (
                                        Array.isArray(JSON.parse(submission.time)) 
                                            ? JSON.parse(submission.time).join(', ') 
                                            : submission.time
                                    ) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-blue-500">
                                    {submission.memory ? (
                                        Array.isArray(JSON.parse(submission.memory)) 
                                            ? JSON.parse(submission.memory).join(', ') 
                                            : submission.memory
                                    ) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {submission.createdAt ? format(new Date(submission.createdAt), 'MM/dd/yyyy') : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        ) : ( !isLoading &&
            <div className="text-muted-foreground">No submissions found.</div>
        )}
    </div>
  );
};

export default ViewAllSubmission;