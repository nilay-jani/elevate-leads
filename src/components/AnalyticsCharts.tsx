"use client";

import React from "react";
import {
  BarChart3,
  PieChart,
  BedDouble,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Target
} from "lucide-react";

interface AnalyticsChartsProps {
  cityDistribution: { city: string; count: number; verifiedCount: number }[];
  categoryDistribution: { category: string; count: number }[];
  bedCapacityDistribution: { range: string; count: number }[];
  totalLeads: number;
}

export default function AnalyticsCharts({
  cityDistribution,
  categoryDistribution,
  bedCapacityDistribution,
  totalLeads,
}: AnalyticsChartsProps) {
  const maxCityCount = Math.max(...cityDistribution.map((c) => c.count), 1);
  const maxBedCount = Math.max(...bedCapacityDistribution.map((b) => b.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* City Distribution */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">City-Wise Lead Distribution</h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {cityDistribution.length} Cities Active
            </span>
          </div>

          <div className="space-y-3">
            {cityDistribution.slice(0, 5).map((item, idx) => {
              const percentage = Math.round((item.count / maxCityCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.city}</span>
                    <span className="text-slate-500 font-medium">
                      <strong className="text-slate-900">{item.count}</strong> leads ({item.verifiedCount} verified)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rotates automatically across configured cities daily</span>
          <span className="font-semibold text-blue-600">30 leads/day</span>
        </div>
      </div>

      {/* Bed Capacity Distribution */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-700">
                <BedDouble className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Bed Capacity Brackets (5–25 Beds)</h2>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Strictly ≤ 25 Beds
            </span>
          </div>

          <div className="space-y-3">
            {bedCapacityDistribution.map((item, idx) => {
              const percentage = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {item.range}
                    </span>
                    <span className="text-slate-500 font-medium">
                      <strong className="text-slate-900">{item.count}</strong> hospitals ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((item.count / maxBedCount) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Excludes large corporate chains and medical colleges</span>
          <span className="text-purple-600 font-semibold">100% Independent</span>
        </div>
      </div>

      {/* Elevate Strategy & Category Breakdown */}
      <div className="bg-[#0c1838] text-white rounded-xl p-5 border border-[#192b58] shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-300">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Elevate Outreach Target Strategy</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              High Conversion
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-[#14234c] border border-[#1c3268]">
              <div className="font-semibold text-blue-200 mb-0.5">Primary Target: 10–25 Bed Nursing Homes</div>
              <div className="text-[11px] text-slate-400">
                Small private hospitals still managing admissions on paper or basic spreadsheets. Prime candidates for Hospital Sathi OS + OPD Booking.
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#14234c] border border-[#1c3268]">
              <div className="font-semibold text-blue-200 mb-0.5">Verified Decision-Maker Channels</div>
              <div className="text-[11px] text-slate-400">
                Only contacting official desk emails (info@, contact@, admin@). Never spamming patient IDs or guessing unverified domains.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1b2f63] flex items-center justify-between text-[11px] text-slate-400">
          <span>Manual review before sending outreach</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Pitch
          </span>
        </div>
      </div>
    </div>
  );
}
