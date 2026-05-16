"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExecutiveCharts } from "@/components/dashboard/ExecutiveCharts";
import { api } from "@/lib/api";
import { Clock, Briefcase, FileText, CheckCircle2, AlertTriangle, ArrowRight, Activity } from "lucide-react";
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
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <Activity className="mr-3 text-primary" size={28} />
          Executive Command Center
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Real-time intelligence on operational performance and SLA tracking.</p>
      </div>

      {/* SLA Engine & Global Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-2 -bottom-2 text-primary/10"><Briefcase size={80} /></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Active Projects
            </h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black text-foreground tracking-tight">{summary?.activeProjects || 0}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center shadow-sm">
                Target hit
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-2 -bottom-2 text-blue-500/10"><Clock size={80} /></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Pending Tasks
            </h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black text-foreground tracking-tight">{summary?.pendingTasks || 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-destructive/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-2 -bottom-2 text-destructive/10"><AlertTriangle size={80} /></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              SLA Breaches
            </h3>
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black text-destructive tracking-tight">{summary?.slaBreached || 0}</span>
              <span className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded-full flex items-center shadow-sm">
                Requires attention
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-2 -bottom-2 text-emerald-500/10"><CheckCircle2 size={80} /></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Delivered YTD
            </h3>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black text-emerald-600 tracking-tight">{summary?.completedProjects || 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Module */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <ExecutiveCharts />
      </div>

      {/* Critical SLA Countdown List (Quick Action) */}
      <div className="mt-10 glass-panel rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <div className="flex justify-between items-center mb-6 border-b border-border pb-5">
          <div>
            <h2 className="text-xl font-bold flex items-center text-foreground">
              <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
              SLA Critical Watchlist
            </h2>
            <p className="text-sm text-muted-foreground mt-1 ml-5">Projects approaching SLA deadline within 48 hours.</p>
          </div>
          <Link href="/dashboard/projects" className="text-primary hover:text-primary/80 transition-colors text-sm font-semibold flex items-center bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg">
            View All Projects <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Mocking a list since we don't have the specific API built for this filtered view yet */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 border border-border rounded-xl bg-white/50 hover:bg-white hover:shadow-md hover:border-amber-500/30 transition-all cursor-pointer group">
              <div className="flex items-center space-x-5">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                  T-{24 * i}H
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-base">Project PRJ-202605-00{i}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">Waiting on Network Department - Subnet Allocation</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Deadline</div>
                <div className="text-sm font-medium bg-amber-50 text-amber-700 px-3 py-1 rounded-md border border-amber-100">
                  {format(new Date(Date.now() + 86400000 * i), 'MMM dd, HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
