import { Log } from "./logger";

async function main() {
  // Valid backend logs
  await Log("backend", "debug",  "handler",    "Debug message from handler");
  await Log("backend", "info",   "service",    "Service started successfully");
  await Log("backend", "warn",   "db",         "Database connection pool running low");
  await Log("backend", "error",  "handler",    "received string, expected bool");
  await Log("backend", "fatal",  "db",         "Critical database connection failure.");
  await Log("backend", "info",   "controller", "Request received at controller");
  await Log("backend", "warn",   "cache",      "Cache miss for key userSession");
  await Log("backend", "error",  "repository", "Failed to fetch records from repo");
  await Log("backend", "info",   "route",      "Route registered successfully");
  await Log("backend", "debug",  "cron_job",   "Cron job triggered successfully");
  await Log("backend", "info",   "domain",     "Domain validation passed");

  // Invalid - should be rejected locally without hitting API
  await Log("frontend", "info",  "handler",    "Frontend using backend package - blocked");
}

main();
