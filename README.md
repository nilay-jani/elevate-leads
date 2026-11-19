# Elevate Digital – Daily Hospital Lead Generation Automation

A production-grade, automated lead generation and hospital intelligence platform built specifically for **Elevate Digital**.

The system automatically discovers, qualifies, deduplicates, and organizes **30 NEW small and medium-sized hospitals (5–25 beds)** every day across Indian cities, capturing verified public business emails, bed evidence, and tailor-made digital modernization pitch opportunities (e.g., Hospital Sathi OS HMS + WhatsApp patient triage + mobile web booking).

---

## Key Modules & Capabilities

1. **Daily Scheduled Automation (08:00 AM IST)**:
   - Configured with `CRON_TZ=Asia/Kolkata 0 8 * * *`.
   - Rotates across configured Indian cities (Nagpur, Pune, Indore, Surat, Nashik, Jaipur, Vadodara, Coimbatore, Lucknow, Bhopal, etc.).
   - Discovers fresh small hospitals from public directories, empanelment registries (Rohini IIB, PMJAY), and live search indexing.
   - Target: 30 qualified leads daily (strict rule: **NEVER fabricates data**; reports exact discovered count).

2. **Strict 5–25 Bed Capacity Qualification**:
   - Automatically parses bed capacity from public evidence and empanelment listings.
   - Disqualifies large corporate chains (Apollo, Fortis, Max, Manipal, Narayana, Aster, Care Hospitals, Yashoda, Medanta, etc.).
   - Disqualifies medical colleges and government tertiary institutions.
   - Excludes hospitals with unconfirmed bed capacity from the qualified count.

3. **Zero-Guess Public Email Extraction**:
   - Extracts publicly listed business emails from official hospital contact pages, footers, and verified healthcare registries.
   - Prioritizes official management domains: `info@`, `contact@`, `admin@`, `reception@`.
   - Never guesses or fabricates emails.
   - Saves the exact public source URL where the email was found.
   - Classifies as `VERIFIED`, `UNVERIFIED`, or `NOT_FOUND`.

4. **Multi-Factor Duplicate Prevention (SQLite)**:
   - Identifies duplicates using normalized hospital name, website domain, email, and phone number.
   - Ensures previously discovered hospitals are never duplicated in future daily runs.

5. **Modern SaaS Dashboard (White & Dark Navy Theme)**:
   - Real-time KPI Cards: Total Discovered, Today's Leads, Verified Emails (%), Confirmed Bed Capacity.
   - Interactive Analytics: City-wise distribution, bed brackets (5–10, 11–15, 16–20, 21–25 beds), category breakdown.
   - Advanced Filtering: By city, bed capacity, category, email verification status, and search keywords.
   - One-Click Exports: Instant CSV and Excel (`.xlsx`) downloads formatted with column widths.
   - Lead Detail Drawer: Full profile, bed evidence quote, website audit score, and custom sales pitch notes.
   - City Rotation & Geo Manager: Add/pause cities, set daily targets, toggle auto-rotation.
   - Execution History: Full chronological audit logs with step-by-step traces.
   - Pitch Playbook: Ready-to-use email templates and modernization angles.

---

## Quick Start

### 1. Run the Dashboard
```bash
cd /Users/nilay/.gemini/antigravity/scratch/elevate-hospital-leads
npm run start
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

### 2. Run Discovery Manually
```bash
# Run discovery for today's active rotation city
npm run discover:daily

# Run discovery for a specific city with a custom target
npx tsx scripts/run-discovery.ts --city Pune --limit 15
```

### 3. Run the Background Scheduler Daemon
```bash
npm run scheduler
```

---

## Antigravity Sidecar Automation

The automation sidecar is registered at:
`~/.gemini/config/sidecars/elevate-hospital-leads/sidecar.json`

To enable the daily 8:00 AM IST background run, open the Automations dashboard:
[Open Automations Dashboard](sidecar://dashboard)
