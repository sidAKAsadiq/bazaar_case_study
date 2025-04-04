import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v3/product.models.js"
import { Store } from "../../models/v3/store.models.js"
import { StoreSupplierProduct } from "../../models/v3/store_supplier_product.models.js"
import { getFromCache, setToCache, invalidateCache } from "../../utils/cache.js"
import event_bus from "../../events/event_bus.js";


const create_store_supplier_product = async_handler(async (req, res) => {
    const { store_id, supplier_id, product_id, sourcing_price } = req.body;
  
    if (!store_id || !supplier_id || !product_id || !sourcing_price) {
      throw new api_error(400, "All fields are required.");
    }
  
    const record = await StoreSupplierProduct.create({
      store_id,
      supplier_id,
      product_id,
      sourcing_price
    },{ user_id: req.user.id });


    event_bus.emit("cache:invalidate", { key: `reports:supplier:sourcing` });
    event_bus.emit("cache:invalidate", { key: `storesupplierproducts:all` });
   



    return res
      .status(201)
      .json(new api_response(201, record, "Store-supplier-product record created successfully."));
  });

  const get_all_store_supplier_products = async_handler(async (_req, res) => {
    const cacheKey = "storesupplierproducts:all";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json(new api_response(200, cached, "All store-supplier-product links (from cache)"));
    }
  
    const records = await StoreSupplierProduct.findAll({
      include: [Store, Supplier, Product]
    });
  
    await setToCache(cacheKey, records, 60);

    return res.status(200).json(new api_response(200, records, "All records"));
  });
  

  const get_store_supplier_product_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const record = await StoreSupplierProduct.findByPk(id, {
      include: [
        { model: Store },
        { model: Supplier },
        { model: Product }
      ]
    });
  
    if (!record) {
      throw new api_error(404, "Record not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, record, "Record fetched successfully."));
  });

  const update_store_supplier_product = async_handler(async (req, res) => {
    const { id } = req.params;
    const { sourcing_price } = req.body;
  
    const record = await StoreSupplierProduct.findByPk(id);
    if (!record) {
      throw new api_error(404, "Record not found.");
    }
  
    record.sourcing_price = sourcing_price ?? record.sourcing_price;
    await record.save({ user_id: req.user.id });
    event_bus.emit("cache:invalidate", { key: `reports:supplier:sourcing` });
    event_bus.emit("cache:invalidate", { key: `storesupplierproducts:all` });

    return res
      .status(200)
      .json(new api_response(200, record, "Record updated successfully."));
  });
    

  const delete_store_supplier_product = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const record = await StoreSupplierProduct.findByPk(id);
    if (!record) {
      throw new api_error(404, "Record not found.");
    }
  
    await record.destroy({ user_id: req.user.id });
    event_bus.emit("cache:invalidate", { key: `reports:supplier:sourcing` });
    event_bus.emit("cache:invalidate", { key: `storesupplierproducts:all` });

    return res
      .status(200)
      .json(new api_response(200, {}, "Record deleted successfully."));
  });

  
  const get_records_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
    if (!store_id) {
      throw new api_error(400, "store_id is required.");
    }
  
    const cacheKey = `storesupplierproducts:store:${store_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Records by store (from cache)"));
    }
  
    const records = await StoreSupplierProduct.findAll({
      where: { store_id },
      include: [Supplier, Product]
    });
  
    await setToCache(cacheKey, records, 30);
  
    return res.status(200).json(new api_response(200, records, "Records by store"));
  });
  

  const get_records_by_supplier = async_handler(async (req, res) => {
    const { supplier_id } = req.query;
    if (!supplier_id) {
      throw new api_error(400, "supplier_id is required.");
    }
  
    const cacheKey = `storesupplierproducts:supplier:${supplier_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Records by supplier (from cache)"));
    }
  
    const records = await StoreSupplierProduct.findAll({
      where: { supplier_id },
      include: [Store, Product]
    });
  
    await setToCache(cacheKey, records, 30);
  
    return res.status(200).json(new api_response(200, records, "Records by supplier"));
  });
  

  
  const get_records_by_product = async_handler(async (req, res) => {
    const { product_id } = req.query;
    if (!product_id) {
      throw new api_error(400, "product_id is required.");
    }
  
    const cacheKey = `storesupplierproducts:product:${product_id}`;
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Records by product (from cache)"));
    }
  
    const records = await StoreSupplierProduct.findAll({
      where: { product_id },
      include: [Store, Supplier]
    });
  
    await setToCache(cacheKey, records, 30);
  
    return res.status(200).json(new api_response(200, records, "Records by product"));
  });
  

  
  export{
    create_store_supplier_product,
    get_all_store_supplier_products,
    get_store_supplier_product_by_id,
    update_store_supplier_product,
    delete_store_supplier_product,
    get_records_by_product,
    get_records_by_store,
    get_records_by_supplier
    
  }