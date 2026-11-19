import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseTables } from "@/lib/db";
import { runDailyDiscovery } from "@/lib/discovery/engine";

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseTables();
    const body = await request.json().catch(() => ({}));
    const { city, limit } = body;

    const summary = await runDailyDiscovery({
      city: city || undefined,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error("Discovery run error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
