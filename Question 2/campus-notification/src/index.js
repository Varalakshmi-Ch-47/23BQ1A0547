const axios = require("axios");
const Log   = require("./middleware/logger");

const AUTH_URL  = "http://4.224.186.213/evaluation-service/auth";
const NOTIF_URL = "http://4.224.186.213/evaluation-service/notifications";

const CREDENTIALS = {
  name:         "ch vara lakshmi prasanna",
  email:        "chennamalluvaralakshmi@gmail.com",
  rollNo:       "23BQ1A0547",
  accessCode:   "QQdEYy",
  clientID:     "4c829d28-faaf-4ab8-96c2-b7d714277a05",
  clientSecret: "YYgqEARQUgvCqruj",
};

/** Priority weight per notification type */
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post(AUTH_URL, CREDENTIALS);
  cachedToken = res.data.access_token;
  return cachedToken;
}

/**
 * Fetch all notifications from the evaluation API.
 * @returns {Promise<Array>} raw notification array
 */
async function fetchNotifications() {
  await Log("backend", "info", "service", "Fetching notifications from API");
  const token = await getToken();

  const res = await axios.get(NOTIF_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const notifications = res.data.notifications || [];
  await Log("backend", "info", "service", `Fetched ${notifications.length} notifications`);
  return notifications;
}

/**
 * Assign priority score to each notification.
 * Score = (typeWeight * 1e13) + timestamp_ms for clean single-key sort.
 * @param {Array} notifications
 * @returns {Array} notifications with priority field
 */
function assignPriority(notifications) {
  return notifications.map((n) => {
    const weight = TYPE_WEIGHT[n.Type] ?? 0;
    const ts     = new Date(n.Timestamp).getTime();
    return { ...n, weight, ts, priority: weight * 1e13 + ts };
  });
}

/**
 * Return top N notifications sorted by priority descending.
 * @param {Array} notifications
 * @param {number} n
 * @returns {Array}
 */
function getTopN(notifications, n = 10) {
  return assignPriority(notifications)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, n);
}

async function main() {
  await Log("backend", "info", "handler", "Campus Notification Service starting");

  const notifications = await fetchNotifications();

  if (!notifications.length) {
    await Log("backend", "warn", "handler", "No notifications received from API");
    return;
  }

  const top10 = getTopN(notifications, 10);
  await Log("backend", "info", "service", "Top 10 notifications computed");

  // ── Output ──────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║           ALL NOTIFICATIONS                      ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`Total: ${notifications.length}\n`);
  console.table(
    notifications.map((n) => ({
      Type:      n.Type,
      Message:   n.Message,
      Timestamp: n.Timestamp,
    }))
  );

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║        TOP 10 PRIORITY NOTIFICATIONS             ║");
  console.log("╚══════════════════════════════════════════════════╝\n");
  top10.forEach((n, i) => {
    console.log(
      `  ${String(i + 1).padStart(2, "0")}. [${n.Type.toUpperCase().padEnd(9)}] ` +
      `weight=${n.weight}  ${n.Timestamp}  "${n.Message}"`
    );
  });
  console.log("");
}

main().catch(async (err) => {
  await Log("backend", "error", "handler", `Service error: ${err.message}`);
  console.error(err.message);
  process.exit(1);
});
