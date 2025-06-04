import React, { useEffect, useState } from 'react';
import { DiscussionAPI } from '@/api/api';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AddComment from '@/pages/user/components/AddComment';
import Comment from '@/pages/user/components/Comment';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Helper function to build a nested comment tree
const buildCommentTree = (comments) => {
  const commentMap = {};
  const rootComments = [];

  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach(comment => {
    const commentNode = commentMap[comment.id];
    if (comment.parentCommentId === null) {
      rootComments.push(commentNode);
    } else {
      const parent = commentMap[comment.parentCommentId];
      if (parent) {
        parent.replies.push(commentNode);
      } else {
        rootComments.push(commentNode);
      }
    }
  });

  rootComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  rootComments.forEach(comment => {
    comment.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });

  return rootComments;
};

const ProblemDiscussion = ({ problem }) => {
  const [discussionData, setDiscussionData] = useState(null);
  const [comments, setComments] = useState([]);
  const { authUser } = useAuthStore();
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [errorDiscussion, setErrorDiscussion] = useState(null);
  const [errorComments, setErrorComments] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const commentsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!problem?.id) {
        setIsLoadingDiscussion(false);
        setIsLoadingComments(false);
        return;
      }

      setComments([]);
      setCurrentPage(1);
      setTotalPages(0);

      setIsLoadingDiscussion(true);
      setErrorDiscussion(null);
      try {
        const response = await DiscussionAPI.getDisscussionByProblemId(problem.id);
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setDiscussionData(response.data.data[0]);
          const discussionId = response.data.data[0].id;
          
          setIsLoadingComments(true);
          setErrorComments(null);
          try {
            const commentsResponse = await DiscussionAPI.getAllCommentByDiscussionId(discussionId, 1, commentsPerPage);
            if (commentsResponse.data && Array.isArray(commentsResponse.data.data)) {
              setComments(commentsResponse.data.data);
              setTotalPages(commentsResponse.data.pagination.totalPages);
            } else {
              setComments([]);
              setTotalPages(0);
            }
          } catch (err) {
            console.error("Error fetching comments:", err);
            setErrorComments("Failed to load comments.");
            setComments([]);
            setTotalPages(0);
          } finally {
            setIsLoadingComments(false);
          }
        } else {
          setDiscussionData(null);
          setComments([]);
          setTotalPages(0);
          setIsLoadingComments(false);
        }
      } catch (err) {
        console.error("Error fetching discussion:", err);
        setErrorDiscussion("Failed to load discussion.");
        setDiscussionData(null);
        setComments([]);
        setTotalPages(0);
        setIsLoadingComments(false);
      } finally {
        setIsLoadingDiscussion(false);
      }
    };

    fetchData();
  }, [problem?.id]);

  useEffect(() => {
    const loadMoreComments = async () => {
      if (currentPage > 1 && discussionData) {
        setIsLoadingComments(true);
        setErrorComments(null);
        try {
          const commentsResponse = await DiscussionAPI.getAllCommentByDiscussionId(discussionData.id, currentPage, commentsPerPage);
          if (commentsResponse.data && Array.isArray(commentsResponse.data.data)) {
            setComments(prevComments => [...prevComments, ...commentsResponse.data.data]);
          } else {
            // Handle case where no new comments are returned
          }
        } catch (err) {
          console.error("Error fetching more comments:", err);
          setErrorComments("Failed to load more comments.");
        } finally {
          setIsLoadingComments(false);
        }
      }
    };

    loadMoreComments();
  }, [currentPage, discussionData]);

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== deletedCommentId)
    );
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (!problem) {
    return <Skeleton className="h-full w-full" />;
  }

  const isLoading = isLoadingDiscussion || (isLoadingComments && comments.length === 0);
  const isLoadMoreLoading = isLoadingComments && comments.length > 0;

  const error = errorDiscussion || errorComments;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-6 w-1/4 mt-8" />
        <Skeleton className="h-[80px] w-full" />
        <Skeleton className="h-[80px] w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const nestedComments = buildCommentTree(comments);

  return (
    <div className="p-4 space-y-6 overflow-y-auto hide-scrollbar h-full">
      {discussionData ? (
        <div className="border rounded-md p-4 space-y-3">
          <div className="font-bold text-xl flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            {discussionData.title}
          </div>
          <div className="text-base text-foreground whitespace-pre-line">
            {discussionData.content}
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">No discussion found for this problem.</div>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold border-b pb-2">Discussion ({comments.length})</h4>
        
        {discussionData && (
          <AddComment 
            discussionId={discussionData.id} 
            onCommentAdded={handleCommentAdded}
          />
        )}

        {nestedComments.length > 0 ? (
          nestedComments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              currentUser={authUser}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          discussionData && (
            <div className="text-muted-foreground">No comments yet.</div>
          )
        )}

        {currentPage < totalPages && (
           <div className="flex justify-center mt-4">
              <Button 
                onClick={handleLoadMore} 
                disabled={isLoadMoreLoading}
                variant="secondary"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              >
                 {isLoadMoreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                 {isLoadMoreLoading ? 'Loading More...' : 'View more discussion'}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDiscussion; 