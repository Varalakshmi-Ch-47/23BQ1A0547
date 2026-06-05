const axios = require("axios");
const Log = require("./middleware/logger");

const AUTH_URL  = "http://4.224.186.213/evaluation-service/auth";
const NOTIF_URL = "http://4.224.186.213/evaluation-service/notifications";

const credentials = {
  name:         "ch vara lakshmi prasanna",
  email:        "chennamalluvaralakshmi@gmail.com",
  rollNo:       "23BQ1A0547",
  accessCode:   "QQdEYy",
  clientID:     "4c829d28-faaf-4ab8-96c2-b7d714277a05",
  clientSecret: "YYgqEARQUgvCqruj",
};

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post(AUTH_URL, credentials);
  cachedToken = res.data.access_token;
  return cachedToken;
}

async function fetchAllNotifications() {
  const token = await getToken();
  const res = await axios.get(NOTIF_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const all = res.data.notifications || [];
  await Log("backend", "info", "service", `Fetched ${all.length} notifications`);
  return all;
}

function getTopN(notifications, n = 10) {
  return notifications
    .map((notif) => ({
      ...notif,
      weight: TYPE_WEIGHT[notif.Type] ?? 0,
      ts: new Date(notif.Timestamp).getTime(),
    }))
    .sort((a, b) => b.weight - a.weight || b.ts - a.ts)
    .slice(0, n);
}

async function main() {
  await Log("backend", "info", "handler", "Campus Notification Service starting");

  const notifications = await fetchAllNotifications();
  const top10 = getTopN(notifications, 10);

  console.log("\n========== ALL NOTIFICATIONS ==========");
  console.log(`Total fetched: ${notifications.length}`);
  console.table(
    notifications.map((n) => ({
      Type: n.Type,
      Message: n.Message,
      Timestamp: n.Timestamp,
    }))
  );

  console.log("\n========== TOP 10 PRIORITY NOTIFICATIONS ==========");
  top10.forEach((n, i) => {
    console.log(
      `${i + 1}. [${n.Type.toUpperCase()}] (weight=${n.weight}) ${n.Message} — ${n.Timestamp}`
    );
  });

  await Log("backend", "info", "service", `Top 10 priority notifications computed`);
}

main().catch(async (err) => {
  await Log("backend", "error", "handler", `Service failed: ${err.message}`);
  console.error(err);
});
