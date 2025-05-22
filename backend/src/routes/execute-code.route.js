import { Router } from "express";
import { authenticate } from "../middleware/authienticate.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const router = Router();

router.post("/", authenticate,executeCode);





export default router;
