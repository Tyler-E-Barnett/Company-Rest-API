require("dotenv").config();
const fmLoginToken = require("../modules/fmLoginToken");
const axios = require("axios");
const { parse } = require("json2csv");
const fs = require("fs");
const fmURL = process.env.FM_SERVER_URL;
const { fmServer, fmApiUrl } = require("../modules/credentials");

const itemQuery = async (req, res) => {
  console.log("inventory get");

  let token;
  try {
    const result = await fmLoginToken("Equipment_Inv");
    token = result;
  } catch (error) {
    console.log("token error");
    res.status(500).send(error);
    return;
  }

  try {
    let data = {
      query: [
        { "Inventory_Data::Date Inventoried": "2024...", Status: "Active" },
      ],
      portal: [],
      limit: 1000,
    };

    console.log(data);

    let config = {
      method: "post",
      url: `https://${fmServer}${fmApiUrl}Equipment_Inv/layouts/API Layout/_find`,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    const result = await axios(config);

    const resData = result.data.response;
    res.status(200).send(resData);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
};

const subItems = async (req, res) => {
  const section = req.params.section;
  const data = req.body;

  const uniqueItemCodes = new Set(data);
  const array = Array.from(uniqueItemCodes);
  const csv = array.join(",");

  fs.writeFile(`${section}unique-values.csv`, csv, (err) => {
    if (err) {
      console.error("Error writing to CSV file", err);
      return res.status(500).send("Error saving CSV file");
    }
    res.send("CSV file with unique values saved successfully");
  });
};

module.exports = { itemQuery, subItems };
