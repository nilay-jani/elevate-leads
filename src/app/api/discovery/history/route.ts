import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const runs = await db.discoveryRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      runs: runs.map((r) => ({
        ...r,
        logs: r.logs ? JSON.parse(r.logs) : [],
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
