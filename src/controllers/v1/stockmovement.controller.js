import { StockMovement } from "../../models/v1/stockmovement.models.js";
import { Product } from "../../models/v1/product.models.js";
import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"

const add_stock_movement = async_handler(async (req, res) => {
    try {
        const { product_id, type, quantity } = req.body;

        if (!product_id || !type || quantity === undefined) {
            throw new api_error(400, "product_id, type, and quantity are required");
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            throw new api_error(404, "Product not found");
        }

        if (!["stock-in", "sale", "manual-removal"].includes(type)) {
            throw new api_error(400, "Invalid type. Use 'stock-in', 'sale', or 'manual-removal'");
        }

        if ((type === "sale" || type === "manual-removal") && product.current_quantity < quantity) {
            throw new api_error(400, "Not enough stock available");
        }

        await StockMovement.create({ product_id, type, quantity });

        product.current_quantity += type === "stock-in" ? quantity : -quantity;
        await product.save();

        return res.status(200).json(new api_response(200, product, "Stock movement recorded & quantity updated!"));
    } catch (error) {
        throw new api_error(500, "Unable to record stock movement");
    }
});

const get_stock_history = async_handler(async (req, res) => {
    try {
        const { product_id } = req.query;

        console.log("PID" , product_id)

        const stock = await StockMovement.findAll({ where: { product_id } });

        if (!stock.length) {
            throw new api_error(404, "No stock history found for this product");
        }

        return res.status(200).json(new api_response(200, stock, "Stock history retrieved successfully!"));
    } catch (error) {
        throw new api_error(500, "Unable to retrieve stock history");
    }
});


const get_all_stock_history = async_handler(async (req, res) => {
    try {
        const stock = await StockMovement.findAll();

        if (!stock.length) {
            throw new api_error(404, "No stock history found");
        }

        return res.status(200).json(new api_response(200, stock, "All stock history retrieved successfully!"));
    } catch (error) {
        throw new api_error(500, "Unable to retrieve stock history");
    }
});
        


export {
    add_stock_movement,
    get_stock_history,
    get_all_stock_history,
}
