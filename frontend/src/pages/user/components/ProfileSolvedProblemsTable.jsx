import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/10 text-green-500';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500';
      
    case 'hard':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const ProfileSolvedProblemsTable = ({ problems, isLoading, userId }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-2">
           <Skeleton className="h-4 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead className="text-right">Solved Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                </TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <div className="flex justify-end mb-2">
           <Link to={`/view-all-solved-problem/${userId}`} className="text-sm text-muted-foreground hover:underline flex items-center">
             View All Solved Problems <ChevronRight className="w-4 h-4 ml-1" />
           </Link>
        </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Companies</TableHead>
            <TableHead className="text-right">Solved Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.slice(0, 3).map((problem) => (
            <TableRow key={problem.id}>
              <TableCell 
                className="font-medium cursor-pointer hover:text-primary"
                onClick={() => navigate(`/problem/${problem.id}`)}
              >
                {problem.title}
              </TableCell>
              <TableCell>
                <Badge className={`capitalize ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2 items-center">
                  {problem.companies?.length > 0 && (
                    <>
                      {/* Show first company logo */}
                      <div className="flex items-center gap-1">
                        {problem.companies[0].companyUrl?.url?.url ? (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={problem.companies[0].companyUrl.url.url} alt={problem.companies[0].name} />
                            <AvatarFallback>{problem.companies[0].name[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Badge variant="secondary">{problem.companies[0].name}</Badge>
                        )}
                      </div>
                      
                      {/* Show +N badge if there are more companies */}
                      {problem.companies.length > 1 && (
                        <Badge variant="secondary">+{problem.companies.length - 1}</Badge>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {problem.solvedDate ? format(new Date(problem.solvedDate), 'MM/dd/yyyy') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileSolvedProblemsTable; 