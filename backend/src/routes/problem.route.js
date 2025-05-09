import { Router } from 'express';
import { createProblem, getAllProblem, getProblemById, updateProblemById, deleteProblemById, getSolvedProblem, getAttemptedProblem } from '../controllers/problem.controller.js';
import { authenticate } from '../middleware/authienticate.js';
import { checkAdmin } from '../middleware/checkadmin.js';

const router = Router();


router.post('/', authenticate,checkAdmin,createProblem);
router.get('/', authenticate,getAllProblem);
router.get('/:id', authenticate,getProblemById);
router.put('/:id', authenticate,checkAdmin,updateProblemById);
router.delete('/:id', authenticate,checkAdmin,deleteProblemById);
router.get('/solved', authenticate,getSolvedProblem);
router.get('/attempted', authenticate,getAttemptedProblem);

export default router;






