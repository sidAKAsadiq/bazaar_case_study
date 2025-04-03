import { Router } from "express";
import {add_supplier} from "../../controllers/v1/supplier.controller.js"

const router = Router()

//Simple api - only GET and POST
router.route('/add_supplier').post(add_supplier)

export default router