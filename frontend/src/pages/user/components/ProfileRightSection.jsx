import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProfileActivityStreak from './ProfileActivityStreak';
import { CheckCircle2, History, ChevronRight } from 'lucide-react';
import { submissionAPI, problemAPI, companyAPI } from '@/api/api';
import { toast } from 'sonner';
import ProfileSolvedProblemsTable from './ProfileSolvedProblemsTable';
import ProfileRecentSubmissionsTable from './ProfileRecentSubmissionsTable';
import { Link } from 'react-router-dom';

const ProfileRightSection = ({ userId }) => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [isLoadingSolved, setIsLoadingSolved] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchSolvedProblems = async () => {
      setIsLoadingSolved(true);
      try {
        const submissionResponse = await submissionAPI.getAllSolvedProblemByUserId(userId);
        const solvedSubmissions = submissionResponse.data.data;

        if (!solvedSubmissions || solvedSubmissions.length === 0) {
            setSolvedProblems([]);
            setIsLoadingSolved(false);
            return;
        }

        const uniqueProblemIds = [...new Set(solvedSubmissions.map(sub => sub.problemId))];

        const solvedProblemsWithDetails = await Promise.all(uniqueProblemIds.map(async (problemId) => {
            try {
                const problemResponse = await problemAPI.getProblem(problemId);
                const problemDetails = problemResponse.data.data[0];

                // Fetch company details for each company ID
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

                // Filter out any null company details
                const validCompanies = companyDetails.filter(company => company !== null);

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

        const validSolvedProblems = solvedProblemsWithDetails.filter(problem => problem !== null);
        setSolvedProblems(validSolvedProblems);

      } catch (error) {
        console.error("Error fetching solved problems for user:", error);
        toast.error("Failed to fetch solved problems");
        setSolvedProblems([]);
      } finally {
        setIsLoadingSolved(false);
      }
    };

    const fetchRecentSubmissions = async () => {
       setIsLoadingRecent(true);
       try {
         const response = await submissionAPI.getAllSubmissions(userId);
         setRecentSubmissions(response.data.data.slice(0, 4));
       } catch (error) {
         console.error("Error fetching recent submissions for user:", error);
         toast.error("Failed to fetch recent submissions");
         setRecentSubmissions([]);
       } finally {
         setIsLoadingRecent(false);
       }
    };

    fetchSolvedProblems();
    fetchRecentSubmissions();

  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Activity Streak Section */}
      <ProfileActivityStreak userId={userId} />

      {/* Solved Problems Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
             <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
             Solved Problems
          </CardTitle>
          <Link to={`/view-all-solved-problem/${userId}`} className="text-sm text-muted-foreground hover:underline flex items-center">
            View All Solved Problems <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
           {isLoadingSolved ? (
             <ProfileSolvedProblemsTable problems={[]} isLoading={isLoadingSolved} userId={userId} />
           ) : solvedProblems.length > 0 ? (
             <ProfileSolvedProblemsTable problems={solvedProblems} isLoading={isLoadingSolved} userId={userId} />
           ) : (
             <div className="text-muted-foreground">No solved problems yet.</div>
           )}
        </CardContent>
      </Card>

      {/* Recent Submissions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
             <History className="w-4 h-4 text-muted-foreground" />
             Recent Submissions
          </CardTitle>
          <Link to={`/view-all-submission/${userId}`} className="text-sm text-muted-foreground hover:underline flex items-center">
            View All Submissions <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
           {isLoadingRecent ? (
             <ProfileRecentSubmissionsTable submissions={[]} isLoading={isLoadingRecent} />
           ) : recentSubmissions.length > 0 ? (
             <ProfileRecentSubmissionsTable submissions={recentSubmissions} isLoading={isLoadingRecent} />
           ) : (
             <div className="text-muted-foreground">No recent submissions yet.</div>
           )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileRightSection;