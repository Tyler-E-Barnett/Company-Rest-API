const {
  msTenantId,
  msClientId,
  msClientSecret,
} = require("../modules/credentials");

const msLoginConfig = {
  method: "post",
  url: `https://login.microsoftonline.com/${msTenantId}/oauth2/v2.0/token`,
  headers: {
    Host: "login.microsoftonline.com",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: {
    client_id: msClientId,
    scope: "https://graph.microsoft.com/.default",
    client_secret: msClientSecret,
    grant_type: "client_credentials",
  },
};
module.exports = msLoginConfig;
