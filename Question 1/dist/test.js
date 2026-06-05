"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
async function main() {
    // Backend-only packages
    await (0, logger_1.Log)("backend", "error", "handler", "received string, expected bool");
    await (0, logger_1.Log)("backend", "fatal", "db", "Critical database connection failure.");
    await (0, logger_1.Log)("backend", "info", "controller", "Request received at controller");
    await (0, logger_1.Log)("backend", "warn", "cache", "Cache miss for key userSession");
    await (0, logger_1.Log)("backend", "debug", "repository", "Fetching records from repository");
    await (0, logger_1.Log)("backend", "info", "route", "Route registered successfully");
    await (0, logger_1.Log)("backend", "debug", "cron_job", "Cron job triggered successfully");
    await (0, logger_1.Log)("backend", "info", "domain", "Domain validation passed");
    await (0, logger_1.Log)("backend", "warn", "service", "Service response time exceeded threshold");
    // Frontend-only packages
    await (0, logger_1.Log)("frontend", "info", "component", "Component mounted successfully");
    await (0, logger_1.Log)("frontend", "warn", "hook", "useEffect called with missing dependency");
    await (0, logger_1.Log)("frontend", "error", "page", "Page failed to load user data");
    await (0, logger_1.Log)("frontend", "debug", "state", "State updated with new user session");
    await (0, logger_1.Log)("frontend", "info", "style", "Theme applied successfully");
    await (0, logger_1.Log)("frontend", "error", "api", "API call failed with status 500");
    // Shared packages (both stacks)
    await (0, logger_1.Log)("backend", "info", "auth", "User authenticated successfully");
    await (0, logger_1.Log)("frontend", "warn", "auth", "Token expiring soon");
    await (0, logger_1.Log)("backend", "debug", "config", "Config loaded from environment");
    await (0, logger_1.Log)("frontend", "info", "middleware", "Request interceptor attached");
    await (0, logger_1.Log)("backend", "warn", "utils", "Utility function deprecated");
    // Invalid combos - rejected locally
    await (0, logger_1.Log)("frontend", "info", "handler", "Frontend using backend package - should be blocked");
    await (0, logger_1.Log)("backend", "info", "component", "Backend using frontend package - should be blocked");
}
main();
