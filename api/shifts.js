const { Router } = require("express");
const {
  getTimeOffs,
  getShopShifts,
  getTimeOffsExpanded,
} = require("../controllers/shiftControllers");

const shiftsRouter = Router();

shiftsRouter.get("/timeoffs/:id", getTimeOffs);
shiftsRouter.get("/timeoffsExpanded/:id", getTimeOffsExpanded);
shiftsRouter.get("/shopShifts", getShopShifts);

module.exports = { shiftsRouter };
