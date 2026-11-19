import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { contactStatus, notes, reviewed } = body;

    const data: any = {};
    if (contactStatus !== undefined) data.contactStatus = contactStatus;
    if (notes !== undefined) data.notes = notes;
    if (reviewed !== undefined) data.reviewed = reviewed;

    const updated = await db.hospital.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
