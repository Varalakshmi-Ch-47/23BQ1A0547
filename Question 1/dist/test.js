"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
async function main() {
    // Valid backend logs
    await (0, logger_1.Log)("backend", "debug", "handler", "Debug message from handler");
    await (0, logger_1.Log)("backend", "info", "service", "Service started successfully");
    await (0, logger_1.Log)("backend", "warn", "db", "Database connection pool running low");
    await (0, logger_1.Log)("backend", "error", "handler", "received string, expected bool");
    await (0, logger_1.Log)("backend", "fatal", "db", "Critical database connection failure.");
    await (0, logger_1.Log)("backend", "info", "controller", "Request received at controller");
    await (0, logger_1.Log)("backend", "warn", "cache", "Cache miss for key userSession");
    await (0, logger_1.Log)("backend", "error", "repository", "Failed to fetch records from repo");
    await (0, logger_1.Log)("backend", "info", "route", "Route registered successfully");
    await (0, logger_1.Log)("backend", "debug", "cron_job", "Cron job triggered successfully");
    await (0, logger_1.Log)("backend", "info", "domain", "Domain validation passed");
    // Invalid - should be rejected locally without hitting API
    await (0, logger_1.Log)("frontend", "info", "handler", "Frontend using backend package - blocked");
}
main();
