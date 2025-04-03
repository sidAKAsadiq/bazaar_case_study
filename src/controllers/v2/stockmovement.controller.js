import { StockMovement } from "../../models/v2/stockmovement.models.js";
import { Product } from "../../models/v2/product.models.js";
import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { StoreProduct } from "../../models/v2/store_product.models.js";
import { Op } from "sequelize";

const record_stock_movement = async_handler(async (req, res) => {
    const { store_product_id, type, quantity } = req.body;
  
    if (!store_product_id || !type || !quantity || quantity <= 0) {
      throw new api_error(400, "store_product_id, type, and positive quantity are required.");
    }
  
    const store_product = await StoreProduct.findByPk(store_product_id);
    if (!store_product) {
      throw new api_error(404, "Store-product not found.");
    }
  
    // Update stock quantity
    let updated_quantity = store_product.stock_quantity;
    if (type === "stock-in") {
      updated_quantity += quantity;
    } else if (type === "sale" || type === "manual-removal") {
      if (quantity > updated_quantity) {
        throw new api_error(400, "Not enough stock to deduct.");
      }
      updated_quantity -= quantity;
    } else {
      throw new api_error(400, "Invalid movement type.");
    }
  
    store_product.stock_quantity = updated_quantity;
    await store_product.save();
  
    const movement = await StockMovement.create({
      store_product_id,
      type,
      quantity
    });
  
    return res
      .status(201)
      .json(new api_response(201, movement, `Stock ${type} recorded.`));
  });

  const get_all_stock_movements = async_handler(async (_req, res) => {
    const movements = await StockMovement.findAll({
      include: {
        model: StoreProduct,
        include: [{ model: Product }, { model: Store }]
      },
      order: [["createdAt", "DESC"]]
    });
  
    return res
      .status(200)
      .json(new api_response(200, movements, "All stock movements fetched."));
  });
  
  const get_stock_movement_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const movement = await StockMovement.findByPk(id, {
      include: {
        model: StoreProduct,
        include: [{ model: Product }, { model: Store }]
      }
    });
  
    if (!movement) {
      throw new api_error(404, "Movement not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, movement, "Stock movement details fetched."));
  });
  
  const get_movements_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
  
    if (!store_id) throw new api_error(400, "store_id is required.");
  
    const movements = await StockMovement.findAll({
      include: {
        model: StoreProduct,
        where: { store_id },
        include: [{ model: Product }]
      },
      order: [["createdAt", "DESC"]]
    });
  
    return res
      .status(200)
      .json(new api_response(200, movements, "Stock movements for store fetched."));
  });

  const get_movements_by_date_range = async_handler(async (req, res) => {
    const { start_date, end_date, store_id, product_id } = req.query;
  
    const where_clause = {
      createdAt: {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      }
    };
  
    const include_clause = {
      model: StoreProduct,
      include: [{ model: Product }, { model: Store }]
    };
  
    if (store_id) include_clause.where = { store_id };
    if (product_id) include_clause.where = { product_id };
  
    const movements = await StockMovement.findAll({
      where: where_clause,
      include: include_clause,
      order: [["createdAt", "DESC"]]
    });
  
    return res
      .status(200)
      .json(new api_response(200, movements, "Stock movements in date range fetched."));
  });


  export {
    record_stock_movement,
    get_all_stock_movements,
    get_stock_movement_by_id,
    get_movements_by_store,
    get_movements_by_date_range,

  }
  