"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Filter, ShieldCheck, Activity, BarChart, Server } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status?.replace('_', ' ')}
      </span>
    );
  };

  const getHealthDot = (status: string, breached: boolean) => {
    if (status === 'delivered') return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>;
    if (breached) return <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse"></span>;
    return <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground mt-1">Track active deployments, SLAs, and cross-department workflows.</p>
        </div>
        <Link href="/dashboard/projects/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
          + New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Deployments", value: projects.filter(p => p.status === 'active').length, icon: <Server className="text-blue-500" /> },
          { label: "SLA Breached", value: projects.filter(p => p.slaBreached).length, icon: <BarChart className="text-destructive" /> },
          { label: "Pending Audit", value: projects.filter(p => p.auditStatus === 'pending').length, icon: <ShieldCheck className="text-amber-500" /> },
          { label: "Pending QC", value: projects.filter(p => p.qcStatus === 'pending').length, icon: <Activity className="text-purple-500" /> },
        ].map((stat, i) => (
          <div key={i} className="p-4 border rounded-xl bg-card shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-muted rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search projects by name or ID..." 
              className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
              <Filter size={16} className="mr-2" />
              All Statuses
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">SLA Deadline</th>
                <th className="px-6 py-4 font-medium">Health</th>
                <th className="px-6 py-4 font-medium">Audit / QC</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex justify-center mb-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No active projects. Projects are generated automatically from Sales Orders.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/projects/${project.id}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.orderRef} • {project.category.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{project.customerName}</div>
                      <div className="text-xs text-muted-foreground">{project.companyName}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {project.dueDate ? format(new Date(project.dueDate), 'MMM dd, yyyy') : 'TBD'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getHealthDot(project.status, project.slaBreached)}
                        <span className="text-xs capitalize">{project.slaBreached ? 'Breached' : project.status === 'delivered' ? 'Completed' : 'On Track'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${project.auditStatus === 'passed' ? 'border-emerald-500 text-emerald-600' : 'border-border text-muted-foreground'}`}>
                          A: {project.auditStatus || 'Pending'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${project.qcStatus === 'approved' ? 'border-emerald-500 text-emerald-600' : 'border-border text-muted-foreground'}`}>
                          Q: {project.qcStatus || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
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
