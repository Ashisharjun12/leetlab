import {Router} from "express"
import { authenticate } from "../middleware/authienticate.js"
import { checkAdmin } from "../middleware/checkadmin.js"
import { getAllUsers, changeRole } from "../controllers/admin.controller.js"

const router = Router()

router.get('/users',authenticate,getAllUsers)
router.patch('/users/:userId/role', authenticate, checkAdmin, changeRole)

export default router