import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { problemAPI } from '@/api/api';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Clock, Code, CheckCircle2, XCircle, Timer, AlertCircle } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'wrong_answer':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'time_limit_exceeded':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'runtime_error':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return <CheckCircle2 className="w-3 h-3" />;
    case 'wrong_answer':
      return <XCircle className="w-3 h-3" />;
    case 'time_limit_exceeded':
      return <Timer className="w-3 h-3" />;
    case 'runtime_error':
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
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
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
         
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Problem Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Submitted Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
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
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-6">
        <motion.div 
          className="flex items-center justify-between "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        
        </motion.div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Problem Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/problem/${submission.problemId}`)}
                  >
                    {problems[submission.problemId] || 'Loading...'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {getLanguageName(submission.languageId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${getStatusColor(submission.status)} border flex items-center gap-1`}>
                      {getStatusIcon(submission.status)}
                      {submission.status?.replace('_', ' ') || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {submission.createdAt ? format(new Date(submission.createdAt), 'MM/dd/yyyy') : 'N/A'}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default ProfileRecentSubmissionsTable; 