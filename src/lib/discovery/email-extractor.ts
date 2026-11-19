import * as cheerio from "cheerio";
import { normalizeDomain } from "./deduplicator";

export interface EmailExtractionResult {
  email: string | null;
  emailStatus: "VERIFIED" | "UNVERIFIED" | "NOT_FOUND";
  emailSourceUrl: string | null;
  allFoundEmails: string[];
}

const INVALID_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js", ".ico"];
const JUNK_DOMAINS = [
  "sentry.io", "wix.com", "wixpress.com", "wordpress.com", "wordpress.org",
  "cloudflare.com", "schema.org", "googleapis.com", "google.com", "facebook.com",
  "instagram.com", "twitter.com", "x.com", "example.com", "domain.com",
  "email.com", "test.com", "sample.com", "templatemonster.com", "themeforest.net",
  "gravatar.com", "mysite.com", "yourdomain.com", "hostgator.com", "godaddy.com"
];

const JUNK_USERNAMES = [
  "user", "username", "yourname", "name", "email", "mail", "test", "demo",
  "admin@admin", "sentry", "privacy", "abuse", "noreply", "no-reply", "donotreply"
];

export function extractCandidateEmails(htmlOrText: string): string[] {
  if (!htmlOrText) return [];

  const foundSet = new Set<string>();

  // Extract from mailto: links first (highest fidelity)
  try {
    const $ = cheerio.load(htmlOrText);
    $('a[href^="mailto:"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        const raw = href.replace(/^mailto:/i, "").split("?")[0].trim().toLowerCase();
        if (isValidEmail(raw)) {
          foundSet.add(raw);
        }
      }
    });
  } catch {
    // If not standard HTML, fall through to regex
  }

  // Regex extraction across the text
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const matches = htmlOrText.match(emailRegex) || [];

  for (const match of matches) {
    const clean = match.trim().toLowerCase();
    if (isValidEmail(clean)) {
      foundSet.add(clean);
    }
  }

  return Array.from(foundSet);
}

function isValidEmail(email: string): boolean {
  if (!email || email.length < 6 || email.length > 80) return false;
  if (!email.includes("@") || !email.includes(".")) return false;

  // Check extensions
  for (const ext of INVALID_EXTENSIONS) {
    if (email.endsWith(ext)) return false;
  }

  const [user, domain] = email.split("@");
  if (!user || !domain) return false;

  // Check junk usernames
  if (JUNK_USERNAMES.includes(user)) return false;

  // Check junk domains
  for (const junk of JUNK_DOMAINS) {
    if (domain === junk || domain.endsWith("." + junk)) return false;
  }

  // Exclude numbers-only usernames (often tracking IDs)
  if (/^\d+$/.test(user)) return false;

  return true;
}

export function rankAndSelectEmail(
  candidateEmails: string[],
  hospitalDomain: string | null,
  sourceUrl: string,
  isOfficialWebsite: boolean
): EmailExtractionResult {
  if (candidateEmails.length === 0) {
    return {
      email: null,
      emailStatus: "NOT_FOUND",
      emailSourceUrl: null,
      allFoundEmails: []
    };
  }

  const normDomain = normalizeDomain(hospitalDomain);

  // Score candidate emails:
  // Priority: info@, contact@, admin@, reception@, hospital@, care@
  // Bonus: domain matches hospital website domain
  const scored = candidateEmails.map((email) => {
    const [user, domain] = email.split("@");
    let score = 0;

    // Check exact prioritized prefixes
    if (["info", "contact", "reception", "admin", "hospital", "care", "helpdesk", "enquiry", "support"].includes(user)) {
      score += 50;
    } else if (user.includes("hospital") || user.includes("clinic") || user.includes("desk")) {
      score += 30;
    }

    // Check domain match
    if (normDomain && domain === normDomain) {
      score += 100;
    } else if (normDomain && (domain.includes(normDomain) || normDomain.includes(domain))) {
      score += 70;
    } else if (domain.endsWith(".org") || domain.endsWith(".in") || domain.endsWith(".org.in") || domain.endsWith(".co.in")) {
      score += 20;
    }

    // Official Gmail / Rediffmail used by thousands of small Indian nursing homes
    if (domain === "gmail.com" || domain === "rediffmail.com" || domain === "yahoo.co.in") {
      score += 10;
    }

    return { email, score, domain };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Verification classification:
  // If found on official website and domain matches or found on official contact page -> VERIFIED
  // If found on public registry directory -> UNVERIFIED
  let emailStatus: "VERIFIED" | "UNVERIFIED" = "UNVERIFIED";
  if (isOfficialWebsite) {
    if (normDomain && best.domain === normDomain) {
      emailStatus = "VERIFIED";
    } else if (best.score >= 50) {
      emailStatus = "VERIFIED";
    }
  }

  return {
    email: best.email,
    emailStatus,
    emailSourceUrl: sourceUrl,
    allFoundEmails: candidateEmails
  };
}
