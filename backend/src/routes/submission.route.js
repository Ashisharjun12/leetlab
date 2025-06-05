import { Router } from "express";
import {
  getActivityStreakByUserId,
  getAllsolvedProblem,
  getAllSolvedProblemByUserId,
  getAllSubmissions,
  getAllTheSubmissionsForProblem,
  getSolvedProblemByProblemId,
  getSolvedProblemByProblemIdUserId,
  getSubmissionsForProblem
  
} from "../controllers/submission.controller.js";
import { authenticate } from "../middleware/authienticate.js";

const router = Router();

router.get("/", authenticate, getAllSubmissions);
router.get(
  "/get-submission/:problemId",
  authenticate,
  getSubmissionsForProblem
);
router.get(
  "/get-submission-for-count/:problemId",
  authenticate,
  getAllTheSubmissionsForProblem
);

router.get('/solved',authenticate,getAllsolvedProblem)
router.get('/solved/:problemId',authenticate,getSolvedProblemByProblemId)
router.get('/solved/user/:userId',getAllSolvedProblemByUserId)
router.get('/solved/user/:userId/problem/:problemId',getSolvedProblemByProblemIdUserId)
router.get('/activity/user/:userId',getActivityStreakByUserId)

export default router;
