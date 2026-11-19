"use client";

import React from "react";
import {
  Download,
  FileSpreadsheet,
  Play,
  RotateCw,
  Sparkles,
  Calendar,
  Globe2
} from "lucide-react";

interface HeaderProps {
  currentTab: string;
  isDiscovering: boolean;
  onRunDiscovery: () => void;
  onRefresh: () => void;
  targetCity: string;
}

export default function Header({
  currentTab,
  isDiscovering,
  onRunDiscovery,
  onRefresh,
  targetCity,
}: HeaderProps) {
  const getTabTitle = () => {
    switch (currentTab) {
      case "overview":
        return {
          title: "Elevate Digital Hospital Lead Dashboard",
          subtitle: "Automated discovery of 5–25 bed independent Indian hospitals & verified emails",
        };
      case "leads":
        return {
          title: "Qualified Hospital Directory",
          subtitle: "Pre-screened hospitals with confirmed bed capacity and verified public emails",
        };
      case "geo":
        return {
          title: "Geographic Configuration & City Rotation",
          subtitle: "Target cities across India, daily discovery targets, and bed thresholds",
        };
      case "history":
        return {
          title: "Discovery Engine History & Audit Logs",
          subtitle: "Complete chronological audit trail of automated and manual discovery cycles",
        };
      case "pitch":
        return {
          title: "Elevate Digital Outreach & Pitch Angles",
          subtitle: "Website audits and Hospital Sathi OS modernization opportunities",
        };
      default:
        return {
          title: "Hospital Lead Automation",
          subtitle: "Elevate Digital daily hospital prospect engine",
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Globe2 className="w-3 h-3 text-blue-600" />
            India
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          title="Refresh Data"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <a
          href="/api/leads/export?format=csv"
          download
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export CSV
        </a>

        <a
          href="/api/leads/export?format=excel"
          download
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-semibold shadow-2xs transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          Export Excel (.xlsx)
        </a>

        <button
          onClick={onRunDiscovery}
          disabled={isDiscovering}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all ${
            isDiscovering
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#0c1838] hover:bg-[#162758] active:scale-95 shadow-blue-900/20"
          }`}
        >
          {isDiscovering ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              Discovering Leads...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Run Discovery Now
            </>
          )}
        </button>
      </div>
    </header>
  );
}
