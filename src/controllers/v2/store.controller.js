import { api_error } from "../../utils/api_error.js"
import { api_response } from "../../utils/api_response.js"
import { async_handler } from "../../utils/async_handler.js"
import { Store } from "../../models/v2/store.models.js"

const create_store = async_handler(async (req, res) => {
    const { name, location } = req.body;
  
    if (!name?.trim()) {
      throw new api_error(400, "Store name is required.");
    }
  
    const store = await Store.create({ name, location });
  
    return res
      .status(201)
      .json(new api_response(201, store, "Store created successfully!"));
  });
  
const get_all_stores = async_handler(async (req, res) => {
    const stores = await Store.findAll();
  
    return res
      .status(200)
      .json(new api_response(200, stores, "List of all stores"));
  });
  
const get_store_by_id = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const store = await Store.findByPk(id);
  
    if (!store) {
      throw new api_error(404, "Store not found.");
    }
  
    return res
      .status(200)
      .json(new api_response(200, store, "Store fetched successfully."));
  });
  
const update_store = async_handler(async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
  
    const store = await Store.findByPk(id);
    if (!store) {
      throw new api_error(404, "Store not found.");
    }
  
    store.name = name ? name : store.name; //both syntax
    store.location = location ?? store.location;
    await store.save();
  
    return res
      .status(200)
      .json(new api_response(200, store, "Store updated successfully."));
  });
  
  const delete_store = async_handler(async (req, res) => {
    const { id } = req.params;
  
    const store = await Store.findByPk(id);
    if (!store) {
      throw new api_error(404, "Store not found.");
    }
  
    await store.destroy();
  
    return res
      .status(200)
      .json(new api_response(200, {}, "Store deleted successfully."));
  });
  

export{
    create_store,
    get_all_stores,
    get_store_by_id,
    update_store,
    delete_store,
}  