export interface WebsiteAuditResult {
  hasSsl: boolean;
  hasMobileViewport: boolean;
  hasOnlineBooking: boolean;
  hasWhatsappWidget: boolean;
  hasBedTracker: boolean;
  auditScore: number; // 0 to 100
  pitchOpportunity: string;
}

export function auditHospitalWebsite(
  websiteUrl: string | null | undefined,
  htmlContent: string | null | undefined,
  bedCount: number | null
): WebsiteAuditResult {
  if (!websiteUrl) {
    return {
      hasSsl: false,
      hasMobileViewport: false,
      hasOnlineBooking: false,
      hasWhatsappWidget: false,
      hasBedTracker: false,
      auditScore: 25,
      pitchOpportunity: "NO OFFICIAL WEBSITE: Prime opportunity for Elevate Digital to build a modern, mobile-ready hospital website + deploy Hospital Sathi OS 20-bed HMS for digital OPD & billing."
    };
  }

  const hasSsl = websiteUrl.toLowerCase().startsWith("https://");
  const html = (htmlContent || "").toLowerCase();

  const hasMobileViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
  const hasOnlineBooking = html.includes("book appointment") || html.includes("online consultation") || html.includes("opd booking") || html.includes("schedule visit");
  const hasWhatsappWidget = html.includes("api.whatsapp.com") || html.includes("wa.me") || html.includes("whatsapp");
  const hasBedTracker = html.includes("live bed") || html.includes("bed status") || html.includes("admissions portal");

  // Calculate audit score
  let score = 50;
  if (hasSsl) score += 15;
  if (hasMobileViewport) score += 15;
  if (hasOnlineBooking) score += 10;
  if (hasWhatsappWidget) score += 10;
  if (!hasOnlineBooking && !hasWhatsappWidget) score -= 15;

  // Synthesize pitch angle
  const painPoints: string[] = [];
  if (!hasSsl) {
    painPoints.push("Missing SSL certificate (shows 'Not Secure' to patients)");
  }
  if (!hasMobileViewport) {
    painPoints.push("Non-responsive legacy desktop layout");
  }
  if (!hasOnlineBooking) {
    painPoints.push("No online OPD booking widget");
  }
  if (!hasWhatsappWidget) {
    painPoints.push("Missing 1-click WhatsApp patient inquiry");
  }
  if (!hasBedTracker) {
    painPoints.push(`Manual admission/paper bed tracking for ${bedCount || "20-25"} beds`);
  }

  let pitchOpportunity = "";
  if (painPoints.length >= 3) {
    pitchOpportunity = `HIGH CONVERSION LEAD: ${painPoints.slice(0, 2).join("; ")}. Pitch complete digital modernization + Hospital Sathi OS 20-bed HMS bundle.`;
  } else if (!hasOnlineBooking) {
    pitchOpportunity = `OPD WORKFLOW GAP: ${painPoints.slice(0, 2).join("; ")}. Pitch Elevate Digital online appointment engine + Hospital Sathi OS Reception Desk.`;
  } else {
    pitchOpportunity = `UPGRADE OPPORTUNITY: Active web presence but lacks integrated bed management & automated billing. Pitch Hospital Sathi OS IPD module.`;
  }

  return {
    hasSsl,
    hasMobileViewport,
    hasOnlineBooking,
    hasWhatsappWidget,
    hasBedTracker,
    auditScore: Math.min(100, Math.max(10, score)),
    pitchOpportunity
  };
}
