import { runDailyDiscovery } from "../src/lib/discovery/engine";

const TARGET_HOUR_IST = 8;
const TARGET_MINUTE_IST = 0;

let lastRunDate: string | null = null;

function getISTDate(): { dateStr: string; hour: number; minute: number } {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istString);
  const dateStr = istDate.toISOString().split("T")[0];
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  return { dateStr, hour, minute };
}

async function checkAndRun(triggerImmediately = false) {
  const { dateStr, hour, minute } = getISTDate();

  const isScheduledTime = hour === TARGET_HOUR_IST && minute === TARGET_MINUTE_IST;

  if (triggerImmediately || (isScheduledTime && lastRunDate !== dateStr)) {
    console.log(`\n[SCHEDULER TRIGGER] Running daily hospital discovery at ${new Date().toISOString()} (IST: ${hour}:${minute})`);
    lastRunDate = dateStr;

    try {
      const summary = await runDailyDiscovery();
      console.log(`[DAILY AUTOMATION SUCCESS] ${summary.reportSummary}`);
    } catch (err: any) {
      console.error("[DAILY AUTOMATION ERROR] Failed discovery cycle:", err.message);
    }
  }
}

async function startScheduler() {
  const args = process.argv.slice(2);
  const runNow = args.includes("--now");

  console.log("============================================================");
  console.log("   ELEVATE DIGITAL: DAILY HOSPITAL LEAD SCHEDULER DAEMON    ");
  console.log("============================================================");
  console.log(`Configured Schedule: Every day at 08:00 AM IST (Asia/Kolkata)`);
  console.log(`Current IST Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);

  if (runNow) {
    console.log("[INIT] --now passed: Executing initial discovery run immediately...");
    await checkAndRun(true);
  }

  console.log("[SCHEDULER ACTIVE] Polling clock every 30 seconds for 08:00 AM IST...");

  setInterval(() => {
    checkAndRun(false);
  }, 30000);
}

startScheduler();
