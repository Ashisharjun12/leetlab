import { Router } from "express";
import {
  getAllSubmissions,
  getAllTheSubmissionsForProblem,
  getSubmissionsForProblem,
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

export default router;
