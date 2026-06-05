import axios from "axios";

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

let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await axios.post(AUTH_URL, credentials);
  cachedToken = res.data.access_token;
  return cachedToken!;
}

export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
export type SharedPackage = "auth" | "config" | "middleware" | "utils";
export type Package = BackendPackage | FrontendPackage | SharedPackage;

const VALID_STACKS: Stack[] = ["backend", "frontend"];
const VALID_LEVELS: Level[] = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES: Package[] = ["cache","controller","cron_job","db","domain","handler","repository","route","service"];
const FRONTEND_PACKAGES: Package[] = ["api","component","hook","page","state","style"];
const SHARED_PACKAGES: Package[] = ["auth","config","middleware","utils"];

function isValidPackageForStack(stack: Stack, pkg: Package): boolean {
  if (SHARED_PACKAGES.includes(pkg)) return true;
  if (stack === "backend") return BACKEND_PACKAGES.includes(pkg);
  if (stack === "frontend") return FRONTEND_PACKAGES.includes(pkg);
  return false;
}

export async function Log(
  stack: Stack,
  level: Level,
  packageName: Package,
  message: string
): Promise<void> {
  if (!VALID_STACKS.includes(stack)) {
    console.error(`Invalid stack: "${stack}". Allowed: ${VALID_STACKS.join(", ")}`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`Invalid level: "${level}". Allowed: ${VALID_LEVELS.join(", ")}`);
    return;
  }
  if (!isValidPackageForStack(stack, packageName)) {
    console.error(`Invalid package "${packageName}" for stack "${stack}".`);
    return;
  }
  try {
    const token = await getToken();
    await axios.post(
      LOG_URL,
      { stack, level, package: packageName, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`[${level.toUpperCase()}] [${stack}/${packageName}] ${message}`);
  } catch (err: any) {
    console.error("Logging failed:", err?.response?.data || err.message);
  }
}
