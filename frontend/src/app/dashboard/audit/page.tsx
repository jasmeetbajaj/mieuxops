"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, AlertTriangle, FileSignature } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function AuditPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const res = await api.get("/audit");
        setAudits(res.data);
      } catch (error) {
        console.error("Failed to fetch audits", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "passed") return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (status === "failed") return <XCircle className="text-destructive" size={18} />;
    return <AlertTriangle className="text-amber-500" size={18} />;
  };

  const getScoreColor = (score: number) => {
    if (!score) return "text-gray-400";
    if (score >= 90) return "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20";
    if (score >= 70) return "text-amber-600 bg-amber-100 dark:bg-amber-500/20";
    return "text-destructive bg-destructive/10";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Compliance Audit</h1>
          <p className="text-muted-foreground mt-1">Review deployment checklists and enforce infrastructure security gates.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search audit records..." 
              className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
            <Filter size={16} className="mr-2" />
            Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Audit Target</th>
                <th className="px-6 py-4 font-medium">Date Initiated</th>
                <th className="px-6 py-4 font-medium text-center">Compliance Score</th>
                <th className="px-6 py-4 font-medium text-center">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex justify-center mb-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    Loading audit records...
                  </td>
                </tr>
              ) : audits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <FileSignature size={32} className="mx-auto mb-3 opacity-20" />
                    No audit records found.
                  </td>
                </tr>
              ) : (
                audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      Project ID: {audit.projectId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(audit.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded font-bold ${getScoreColor(audit.complianceScore)}`}>
                        {audit.complianceScore || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono">{audit.riskScore || 0} / 100</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 capitalize font-medium">
                        {getStatusIcon(audit.status)}
                        <span>{audit.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm">
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
