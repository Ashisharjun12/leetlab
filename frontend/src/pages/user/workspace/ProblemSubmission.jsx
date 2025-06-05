import React, { useEffect, useState } from 'react'
import { submissionAPI } from '@/api/api'; // Import the API
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Clock, MemoryStick } from 'lucide-react'; // Import icons
import { getStatusColor } from './ProblemTestResult'; // Reuse status color helper
import { formatDistanceToNow } from 'date-fns'; // For formatting time
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Language mapping object: Maps numeric language IDs to display names
const languageMap = {

    62:'JAVA',
    71:'pYTHON',
    63:'JAVASCRIPT',
    54:'CPP'
    
   
}

const ProblemSubmission = ({ problem, onSubmissionSelect }) => {
  // This component will display the submission history for the problem
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!problem) {
    return <div className="p-4 text-muted-foreground">Loading problem details...</div>;
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!problem?.id) return; // Ensure problem ID exists

      setIsLoading(true);
      setError(null);
      try {
        const response = await submissionAPI.getAllTheSubmissionsForProblem(problem.id);
        console.log("Submissions fetched:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          // Sort submissions by createdAt timestamp in ascending order (oldest first)
          const sortedSubmissions = response.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setSubmissions(sortedSubmissions);
        } else {
           setSubmissions([]); // Clear submissions if data is not as expected
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions.");
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [problem?.id]); // Refetch when problem ID changes

  const formatRuntime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const timeArray = JSON.parse(timeStr);
      if (Array.isArray(timeArray) && timeArray.length > 0) {
        return timeArray[0];
      }
    } catch (e) {
      console.error("Failed to parse runtime:", e);
    }
    return '';
  };

  const formatMemory = (memoryStr) => {
    if (!memoryStr) return '';
    try {
      const memoryArray = JSON.parse(memoryStr);
      if (Array.isArray(memoryArray) && memoryArray.length > 0) {
        return memoryArray[0];
      }
    } catch (e) {
      console.error("Failed to parse memory:", e);
    }
    return '';
  };

 
  return (
    <div className="p-4 space-y-4 overflow-y-auto hide-scrollbar h-full"> {/* Add padding and make scrollable */}
      <h3 className="text-lg font-semibold mb-4">Submissions for {problem.title}</h3>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-[60px] w-full rounded-md" />
          <Skeleton className="h-[60px] w-full rounded-md" />
          <Skeleton className="h-[60px] w-full rounded-md" />
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}

      {!isLoading && !error && submissions.length === 0 && (
        <div className="text-muted-foreground">No submissions yet.</div>
      )}

      {!isLoading && submissions.length > 0 && (
        <div className="space-y-3">
          {submissions.map((submission, index) => {
            const runtime = formatRuntime(submission.time);
            const memory = formatMemory(submission.memory);
            const languageName = languageMap[submission.languageId] || `Language ${submission.languageId}`;
            const timeAgo = submission.createdAt ? formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true }) : 'N/A';

            return (
              <div 
                key={submission.id} 
                className="border text-card-foreground rounded-md p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out cursor-pointer"
                onClick={() => onSubmissionSelect && onSubmissionSelect(submission)}
              >
                {/* Left section: Submission Number, Status and Time */}
                <div className="flex items-center gap-4">
                  <div className="text-lg font-mono text-muted-foreground">{index + 1}.</div> {/* Display submission number starting from 1 */}
                  <div className="flex flex-col">
                    <div className={`font-semibold ${getStatusColor(submission.status)}`}>
                      {submission.status.replace(/_/g, ' ')}
                    </div>
                    <div className="text-md text-muted-foreground">{timeAgo}</div>
                  </div>
                </div>

                {/* Right section: Language, Runtime, Memory */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono border-primary text-primary">{languageName}</Badge>
                  {runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{runtime}</span>
                    </div>
                  )}
                  {memory && (
                    <div className="flex items-center gap-1">
                      <MemoryStick className="w-4 h-4" />
                      <span>{memory}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProblemSubmission