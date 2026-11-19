import { NextRequest, NextResponse } from "next/server";
import { db, ensureDatabaseTables } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseTables();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const emailStatus = searchParams.get("emailStatus") || "";
    const minBeds = searchParams.get("minBeds") ? parseInt(searchParams.get("minBeds")!, 10) : undefined;
    const maxBeds = searchParams.get("maxBeds") ? parseInt(searchParams.get("maxBeds")!, 10) : undefined;
    const contactStatus = searchParams.get("contactStatus") || "";
    const date = searchParams.get("date") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { websiteOpportunity: { contains: search } },
      ];
    }

    if (city && city !== "ALL") {
      where.city = { equals: city };
    }

    if (category && category !== "ALL") {
      where.category = { equals: category };
    }

    if (emailStatus && emailStatus !== "ALL") {
      where.emailStatus = { equals: emailStatus };
    }

    if (contactStatus && contactStatus !== "ALL") {
      where.contactStatus = { equals: contactStatus };
    }

    if (minBeds !== undefined || maxBeds !== undefined) {
      where.bedCount = {};
      if (minBeds !== undefined) where.bedCount.gte = minBeds;
      if (maxBeds !== undefined) where.bedCount.lte = maxBeds;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.discoveryDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const total = await db.hospital.count({ where });
    const leads = await db.hospital.findMany({
      where,
      orderBy: { discoveryDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      leads,
    });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
