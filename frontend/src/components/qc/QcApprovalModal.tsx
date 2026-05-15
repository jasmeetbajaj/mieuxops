"use client";

import React, { useState } from "react";
import { CheckCircle2, Undo2, XCircle, Settings, Send } from "lucide-react";
import { api } from "@/lib/api";

export const QcApprovalModal = ({ projectId, onClose, onComplete }: { projectId: string, onClose: () => void, onComplete: () => void }) => {
  const [status, setStatus] = useState<"approved" | "rejected" | "sent_back">("approved");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checks, setChecks] = useState({
    connectivity: false,
    metrics: false,
    backup: false,
  });

  const handleSubmit = async () => {
    if ((status === "rejected" || status === "sent_back") && !remarks) {
      alert("Remarks are mandatory when rejecting or sending back.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/qc", {
        projectId,
        status,
        qcRemarks: remarks,
        connectivityVerified: checks.connectivity,
        metricsValidated: checks.metrics,
      });
      onComplete();
    } catch (error) {
      console.error("QC submission failed", error);
      alert("Failed to submit QC review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b bg-muted/20">
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="mr-2 text-primary" size={24} />
            Quality Control Gate Review
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Final gatekeeper approval before marking the deployment as Delivered.</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Validation Checks */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Mandatory Validation</h3>
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded" checked={checks.connectivity} onChange={(e) => setChecks(p => ({...p, connectivity: e.target.checked}))} />
              <span className="text-sm font-medium">Connectivity Verified (Internal & External)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded" checked={checks.metrics} onChange={(e) => setChecks(p => ({...p, metrics: e.target.checked}))} />
              <span className="text-sm font-medium">Resource Metrics Validated (CPU/RAM allocs match order)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded" checked={checks.backup} onChange={(e) => setChecks(p => ({...p, backup: e.target.checked}))} />
              <span className="text-sm font-medium">Backup Integrity Confirmed</span>
            </label>
          </div>

          {/* Decision */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Gate Decision</h3>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setStatus("approved")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${status === 'approved' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-border hover:border-emerald-500/50'}`}
              >
                <CheckCircle2 size={28} className={status === 'approved' ? 'text-emerald-500' : 'text-muted-foreground'} />
                <span className="font-bold">Approve</span>
              </button>
              
              <button 
                onClick={() => setStatus("sent_back")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${status === 'sent_back' ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-border hover:border-amber-500/50'}`}
              >
                <Undo2 size={28} className={status === 'sent_back' ? 'text-amber-500' : 'text-muted-foreground'} />
                <span className="font-bold text-center leading-tight">Send Back<br/><span className="text-xs font-normal opacity-80">(Needs Fix)</span></span>
              </button>
              
              <button 
                onClick={() => setStatus("rejected")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${status === 'rejected' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:border-destructive/50'}`}
              >
                <XCircle size={28} className={status === 'rejected' ? 'text-destructive' : 'text-muted-foreground'} />
                <span className="font-bold">Reject</span>
              </button>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              QC Notes {status !== "approved" && <span className="text-destructive lowercase normal-case">* (Mandatory)</span>}
            </h3>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-24 bg-background border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
              placeholder={status === "approved" ? "Any final notes before delivery..." : "Please detail exactly what needs to be fixed..."}
            />
          </div>

        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg font-medium hover:bg-background transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting || (status === 'approved' && (!checks.connectivity || !checks.metrics || !checks.backup))}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center disabled:opacity-50"
          >
            {submitting ? "Processing..." : (
              <>
                <Send size={18} className="mr-2" /> Submit Decision
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
