import { Router } from "express";
import { authenticate } from "../middleware/authienticate.js";
import { executeCode, createSubmissionForExecutedCode } from "../controllers/executeCode.controller.js";

const router = Router();

router.post("/", authenticate, executeCode);
router.post("/:problemId/submission", authenticate, createSubmissionForExecutedCode);

export default router;
