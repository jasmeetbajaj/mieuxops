"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Activity, Search, Filter, History, User, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/activity-logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes("create")) return <CheckCircle className="text-emerald-500" size={16} />;
    if (action.includes("update") || action.includes("approve")) return <Activity className="text-blue-500" size={16} />;
    if (action.includes("delete") || action.includes("reject")) return <AlertTriangle className="text-destructive" size={16} />;
    return <FileText className="text-gray-500" size={16} />;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Immutable audit trail of all platform actions and gatekeeper decisions.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search by entity ID, user, or action..." 
              className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
              <User size={16} className="mr-2" />
              Users
            </button>
            <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
              <Filter size={16} className="mr-2" />
              Entities
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <History size={48} className="mb-4 opacity-20" />
              <p>No activity logs found.</p>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {logs.map((log) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm capitalize">{log.action.replace('_', ' ')}</span>
                      <time className="text-xs font-medium text-muted-foreground">{format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}</time>
                    </div>
                    <p className="text-sm text-foreground/80 leading-snug">
                      <span className="font-medium">{log.userEmail || 'System'}</span> performed this action on <span className="font-semibold">{log.entityType}</span>.
                    </p>
                    <div className="mt-2 text-xs font-mono text-muted-foreground bg-muted p-2 rounded-md truncate">
                      Entity ID: {log.entityId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
