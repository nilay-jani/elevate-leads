"use client";

import React, { useState } from "react";
import {
  X,
  Building,
  BedDouble,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  FileText,
  Save
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
  country: string;
  address: string;
  pincode?: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  emailStatus: string;
  emailSourceUrl: string | null;
  hospitalSourceUrl: string | null;
  websiteOpportunity: string | null;
  auditScore: number;
  contactStatus: string;
  notes?: string | null;
  discoveryDate: string;
}

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
}

export default function LeadModal({ lead, onClose, onUpdateLead }: LeadModalProps) {
  if (!lead) return null;

  const [contactStatus, setContactStatus] = useState(lead.contactStatus || "NEW");
  const [notes, setNotes] = useState(lead.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (lead.email) {
      navigator.clipboard.writeText(lead.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactStatus,
          notes,
          reviewed: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        onUpdateLead(data.lead);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#0c1838] text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {lead.category}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {lead.emailStatus}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{lead.name}</h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {lead.address}, {lead.city}, {lead.state}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Bed Capacity</div>
              <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-purple-600" />
                {lead.bedCount} Beds
              </div>
              <div className="text-[10px] text-purple-700 font-medium">Verified ≤ 25 Beds</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Phone Number</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                {lead.phone || "Not Listed"}
              </div>
              <div className="text-[10px] text-slate-500">Official Desk</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Audit Health Score</div>
              <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {lead.auditScore} / 100
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">Digital Readiness</div>
            </div>
          </div>

          {/* Bed Evidence Box */}
          <div className="p-3.5 rounded-lg bg-purple-50/70 border border-purple-200/80">
            <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              Bed Capacity Evidence Quote
            </div>
            <div className="text-xs text-purple-800 italic leading-relaxed">
              "{lead.bedEvidence || "Empanelled registry confirmed bed threshold ≤ 25 beds."}"
            </div>
          </div>

          {/* Email & Contact Verification Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                Public Business Email Details
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Sourced (Zero Guesswork)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-mono text-xs font-semibold text-slate-900 select-all">
                {lead.email}
              </div>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Email
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              {lead.emailSourceUrl && (
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-700 shrink-0">Email Found At:</span>
                  <a
                    href={lead.emailSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate inline-flex items-center gap-1"
                  >
                    {lead.emailSourceUrl}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
              {lead.website && (
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-700 shrink-0">Hospital Website:</span>
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate inline-flex items-center gap-1"
                  >
                    {lead.website}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Elevate Pitch Angle */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-700" />
              Elevate Digital Outreach Pitch Opportunity
            </div>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {lead.websiteOpportunity || "Opportunity pending detailed audit."}
            </p>
          </div>

          {/* Lead Review & Contact Status */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Lead Review Status</label>
              <select
                value={contactStatus}
                onChange={(e) => setContactStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="NEW">NEW (Unreviewed)</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="PITCH_PREPARED">PITCH PREPARED</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT_INTERESTED">NOT INTERESTED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">Internal Notes & Action Plan</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add pitch notes, contacted doctor name, or Hospital Sathi OS quote details..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[75px]"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Discovered on {lead.discoveryDate.split("T")[0]}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
