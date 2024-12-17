const { Router } = require("express");
const { fmServer, fmApiUrl } = require("../modules/credentials");
const msLoginConfig = require("../modules/msLoginConfig");
const axios = require("axios");
const fmLoginToken = require("../modules/fmLoginToken");
const fmSessionLogout = require("../modules/fmSessionLogout");

const reportRouter = Router();

reportRouter.get("/:database/:layout", async (req, res) => {
  const database = req.params.database;
  const layout = req.params.layout;
  let filter = "ModificationTimeStamp";

  if (database === "Equipment_Inv" || "EMS") {
    filter = "Inventory_Data::Date Inventoried";
  }

  if (database === "Crew_Hours") {
    filter = "Run Date";
  }

  console.log("fetching report...");

  let token;

  try {
    const result = await fmLoginToken(database);
    token = result;
  } catch (error) {
    console.log("token error");
    res.status(500).send(error);
  }

  console.log(token);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoString = weekAgo.toLocaleDateString();

  try {
    let data = {
      query: [{ [filter]: `${weekAgoString}...` }],
      portal: [],
      limit: 1000,
    };

    console.log(data);

    let config = {
      method: "post",
      url: `https://${fmServer}${fmApiUrl}${database}/layouts/${layout}/_find`,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    const result = await axios(config);

    const resData = result.data.response.data;

    for (const i in resData) {
      delete resData[i].fieldData[""];
    }

    const fieldData = resData.map((i) => i.fieldData);

    console.log(fieldData);

    console.log("success");
    fmSessionLogout(database, token);
    res.status(200).send(fieldData);
  } catch (error) {
    console.log("data fetch error");
    res.status(500).send(error);
  }
});

reportRouter.get("/graph/:database/:layout", async (req, res) => {
  const database = req.params.database;
  const layout = req.params.layout;
  let filter = "ModificationTimeStamp";

  if (database === "Equipment_Inv" || "EMS") {
    filter = "Inventory_Data::Date Inventoried";
  }

  if (database === "Crew_Hours") {
    filter = "Run Date";
  }

  console.log("fetching report...");

  let token;

  try {
    const result = await fmLoginToken(database);
    token = result;
  } catch (error) {
    console.log("token error");
    res.status(500).send(error);
  }

  console.log(token);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoString = weekAgo.toLocaleDateString();

  try {
    let data = {
      query: [{ [filter]: `${weekAgoString}...` }],
      portal: [],
      limit: 1000,
    };

    console.log(data);

    let config = {
      method: "post",
      url: `https://${fmServer}${fmApiUrl}${database}/layouts/${layout}/_find`,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    const result = await axios(config);

    const resData = result.data.response.data;

    const totalsRecord = resData.reduce((acc, { fieldData }) => {
      const key = `${fieldData["Inventory_Data::Inventoried By"]}::${fieldData["Inventory_Data::Date Inventoried"]}`;
      if (!acc[key]) {
        acc[key] = { ...fieldData, count: 0 };
      }
      acc[key].count += 1; // Assuming you want to count the number of occurrences
      return acc;
    }, {});
    console.log(totalsRecord);

    // Then, transform the record into an array of objects
    const totalsArray = Object.values(totalsRecord).map(
      ({
        "Inventory_Data::Inventoried By": inventoriedBy,
        "Inventory_Data::Date Inventoried": date,
        count,
      }) => ({
        inventoriedBy,
        date,
        count,
      })
    );

    // console.log(totalsArray);

    console.log("success");
    fmSessionLogout(database, token);
    res.status(200).send(totalsArray);
  } catch (error) {
    console.log("data fetch error");
    res.status(500).send(error);
  }
});

module.exports = { reportRouter };
