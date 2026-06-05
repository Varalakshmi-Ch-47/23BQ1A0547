"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
const LOG_URL = "http://4.224.186.213/evaluation-service/logs";
const credentials = {
    name: "ch vara lakshmi prasanna",
    email: "chennamalluvaralakshmi@gmail.com",
    rollNo: "23BQ1A0547",
    accessCode: "QQdEYy",
    clientID: "4c829d28-faaf-4ab8-96c2-b7d714277a05",
    clientSecret: "YYgqEARQUgvCqruj",
};
let cachedToken = null;
async function getToken() {
    if (cachedToken)
        return cachedToken;
    const res = await axios_1.default.post(AUTH_URL, credentials);
    cachedToken = res.data.access_token;
    return cachedToken;
}
async function Log(stack, level, packageName, message) {
    try {
        const token = await getToken();
        await axios_1.default.post(LOG_URL, { stack, level, package: packageName, message }, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`[${level.toUpperCase()}] [${stack}/${packageName}] ${message}`);
    }
    catch (err) {
        console.error("Logging failed:", err?.response?.data || err.message);
    }
}
