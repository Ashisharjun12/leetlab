import React, { useState } from 'react';
import { DiscussionAPI } from '@/api/api';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const AddComment = ({ discussionId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!authUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await DiscussionAPI.addComment({
        discussionId,
        content: content.trim(),
        userId: authUser.id
      });

      if (response.data.success) {
        toast.success("Comment added successfully");
        setContent('');
        onCommentAdded(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Please log in to add a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 w-full">
      <div className="flex items-start space-x-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={authUser?.avatar} alt={authUser?.name || 'Your Avatar'} />
          <AvatarFallback>
            {authUser?.name ? authUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddComment; 