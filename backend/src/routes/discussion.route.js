import { Router } from "express";
import { authenticate } from "../middleware/authienticate.js";
import { addComment, editComment, getAllCommentsByDiscussionId, getDiscussionByProblemId, removeComment } from "../controllers/discussion.controller.js";



const router = Router()

router.get('/:id',authenticate,getDiscussionByProblemId)
router.get('/:discussionId/comments',getAllCommentsByDiscussionId)
router.post('/add-commnet',authenticate,addComment)
router.delete('/remove-comment/:commentId',authenticate,removeComment)
router.put('/comment/:commentId',authenticate,editComment)







export default router;