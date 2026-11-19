"use client";

import React from "react";
import {
  Building,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldCheck
} from "lucide-react";

interface KpiCardsProps {
  stats: {
    totalDiscovered: number;
    todayNewLeads: number;
    verifiedEmails: number;
    unverifiedEmails: number;
    missingEmails: number;
    confirmedBedCapacity: number;
    verifiedPercentage: number;
  };
  geoConfig: {
    targetCountry: string;
    dailyTarget: number;
    maxBeds: number;
    currentCity: string;
    nextRunTime: string;
  };
}

export default function KpiCards({ stats, geoConfig }: KpiCardsProps) {
  const cards = [
    {
      title: "Total Hospitals Discovered",
      value: stats.totalDiscovered,
      subtext: "Independent 5–25 bed facilities",
      icon: Building,
      badge: "In Database",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accent: "text-blue-600",
    },
    {
      title: "Today's New Leads",
      value: stats.todayNewLeads,
      subtext: `Target: ${geoConfig.dailyTarget} qualified / day`,
      icon: Sparkles,
      badge: stats.todayNewLeads > 0 ? "Fresh Today" : "Awaiting 8 AM",
      badgeColor: stats.todayNewLeads > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200",
      accent: "text-indigo-600",
    },
    {
      title: "Verified Public Emails",
      value: stats.verifiedEmails,
      subtext: `${stats.verifiedPercentage}% verified rate (no guessing)`,
      icon: ShieldCheck,
      badge: "100% Legitimate",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "text-emerald-600",
    },
    {
      title: "Confirmed Bed Capacity",
      value: stats.confirmedBedCapacity,
      subtext: `Filtered ≤ ${geoConfig.maxBeds} beds strictly`,
      icon: BedDouble,
      badge: "Evidence Verified",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "text-purple-600",
    },
    {
      title: "Missing / Excluded Emails",
      value: stats.missingEmails,
      subtext: "Excluded from qualified lead count",
      icon: AlertCircle,
      badge: "Zero Spam Rule",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "text-amber-600",
    },
    {
      title: "Active Rotation City",
      value: geoConfig.currentCity.split(",")[0],
      subtext: `Next run at ${geoConfig.nextRunTime}`,
      icon: MapPin,
      badge: "IST Scheduled",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      accent: "text-sky-600",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <div
                  className={`text-2xl font-extrabold tracking-tight text-slate-900 ${
                    card.isText ? "text-lg truncate max-w-[140px]" : ""
                  }`}
                >
                  {card.value}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">{card.subtext}</span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${card.accent}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
