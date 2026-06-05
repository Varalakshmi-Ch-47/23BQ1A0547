import { Log } from "./logger";

async function main() {
  await Log("backend", "debug",  "handler", "Debug message test");
  await Log("backend", "info",   "handler", "Info message test");
  await Log("backend", "warn",   "handler", "Warn message test");
  await Log("backend", "error",  "handler", "received string, expected bool");
  await Log("backend", "fatal",  "db",      "Critical database connection failure.");
  await Log("frontend","info",   "component","Frontend log test");
}

main();
