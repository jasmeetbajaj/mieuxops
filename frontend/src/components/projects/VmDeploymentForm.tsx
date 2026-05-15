"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Server, HardDrive, Shield, Activity, Share2 } from "lucide-react";
import { api } from "@/lib/api";

type VmFormData = {
  vmName: string;
  osType: string;
  vcpuCount: number;
  ramGb: number;
  diskSpaceGb: number;
  vlanId: string;
  internalIp: string;
  publicIp?: string;
  firewallRules: string;
  backupPolicy: string;
  antivirusEnabled: boolean;
  monitoringEnabled: boolean;
};

export const VmDeploymentForm = ({ projectId, onSaved }: { projectId: string, onSaved?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<VmFormData>();

  const onSubmit = async (data: VmFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/vm-deployments", { ...data, projectId });
      
      // Auto-spawn department tasks based on the form logic
      await Promise.all([
        api.post("/tasks", { projectId, title: `Allocate Network IP: ${data.internalIp}`, department: "network", status: "pending", kanbanColumn: "todo" }),
        api.post("/tasks", { projectId, title: `Provision ${data.diskSpaceGb}GB Storage for ${data.vmName}`, department: "storage", status: "pending", kanbanColumn: "todo" }),
        api.post("/tasks", { projectId, title: `Apply FW rules and AV for ${data.vmName}`, department: "security", status: "pending", kanbanColumn: "todo" })
      ]);

      setSuccess(true);
      if (onSaved) onSaved();
    } catch (error) {
      console.error("Failed to save VM specs", error);
      alert("Failed to save VM specifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl p-8 text-center">
        <Server className="mx-auto mb-4 h-12 w-12" />
        <h3 className="text-xl font-bold mb-2">VM Configured & Tasks Spawned</h3>
        <p className="text-emerald-600/80 mb-6">The infrastructure specifications have been saved and sub-tasks have automatically been routed to the Network, Storage, and Security departments.</p>
        <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-600 transition-all">
          Configure Another VM
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Server className="mr-2 text-primary" size={24} /> 
          Master VM Configuration
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">Define infrastructure specifications. Submitting this form will automatically delegate tasks to respective departments.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Computing Resources */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center text-foreground"><Activity size={18} className="mr-2 text-blue-500" /> Computing Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-xl border border-border/50">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">VM Name *</label>
              <input {...register("vmName", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. PRD-DB-01" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">OS Template *</label>
              <select {...register("osType", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="ubuntu_22">Ubuntu 22.04 LTS</option>
                <option value="win_2022">Windows Server 2022</option>
                <option value="rhel_9">RHEL 9</option>
                <option value="alma_9">AlmaLinux 9</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">vCPU Cores *</label>
              <input type="number" {...register("vcpuCount", { required: true, min: 1 })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" defaultValue={4} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">RAM (GB) *</label>
              <input type="number" {...register("ramGb", { required: true, min: 1 })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" defaultValue={16} />
            </div>
          </div>
        </div>

        {/* Network & Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center text-foreground"><Share2 size={18} className="mr-2 text-purple-500" /> Networking</h3>
            <div className="space-y-4 p-4 bg-muted/20 rounded-xl border border-border/50 h-full">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">VLAN ID *</label>
                <input {...register("vlanId", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. VLAN 100" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Internal IP Address *</label>
                <input {...register("internalIp", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="10.0.x.x" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Public IP Address (Optional)</label>
                <input {...register("publicIp")} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="If required for NAT" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center text-foreground"><HardDrive size={18} className="mr-2 text-amber-500" /> Storage & Data</h3>
            <div className="space-y-4 p-4 bg-muted/20 rounded-xl border border-border/50 h-full">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Disk Space (GB) *</label>
                <input type="number" {...register("diskSpaceGb", { required: true, min: 10 })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" defaultValue={100} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Backup Policy *</label>
                <select {...register("backupPolicy", { required: true })} className="w-full h-10 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                  <option value="daily_7">Daily (7 days retention)</option>
                  <option value="daily_30">Daily (30 days retention)</option>
                  <option value="weekly">Weekly</option>
                  <option value="none">No Backup Required</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Monitoring */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center text-foreground"><Shield size={18} className="mr-2 text-red-500" /> Security & Edge</h3>
          <div className="space-y-4 p-4 bg-muted/20 rounded-xl border border-border/50">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Firewall Rules (Ingress/Egress)</label>
              <textarea {...register("firewallRules")} rows={3} className="w-full bg-background border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Allow TCP 443 from Any; Allow TCP 3306 from 10.0.1.0/24..."></textarea>
            </div>
            <div className="flex space-x-8 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("antivirusEnabled")} className="w-4 h-4 rounded text-primary focus:ring-primary/50" defaultChecked />
                <span className="text-sm font-medium">Install Enterprise Antivirus</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("monitoringEnabled")} className="w-4 h-4 rounded text-primary focus:ring-primary/50" defaultChecked />
                <span className="text-sm font-medium">Add to Zabbix/Prometheus Monitoring</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 flex items-center transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Deploy Configurations & Trigger Workflows
          </button>
        </div>
      </form>
    </div>
  );
};
