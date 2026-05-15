"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExecutiveCharts } from "@/components/dashboard/ExecutiveCharts";
import { api } from "@/lib/api";
import { Clock, Briefcase, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to load summary", error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Executive Command Center</h1>
        <p className="text-muted-foreground mt-1">Real-time intelligence on operational performance and SLA tracking.</p>
      </div>

      {/* SLA Engine & Global Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500"><Briefcase size={120} /></div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2 flex items-center">
            Active Projects
          </h3>
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-extrabold text-foreground">{summary?.activeProjects || 0}</span>
            <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              Target hit
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 group-hover:-rotate-12 transition-all duration-500"><Clock size={120} /></div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2 flex items-center">
            Pending Tasks
          </h3>
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-extrabold text-foreground">{summary?.pendingTasks || 0}</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-destructive transition-all duration-300 hover:shadow-glow-destructive animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-destructive group-hover:scale-110 group-hover:opacity-20 transition-all duration-500"><AlertTriangle size={120} /></div>
          <h3 className="text-sm font-semibold uppercase text-destructive mb-2 flex items-center">
            SLA Breaches
          </h3>
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-extrabold text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{summary?.slaBreached || 0}</span>
            <span className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 rounded-full flex items-center animate-pulse">
              Requires attention
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-emerald-500 transition-all duration-300 hover:shadow-glow-emerald animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500"><CheckCircle2 size={120} /></div>
          <h3 className="text-sm font-semibold uppercase text-emerald-500 mb-2 flex items-center">
            Delivered YTD
          </h3>
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-extrabold text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{summary?.completedProjects || 0}</span>
          </div>
        </div>

      </div>

      {/* Charts Module */}
      <ExecutiveCharts />

      {/* Critical SLA Countdown List (Quick Action) */}
      <div className="mt-8 bg-card border rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Clock className="mr-2 text-amber-500" size={24} /> 
              SLA Critical Watchlist
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Projects approaching SLA deadline within 48 hours.</p>
          </div>
          <Link href="/dashboard/projects" className="text-primary hover:underline text-sm font-medium flex items-center">
            View All Projects <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Mocking a list since we don't have the specific API built for this filtered view yet */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background hover:border-amber-500/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                  T-{24 * i}H
                </div>
                <div>
                  <h4 className="font-semibold">Project PRJ-202605-00{i}</h4>
                  <p className="text-sm text-muted-foreground">Waiting on Network Department - Subnet Allocation</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-600 dark:text-amber-500">Deadline</div>
                <div className="text-xs font-medium">{format(new Date(Date.now() + 86400000 * i), 'MMM dd, HH:mm')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
