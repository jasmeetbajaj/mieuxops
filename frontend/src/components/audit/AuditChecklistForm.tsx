"use client";

import React, { useState } from "react";
import { ShieldAlert, Check, X, Send } from "lucide-react";
import { api } from "@/lib/api";

const CHECKLIST_ITEMS = [
  { id: "cpuRamVerified", label: "CPU & RAM Specifications Verified" },
  { id: "osVerified", label: "OS Template and Version Validated" },
  { id: "ipValidated", label: "IP Addressing & Subnets Confirmed" },
  { id: "firewallRules", label: "Firewall Ingress/Egress Rules Active" },
  { id: "backupStatus", label: "Backup Policy Assigned and Tested" },
  { id: "antivirusStatus", label: "Enterprise Antivirus Deployed" },
  { id: "monitoringStatus", label: "Zabbix/Prometheus Agents Active" },
  { id: "sslValidated", label: "SSL/TLS Certificates Installed" },
  { id: "tsPlusValidated", label: "TSPlus Configuration Complete" },
  { id: "updateStatus", label: "System Updates / Patches Applied" },
  { id: "securityHardening", label: "CIS Security Hardening Profile Applied" },
  { id: "passwordPolicy", label: "Default Passwords Changed & Rotated" },
  { id: "documentationValidated", label: "LLD & Topology Docs Uploaded" },
];

export const AuditChecklistForm = ({ projectId, onComplete }: { projectId: string, onComplete: () => void }) => {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const complianceScore = Math.round((Object.values(checks).filter(Boolean).length / CHECKLIST_ITEMS.length) * 100) || 0;

  const handleToggle = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { projectId, auditorRemarks: remarks, ...checks };
      await api.post("/audit", payload);
      onComplete();
    } catch (error) {
      console.error("Audit submission failed", error);
      alert("Failed to submit audit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 text-left">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            <ShieldAlert className="mr-2 text-primary" size={24} />
            Security & Compliance Audit
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Complete the mandatory 14-point checklist.</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Compliance Score</div>
          <div className={`text-3xl font-extrabold ${complianceScore >= 90 ? 'text-emerald-500' : complianceScore >= 70 ? 'text-amber-500' : 'text-destructive'}`}>
            {complianceScore}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        {CHECKLIST_ITEMS.map((item) => (
          <label key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group">
            <div className="mt-0.5">
              <div 
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checks[item.id] ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30 group-hover:border-primary/50'}`}
              >
                {checks[item.id] && <Check size={14} />}
              </div>
              <input type="checkbox" className="hidden" checked={!!checks[item.id]} onChange={() => handleToggle(item.id)} />
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold mb-2 block">Auditor Remarks (Optional)</label>
        <textarea 
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full h-24 bg-background border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
          placeholder="Note any deviations, accepted risks, or follow-up tasks..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md flex items-center disabled:opacity-50"
        >
          {submitting ? "Processing..." : (
            <>
              <Send size={18} className="mr-2" /> Submit Official Audit Log
            </>
          )}
        </button>
      </div>
    </div>
  );
};
