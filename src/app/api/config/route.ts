import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateGeoConfig } from "@/lib/discovery/engine";

export async function GET() {
  try {
    const config = await getOrCreateGeoConfig();
    return NextResponse.json({
      success: true,
      config: {
        ...config,
        activeCities: JSON.parse(config.activeCitiesJson),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetCountry, dailyTarget, maxBeds, minBeds, activeCities, searchRadiusKm, autoRotate } = body;

    const data: any = {};
    if (targetCountry !== undefined) data.targetCountry = targetCountry;
    if (dailyTarget !== undefined) data.dailyTarget = parseInt(dailyTarget, 10);
    if (maxBeds !== undefined) data.maxBeds = parseInt(maxBeds, 10);
    if (minBeds !== undefined) data.minBeds = parseInt(minBeds, 10);
    if (searchRadiusKm !== undefined) data.searchRadiusKm = parseInt(searchRadiusKm, 10);
    if (autoRotate !== undefined) data.autoRotate = Boolean(autoRotate);
    if (activeCities !== undefined) data.activeCitiesJson = JSON.stringify(activeCities);

    const updated = await db.geoConfig.update({
      where: { id: "default" },
      data,
    });

    return NextResponse.json({
      success: true,
      config: {
        ...updated,
        activeCities: JSON.parse(updated.activeCitiesJson),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
