import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Trophy, Calendar, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'hard':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const ProfileSolvedProblemsTable = ({ problems, isLoading, userId }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
         
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Problem Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Companies</TableHead>
                  <TableHead className="text-right">Solved Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
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
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-6">
        <motion.div 
          className="flex items-center justify-between mb-6"
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
                <TableHead>Difficulty</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead className="text-right">Solved Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.slice(0, 3).map((problem, index) => (
                <motion.tr
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/problem/${problem.id}`)}
                  >
                    {problem.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${getDifficultyColor(problem.difficulty)} border`}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 items-center">
                      {problem.companies?.length > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            {problem.companies[0].companyUrl?.url?.url ? (
                              <Avatar className="h-6 w-6 border border-border/50">
                                <AvatarImage src={problem.companies[0].companyUrl.url.url} alt={problem.companies[0].name} />
                                <AvatarFallback className="text-xs">{problem.companies[0].name[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {problem.companies[0].name}
                              </Badge>
                            )}
                          </div>
                          
                          {problem.companies.length > 1 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                             
                              +{problem.companies.length - 1}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {problem.solvedDate ? format(new Date(problem.solvedDate), 'MM/dd/yyyy') : 'N/A'}
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

export default ProfileSolvedProblemsTable; 