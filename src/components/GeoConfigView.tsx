"use client";

import React, { useState } from "react";
import {
  MapPin,
  Save,
  Plus,
  Trash2,
  RotateCw,
  Globe,
  BedDouble,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface CityConfig {
  name: string;
  state: string;
  enabled: boolean;
  priority: number;
  targetCount: number;
}

interface GeoConfigViewProps {
  initialConfig: any;
  onConfigSaved: () => void;
}

export default function GeoConfigView({ initialConfig, onConfigSaved }: GeoConfigViewProps) {
  const [dailyTarget, setDailyTarget] = useState(initialConfig.dailyTarget || 30);
  const [maxBeds, setMaxBeds] = useState(initialConfig.maxBeds || 25);
  const [minBeds, setMinBeds] = useState(initialConfig.minBeds || 5);
  const [autoRotate, setAutoRotate] = useState(initialConfig.autoRotate ?? true);
  const [activeCities, setActiveCities] = useState<CityConfig[]>(initialConfig.activeCities || []);
  const [newCityName, setNewCityName] = useState("");
  const [newCityState, setNewCityState] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleCity = (index: number) => {
    const updated = [...activeCities];
    updated[index].enabled = !updated[index].enabled;
    setActiveCities(updated);
  };

  const handleRemoveCity = (index: number) => {
    const updated = activeCities.filter((_, i) => i !== index);
    setActiveCities(updated);
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim() || !newCityState.trim()) return;

    setActiveCities([
      ...activeCities,
      {
        name: newCityName.trim(),
        state: newCityState.trim(),
        enabled: true,
        priority: activeCities.length + 1,
        targetCount: dailyTarget,
      },
    ]);
    setNewCityName("");
    setNewCityState("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyTarget,
          maxBeds,
          minBeds,
          autoRotate,
          activeCities,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        onConfigSaved();
      }
    } catch (err) {
      console.error("Config save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Parameter Cards */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Automation Parameters & Thresholds</h2>
            <p className="text-xs text-slate-500">Configure target country, daily lead goals, and bed capacity boundaries.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Settings"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Country</label>
            <input
              type="text"
              value="India"
              disabled
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Fixed to Indian healthcare market</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Daily Qualified Lead Target</label>
            <input
              type="number"
              min="5"
              max="100"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(parseInt(e.target.value, 10))}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 30 qualified hospitals / day</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Maximum Bed Limit</label>
            <input
              type="number"
              min="10"
              max="50"
              value={maxBeds}
              onChange={(e) => setMaxBeds(parseInt(e.target.value, 10))}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Strictly ≤ 25 beds (filters out corporate)</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1">Daily City Rotation</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="autoRotate"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoRotate" className="text-xs font-semibold text-slate-800 cursor-pointer">
                Auto-Rotate Cities Daily
              </label>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Rotates to next city at 08:00 AM IST</span>
          </div>
        </div>
      </div>

      {/* City Rotation Manager */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Configured Cities & Rotation Pipeline</h2>
            <p className="text-xs text-slate-500">
              The engine automatically rotates between these cities to gather 30 fresh leads daily without duplicate overlap.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {activeCities.filter((c) => c.enabled).length} Cities Active
          </span>
        </div>

        {/* Add City Form */}
        <form onSubmit={handleAddCity} className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="text"
            placeholder="City Name (e.g. Kolhapur, Udaipur, Solapur)"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="State (e.g. Maharashtra, Rajasthan)"
            value={newCityState}
            onChange={(e) => setNewCityState(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0c1838] hover:bg-[#162758] text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Rotation
          </button>
        </form>

        {/* Cities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Target/Run</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCities.map((city, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {city.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{city.state}</td>
                  <td className="py-3 px-3 text-slate-800 font-semibold">{city.targetCount || dailyTarget} hospitals</td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCity(idx)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        city.enabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {city.enabled ? "Active in Rotation" : "Paused"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove City"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
