import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { companyAPI } from "@/api/api";

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();
  const [companyMap, setCompanyMap] = useState({}); // { [companyId]: { name, url } }

  useEffect(() => {
    // Get unique companyIds from problems
    const companyIds = Array.from(new Set(problems.map(p => p.companyId).filter(Boolean)));
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
            const company = problem.companyId ? companyMap[problem.companyId] : null;
            return (
              <TableRow key={problem.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{problem.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${problem.difficulty}`}>{problem.difficulty}</Badge>
                </TableCell>
                <TableCell>
                  {company ? (
                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-sm font-mediu">
                      {company.url && (
                        <img
                          src={company.url}
                          alt={company.name}
                          style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover" }}
                        />
                      )}
                      <span className="ml-1 truncate" style={{maxWidth: 80}}>{company.name}</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary">None</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {problem.tags.map(tag => (
                    <Badge key={tag} className="mr-1">{tag}</Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/problem/${problem.id}`)}>Solve</Button>
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