const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddress = require("../constants/networkMapping.json");

const serverUrl = "YOUR-SERVER-URL";
const appId = "YOUR-APP-ID";
const masterKey = "YOUR-MASTER-KEY";

let chainId = process.env.chainId || 31337;
