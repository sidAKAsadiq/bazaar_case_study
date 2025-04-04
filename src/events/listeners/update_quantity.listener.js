import event_bus from "../event_bus.js";

event_bus.on("update_quantity", async ({ storeProduct, type, quantity = {} }) => {
  // Update quantity
  let updated_quantity = storeProduct.stock_quantity;
  if (type === "stock-in") updated_quantity += quantity;
  else if (["sale", "manual-removal"].includes(type)) {
    updated_quantity -= quantity;
    if (updated_quantity < 0) updated_quantity = 0;
  }
await storeProduct.update({ stock_quantity: updated_quantity });
});
