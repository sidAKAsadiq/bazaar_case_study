import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v3/product.models.js"
import { Supplier } from "../../models/v3/supplier.models.js"
import { Store } from "../../models/v3/store.models.js"
import { StoreProduct } from "../../models/v3/store_product.models.js"
import { StoreSupplierProduct } from "../../models/v3/store_supplier_product.models.js"
import { StockMovement } from "../../models/v3/stockmovement.models.js"
import { Op } from "sequelize";
import { getFromCache, setToCache, invalidateCache } from "../../utils/cache.js";
import event_bus from "../../events/event_bus.js";


//Some of the valuable insights that can be extracted!

const get_stock_summary_by_store = async_handler(async (req, res) => {
  const { store_id } = req.query;

  if (!store_id) {
    throw new api_error(400, "store_id is required.");
  }

  const cacheKey = `summary:stock:store:${store_id}`;

  const cached = await getFromCache(cacheKey);
  if (cached) {
    return res.status(200).json(new api_response(200, cached, "Stock summary (from cache)"));
  }

  const storeProducts = await StoreProduct.findAll({
    where: { store_id },
    include: [Product]
  });

  const summary = storeProducts.map((item) => ({
    product_name: item.Product.name,
    stock_quantity: item.stock_quantity
  }));

  await setToCache(cacheKey, summary, 60); // Cache for 60 sec - less time so we dont have to invalidate

  return res.status(200).json(
    new api_response(200, summary, "Stock summary by store")
  );
});
  
  const get_sales_report_by_store_and_date = async_handler(async (req, res) => {
    const { store_id, start_date, end_date } = req.query;
  
    if (!store_id || !start_date || !end_date) {
      throw new api_error(400, "store_id, start_date, and end_date are required.");
    }
  
    const cacheKey = `sales:store:${store_id}:from:${start_date}:to:${end_date}`;
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Sales report (from cache)"));
    }
  
    const report = await StockMovement.findAll({
      include: [
        {
          model: StoreProduct,
          include: [Product, Store]
        }
      ],
      where: {
        type: "sale",
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        }
      }
    });
  
    const filtered = report.filter((r) => r.StoreProduct.store_id === store_id);
  
    const data = filtered.map((entry) => ({
      product_name: entry.StoreProduct.Product.name,
      quantity_sold: entry.quantity,
      store: entry.StoreProduct.Store.name,
      sold_at: entry.createdAt
    }));
  
    await setToCache(cacheKey, data, 60); 
  
    return res
      .status(200)
      .json(new api_response(200, data, "Sales report fetched successfully"));
  });
   
  
  const get_stock_movement_summary_by_type = async_handler(async (_req, res) => {
    const cacheKey = "summary:stockmovements:by_type";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Stock movement summary (from cache)"));
    }
  
    const movements = await StockMovement.findAll({
      attributes: ["type", [sequelize.fn("SUM", sequelize.col("quantity")), "total"]],
      group: ["type"]
    });
  
    const summary = movements.map((m) => ({
      type: m.type,
      total_quantity: parseInt(m.dataValues.total)
    }));
  
    await setToCache(cacheKey, summary, 60);
  
    return res.status(200).json(
      new api_response(200, summary, "Stock movement summary by type")
    );
  });

  const get_supplier_sourcing_summary = async_handler(async (_req, res) => {
    const cacheKey = "reports:supplier:sourcing";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json(new api_response(200, cached, "Supplier sourcing summary (from cache)"));
    }
  
    const records = await StoreSupplierProduct.findAll({
      include: [Supplier, Product, Store]
    });
  
    const summary = {};
  
    records.forEach((rec) => {
      const sid = rec.supplier_id;
      const sname = rec.Supplier.name;
      const pname = rec.Product.name;
  
      if (!summary[sid]) {
        summary[sid] = {
          supplier_id: sid,
          supplier_name: sname,
          products: {}
        };
      }
  
      if (!summary[sid].products[pname]) {
        summary[sid].products[pname] = {
          stores_count: new Set(),
          avg_price_total: 0,
          entries: 0
        };
      }
  
      summary[sid].products[pname].stores_count.add(rec.store_id);
      summary[sid].products[pname].avg_price_total += rec.sourcing_price;
      summary[sid].products[pname].entries++;
    });
  
    const result = Object.values(summary).map((s) => ({
      supplier_id: s.supplier_id,
      supplier_name: s.supplier_name,
      products: Object.entries(s.products).map(([name, data]) => ({
        product_name: name,
        stores_supplied: data.stores_count.size,
        avg_sourcing_price: parseFloat((data.avg_price_total / data.entries).toFixed(2))
      }))
    }));
  
    await setToCache(cacheKey, result, 60); 
  
    return res
      .status(200)
      .json(new api_response(200, result, "Supplier sourcing summary"));
  });
   
  const get_full_inventory_summary = async_handler(async (req, res) => {
    const cacheKey = "reports:inventory:summary";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "Inventory summary (from cache)"));
    }
  
    // original logic
    const summary = await StoreProduct.findAll({
      include: [Store, Product],
      attributes: ["store_id", "product_id", "stock_quantity"],
    });
  
    await setToCache(cacheKey, summary, 60);
  
    return res.status(200).json(new api_response(200, summary, "Inventory summary"));
  });
  
  export{
    get_stock_summary_by_store,
    get_sales_report_by_store_and_date,
    get_stock_movement_summary_by_type,
    get_supplier_sourcing_summary,
    get_full_inventory_summary,



  }