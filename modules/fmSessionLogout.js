const axios = require("axios");
const { fmServer, fmApiUrl } = require("../modules/credentials");

async function fmSessionLogout(database, token) {
  let config = {
    method: "delete",
    url: `https://${fmServer}${fmApiUrl}${database}/sessions/${token}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const result = await axios(config);
    console.log(result.data.messages);
  } catch (error) {
    console.log("error with fmSession logout", error);
  }
}

module.exports = fmSessionLogout;
