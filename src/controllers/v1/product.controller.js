import { Product } from "../../models/v1/product.models.js";
import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Supplier } from "../../models/v1/supplier.models.js";



const add_product = async_handler(async (req, res) => {
    try {
        const { name, price, current_quantity ,supplier_id } = req.body;

        if (!name || !price || !supplier_id || !current_quantity) {
            throw new api_error(400, "Product name, price,  supplier_id , current_quantity are required");
        }

        // Check if supplier exists
        const supplier = await Supplier.findByPk(supplier_id);
        console.log("Suppler ID : ", supplier_id );
        
        if (!supplier) {
            throw new api_error(404, "Supplier not found");
        }

        const product = await Product.create({ name, price, current_quantity , supplier_id });

        return res.status(201).json(new api_response(201, product, "Product added successfully!"));
    } catch (error) {
        throw new api_error(500, error.message);
    }
});



const remove_product = async_handler(async (req, res) => {
    try {
        const { id } = req.query;
        console.log("ID: ", id);

        const product = await Product.findByPk(id);
        if (!product) {
            throw new api_error(404, "Product not found");
        }

        
        await product.destroy();
        return res.status(200).json(new api_response(200, null, "Product deleted successfully!"));
    } catch (error) {
        throw new api_error(500, error.message);
    }
});


const update_product = async_handler(async (req, res) => {
    try {
        const { id } = req.query;
        const product = await Product.findByPk(id);
        if (!product) {
            throw new api_error(404, "Product not found");
        }

        await product.update(req.body);
        return res.status(200).json(new api_response(200, product, "Product updated successfully!"));
    } catch (error) {
        throw new api_error(500, "Unable to update product");
    }
});


const get_products = async_handler(async (req, res) => {
    try {
        const products = await Product.findAll({
            include: Supplier // Include supplier details
        });

        if (!products.length) {
            throw new api_error(404, "No products found");
        }

        return res.status(200).json(new api_response(200, products, "Products retrieved successfully!"));
    } catch (error) {
        throw new api_error(500, "Unable to fetch products");
    }
});



export {
add_product,
remove_product,
update_product,
get_products,
}