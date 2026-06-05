import { Log } from "./logger.js";

async function main() {
  // Backend-only packages
  await Log("backend", "error",  "handler",    "received string, expected bool");
  await Log("backend", "fatal",  "db",         "Critical database connection failure.");
  await Log("backend", "info",   "controller", "Request received at controller");
  await Log("backend", "warn",   "cache",      "Cache miss for key userSession");
  await Log("backend", "debug",  "repository", "Fetching records from repository");
  await Log("backend", "info",   "route",      "Route registered successfully");
  await Log("backend", "debug",  "cron_job",   "Cron job triggered successfully");
  await Log("backend", "info",   "domain",     "Domain validation passed");
  await Log("backend", "warn",   "service",    "Service response time exceeded threshold");

  // Frontend-only packages
  await Log("frontend", "info",  "component",  "Component mounted successfully");
  await Log("frontend", "warn",  "hook",       "useEffect called with missing dependency");
  await Log("frontend", "error", "page",       "Page failed to load user data");
  await Log("frontend", "debug", "state",      "State updated with new user session");
  await Log("frontend", "info",  "style",      "Theme applied successfully");
  await Log("frontend", "error", "api",        "API call failed with status 500");

  // Shared packages (both stacks)
  await Log("backend",  "info",  "auth",       "User authenticated successfully");
  await Log("frontend", "warn",  "auth",       "Token expiring soon");
  await Log("backend",  "debug", "config",     "Config loaded from environment");
  await Log("frontend", "info",  "middleware",  "Request interceptor attached");
  await Log("backend",  "warn",  "utils",      "Utility function deprecated");

  // Invalid combos - rejected locally
  await Log("frontend", "info",  "handler",    "Frontend using backend package - should be blocked");
  await Log("backend",  "info",  "component",  "Backend using frontend package - should be blocked");
}

main();
