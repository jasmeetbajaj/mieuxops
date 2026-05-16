"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    customerName: "",
    companyName: "",
    orderRef: "",
    category: "software_deployment",
    priority: "medium",
    environment: "production",
    dueDate: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/projects", formData);
      router.push("/dashboard/projects");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create project. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/dashboard/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-1">Manually initialize a new project deployment outside of the standard sales order flow.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm max-w-3xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name <span className="text-destructive">*</span></label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Enterprise EDR Deployment"
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Reference (Optional)</label>
              <input
                type="text"
                name="orderRef"
                value={formData.orderRef}
                onChange={handleChange}
                placeholder="e.g., SO-2026-0421"
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Contact Name <span className="text-destructive">*</span></label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name <span className="text-destructive">*</span></label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="software_deployment">Software Deployment</option>
                <option value="infrastructure_setup">Infrastructure Setup</option>
                <option value="security_audit">Security Audit</option>
                <option value="cloud_migration">Cloud Migration</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
                <option value="dr">Disaster Recovery (DR)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a brief overview of the deployment objectives..."
              className="w-full p-3 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Link href="/dashboard/projects" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors mr-2">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
