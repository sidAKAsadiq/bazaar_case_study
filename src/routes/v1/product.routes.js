import { Router } from "express";
import {add_product,remove_product,update_product,get_products} from "../../controllers/v1/product.controller.js"

const router = Router()

//Simple api - only GET and POST
router.route('/add_product').post(add_product)
router.route('/remove_product').get(remove_product)
router.route('/update_product').post(update_product)
router.route('/get_products').get(get_products)



export default router