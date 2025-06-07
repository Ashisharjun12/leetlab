import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { submissionAPI, problemAPI, companyAPI } from '@/api/api';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

const ViewAllSolvedProblem = () => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch solved problems, problem details, and company details
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        // 1. Fetch solved submissions for the user
        const submissionResponse = await submissionAPI.getAllSolvedProblemByUserId(userId);
        const solvedSubmissions = submissionResponse.data.data;

        if (!solvedSubmissions || solvedSubmissions.length === 0) {
            setSolvedProblems([]);
            setIsLoading(false);
            return;
        }

        // Get unique problem IDs from solved submissions
        const uniqueProblemIds = [...new Set(solvedSubmissions.map(sub => sub.problemId))];

        // 2. Fetch problem details and company details for each unique solved problem
        const problemsWithDetails = await Promise.all(uniqueProblemIds.map(async (problemId) => {
            try {
                const problemResponse = await problemAPI.getProblem(problemId);
                const problemDetails = problemResponse.data.data[0];

                // Fetch company details for each company ID associated with the problem
                const companyDetails = await Promise.all(
                    (problemDetails.companies || []).map(async (companyId) => {
                        try {
                            const companyResponse = await companyAPI.getCompanyById(companyId);
                            return companyResponse.data.data;
                        } catch (error) {
                            console.error(`Error fetching company ${companyId}:`, error);
                            return null;
                        }
                    })
                );

                const validCompanies = companyDetails.filter(company => company !== null);

                 // Find the latest accepted submission date for this problem by this user
                const latestAcceptedSubmission = solvedSubmissions
                    .filter(sub => sub.problemId === problemId && sub.status === 'accepted')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                return {
                    ...problemDetails,
                    companies: validCompanies,
                    solvedDate: latestAcceptedSubmission ? latestAcceptedSubmission.createdAt : null,
                };
            } catch (problemError) {
                console.error(`Error fetching details for problem ${problemId}:`, problemError);
                return null;
            }
        }));

        const validSolvedProblems = problemsWithDetails.filter(problem => problem !== null);
        setSolvedProblems(validSolvedProblems);

      } catch (error) {
        console.error("Error fetching solved problems for user:", error);
        toast.error("Failed to fetch solved problems");
        setSolvedProblems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Rerun when userId changes

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">All Solved Problems</h1>
        <div className="overflow-x-auto rounded-md overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Solved Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
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
        <h1 className="text-2xl font-bold mb-4">All Solved Problems</h1>
        {solvedProblems.length > 0 ? (
            <div className="overflow-x-auto rounded-md overflow-hidden border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Problem Title</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Companies</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Solved Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {solvedProblems.map((problem) => (
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
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 items-center">
                                        {problem.tags?.length > 0 && (
                                            <>
                                                <Badge variant="secondary">{problem.tags[0]}</Badge>
                                                {problem.tags.length > 1 && (
                                                     <Badge variant="secondary">+{problem.tags.length - 1}</Badge>
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
        ) : ( !isLoading &&
            <div className="text-muted-foreground">No solved problems found for this user.</div>
        )}
    </div>
  );
};

export default ViewAllSolvedProblem;