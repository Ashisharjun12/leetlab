import { Router } from 'express';
import { registerUser, loginUser, logoutUser, uploadAvatar, checkUser, getLoggedInUser, getUserDetailsApi } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authienticate.js';



const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',authenticate,logoutUser);
router.get('/check',authenticate,checkUser)
router.get('/me',authenticate,getLoggedInUser)
router.get('/details/:userId',getUserDetailsApi)
router.post('/upload-avatar', uploadAvatar);




export default router;
