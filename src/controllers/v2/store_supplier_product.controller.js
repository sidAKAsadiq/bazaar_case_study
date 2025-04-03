import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v2/product.models.js"
import { Store } from "../../models/v2/store.models.js"
import { StoreSupplierProduct } from "../../models/v2/store_supplier_product.models.js"
import { Op } from "sequelize";

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
    });
  
    return res
      .status(201)
      .json(new api_response(201, record, "Store-supplier-product record created successfully."));
  });

  const get_all_store_supplier_products = async_handler(async (_req, res) => {
    const records = await StoreSupplierProduct.findAll({
      include: [
        { model: Store },
        { model: Supplier },
        { model: Product }
      ]
    });
  
    return res
      .status(200)
      .json(new api_response(200, records, "All store-supplier-product records fetched."));
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
    await record.save();
  
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
  
    await record.destroy();
  
    return res
      .status(200)
      .json(new api_response(200, {}, "Record deleted successfully."));
  });

  
  const get_records_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
  
    if (!store_id) throw new api_error(400, "store_id is required.");
  
    const records = await StoreSupplierProduct.findAll({
      where: { store_id },
      include: [{ model: Supplier }, { model: Product }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, records, "Records for store fetched."));
  });

  const get_records_by_supplier = async_handler(async (req, res) => {
    const { supplier_id } = req.query;
  
    if (!supplier_id) throw new api_error(400, "supplier_id is required.");
  
    const records = await StoreSupplierProduct.findAll({
      where: { supplier_id },
      include: [{ model: Store }, { model: Product }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, records, "Records for supplier fetched."));
  });

  
  const get_records_by_product = async_handler(async (req, res) => {
    const { product_id } = req.query;
  
    if (!product_id) throw new api_error(400, "product_id is required.");
  
    const records = await StoreSupplierProduct.findAll({
      where: { product_id },
      include: [{ model: Store }, { model: Supplier }]
    });
  
    return res
      .status(200)
      .json(new api_response(200, records, "Records for product fetched."));
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