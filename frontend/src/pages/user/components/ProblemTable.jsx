import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import useSubmissionStore from "@/store/submissionStore";
import { useCompanyStore } from "@/store/companyStore";

const ProblemTable = ({ problems, onProblemRemove }) => {
  const navigate = useNavigate();
  const { isProblemSolved, getSolvedProblemById } = useSubmissionStore();
  const { getCompanyFromCache, getCompanyById } = useCompanyStore();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  // Add new useEffect to check solved status for each problem
  useEffect(() => {
    const checkSolvedStatus = async () => {
      for (const problem of problems) {
        if (!isProblemSolved(problem.id)) {
          await getSolvedProblemById(problem.id);
        }
      }
    };
    checkSolvedStatus();
  }, [problems, isProblemSolved, getSolvedProblemById]);

  // Add useEffect to fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      // Get unique companyIds from problems
      const companyIds = Array.from(new Set(problems.flatMap(p => p.companies || []).filter(Boolean)));
      
      // Fetch data for companies not in cache
      for (const companyId of companyIds) {
        if (!getCompanyFromCache(companyId)) {
          await getCompanyById(companyId);
        }
      }
    };

    fetchCompanyData();
  }, [problems, getCompanyFromCache, getCompanyById]);

  const handleRowClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handleRemoveClick = (e, problemId) => {
    e.stopPropagation();
    if (onProblemRemove) {
      onProblemRemove(problemId);
    }
  };

  return (
    <div className="rounded-xl border bg-background text-foreground shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead className="w-[200px]">Tags</TableHead>
            <TableHead className="w-[80px] ">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, idx) => {
            const companies = problem.companies || [];
            const firstCompanyId = companies[0];
            const firstCompany = firstCompanyId ? getCompanyFromCache(firstCompanyId) : null;
            const additionalCompanies = companies.length - 1;
            const isSolved = isProblemSolved(problem.id);

            // Handle tags display
            const visibleTags = problem.tags?.slice(0, 2) || [];
            const additionalTags = (problem.tags?.length || 0) - 2;

            return (
              <TableRow key={problem.id} className="cursor-pointer hover:bg-accent/50">
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium" onClick={() => handleRowClick(problem.id)}>{problem.title}</TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {firstCompany ? (
                      <Badge variant="secondary" className="flex items-center gap-2 text-sm font-medium">
                        {firstCompany.url && (
                          <img
                            src={firstCompany.url}
                            alt={firstCompany.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        )}
                        <span className="truncate max-w-[120px]">{firstCompany.name}</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Loading...</Badge>
                    )}
                    {additionalCompanies > 0 && (
                      <Badge variant="secondary" className="text-xs">+{additionalCompanies}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {visibleTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
                    ))}
                    {additionalTags > 0 && (
                      <Badge variant="secondary" className="text-xs">+{additionalTags}</Badge>
                    )}
                  </div>
                </TableCell>
                {onProblemRemove && (
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="cursor-pointer"
                      onClick={(e) => handleRemoveClick(e, problem.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                )}
                {!onProblemRemove && (
                  <TableCell className="text-right">
                    <Button 
                      variant={isSolved ? "default" : "outline"} 
                      size="sm" 
                      className={`cursor-pointer ${isSolved ? 'bg-green-600 hover:bg-green-600' : ''}`}
                      onClick={() => handleRowClick(problem.id)}
                    >
                      {isSolved ? (
                        <span className="flex items-center text-white gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Solved
                        </span>
                      ) : (
                        'Solve'
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProblemTable; 