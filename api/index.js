const { Router } = require("express");
const { shiftsRouter } = require("./shifts");
const { timecardRouter } = require("./timecard");
const { reportRouter } = require("./report");
const { jotformRouter } = require("./jotform");
const { webhooksRouter } = require("./webhooks");
const { inventoryRouter } = require("./inventory");

const apiRouter = Router();

apiRouter.use("/shifts", shiftsRouter);
apiRouter.use("/timecard", timecardRouter);
apiRouter.use("/report", reportRouter);
apiRouter.use("/jotform", jotformRouter);
apiRouter.use("/webhooks", webhooksRouter);
apiRouter.use("/inventory", inventoryRouter);

module.exports = {
  apiRouter,
};
