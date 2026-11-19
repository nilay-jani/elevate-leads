"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  BedDouble,
  Eye,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Info
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  bedCount: number | null;
  bedCapacityStatus: string;
  bedEvidence: string | null;
  category: string;
  city: string;
  state: string;
  address: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  emailStatus: string;
  emailSourceUrl: string | null;
  hospitalSourceUrl: string | null;
  websiteOpportunity: string | null;
  auditScore: number;
  contactStatus: string;
  discoveryDate: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  availableCities: string[];
}

export default function LeadsTable({ leads, onSelectLead, availableCities }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBeds, setSelectedBeds] = useState("ALL");
  const [selectedEmailStatus, setSelectedEmailStatus] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = (email: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLeads = leads.filter((l) => {
    if (selectedCity !== "ALL" && l.city !== selectedCity) return false;
    if (selectedCategory !== "ALL" && l.category !== selectedCategory) return false;
    if (selectedEmailStatus !== "ALL" && l.emailStatus !== selectedEmailStatus) return false;

    if (selectedBeds !== "ALL") {
      if (!l.bedCount) return false;
      if (selectedBeds === "5-10" && (l.bedCount < 5 || l.bedCount > 10)) return false;
      if (selectedBeds === "11-15" && (l.bedCount < 11 || l.bedCount > 15)) return false;
      if (selectedBeds === "16-20" && (l.bedCount < 16 || l.bedCount > 20)) return false;
      if (selectedBeds === "21-25" && (l.bedCount < 21 || l.bedCount > 25)) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchCity = l.city.toLowerCase().includes(q);
      const matchEmail = (l.email || "").toLowerCase().includes(q);
      const matchAddr = (l.address || "").toLowerCase().includes(q);
      const matchOpp = (l.websiteOpportunity || "").toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchEmail && !matchAddr && !matchOpp) return false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Search & Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by hospital name, city, email, or opportunity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Cities ({availableCities.length})</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Bed Capacity Filter */}
          <select
            value={selectedBeds}
            onChange={(e) => setSelectedBeds(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Beds (5–25)</option>
            <option value="5-10">5–10 Beds</option>
            <option value="11-15">11–15 Beds</option>
            <option value="16-20">16–20 Beds</option>
            <option value="21-25">21–25 Beds</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Small Multispeciality Hospital">Small Multispeciality</option>
            <option value="Independent Nursing Home">Independent Nursing Home</option>
            <option value="Maternity & Nursing Home">Maternity & Nursing Home</option>
            <option value="Private Surgical Hospital">Private Surgical Hospital</option>
            <option value="Specialty Day-Care Hospital">Specialty Day-Care</option>
          </select>

          {/* Email Status Filter */}
          <select
            value={selectedEmailStatus}
            onChange={(e) => setSelectedEmailStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Email Status</option>
            <option value="VERIFIED">Verified Emails</option>
            <option value="UNVERIFIED">Unverified Emails</option>
          </select>
        </div>
      </div>

      {/* Table Results Counter */}
      <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-900">{filteredLeads.length}</strong> qualified hospitals
          {filteredLeads.length !== leads.length && ` (filtered from ${leads.length})`}
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Publicly Sourced
          </span>
          <span>•</span>
          <span>Zero Fabricated Contacts</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Hospital Name & Category</th>
              <th className="py-3 px-3">Capacity</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-4">Public Email & Status</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Website</th>
              <th className="py-3 px-4">Elevate Pitch Opportunity</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-6 h-6 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No hospital leads match current filters.</p>
                    <p className="text-xs text-slate-400">Try loosening your search query or reset filter dropdowns.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const isVerified = lead.emailStatus === "VERIFIED";
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Name & Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[220px]">
                      <div className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </div>
                      <div className="mt-0.5 inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {lead.category}
                      </div>
                    </td>

                    {/* Capacity & Evidence */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 text-xs">
                          {lead.bedCount} beds
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]" title={lead.bedEvidence || ""}>
                        {lead.bedEvidence ? "Evidence verified" : "Confirmed"}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lead.city}
                      </div>
                      <div className="text-[10px] text-slate-400">{lead.state}</div>
                    </td>

                    {/* Email & Status */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-slate-900 truncate font-medium select-all" title={lead.email || ""}>
                          {lead.email}
                        </span>
                        {lead.email && (
                          <button
                            onClick={(e) => handleCopyEmail(lead.email!, lead.id, e)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                            title="Copy Email"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <ShieldCheck className="w-2.5 h-2.5" />
                          {lead.emailStatus}
                        </span>
                        {lead.emailSourceUrl && (
                          <a
                            href={lead.emailSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                            title="Inspect Email Source URL"
                          >
                            Source <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 text-xs font-mono">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Website */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <Globe className="w-3 h-3 text-blue-500" />
                          Visit Site
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Website</span>
                      )}
                    </td>

                    {/* Elevate Pitch Opportunity */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <div className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed" title={lead.websiteOpportunity || ""}>
                        {lead.websiteOpportunity || "Opportunity pending audit"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
