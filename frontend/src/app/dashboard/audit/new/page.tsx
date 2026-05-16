"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, Loader2, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CHECKLIST_ITEMS = [
  { id: "cpuRamVerified", label: "CPU & RAM Specifications Verified" },
  { id: "osVerified", label: "Operating System Version & License Verified" },
  { id: "ipValidated", label: "IP Address Configuration Validated" },
  { id: "firewallRules", label: "Firewall Rules & Ports Hardened" },
  { id: "backupStatus", label: "Automated Backup Configured" },
  { id: "antivirusStatus", label: "Antivirus / EDR Agent Installed" },
  { id: "monitoringStatus", label: "Monitoring Tools Configured" },
  { id: "sslValidated", label: "SSL Certificates Installed" },
  { id: "tsPlusValidated", label: "TSPlus/Remote Access Hardened" },
  { id: "updateStatus", label: "OS Updates Applied" },
  { id: "patchStatus", label: "Latest Security Patches Installed" },
  { id: "securityHardening", label: "General Security Hardening Applied" },
  { id: "passwordPolicy", label: "Strong Password Policy Enforced" },
  { id: "documentationValidated", label: "Deployment Documentation Validated" },
];

export default function NewAuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  const [formData, setFormData] = useState<Record<string, any>>({
    projectId: "",
    observations: "",
  });

  // Initialize checklist booleans to false
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects?status=active");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setFetchingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleToggle = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      setError("Please select a target project to audit.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/audit", { ...formData, ...checklist });
      router.push("/dashboard/audit");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create audit record.");
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    const passed = Object.values(checklist).filter(Boolean).length;
    const total = CHECKLIST_ITEMS.length;
    return Math.round((passed / total) * 100);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/dashboard/audit" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Audit Center
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Perform Security Audit</h1>
        <p className="text-muted-foreground mt-1">Review deployment checklists and enforce infrastructure security gates.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm max-w-4xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="p-6 md:w-2/3 border-r border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Project <span className="text-destructive">*</span></label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">-- Select Active Project --</option>
                {!fetchingProjects && projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.customerName})</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-medium mb-4">Compliance Checklist</h3>
              <div className="grid grid-cols-1 gap-3">
                {CHECKLIST_ITEMS.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleToggle(item.id)}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${checklist[item.id] ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'}`}
                  >
                    {checklist[item.id] ? (
                      <CheckCircle className="text-primary mr-3 shrink-0" size={20} />
                    ) : (
                      <Circle className="text-muted-foreground mr-3 shrink-0" size={20} />
                    )}
                    <span className={`text-sm ${checklist[item.id] ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-medium">Observations / Remarks</label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
                placeholder="Any deviations or notes during the audit..."
                className="w-full p-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <Link href="/dashboard/audit" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors mr-2">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center disabled:opacity-70"
              >
                {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
                Submit Audit Record
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live Score */}
        <div className="p-6 md:w-1/3 bg-muted/20 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Live Score</h3>
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Simple circular representation */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-border"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * calculateScore()) / 100}
                className={`transition-all duration-500 ease-out ${calculateScore() >= 90 ? 'text-emerald-500' : calculateScore() >= 70 ? 'text-amber-500' : 'text-destructive'}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{calculateScore()}%</span>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Checks Passed</p>
            <p className="text-2xl font-semibold">
              {Object.values(checklist).filter(Boolean).length} <span className="text-muted-foreground text-lg">/ {CHECKLIST_ITEMS.length}</span>
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
