const express = require("express");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3003;

const { apiRouter } = require("./api");

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

app.use("/api", apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
