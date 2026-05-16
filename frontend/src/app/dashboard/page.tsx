"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExecutiveCharts } from "@/components/dashboard/ExecutiveCharts";
import { api } from "@/lib/api";
import { Clock, Briefcase, FileText, CheckCircle2, AlertTriangle, ArrowRight, Activity, Filter, Settings2, Share, Plus } from "lucide-react";
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
      {/* Asana-style Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-2 font-medium">
          <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center">
            <Activity size={14} />
          </div>
          <span>Command Center /</span>
          <span className="text-foreground">Executive Overview</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            Executive Command Center
          </h1>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-secondary transition-colors">
              <Share size={14} className="mr-2" /> Share
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Plus size={14} className="mr-2" /> Add chart
            </button>
          </div>
        </div>
      </div>

      {/* SLA Engine & Global Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-card border border-border p-6 rounded-xl hover-lift">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">
            Completed tasks
          </h3>
          <div className="text-center py-4">
            <span className="text-5xl font-light text-foreground">{summary?.completedProjects || 0}</span>
          </div>
          <div className="mt-4 flex items-center justify-center text-xs font-medium text-primary">
            <Filter size={12} className="mr-1" /> 1 Filter
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl hover-lift">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">
            Incomplete tasks
          </h3>
          <div className="text-center py-4">
            <span className="text-5xl font-light text-foreground">{summary?.pendingTasks || 0}</span>
          </div>
          <div className="mt-4 flex items-center justify-center text-xs font-medium text-primary">
            <Filter size={12} className="mr-1" /> 1 Filter
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl hover-lift">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">
            Overdue tasks
          </h3>
          <div className="text-center py-4">
            <span className="text-5xl font-light text-foreground">{summary?.slaBreached || 0}</span>
          </div>
          <div className="mt-4 flex items-center justify-center text-xs font-medium text-primary">
            <Filter size={12} className="mr-1" /> 1 Filter
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl hover-lift">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">
            Total tasks
          </h3>
          <div className="text-center py-4">
            <span className="text-5xl font-light text-foreground">{summary?.activeProjects || 0}</span>
          </div>
          <div className="mt-4 flex items-center justify-center text-xs font-medium text-muted-foreground">
            <Filter size={12} className="mr-1" /> No Filters
          </div>
        </div>

      </div>

      {/* Charts Module */}
      <div className="mb-8">
        <ExecutiveCharts />
      </div>

      {/* Critical SLA Countdown List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[15px] font-semibold text-foreground flex items-center">
            SLA Critical Watchlist
          </h2>
          <Link href="/dashboard/projects" className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
            <Settings2 size={16} />
          </Link>
        </div>
        
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 group">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                  {24 * i}h
                </div>
                <div>
                  <h4 className="font-medium text-[14px] text-foreground hover:underline cursor-pointer">Project PRJ-202605-00{i}</h4>
                  <p className="text-[13px] text-muted-foreground">Waiting on Network Department</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-medium text-foreground">
                  {format(new Date(Date.now() + 86400000 * i), 'MMM dd')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
