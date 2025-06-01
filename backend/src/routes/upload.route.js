import {Router} from "express"
import { uploadFile } from "../services/imagekit.js"
import { upload } from "../utils/multer.js"

const router = Router()


router.get('/upload', uploadFile)
router.post('/upload', upload.single('file'), uploadFile)

export default router;