"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Sparkles,
  Copy,
  Check,
  Send,
  BedDouble,
  MessageSquare,
  Globe,
  FileText
} from "lucide-react";

export default function PitchDeckView() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const templates = [
    {
      title: "Hospital Sathi OS (20–25 Bed HMS) Modernization Pitch",
      subject: "Upgrading inpatient bed tracking & digital OPD for {{Hospital Name}}",
      body: `Dear Management Team at {{Hospital Name}},

I came across {{Hospital Name}}'s dedicated inpatient healthcare setup in {{City}} ({{Bed Count}} beds).

Most nursing homes with 15–25 beds in {{State}} face friction managing walk-in OPD queues, manual paper admission registers, and shift cash handovers.

At Elevate Digital, we developed Hospital Sathi OS — a lightweight Hospital Management System built specifically for 20–25 bed Indian nursing homes:
• Visual 25-bed board (General, Semi-Private, ICU/HDU bed statuses)
• 30-second walk-in OPD registration & printed prescription generator
• Integrated billing with cash, UPI, and insurance/TPA ledger
• Zero heavy IT maintenance needed — runs instantly on any tablet or reception PC.

Would you be open to a brief 10-minute online walkthrough this week to see how it can streamline {{Hospital Name}}'s desk?

Warm regards,
Elevate Digital Healthcare Team
elevatedigital.in`,
    },
    {
      title: "Mobile Website & WhatsApp Appointment Booking Pitch",
      subject: "Quick feedback on {{Hospital Name}}'s website patient experience",
      body: `Hello Team {{Hospital Name}},

Our healthcare team was reviewing hospital web accessibility in {{City}} and noticed that patients visiting your website ({{Website}}) cannot easily schedule OPD consultations or inquire via WhatsApp on mobile devices.

Over 78% of Indian patients now search and book doctor visits directly from their smartphones. By adding:
1. A 1-click WhatsApp patient triage button
2. A live OPD doctor schedule & consultation request widget
3. Speed-optimized mobile design with Google Local Business verification

{{Hospital Name}} can easily capture 15–30 additional patient inquiries every week without recurring ad spend.

We would love to share a free 2-page modernization mockup customized with {{Hospital Name}}'s letterhead. May we send it across?

Best regards,
Elevate Digital Outreach Desk
elevatedigital.in`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#0c1838] text-white rounded-xl p-6 border border-[#192b58] shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Elevate Digital Pitch Playbook for 5–25 Bed Hospitals</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Independent hospitals and nursing homes in India (5–25 beds) have high patient trust but suffer from legacy paper workflows and outdated static websites. Elevate Digital solves both sides: Modern Digital Presence + Hospital Sathi OS.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <BedDouble className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Hospital Sathi OS (HMS)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tailor-made for 20–25 beds. Live bed occupancy board, OPD token queue, doctor diagnosis desk, and instant A4 Rx printing.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">WhatsApp Patient Desk</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automated WhatsApp receptionist answering OPD hours, consultation booking, test report delivery, and location directions.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Mobile Website & Local SEO</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lightning-fast mobile website redesign, SSL HTTPS certification, Google Business Profile ranking for local neighborhood searches.
          </p>
        </div>
      </div>

      {/* Outreach Templates */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personalized Outreach Email Templates</h3>
          <p className="text-xs text-slate-500">
            Copy and personalize these templates for verified leads. Never spam: review each lead before initiating contact.
          </p>
        </div>

        <div className="space-y-4">
          {templates.map((tmpl, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{tmpl.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">Subject: {tmpl.subject}</div>
                </div>
                <button
                  onClick={() => handleCopy(tmpl.body, idx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Template
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {tmpl.body}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
