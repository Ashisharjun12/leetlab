import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { companyAPI } from "@/api/api";

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();
  const [companyMap, setCompanyMap] = useState({}); // { [companyId]: { name, url } }

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

  useEffect(() => {
    // Get unique companyIds from problems
    const companyIds = Array.from(new Set(problems.flatMap(p => p.companies || []).filter(Boolean)));
    // Only fetch if not already in companyMap
    companyIds.forEach(async (companyId) => {
      if (!companyMap[companyId]) {
        try {
          const res = await companyAPI.getCompanyById(companyId);
          console.log("Company for id", companyId, res.data);
          const company = res.data?.data;
          setCompanyMap(prev => ({
            ...prev,
            [companyId]: {
              name: company?.name,
              url: company?.companyUrl?.url?.url || null
            }
          }));
        } catch (err) {
          console.error("Error fetching company by id", companyId, err);
        }
      }
    });
    // eslint-disable-next-line
  }, [problems]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, idx) => {
            const companies = problem.companies || [];
            const firstCompanyId = companies[0];
            const firstCompany = firstCompanyId ? companyMap[firstCompanyId] : null;
            const additionalCompanies = companies.length - 1;

            // Handle tags display
            const visibleTags = problem.tags?.slice(0, 2) || [];
            const additionalTags = (problem.tags?.length || 0) - 2;

            return (
              <TableRow key={problem.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{problem.title}</TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {firstCompany ? (
                      <Badge variant="secondary" className="flex items-center gap-2 text-sm font-mediu">
                        {firstCompany.url && (
                          <img
                            src={firstCompany.url}
                            alt={firstCompany.name}
                            style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover" }}
                          />
                        )}
                        <span className="ml-1 truncate" style={{maxWidth: 80}}>{firstCompany.name}</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary">None</Badge>
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
                <TableCell>
                  <Button 
                    className="bg-green-600 rounded-lg text-white cursor-pointer" 
                    onClick={() => navigate(`/problem/${problem.id}`)}
                  >
                    Solve
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProblemTable; 