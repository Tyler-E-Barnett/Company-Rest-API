const { Router } = require("express");

const { itemQuery, subItems } = require("../controllers/inventoryControllers");
const {
  appendToJson,
  readJson,
} = require("../controllers/functionControllers");

const inventoryRouter = Router();

inventoryRouter.get("/items", itemQuery);
inventoryRouter.post("/subItems/:section", subItems);
inventoryRouter.post("/append", appendToJson);
inventoryRouter.get("/read", readJson);

module.exports = { inventoryRouter };
