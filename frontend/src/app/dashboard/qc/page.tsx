"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Activity, Search, Filter, CheckCircle2, XCircle, Clock, Undo2, Stethoscope } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function QcPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQc = async () => {
      try {
        const res = await api.get("/qc");
        setRecords(res.data);
      } catch (error) {
        console.error("Failed to fetch QC", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQc();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (status === "rejected") return <XCircle className="text-destructive" size={18} />;
    if (status === "sent_back") return <Undo2 className="text-amber-500" size={18} />;
    return <Clock className="text-blue-500" size={18} />;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control Gatekeeper</h1>
          <p className="text-muted-foreground mt-1">Final review and sign-off before marking deployments as Delivered.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search QC requests..." 
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
                <th className="px-6 py-4 font-medium">Project Target</th>
                <th className="px-6 py-4 font-medium">Requested On</th>
                <th className="px-6 py-4 font-medium">Connectivity</th>
                <th className="px-6 py-4 font-medium">Resource Metrics</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex justify-center mb-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    Loading QC records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <Stethoscope size={32} className="mx-auto mb-3 opacity-20" />
                    No QC requests found in the pipeline.
                  </td>
                </tr>
              ) : (
                records.map((qc) => (
                  <tr key={qc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      Project ID: {qc.projectId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(qc.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      {qc.connectivityVerified ? <span className="text-emerald-500 font-medium">Verified</span> : <span className="text-amber-500">Pending</span>}
                    </td>
                    <td className="px-6 py-4">
                      {qc.metricsValidated ? <span className="text-emerald-500 font-medium">Validated</span> : <span className="text-amber-500">Pending</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 capitalize font-medium">
                        {getStatusIcon(qc.status)}
                        <span>{qc.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm">
                        Gate Review
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
