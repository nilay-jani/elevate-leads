"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Terminal,
  RotateCw
} from "lucide-react";

interface DiscoveryRun {
  id: string;
  startedAt: string;
  completedAt: string | null;
  cityTarget: string;
  stateTarget: string;
  status: string;
  totalFound: number;
  qualifiedCount: number;
  verifiedEmailsCount: number;
  unverifiedEmailsCount: number;
  duplicatesSkipped: number;
  reportSummary: string | null;
  logs: { time: string; message: string }[];
}

export default function DiscoveryHistoryView() {
  const [runs, setRuns] = useState<DiscoveryRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discovery/history");
      const data = await res.json();
      if (data.success && data.runs) {
        setRuns(data.runs);
        if (data.runs.length > 0 && !expandedRunId) {
          setExpandedRunId(data.runs[0].id);
        }
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Discovery Engine History & Execution Logs</h2>
          <p className="text-xs text-slate-500">
            Immutable chronological records of daily scheduled and manual hospital discovery runs.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Refresh History
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading discovery runs...</div>
      ) : runs.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No discovery runs recorded yet.</div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const isExpanded = expandedRunId === run.id;
            return (
              <div
                key={run.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                  className="p-4 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer flex flex-wrap items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="p-1 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {run.cityTarget}, {run.stateTarget}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {run.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(run.startedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                      </div>
                    </div>
                  </div>

                  {/* Run Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">{run.qualifiedCount}</div>
                      <div className="text-[10px] text-slate-500">Qualified Leads</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-600">{run.verifiedEmailsCount}</div>
                      <div className="text-[10px] text-slate-500">Verified Emails</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-amber-600">{run.duplicatesSkipped}</div>
                      <div className="text-[10px] text-slate-500">Duplicates Skipped</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Log Output */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950 text-slate-200 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        Execution Trace Log (Run ID: {run.id})
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {run.reportSummary}
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto font-mono text-[11px] space-y-1 pr-2">
                      {run.logs && run.logs.length > 0 ? (
                        run.logs.map((log, lIdx) => {
                          const isLead = log.message.includes("[QUALIFIED LEAD");
                          const isDup = log.message.includes("[DUPLICATE SKIPPED]");
                          const isDisq = log.message.includes("[DISQUALIFIED]");

                          let colorClass = "text-slate-300";
                          if (isLead) colorClass = "text-emerald-400 font-semibold";
                          else if (isDup) colorClass = "text-amber-400/90";
                          else if (isDisq) colorClass = "text-rose-400/80";

                          return (
                            <div key={lIdx} className={`leading-relaxed ${colorClass}`}>
                              <span className="text-slate-600 mr-2">[{log.time.split("T")[1]?.slice(0, 8)}]</span>
                              {log.message}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-slate-500 italic">No detailed log events stored.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
