import { Router } from 'express';
import { registerUser, loginUser, logoutUser, uploadAvatar, checkUser, getLoggedInUser, getUserDetailsApi, getUserStatistics } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authienticate.js';
import { upload } from '../utils/multer.js';



const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',authenticate,logoutUser);
router.get('/check',authenticate,checkUser)
router.get('/me',authenticate,getLoggedInUser)
router.get('/details/:userId',getUserDetailsApi)
router.get('/statistics/:userId',getUserStatistics)
router.post('/upload-avatar', upload.single('file'), authenticate, uploadAvatar);




export default router;
