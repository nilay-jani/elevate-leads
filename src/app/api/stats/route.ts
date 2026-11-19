import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateGeoConfig } from "@/lib/discovery/engine";

export async function GET() {
  try {
    const geoConfig = await getOrCreateGeoConfig();
    const activeCities = JSON.parse(geoConfig.activeCitiesJson);
    const currentCity = activeCities[geoConfig.currentCityIndex % activeCities.length];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalDiscovered,
      todayNewLeads,
      verifiedEmails,
      missingEmails,
      unverifiedEmails,
      confirmedBedCapacity,
      allHospitals,
      recentRuns,
    ] = await Promise.all([
      db.hospital.count(),
      db.hospital.count({ where: { discoveryDate: { gte: todayStart } } }),
      db.hospital.count({ where: { emailStatus: "VERIFIED" } }),
      db.hospital.count({ where: { emailStatus: "NOT_FOUND" } }),
      db.hospital.count({ where: { emailStatus: "UNVERIFIED" } }),
      db.hospital.count({ where: { bedCapacityStatus: "CONFIRMED" } }),
      db.hospital.findMany({
        select: {
          city: true,
          bedCount: true,
          category: true,
          emailStatus: true,
          discoveryDate: true,
        },
      }),
      db.discoveryRun.findMany({
        orderBy: { startedAt: "desc" },
        take: 5,
      }),
    ]);

    // City distribution
    const cityMap: Record<string, { count: number; verified: number }> = {};
    const categoryMap: Record<string, number> = {};
    const bedRanges = {
      "5-10 beds": 0,
      "11-15 beds": 0,
      "16-20 beds": 0,
      "21-25 beds": 0,
    };

    allHospitals.forEach((h) => {
      // City
      if (!cityMap[h.city]) cityMap[h.city] = { count: 0, verified: 0 };
      cityMap[h.city].count++;
      if (h.emailStatus === "VERIFIED") cityMap[h.city].verified++;

      // Category
      categoryMap[h.category] = (categoryMap[h.category] || 0) + 1;

      // Bed Range
      if (h.bedCount) {
        if (h.bedCount <= 10) bedRanges["5-10 beds"]++;
        else if (h.bedCount <= 15) bedRanges["11-15 beds"]++;
        else if (h.bedCount <= 20) bedRanges["16-20 beds"]++;
        else if (h.bedCount <= 25) bedRanges["21-25 beds"]++;
      }
    });

    const cityDistribution = Object.entries(cityMap).map(([city, data]) => ({
      city,
      count: data.count,
      verifiedCount: data.verified,
    })).sort((a, b) => b.count - a.count);

    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);

    const bedCapacityDistribution = Object.entries(bedRanges).map(([range, count]) => ({
      range,
      count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalDiscovered,
        todayNewLeads,
        verifiedEmails,
        unverifiedEmails,
        missingEmails,
        confirmedBedCapacity,
        verifiedPercentage: totalDiscovered > 0 ? Math.round((verifiedEmails / totalDiscovered) * 100) : 0,
      },
      geoConfig: {
        targetCountry: geoConfig.targetCountry,
        dailyTarget: geoConfig.dailyTarget,
        maxBeds: geoConfig.maxBeds,
        currentCity: currentCity ? `${currentCity.name}, ${currentCity.state}` : "Nagpur, Maharashtra",
        nextRunTime: "08:00 AM IST",
        autoRotate: geoConfig.autoRotate,
        activeCities,
      },
      cityDistribution,
      categoryDistribution,
      bedCapacityDistribution,
      recentRuns,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
