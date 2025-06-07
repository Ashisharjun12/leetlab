import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProfileActivityStreak from './ProfileActivityStreak';
import { CheckCircle2, History, ChevronRight, Trophy, Clock } from 'lucide-react';
import { submissionAPI, problemAPI, companyAPI } from '@/api/api';
import { toast } from 'sonner';
import ProfileSolvedProblemsTable from './ProfileSolvedProblemsTable';
import ProfileRecentSubmissionsTable from './ProfileRecentSubmissionsTable';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Activity Streak Section */}
      <ProfileActivityStreak userId={userId} />

      {/* Solved Problems Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Solved Problems
            </CardTitle>
            <Link 
              to={`/view-all-solved-problem/${userId}`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
            >
              View All 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardHeader>
          <CardContent className="px-6">
            {isLoadingSolved ? (
              <ProfileSolvedProblemsTable problems={[]} isLoading={isLoadingSolved} userId={userId} />
            ) : solvedProblems.length > 0 ? (
              <ProfileSolvedProblemsTable problems={solvedProblems} isLoading={isLoadingSolved} userId={userId} />
            ) : (
              <div className="text-muted-foreground text-center py-8">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No solved problems yet.</p>
                <p className="text-sm">Start solving problems to see them here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Submissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Submissions
            </CardTitle>
            <Link 
              to={`/view-all-submission/${userId}`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
            >
              View All 
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardHeader>
          <CardContent className="px-6">
            {isLoadingRecent ? (
              <ProfileRecentSubmissionsTable submissions={[]} isLoading={isLoadingRecent} />
            ) : recentSubmissions.length > 0 ? (
              <ProfileRecentSubmissionsTable submissions={recentSubmissions} isLoading={isLoadingRecent} />
            ) : (
              <div className="text-muted-foreground text-center py-8">
                <History className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No recent submissions yet.</p>
                <p className="text-sm">Submit your first solution to see it here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProfileRightSection;