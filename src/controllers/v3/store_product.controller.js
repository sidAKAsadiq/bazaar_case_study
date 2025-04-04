import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v3/product.models.js"
import { Store } from "../../models/v3/store.models.js"
import { StoreProduct } from "../../models/v3/store_product.models.js"
import { getFromCache, setToCache, invalidateCache } from "../../utils/cache.js";
import event_bus from "../../events/event_bus.js";
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
    },{ user_id: req.user.id });



    event_bus.emit("cache:invalidate", { key: `summary:stock:store:${store_id}` });
    event_bus.emit("cache:invalidate", { key: `reports:inventory:summary` });
    event_bus.emit("cache:invalidate", { key: `storeproducts:all` });




    return res
      .status(201)
      .json(new api_response(201, store_product, "Product assigned to store successfully."));
  });

  const get_all_store_products = async_handler(async (req, res) => {
    const cacheKey = "storeproducts:all";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "All store products (from cache)"));
    }
  
    const store_products = await StoreProduct.findAll({
      include: [Product, Store] // optional, if needed
    });
  
    await setToCache(cacheKey, store_products, 60);
  
    return res.status(200).json(new api_response(200, store_products, "All store products fetched"));
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
    await entry.save({ user_id: req.user.id });
    


    event_bus.emit("cache:invalidate", { key: `summary:stock:store:${entry.store_id}` });
    event_bus.emit("cache:invalidate", { key: `reports:inventory:summary` });
    event_bus.emit("cache:invalidate", { key: `storeproducts:all` });


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
  
    await entry.destroy({ user_id: req.user.id });
    event_bus.emit("cache:invalidate", { key: `summary:stock:store:${entry.store_id}` });
    event_bus.emit("cache:invalidate", { key: `reports:inventory:summary` });
    event_bus.emit("cache:invalidate", { key: `storeproducts:all` });



    return res
      .status(200)
      .json(new api_response(200, {}, "Store-product record deleted successfully."));
  });
  
  const get_store_products_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
    if (!store_id) {
      throw new api_error(400, "store_id is required.");
    }
  
    const cacheKey = `storeproducts:store:${store_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Store products (from cache)"));
    }
  
    const results = await StoreProduct.findAll({
      where: { store_id },
      include: [Product, Store]
    });
  
    await setToCache(cacheKey, results, 30);
  
    return res.status(200).json(new api_response(200, results, "Store products by store"));
  });

  const get_store_products_by_product = async_handler(async (req, res) => {
    const { product_id } = req.query;
    if (!product_id) {
      throw new api_error(400, "product_id is required.");
    }
  
    const cacheKey = `storeproducts:product:${product_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Store products (by product, from cache)"));
    }
  
    const results = await StoreProduct.findAll({
      where: { product_id },
      include: [Product, Store]
    });
  
    await setToCache(cacheKey, results, 30);
  
    return res.status(200).json(new api_response(200, results, "Store products by product"));
  });
  
  
const get_store_products_by_category = async_handler(async (req, res) => {
  const { category } = req.query;
  if (!category) {
    throw new api_error(400, "category is required.");
  }

  const cacheKey = `storeproducts:category:${category}`;
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return res.status(200).json(new api_response(200, cached, "Store products (by category, from cache)"));
  }

  const results = await StoreProduct.findAll({
    include: [{
      model: Product,
      where: { category }
    }, Store]
  });

  await setToCache(cacheKey, results, 30);

  return res.status(200).json(new api_response(200, results, "Store products by category"));
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