import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { discussion } from "../models/discussion.model.js";
import { comment } from "../models/comment.model.js";
import logger from "../utils/logger.js"


export const getDiscussionByProblemId = async(req,res)=>{
    try {
        logger.info("hitting get discussion for problem ....")
        const problemId = req.params.id;

        const getDiscussion= await db.select().from(discussion).where(eq(discussion.problemId, problemId))

        res.status(200).json({
            success:true,
            message:"get discussion by probelmId successfully",
            data: getDiscussion
        })

    } catch (error) {
        logger.error("error in get discussion by problemId",error)
         res.status(500).json({
            success: false,
            message: "Failed to get discussion by problem ID",
            error: error.message
        });
    }

}


export const addComment = async(req,res)=>{
    try {
        logger.info("hitting add comment route....")
        const { discussionId, content, parentCommentId } = req.body;
        const userId = req.user.id;

        if (!discussionId || !content) {
            return res.status(400).json({
                success: false,
                message: "Discussion ID and content are required."
            });
        }

        const [newComment] = await db.insert(comment).values({
            discussionId: discussionId,
            userId: userId,
            content: content,
            parentCommentId: parentCommentId || null
        }).returning();

        logger.info(`Comment added: ${newComment.id}`);

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });

    } catch (error) {
        logger.error("error in adding comment:",error);
        res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
}

export const removeComment = async (req, res) => {
    try {
        logger.info("hitting remove comment route....")
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!commentId) {
             return res.status(400).json({
                success: false,
                message: "Comment ID is required."
            });
        }

        const [existingComment] = await db.select()
            .from(comment)
            .where(eq(comment.id, commentId));

        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        if (existingComment.userId !== userId || userRole !== 'admin') {
             return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment."
            });
        }

        const [deletedComment] = await db.delete(comment)
            .where(eq(comment.id, commentId))
            .returning();

        logger.info(`Comment removed: ${deletedComment.id}`);

        res.status(200).json({
            success: true,
            message: "Comment removed successfully",
            data: deletedComment
        });

    } catch (error) {
        logger.error("error in removing comment:",error);
        res.status(500).json({
            success: false,
            message: "Failed to remove comment",
            error: error.message
        });
    }
}

export const getAllCommentsByDiscussionId = async (req, res) => {
    try {
        logger.info("hitting get all comments by discussion ID route with pagination....")
        const { discussionId } = req.params;
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        if (!discussionId) {
            return res.status(400).json({
                success: false,
                message: "Discussion ID is required."
            });
        }

        // Fetch total count of comments for pagination info
        const totalCommentsResult = await db.select({ count: comment.id })
            .from(comment)
            .where(eq(comment.discussionId, discussionId));

        const totalComments = totalCommentsResult.length > 0 ? totalCommentsResult.length : 0; // Or use count aggregate if available

        // Fetch comments for the current page, ordered by creation time
        const comments = await db.select()
            .from(comment)
            .where(eq(comment.discussionId, discussionId))
            .orderBy(comment.createdAt)
            .limit(limit)
            .offset(offset);

        logger.info(`Fetched ${comments.length} comments for discussion ${discussionId} on page ${page} with limit ${limit}. Total comments: ${totalComments}`);

        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            data: comments,
            pagination: {
                totalComments: totalComments,
                currentPage: page,
                commentsPerPage: limit,
                totalPages: Math.ceil(totalComments / limit)
            }
        });

    } catch (error) {
        logger.error("error in getting all comments by discussion ID with pagination:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve comments",
            error: error.message
        });
    }
}

export const editComment = async (req, res) => {
    try {
        logger.info("hitting edit comment route....")
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // Assuming user ID is available from auth middleware
        const userRole = req.user.role; // Assuming user role is available from auth middleware

        if (!commentId || content === undefined) { // Check for undefined to allow empty string content
            return res.status(400).json({
                success: false,
                message: "Comment ID and content are required."
            });
        }

        // Check if the comment exists
        const [existingComment] = await db.select()
            .from(comment)
            .where(eq(comment.id, commentId));

        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        // Allow editing only by the original author or an admin
        if (existingComment.userId !== userId && userRole !== 'admin') {
             return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this comment."
            });
        }

        // Update the comment and return the updated row
        const [updatedComment] = await db.update(comment)
            .set({
                content: content,
                updatedAt: new Date(), // Update the timestamp
            })
            .where(eq(comment.id, commentId))
            .returning();

        // Add this check to ensure updatedComment is not undefined
        if (!updatedComment) {
             logger.error(`Edit comment failed for comment ID: ${commentId}. Row not updated.`);
             return res.status(500).json({
                 success: false,
                 message: "Failed to update comment."
             });
        }

        logger.info(`Comment edited: ${updatedComment.id}`);

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: updatedComment
        });

    } catch (error) {
        logger.error("error in editing comment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to edit comment",
            error: error.message
        });
    }
}