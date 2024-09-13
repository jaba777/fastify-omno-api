import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
//CLIENT_ID CLIENT_SECRET

const url = "https://sso.omno.com/realms/omno/protocol/openid-connect/token";
const cliendId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const data = new URLSearchParams({
  grant_type: "client_credentials",
  client_secret: clientSecret as string,
  client_id: cliendId as string,
}).toString();

const options = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
  url: url,
};

export const Authorization = async () => {
  try {
    const response = await axios(options);
    return response.data;
  } catch (err) {
    console.error("Error fetching token:", err);
  }
};
