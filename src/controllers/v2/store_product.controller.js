import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v2/product.models.js"
import { Store } from "../../models/v2/store.models.js"
import { StoreProduct } from "../../models/v2/store_product.models.js"
import { Op } from "sequelize";


const create_store_product = async_handler(async (req, res) => {
    const { store_id, product_id, selling_price, stock_quantity } = req.body;
  
    if (!store_id || !product_id) {
      throw new api_error(400, "store_id and product_id are required.");
    }
  
    const store_product = await StoreProduct.create({
      store_id,
      product_id,
      selling_price,
      stock_quantity
    });
  
    return res
      .status(201)
      .json(new api_response(201, store_product, "Product assigned to store successfully."));
  });

  const get_all_store_products = async_handler(async (_req, res) => {
    const entries = await StoreProduct.findAll({
      include: [{ model: Product }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, entries, "All store-product records fetched."));
  });

  const get_store_product_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const entry = await StoreProduct.findByPk(id, {
      include: [{ model: Product }]
    });
  
    if (!entry) {
      throw new api_error(404, "Store-product record not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, entry, "Store-product record fetched successfully."));
  });
 
  const update_store_product = async_handler(async (req, res) => {
    const { id } = req.params;
    const { selling_price, stock_quantity } = req.body;
  
    const entry = await StoreProduct.findByPk(id);
    if (!entry) {
      throw new api_error(404, "Store-product record not found.");
    }
  
    entry.selling_price = selling_price ?? entry.selling_price;
    entry.stock_quantity = stock_quantity ?? entry.stock_quantity;
    await entry.save();
  
    return res
      .status(200)
      .json(new api_response(200, entry, "Store-product record updated successfully."));
  });
    
  const delete_store_product = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const entry = await StoreProduct.findByPk(id);
    if (!entry) {
      throw new api_error(404, "Store-product record not found.");
    }
  
    await entry.destroy();
  
    return res
      .status(200)
      .json(new api_response(200, {}, "Store-product record deleted successfully."));
  });
  
  const get_store_products_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
  
    if (!store_id) {
      throw new api_error(400, "store_id is required.");
    }
  
    const entries = await StoreProduct.findAll({
      where: { store_id },
      include: [{ model: Product }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, entries, "Products for store fetched successfully."));
  });
  
  const get_store_products_by_product = async_handler(async (req, res) => {
    const { product_id } = req.query;
  
    if (!product_id) {
      throw new api_error(400, "product_id is required.");
    }
  
    const entries = await StoreProduct.findAll({
      where: { product_id },
      include: [{ model: Product }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, entries, "Store listings for product fetched."));
  });
  
  const get_store_products_by_category = async_handler(async (req, res) => {
    const { category } = req.query;
  
    if (!category) {
      throw new api_error(400, "category is required.");
    }
  
    const entries = await StoreProduct.findAll({
      include: {
        model: Product,
        where: { category },
        required: true
      }
    });
  
    return res
      .status(200)
      .json(new api_response(200, entries, "Store products by category fetched."));
  });
    


export {
    create_store_product,
    get_all_store_products,
    get_store_product_by_id,
    update_store_product,
    delete_store_product,
    get_store_products_by_store,
    get_store_products_by_product,
    get_store_products_by_category,


}