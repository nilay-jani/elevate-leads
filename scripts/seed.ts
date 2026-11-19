import { db } from "../src/lib/db";
import { runDailyDiscovery, getOrCreateGeoConfig } from "../src/lib/discovery/engine";

async function seed() {
  console.log("Seeding Elevate Digital Hospital Lead System...");

  // Initialize GeoConfig
  await getOrCreateGeoConfig();

  // Run initial discovery for Nagpur & Pune to populate initial leads
  console.log("Generating initial baseline batch of qualified hospital leads...");
  const run1 = await runDailyDiscovery({ city: "Nagpur", limit: 8 });
  console.log(`Nagpur run completed: ${run1.qualifiedCount} leads created.`);

  const run2 = await runDailyDiscovery({ city: "Pune", limit: 6 });
  console.log(`Pune run completed: ${run2.qualifiedCount} leads created.`);

  const run3 = await runDailyDiscovery({ city: "Indore", limit: 5 });
  console.log(`Indore run completed: ${run3.qualifiedCount} leads created.`);

  const run4 = await runDailyDiscovery({ city: "Surat", limit: 4 });
  console.log(`Surat run completed: ${run4.qualifiedCount} leads created.`);

  const totalHospitals = await db.hospital.count();
  const totalVerified = await db.hospital.count({ where: { emailStatus: "VERIFIED" } });
  console.log(`\nSeed finished successfully! Total hospitals in database: ${totalHospitals} (Verified emails: ${totalVerified})`);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
