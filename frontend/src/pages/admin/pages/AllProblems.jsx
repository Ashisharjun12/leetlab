import React, { useEffect, useState } from 'react'
import { useProblemStore } from '@/store/problemStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Edit, Trash2, Plus, X, Tag, CheckCircle2, SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'
import ProblemTableSkeleton from '../skeletons/ProblemTableSkeleton'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { companyAPI } from '@/api/api'

const ITEMS_PER_PAGE = 5;

const AllProblems = () => {
  const navigate = useNavigate();
  const { getAllProblems, problems, deleteProblem, isLoading } = useProblemStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesMap, setCompaniesMap] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  // Fetch companies and store in a map for easy lookup
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyAPI.getAllCompanies();
        const companiesMap = {};
        if (response.data && Array.isArray(response.data.data)) {
          response.data.data.forEach(company => {
            companiesMap[company.id] = company;
          });
        }
        setCompaniesMap(companiesMap);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Extract unique tags from problems
  useEffect(() => {
    const tags = new Set();
    problems.forEach(problem => {
      problem.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
  }, [problems]);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => problem.tags.includes(tag));
    return matchesSearch && matchesDifficulty && matchesTags;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  console.log('Problems:', problems);
  console.log('Filtered Problems:', filteredProblems);
  console.log('Total Pages:', totalPages);
  console.log('Current Page:', currentPage);

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

  const renderCompanyInfo = (companyIds) => {
    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return (
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
          None
        </Badge>
      );
    }

    // Select a random company ID from the array
    const randomIndex = Math.floor(Math.random() * companyIds.length);
    const randomCompanyId = companyIds[randomIndex];
    const selectedCompany = companiesMap[randomCompanyId];

    if (!selectedCompany) {
       return (
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
          Unknown Company
        </Badge>
      );
    }

    const additionalCompaniesCount = companyIds.length - 1;

    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Avatar className="h-4 w-4">
             {selectedCompany.companyUrl?.url ? (
               <AvatarImage src={selectedCompany.companyUrl.url.url} alt={selectedCompany.name} />
             ) : (
               <AvatarFallback className="text-[8px]">{selectedCompany.name.charAt(0)}</AvatarFallback>
             )}
           </Avatar>
           <span>{selectedCompany.name}</span>
           
        </Badge>
         {additionalCompaniesCount > 0 && (
           <Badge variant="secondary" className="ml-1">
             +{additionalCompaniesCount}
           </Badge>
         )}
      </div>
    );
  };

  const handleDelete = async () => {
    if (!problemToDelete) return;
    
    try {
      await deleteProblem(problemToDelete);
      await getAllProblems();
      setProblemToDelete(null);
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    const pages = [];
    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add last page and ellipsis if necessary
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {pages}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </>
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedDifficulty('all');
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Problems</h1>
        <Button onClick={() => navigate('/admin/add-problem')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Problem
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tag className="h-4 w-4" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Tags</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTags([])}
                  disabled={selectedTags.length === 0}
                >
                  Clear All
                </Button>
                <DialogTrigger asChild>
                  <Button>Done</Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
          {(selectedDifficulty !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Show selected tags below the filters */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <ProblemTableSkeleton />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProblems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <SearchX className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg font-medium text-muted-foreground">No problems found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProblems.map((problem, index) => (
                    <TableRow key={problem.id}>
                      <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                      <TableCell className="font-medium">{problem.title}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {renderCompanyInfo(problem.companies)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {problem.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/edit-problem/${problem.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProblemToDelete(problem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredProblems.length > 0 && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {renderPaginationItems()}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <AlertDialog open={!!problemToDelete} onOpenChange={() => setProblemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the problem
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AllProblems 