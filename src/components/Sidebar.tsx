"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  History,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Stethoscope
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  totalLeads: number;
  verifiedCount: number;
  currentCity: string;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  totalLeads,
  verifiedCount,
  currentCity,
}: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Dashboard & KPIs", icon: LayoutDashboard },
    { id: "leads", label: "Qualified Hospital Leads", icon: Building2, count: totalLeads },
    { id: "geo", label: "City Rotation & Geo", icon: MapPin },
    { id: "history", label: "Discovery Engine Runs", icon: History },
    { id: "pitch", label: "Elevate Pitch Angles", icon: Stethoscope },
  ];

  return (
    <aside className="w-64 bg-[#0c1838] text-slate-200 border-r border-[#192b58] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#192b58]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Elevate Digital
              </div>
              <div className="text-[11px] font-medium text-blue-300/80 tracking-wide uppercase">
                Hospital Lead OS
              </div>
            </div>
          </div>

          <div className="mt-3.5 px-3 py-2 rounded-md bg-[#132247] border border-[#1f356d] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs text-slate-300 font-medium truncate">
              Target: <span className="text-white font-semibold">{currentCity}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:bg-[#14234c] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-blue-800 text-white" : "bg-[#182955] text-slate-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Daily Schedule Pill */}
      <div className="p-4 border-t border-[#192b58] space-y-3">
        <div className="p-3 rounded-lg bg-[#111e40] border border-[#1b2f63] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-blue-300">
              <Clock className="w-3.5 h-3.5" />
              Daily Automation
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              08:00 AM IST
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Targeting <strong className="text-slate-200">5–25 bed</strong> independent nursing homes in India.
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {verifiedCount} Verified Emails
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
}
