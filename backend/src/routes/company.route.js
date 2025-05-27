import { Router } from "express";
import { authenticate } from "../middleware/authienticate.js";
import { checkAdmin } from "../middleware/checkadmin.js";
import { createCompany, deleteCompanyById, getAllCompany, getCompanybyId } from "../controllers/company.controller.js";


const router = Router()

router.post('/',authenticate,checkAdmin,createCompany)
router.get('/:id',authenticate,getCompanybyId)
router.get('/',getAllCompany)
router.delete('/:id',authenticate,checkAdmin,deleteCompanyById)




export default router;