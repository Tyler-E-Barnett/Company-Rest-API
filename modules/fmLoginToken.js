const axios = require("axios");
const {
  fmServer,
  fmApiUrl,
  base64FmCredentials,
} = require("../modules/credentials");

async function fmLoginToken(database) {
  let config = {
    method: "post",
    url: `https://${fmServer}${fmApiUrl}${database}/sessions`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64FmCredentials}`,
    },
  };

  try {
    const result = await axios(config);
    const token = result.data.response.token;
    console.log(token);
    return token;
  } catch (error) {
    console.log("error with fmlogintoken", error);
  }
}

module.exports = fmLoginToken;
