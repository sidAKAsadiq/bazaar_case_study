import { Supplier } from "../../models/v1/supplier.models.js";
import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"

const add_supplier = async_handler(async (req, res) => {
    try {
        const { name, contact_info } = req.body;

        if (!name || !contact_info) {
            throw new api_error(400, "Supplier name and contact info are required");
        }

        const supplier = await Supplier.create({ name, contact_info });

        return res.status(201).json(new api_response(201, supplier, "Supplier added successfully!"));
    } catch (error) {
        throw new api_error(500, error.message);
    }
});

export {
    add_supplier,
}


