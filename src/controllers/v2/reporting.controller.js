import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Product } from "../../models/v2/product.models.js"
import { Supplier } from "../../models/v2/supplier.models.js"
import { Store } from "../../models/v2/store.models.js"
import { StoreProduct } from "../../models/v2/store_product.models.js"
import { StoreSupplierProduct } from "../../models/v2/store_supplier_product.models.js"
import { StockMovement } from "../../models/v2/stockmovement.models.js"
import { Op } from "sequelize";

//Some of the valuable insights that can be extracted!
const get_stock_summary_by_store = async_handler(async (req, res) => {
    const { store_id } = req.query;
  
    if (!store_id) {
      throw new api_error(400, "store_id is required.");
    }
  
    const records = await StoreProduct.findAll({
      where: { store_id },
      include: [{ model: Product }],
      attributes: ["product_id", "store_id", "selling_price", "stock_quantity"],
      order: [["stock_quantity", "DESC"]]
    });
  
    const formatted = records.map((entry) => ({
      store_id: entry.store_id,
      product_id: entry.product_id,
      product_name: entry.Product?.name,
      category: entry.Product?.category,
      selling_price: entry.selling_price,
      stock_quantity: entry.stock_quantity
    }));
  
    return res
      .status(200)
      .json(new api_response(200, formatted, "Stock summary for store fetched."));
  });
  
  const get_sales_report_by_store_and_date = async_handler(async (req, res) => {
    const { store_id, start_date, end_date } = req.query;
  
    if (!store_id || !start_date || !end_date) {
      throw new api_error(400, "store_id, start_date, and end_date are required.");
    }
  
    const movements = await StockMovement.findAll({
      where: {
        type: "sale",
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        }
      },
      include: {
        model: StoreProduct,
        where: { store_id },
        include: [Product]
      }
    });
  
    const summary = {};
  
    movements.forEach((move) => {
      const pid = move.StoreProduct.product_id;
      const pname = move.StoreProduct.Product.name;
      const qty = move.quantity;
      const price = move.StoreProduct.selling_price;
  
      if (!summary[pid]) {
        summary[pid] = {
          product_id: pid,
          product_name: pname,
          total_quantity_sold: 0,
          total_revenue: 0
        };
      }
  
      summary[pid].total_quantity_sold += qty;
      summary[pid].total_revenue += qty * price;
    });
  
    return res
      .status(200)
      .json(new api_response(200, Object.values(summary), "Sales report generated."));
  });
  
  const get_stock_movement_summary_by_type = async_handler(async (req, res) => {
    const { start_date, end_date } = req.query;
  
    const where = {};
    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }
  
    const movements = await StockMovement.findAll({ where });
  
    const summary = {
      "stock-in": 0,
      sale: 0,
      "manual-removal": 0
    };
  
    movements.forEach((m) => {
      summary[m.type] += m.quantity;
    });
  
    return res
      .status(200)
      .json(new api_response(200, summary, "Stock movement breakdown by type."));
  });

  const get_supplier_sourcing_summary = async_handler(async (_req, res) => {
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
  
    return res
      .status(200)
      .json(new api_response(200, result, "Supplier sourcing summary."));
  });
   
  const get_full_inventory_summary = async_handler(async (_req, res) => {
    const records = await StoreSupplierProduct.findAll({
      include: [
        { model: Store },
        { model: Supplier },
        { model: Product }
      ]
    });
  
    const summary = records.map((r) => ({
      store: r.Store?.name,
      supplier: r.Supplier?.name,
      product: r.Product?.name,
      sourcing_price: r.sourcing_price
    }));
  
    return res
      .status(200)
      .json(new api_response(200, summary, "Full inventory sourcing summary."));
  });
  
  export{
    get_stock_summary_by_store,
    get_sales_report_by_store_and_date,
    get_stock_movement_summary_by_type,
    get_supplier_sourcing_summary,
    get_full_inventory_summary,



  }