"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KpiCards from "@/components/KpiCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import LeadsTable from "@/components/LeadsTable";
import LeadModal from "@/components/LeadModal";
import GeoConfigView from "@/components/GeoConfigView";
import DiscoveryHistoryView from "@/components/DiscoveryHistoryView";
import PitchDeckView from "@/components/PitchDeckView";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [geoConfig, setGeoConfig] = useState<any>(null);
  const [cityDistribution, setCityDistribution] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [bedCapacityDistribution, setBedCapacityDistribution] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setGeoConfig(data.geoConfig);
        setCityDistribution(data.cityDistribution);
        setCategoryDistribution(data.categoryDistribution);
        setBedCapacityDistribution(data.bedCapacityDistribution);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads?pageSize=100");
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAll = async () => {
    await Promise.all([fetchStats(), fetchLeads()]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRunDiscovery = async () => {
    setIsDiscovering(true);
    setToastMessage("Initiating discovery cycle across target city registries...");
    try {
      const res = await fetch("/api/discovery/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        if (data.summary.qualifiedCount > 0) {
          setToastMessage(`Discovery completed! ${data.summary.qualifiedCount} new qualified hospital leads discovered in ${data.summary.city}! Added to database.`);
        } else {
          setToastMessage(`Discovery completed for ${data.summary.city}. Skipped ${data.summary.duplicatesSkipped} duplicates.`);
        }
        await loadAll();
      } else {
        setToastMessage("Discovery completed with no new unique leads.");
      }
    } catch (err: any) {
      setToastMessage("Discovery error: " + err.message);
    } finally {
      setIsDiscovering(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleUpdateLead = (updated: any) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
    fetchStats();
  };

  const availableCities = Array.from(new Set(leads.map((l) => l.city)));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalLeads={stats?.totalDiscovered || leads.length}
        verifiedCount={stats?.verifiedEmails || 0}
        currentCity={geoConfig?.currentCity?.split(",")[0] || "Nagpur"}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          isDiscovering={isDiscovering}
          onRunDiscovery={handleRunDiscovery}
          onRefresh={loadAll}
          targetCity={geoConfig?.currentCity || "Nagpur, Maharashtra"}
        />

        {/* Floating Notification Toast */}
        {toastMessage && (
          <div className="mx-8 mt-4 p-3.5 rounded-xl bg-[#0c1838] text-white border border-[#1b2f63] flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-slate-400 hover:text-white ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 p-8 space-y-6">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading hospital lead intelligence...</p>
            </div>
          ) : (
            <>
              {currentTab === "overview" && (
                <div className="space-y-6">
                  {stats && geoConfig && (
                    <KpiCards stats={stats} geoConfig={geoConfig} />
                  )}

                  <AnalyticsCharts
                    cityDistribution={cityDistribution}
                    categoryDistribution={categoryDistribution}
                    bedCapacityDistribution={bedCapacityDistribution}
                    totalLeads={stats?.totalDiscovered || leads.length}
                  />

                  {/* Quick Leads Preview Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Recent Discovered Leads</h2>
                        <p className="text-xs text-slate-500">Showing the latest verified 5–25 bed hospital prospects.</p>
                      </div>
                      <button
                        onClick={() => setCurrentTab("leads")}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        View All {leads.length} Leads
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <LeadsTable
                      leads={leads.slice(0, 10)}
                      onSelectLead={setSelectedLead}
                      availableCities={availableCities}
                    />
                  </div>
                </div>
              )}

              {currentTab === "leads" && (
                <div className="space-y-4">
                  <LeadsTable
                    leads={leads}
                    onSelectLead={setSelectedLead}
                    availableCities={availableCities}
                  />
                </div>
              )}

              {currentTab === "geo" && geoConfig && (
                <GeoConfigView
                  initialConfig={geoConfig}
                  onConfigSaved={loadAll}
                />
              )}

              {currentTab === "history" && (
                <DiscoveryHistoryView />
              )}

              {currentTab === "pitch" && (
                <PitchDeckView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Lead Details Modal / Drawer */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
        />
      )}
    </div>
  );
}
