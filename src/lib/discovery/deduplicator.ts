import { db } from "../db";

export function normalizeName(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\b(dr|dr\.|doctor|shree|shri|the|pvt|private|ltd|limited|hospital|nursing|home|clinic|centre|center|healthcare|surgical|multispeciality|superspeciality)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    let cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    const parsed = new URL(cleanUrl);
    let hostname = parsed.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    return hostname;
  } catch {
    return url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].trim();
  }
}

export function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  return email.trim().toLowerCase();
}

export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits.length > 5 ? digits : null;
}

export async function isDuplicateHospital(candidate: {
  name: string;
  city: string;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
}): Promise<{ isDuplicate: boolean; reason?: string; existingId?: string }> {
  const normName = normalizeName(candidate.name);
  const normDomain = normalizeDomain(candidate.website);
  const normEmail = normalizeEmail(candidate.email);
  const normPhone = normalizePhone(candidate.phone);

  // Check 1: Normalized domain match (strongest identity)
  if (normDomain && normDomain !== "facebook.com" && normDomain !== "instagram.com" && normDomain !== "justdial.com") {
    const byDomain = await db.hospital.findFirst({
      where: { domain: normDomain },
      select: { id: true, name: true }
    });
    if (byDomain) {
      return { isDuplicate: true, reason: `Domain match: ${normDomain} (matches ${byDomain.name})`, existingId: byDomain.id };
    }
  }

  // Check 2: Normalized email match
  if (normEmail) {
    const byEmail = await db.hospital.findFirst({
      where: { emailNormalized: normEmail },
      select: { id: true, name: true }
    });
    if (byEmail) {
      return { isDuplicate: true, reason: `Email match: ${normEmail} (matches ${byEmail.name})`, existingId: byEmail.id };
    }
  }

  // Check 3: Name + City match
  if (normName.length >= 3) {
    const candidatesInCity = await db.hospital.findMany({
      where: { city: { equals: candidate.city } },
      select: { id: true, name: true, nameNormalized: true }
    });

    for (const existing of candidatesInCity) {
      if (existing.nameNormalized === normName ||
          existing.nameNormalized.includes(normName) ||
          normName.includes(existing.nameNormalized)) {
        return { isDuplicate: true, reason: `Name/City match in ${candidate.city} (matches ${existing.name})`, existingId: existing.id };
      }
    }
  }

  // Check 4: Phone match
  if (normPhone && normPhone.length === 10) {
    const byPhone = await db.hospital.findFirst({
      where: { phoneNormalized: normPhone },
      select: { id: true, name: true }
    });
    if (byPhone) {
      return { isDuplicate: true, reason: `Phone match: ${normPhone} (matches ${byPhone.name})`, existingId: byPhone.id };
    }
  }

  return { isDuplicate: false };
}
