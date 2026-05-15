"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, Save, Loader2, Building, Package, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

type OrderFormData = {
  customerName: string;
  companyName: string;
  customerEmail: string;
  customerPhone: string;
  projectType: string;
  projectCategory: string;
  environment: string;
  priority: string;
  startDate: string;
  deliveryDate: string;
  slaTat: string;
  deploymentOwner: string;
  salesRemarks: string;
};

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>();

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/orders", data);
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Failed to create order", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/orders" className="mr-4 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground text-sm">Initiate a new deployment and automatically spawn a project.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">
        {/* Customer Info Section */}
        <div className="bg-card border rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex items-center space-x-2 mb-6">
            <Building className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name *</label>
              <input {...register("customerName", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name *</label>
              <input {...register("companyName", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <input type="email" {...register("customerEmail")} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Phone</label>
              <input {...register("customerPhone")} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="bg-card border rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="flex items-center space-x-2 mb-6">
            <Package className="text-purple-500" size={20} />
            <h2 className="text-lg font-semibold">Deployment Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Type *</label>
              <select {...register("projectType", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="">Select type...</option>
                <option value="new_deployment">New Deployment</option>
                <option value="migration">Migration</option>
                <option value="upgrade">Upgrade</option>
                <option value="audit">Audit Only</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select {...register("projectCategory", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="">Select category...</option>
                <option value="app_server">App Server</option>
                <option value="db_server">DB Server</option>
                <option value="web_server">Web Server</option>
                <option value="tsplus">TSPlus</option>
                <option value="full_stack">Full Stack Solution</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment *</label>
              <select {...register("environment", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
                <option value="dr">Disaster Recovery (DR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SLA & Delivery Section */}
        <div className="bg-card border rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="text-emerald-500" size={20} />
            <h2 className="text-lg font-semibold">Timeline & SLA</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority *</label>
              <select {...register("priority", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SLA TAT *</label>
              <select {...register("slaTat", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="24h">24 Hours</option>
                <option value="48h">48 Hours</option>
                <option value="72h">72 Hours</option>
                <option value="1w">1 Week</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Date *</label>
              <input type="date" {...register("deliveryDate", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="col-span-1 md:col-span-3 space-y-2">
              <label className="text-sm font-medium">Sales Remarks</label>
              <textarea {...register("salesRemarks")} rows={3} className="w-full bg-background border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Any special instructions for the implementation team..."></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/orders" className="px-6 py-2 border rounded-lg font-medium hover:bg-secondary transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Process Order & Initialize Project
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
