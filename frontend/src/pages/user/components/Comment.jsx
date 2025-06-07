import React, { useEffect, useState } from 'react';
import { authAPI, DiscussionAPI } from '@/api/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Save, X, MoreHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate } from 'react-router-dom';

const Comment = ({ comment, currentUser, onCommentUpdated, onCommentDeleted }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthor = currentUser && comment.userId === currentUser.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authAPI.getUserDetails(comment.userId);
        if (response.data && response.data.success) {
          setUserDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (comment.userId) {
      fetchUserDetails();
    }
  }, [comment.userId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleSaveClick = async () => {
    if (!editedContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await DiscussionAPI.editComment(comment.id, { content: editedContent.trim() });
      if (response.data.success) {
        toast.success("Comment updated successfully");
        if(onCommentUpdated) onCommentUpdated({ ...comment, content: editedContent.trim() });
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error.response?.data?.message || "Failed to update comment");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsUpdating(true);
    try {
      const response = await DiscussionAPI.removeComment(comment.id);
      if (response.data.success) {
        toast.success("Comment deleted successfully");
        if(onCommentDeleted) onCommentDeleted(comment.id);
      } else {
        toast.error(response.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setIsUpdating(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const initials = userDetails?.name ? userDetails.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN';

  return (
    <div className={`flex space-x-4 border-b pb-4 mb-4 ${comment.parentCommentId ? 'ml-8' : ''}`}>
      <div className="flex-shrink-0">
        {isLoadingUser ? (
          <Skeleton className="w-7 h-7 rounded-full" />
        ) : (
          <Avatar className="w-7 h-7">
            <AvatarImage src={userDetails?.avatar} alt={userDetails?.name || 'User Avatar'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {isLoadingUser ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <div 
                className="font-semibold cursor-pointer hover:underline"
                onClick={() => userDetails?.id && navigate(`/profile/${userDetails.id}`)}
              >
                {userDetails?.name || 'Unknown User'}
                {isAuthor && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
              </div>
            )}
            <div className="text-muted-foreground">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
            </div>
          </div>
          {isAuthor && !isEditing && (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleEditClick} disabled={isUpdating}>
                   <Edit className="w-4 h-4 mr-2" />
                  Edit
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} disabled={isUpdating}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isUpdating}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCancelClick} disabled={isUpdating}>
                <X className="w-4 h-4 mr-1" />Cancel
              </Button>
              <Button size="sm" onClick={handleSaveClick} disabled={isUpdating || !editedContent.trim()}>
                {isUpdating ? 'Saving...' : <><Save className="w-4 h-4 mr-1" />Save</>}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground whitespace-pre-line">
            {comment.content}
          </div>
        )}

        {/* Render actions like Reply, Edit, Delete here */}
        {/* <Button variant="ghost" size="sm">Reply</Button> */}

        {/* Recursively render replies */}
        {comment.replies && comment.replies.map(reply => (
          <Comment 
            key={reply.id} 
            comment={reply} 
            currentUser={currentUser}
            onCommentUpdated={onCommentUpdated}
            onCommentDeleted={onCommentDeleted}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isUpdating} className="bg-red-600 hover:bg-red-700">
              {isUpdating ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Comment; 