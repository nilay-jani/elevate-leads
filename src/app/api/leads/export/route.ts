import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const city = searchParams.get("city");
    const emailStatus = searchParams.get("emailStatus");

    const where: any = {};
    if (city && city !== "ALL") where.city = city;
    if (emailStatus && emailStatus !== "ALL") where.emailStatus = emailStatus;

    const leads = await db.hospital.findMany({
      where,
      orderBy: { discoveryDate: "desc" },
    });

    const exportData = leads.map((l) => ({
      "Hospital Name": l.name,
      "Bed Count": l.bedCount || "N/A",
      "Bed Capacity Status": l.bedCapacityStatus,
      "Bed Evidence": l.bedEvidence || "",
      "Category": l.category,
      "City": l.city,
      "State": l.state,
      "Country": l.country,
      "Address": l.address,
      "PIN Code": l.pincode || "",
      "Phone": l.phone || "",
      "Website": l.website || "",
      "Email": l.email || "",
      "Email Status": l.emailStatus,
      "Email Source URL": l.emailSourceUrl || "",
      "Hospital Source URL": l.hospitalSourceUrl || "",
      "Elevate Digital Pitch Opportunity": l.websiteOpportunity || "",
      "Website Audit Score": l.auditScore,
      "Lead Review Status": l.contactStatus,
      "Discovery Date": l.discoveryDate.toISOString().split("T")[0],
    }));

    const dateStamp = new Date().toISOString().split("T")[0];
    const fileName = `elevate_hospital_leads_${city ? city.toLowerCase() : "all"}_${dateStamp}`;

    if (format === "excel" || format === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hospital Leads");

      // Set column widths for readability
      worksheet["!cols"] = [
        { wch: 30 }, // Name
        { wch: 10 }, // Beds
        { wch: 15 }, // Status
        { wch: 40 }, // Evidence
        { wch: 25 }, // Category
        { wch: 15 }, // City
        { wch: 15 }, // State
        { wch: 10 }, // Country
        { wch: 35 }, // Address
        { wch: 10 }, // PIN
        { wch: 18 }, // Phone
        { wch: 30 }, // Website
        { wch: 30 }, // Email
        { wch: 15 }, // Email Status
        { wch: 40 }, // Email Source
        { wch: 40 }, // Hosp Source
        { wch: 50 }, // Pitch
        { wch: 12 }, // Score
        { wch: 15 }, // Contact Status
        { wch: 15 }, // Date
      ];

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

      return new NextResponse(excelBuffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,
        },
      });
    }

    // Default: CSV export
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
