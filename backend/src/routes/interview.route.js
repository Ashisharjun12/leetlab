import {Router} from "express"
import { authenticate } from "../middleware/authienticate.js";
import { createInterview, getInterviewByInterviewId, getUserInterviews } from "../controllers/interview.controller.js";



const router = Router()

router.post('/create',authenticate,createInterview)
router.get('/all',authenticate,getUserInterviews)
router.get('/get/:interviewId',authenticate,getInterviewByInterviewId)


export default router;