import { runDailyDiscovery } from "../src/lib/discovery/engine";

async function main() {
  const args = process.argv.slice(2);
  let city: string | undefined;
  let limit: number | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--city" && args[i + 1]) {
      city = args[i + 1];
      i++;
    } else if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--test") {
      limit = 5;
    }
  }

  console.log("\n=======================================================");
  console.log("   ELEVATE DIGITAL - HOSPITAL LEAD GENERATION ENGINE   ");
  console.log("=======================================================");
  console.log(`Starting discovery run at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`);
  if (city) console.log(`Target City: ${city}`);
  if (limit) console.log(`Lead Target: ${limit}`);

  try {
    const summary = await runDailyDiscovery({ city, limit });

    console.log("\n-------------------------------------------------------");
    console.log(`[STATUS: COMPLETED] Run ID: ${summary.runId}`);
    console.log(`Target City: ${summary.city}, ${summary.state}`);
    console.log(`Qualified Leads Saved: ${summary.qualifiedCount}`);
    console.log(`Verified Public Emails: ${summary.verifiedEmailsCount}`);
    console.log(`Unverified Public Emails: ${summary.unverifiedEmailsCount}`);
    console.log(`Duplicates Avoided: ${summary.duplicatesSkipped}`);
    console.log(`Duration: ${(summary.durationMs / 1000).toFixed(2)}s`);
    console.log("-------------------------------------------------------\n");

    if (summary.leads.length > 0) {
      console.log("TOP DISCOVERED QUALIFIED LEADS:");
      summary.leads.forEach((l, idx) => {
        console.log(`\n#${idx + 1}. ${l.name}`);
        console.log(`    Capacity: ${l.bedCount} beds (${l.category})`);
        console.log(`    Email: ${l.email} [${l.emailStatus}]`);
        console.log(`    Website: ${l.website || "N/A"}`);
        console.log(`    Address: ${l.address}`);
        console.log(`    Pitch Angle: ${l.websiteOpportunity}`);
      });
    }

    console.log("\n" + summary.reportSummary);
    console.log("=======================================================\n");
  } catch (err: any) {
    console.error("Discovery run failed:", err);
    process.exit(1);
  }
}

main();
