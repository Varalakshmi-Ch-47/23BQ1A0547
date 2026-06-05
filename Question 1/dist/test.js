"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
async function main() {
    await (0, logger_1.Log)("backend", "debug", "handler", "Debug message test");
    await (0, logger_1.Log)("backend", "info", "handler", "Info message test");
    await (0, logger_1.Log)("backend", "warn", "handler", "Warn message test");
    await (0, logger_1.Log)("backend", "error", "handler", "received string, expected bool");
    await (0, logger_1.Log)("backend", "fatal", "db", "Critical database connection failure.");
    await (0, logger_1.Log)("frontend", "info", "component", "Frontend log test");
}
main();
