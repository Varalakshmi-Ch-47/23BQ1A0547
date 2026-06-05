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

export async function Log(
  stack: Stack,
  level: Level,
  packageName: string,
  message: string
): Promise<void> {
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
