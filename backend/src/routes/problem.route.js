import { Router } from 'express';
import { createProblem, getAllProblem, getProblemById, updateProblemById, deleteProblemById, getAttemptedProblem, getAllProblemSolvedByUser } from '../controllers/problem.controller.js';
import { authenticate } from '../middleware/authienticate.js';
import { checkAdmin } from '../middleware/checkadmin.js';

const router = Router();

router.get('/solved', authenticate,getAllProblemSolvedByUser);
router.get('/attempted', authenticate,getAttemptedProblem);
router.post('/', authenticate,checkAdmin,createProblem);
router.get('/', authenticate,getAllProblem);
router.get('/:id', authenticate,getProblemById);
router.put('/:id', authenticate,checkAdmin,updateProblemById);
router.delete('/:id', authenticate,checkAdmin,deleteProblemById);


export default router;






