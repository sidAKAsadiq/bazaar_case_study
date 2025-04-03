import { Router } from "express";
import {add_stock_movement,get_stock_history,get_all_stock_history} from "../../controllers/v1/stockmovement.controller.js"

const router = Router()

//Simple api - only GET and POST
router.route('/add_stock_movement').post(add_stock_movement)
router.route('/get_stock_history').get(get_stock_history)
router.route('/get_all_stock_history').get(get_all_stock_history)



export default router