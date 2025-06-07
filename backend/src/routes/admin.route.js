import {Router} from "express"
import { authenticate } from "../middleware/authienticate.js"
import { checkAdmin } from "../middleware/checkadmin.js"
import { getAllUsers, changeRole, getTotal } from "../controllers/admin.controller.js"

const router = Router()

router.get('/users',authenticate,getAllUsers)
router.get('/total',authenticate,checkAdmin,getTotal)
router.patch('/users/:userId/role', authenticate, checkAdmin, changeRole)

export default router