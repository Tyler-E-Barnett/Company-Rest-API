require("dotenv").config();

const msTenantId = process.env.MS_TENANT_ID;
const msClientId = process.env.CLIENT_ID;
const msClientSecret = process.env.CLIENT_SECRET;
const msUUID = process.env.MS_UUID;
const fmServer = process.env.FM_SERVER;
const fmApiUrl = "/fmi/data/v1/databases/";
const fmUser = process.env.FM_USER;
const fmPassword = process.env.FM_PASSWORD;
const combinedString = `${fmUser}:${fmPassword}`;
const base64FmCredentials = Buffer.from(combinedString).toString("base64");

module.exports = {
  fmServer,
  fmApiUrl,
  fmUser,
  fmPassword,
  base64FmCredentials,
  msTenantId,
  msClientId,
  msClientSecret,
  msUUID,
};
