import { Router } from 'express';
import { createProblem, getAllProblem, getProblemById, updateProblemById, deleteProblemById, getSolvedProblem, getAttemptedProblem } from '../controllers/problem.controller.js';

const router = Router();


router.post('/', createProblem);
router.get('/', getAllProblem);
router.get('/:id', getProblemById);
router.put('/:id', updateProblemById);
router.delete('/:id', deleteProblemById);

router.get('/solved', getSolvedProblem);
router.get('/attempted', getAttemptedProblem);

export default router;






