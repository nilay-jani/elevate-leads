export interface BedAnalysisResult {
  bedCount: number | null;
  status: "CONFIRMED" | "UNKNOWN" | "EXCEEDS_MAX" | "DISQUALIFIED_CHAIN" | "DISQUALIFIED_GOVT";
  evidence: string | null;
  category: string;
  isQualified: boolean;
  disqualificationReason?: string;
}

const CORPORATE_CHAINS = [
  "apollo", "fortis", "max healthcare", "max hospital", "manipal", "narayana health", 
  "narayana hrudayalaya", "aster dm", "aster hospital", "care hospitals", "yashoda hospital",
  "medanta", "kims", "krishna institute", "gleneagles", "columbia asia", "cloudnine",
  "motherhood hospital", "rainbow children", "dr agarwal", "vasan eye", "ruby hall",
  "wockhardt", "sterling hospital", "shalby", "paras hospital", "lilavati", "hinduja",
  "kokilaben", "sir h n reliance", "nanavati", "artemis", "sarvodaya"
];

const GOVT_COLLEGE_KEYWORDS = [
  "medical college", "govt", "government", "district hospital", "civil hospital",
  "aiims", "municipal corporation hospital", "esi hospital", "railway hospital",
  "sub-district hospital", "taluka hospital", "primary health centre", "phc", "chc",
  "tertiary care", "super speciality institute", "postgraduate institute"
];

export function analyzeBedCapacity(
  hospitalName: string,
  rawText: string,
  categoryHint?: string,
  bedCountHint?: number | null
): BedAnalysisResult {
  const lowerName = hospitalName.toLowerCase();
  const lowerText = (rawText || "").toLowerCase();

  // Check 1: Exclude Corporate Hospital Chains
  for (const chain of CORPORATE_CHAINS) {
    if (lowerName.includes(chain) || lowerText.includes(`part of ${chain}`) || lowerText.includes(`unit of ${chain}`)) {
      return {
        bedCount: null,
        status: "DISQUALIFIED_CHAIN",
        evidence: `Matches blacklisted corporate chain: ${chain}`,
        category: "Corporate Hospital Chain",
        isQualified: false,
        disqualificationReason: `Excluded corporate chain (${chain}) - Elevate targets independent 5-25 bed hospitals.`
      };
    }
  }

  // Check 2: Exclude Medical Colleges and Government Hospitals
  for (const term of GOVT_COLLEGE_KEYWORDS) {
    if (lowerName.includes(term)) {
      return {
        bedCount: null,
        status: "DISQUALIFIED_GOVT",
        evidence: `Matches public/medical college keyword: ${term}`,
        category: "Government / Medical College",
        isQualified: false,
        disqualificationReason: `Excluded government/medical college institute (${term}).`
      };
    }
  }

  // Determine Category
  let category = categoryHint || "Independent Nursing Home";
  if (lowerName.includes("maternity") || lowerText.includes("maternity") || lowerName.includes("gynec") || lowerText.includes("obstetric")) {
    category = "Maternity & Nursing Home";
  } else if (lowerName.includes("surgical") || lowerText.includes("surgical hospital") || lowerText.includes("laparoscopy")) {
    category = "Private Surgical Hospital";
  } else if (lowerName.includes("multispeciality") || lowerName.includes("multi-speciality")) {
    category = "Small Multispeciality Hospital";
  } else if (lowerName.includes("eye") || lowerName.includes("netra") || lowerName.includes("ent")) {
    category = "Specialty Day-Care Hospital";
  }

  // Check 3: Extract Bed Capacity from Text / Evidence
  const bedPatterns: { regex: RegExp; extractor: (m: RegExpMatchArray) => number }[] = [
    {
      regex: /(?:registered\s*with|capacity\s*of|equipped\s*with|accommodates?)\s*(\d{1,3})\s*beds?/i,
      extractor: (m) => parseInt(m[1], 10)
    },
    {
      regex: /(\d{1,3})\s*[-–to\s]*\s*bedded/i,
      extractor: (m) => parseInt(m[1], 10)
    },
    {
      regex: /bed\s*capacity\s*(?::|is|of)?\s*(\d{1,3})\b/i,
      extractor: (m) => parseInt(m[1], 10)
    },
    {
      regex: /total\s*beds?\s*(?::|is|of)?\s*(\d{1,3})\b/i,
      extractor: (m) => parseInt(m[1], 10)
    },
    {
      regex: /\b(\d{1,3})\s*beds?\b/i,
      extractor: (m) => parseInt(m[1], 10)
    },
    {
      regex: /(\d{1,3})\s*bed\s*(?:hospital|facility|setup|wing|inpatient|unit|care)/i,
      extractor: (m) => parseInt(m[1], 10)
    }
  ];

  let detectedBedCount: number | null = null;
  let evidenceSnippet: string | null = null;

  for (const pattern of bedPatterns) {
    const match = rawText.match(pattern.regex);
    if (match) {
      const count = pattern.extractor(match);
      if (!isNaN(count) && count > 0 && count < 1000) {
        detectedBedCount = count;
        const idx = match.index || 0;
        const start = Math.max(0, idx - 40);
        const end = Math.min(rawText.length, idx + match[0].length + 40);
        evidenceSnippet = `"${rawText.slice(start, end).replace(/\s+/g, " ").trim()}"`;
        break;
      }
    }
  }

  if (detectedBedCount === null && typeof bedCountHint === "number" && bedCountHint > 0) {
    detectedBedCount = bedCountHint;
    evidenceSnippet = rawText ? `"${rawText.slice(0, 100).trim()}"` : `Verified registry listing: ${bedCountHint} beds`;
  }

  // Validation Rules:
  if (detectedBedCount === null) {
    return {
      bedCount: null,
      status: "UNKNOWN",
      evidence: null,
      category,
      isQualified: false,
      disqualificationReason: "Bed capacity cannot be verified with public evidence. Marked UNKNOWN."
    };
  }

  if (detectedBedCount > 25) {
    return {
      bedCount: detectedBedCount,
      status: "EXCEEDS_MAX",
      evidence: evidenceSnippet,
      category,
      isQualified: false,
      disqualificationReason: `Bed capacity (${detectedBedCount} beds) exceeds maximum threshold of 25 beds.`
    };
  }

  if (detectedBedCount < 5) {
    return {
      bedCount: detectedBedCount,
      status: "UNKNOWN",
      evidence: evidenceSnippet,
      category,
      isQualified: false,
      disqualificationReason: `Bed capacity (${detectedBedCount} beds) below target minimum of 5 beds.`
    };
  }

  return {
    bedCount: detectedBedCount,
    status: "CONFIRMED",
    evidence: evidenceSnippet || `Confirmed ${detectedBedCount} beds in official listing`,
    category,
    isQualified: true
  };
}
