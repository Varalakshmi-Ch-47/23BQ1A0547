const axios = require("axios");

const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
const LOG_URL  = "http://4.224.186.213/evaluation-service/logs";

const CREDENTIALS = {
  name:         "ch vara lakshmi prasanna",
  email:        "chennamalluvaralakshmi@gmail.com",
  rollNo:       "23BQ1A0547",
  accessCode:   "QQdEYy",
  clientID:     "4c829d28-faaf-4ab8-96c2-b7d714277a05",
  clientSecret: "YYgqEARQUgvCqruj",
};

const VALID_STACKS  = ["backend", "frontend"];
const VALID_LEVELS  = ["debug", "info", "warn", "error", "fatal"];

const BACKEND_PACKAGES  = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
const FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
const SHARED_PACKAGES   = ["auth", "config", "middleware", "utils"];

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post(AUTH_URL, CREDENTIALS);
  cachedToken = res.data.access_token;
  return cachedToken;
}

function isValidPackage(stack, pkg) {
  if (SHARED_PACKAGES.includes(pkg))   return true;
  if (stack === "backend")              return BACKEND_PACKAGES.includes(pkg);
  if (stack === "frontend")             return FRONTEND_PACKAGES.includes(pkg);
  return false;
}

/**
 * Log sends a structured log entry to the evaluation service.
 * @param {string} stack   - "backend" | "frontend"
 * @param {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg     - package name (stack-specific or shared)
 * @param {string} message - log message
 */
async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[LOGGER] Invalid stack "${stack}". Allowed: ${VALID_STACKS.join(", ")}`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[LOGGER] Invalid level "${level}". Allowed: ${VALID_LEVELS.join(", ")}`);
    return;
  }
  if (!isValidPackage(stack, pkg)) {
    console.error(`[LOGGER] Invalid package "${pkg}" for stack "${stack}".`);
    return;
  }

  try {
    const token = await getToken();
    await axios.post(
      LOG_URL,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`[${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);
  } catch (err) {
    console.error("[LOGGER] Failed to send log:", err?.response?.data || err.message);
  }
}

module.exports = Log;
