import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Supplier } from "../../models/v3/supplier.models.js"
import { getFromCache, setToCache, invalidateCache } from "../../utils/cache.js";
import event_bus from "../../events/event_bus.js";

const create_supplier = async_handler(async (req, res) => {
    const { name, contact_info } = req.body;
  
    if (!name?.trim()) {
      throw new api_error(400, "Supplier name is required.");
    }
  
    const supplier = await Supplier.create({ name, contact_info }, { user_id: req.user.id });

    event_bus.emit("cache:invalidate", { key: `suppliers:all` });


    return res
      .status(201)
      .json(new api_response(201, supplier, "Supplier created successfully!"));
  });

  const get_all_suppliers = async_handler(async (req, res) => {
    const cacheKey = "suppliers:all";
  
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(new api_response(200, cached, "All suppliers (from cache)"));
    }
  
    const suppliers = await Supplier.findAll();
  
    await setToCache(cacheKey, suppliers, 60);
  
    return res.status(200).json(new api_response(200, suppliers, "All suppliers fetched"));
  });

  const get_supplier_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const supplier = await Supplier.findByPk(id);
  
    if (!supplier) {
      throw new api_error(404, "Supplier not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, supplier, "Supplier fetched successfully."));
  });

  const update_supplier = async_handler(async (req, res) => {
    const { id } = req.params;
    const { name, contact_info } = req.body;
  
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new api_error(404, "Supplier not found.");
    }
  
    supplier.name = name ?? supplier.name;
    supplier.contact_info = contact_info ?? supplier.contact_info;
    await supplier.save( { user_id: req.user.id });
    event_bus.emit("cache:invalidate", { key: `suppliers:all` });



    return res
      .status(200)
      .json(new api_response(200, supplier, "Supplier updated successfully."));
  });

  const delete_supplier = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      throw new api_error(404, "Supplier not found.");
    }
  
    await supplier.destroy( { user_id: req.user.id });
    event_bus.emit("cache:invalidate", { key: `suppliers:all` });



    return res
      .status(200)
      .json(new api_response(200, {}, "Supplier deleted successfully."));
  });
  
export {
    create_supplier,
    get_all_suppliers,
    get_supplier_by_id,
    update_supplier,
    delete_supplier
}