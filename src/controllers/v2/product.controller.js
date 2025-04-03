import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v2/product.models.js"
import { Op } from "sequelize";


const create_product = async_handler(async (req, res) => {
    const { name, category } = req.body;
  
    if (!name?.trim()) {
      throw new api_error(400, "Product name is required.");
    }
  
    const product = await Product.create({ name, category });
  
    return res
      .status(201)
      .json(new api_response(201, product, "Product created successfully!"));
  });

  const get_all_products = async_handler(async (_req, res) => {
    const products = await Product.findAll();
  
    return res
      .status(200)
      .json(new api_response(200, products, "All products fetched successfully."));
  });

  

  const get_filtered_products = async_handler(async (req, res) => {
    const { name, category } = req.query;
  
    const where_clause = {};
    if (name) where_clause.name = { [Op.iLike]: `%${name}%` };
    if (category) where_clause.category = { [Op.iLike]: `%${category}%` };
  
    const products = await Product.findAll({ where: where_clause });
  
    return res
      .status(200)
      .json(new api_response(200, products, "Filtered products fetched successfully."));
  });
    
  const get_product_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const product = await Product.findByPk(id);
  
    if (!product) {
      throw new api_error(404, "Product not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, product, "Product fetched successfully."));
  });

  const update_product = async_handler(async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;
  
    const product = await Product.findByPk(id);
    if (!product) {
      throw new api_error(404, "Product not found.");
    }
  
    product.name = name ?? product.name;
    product.category = category ?? product.category;
    await product.save();
  
    return res
      .status(200)
      .json(new api_response(200, product, "Product updated successfully."));
  });

  const delete_product = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const product = await Product.findByPk(id);
    if (!product) {
      throw new api_error(404, "Product not found.");
    }
  
    await product.destroy();
  
    return res
      .status(200)
      .json(new api_response(200, {}, "Product deleted successfully."));
  });

  
  
  export{
    create_product,
    get_all_products,
    get_filtered_products,
    get_product_by_id,
    update_product,
    delete_product
  }
