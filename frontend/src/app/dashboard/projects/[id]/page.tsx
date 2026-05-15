"use client";

import React, { useEffect, useState, use } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { VmDeploymentForm } from "@/components/projects/VmDeploymentForm";
import { AuditChecklistForm } from "@/components/audit/AuditChecklistForm";
import { QcApprovalModal } from "@/components/qc/QcApprovalModal";
import { ArrowLeft, Clock, Server, Briefcase, FileText, CheckCircle2, ShieldCheck, Settings } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [showQcModal, setShowQcModal] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (error) {
      console.error("Failed to load project", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (!project) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: <Briefcase size={16} /> },
    { id: "kanban", label: "Tasks & Workflow", icon: <CheckCircle2 size={16} /> },
    { id: "vm_specs", label: "VM Configurations", icon: <Server size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    { id: "audit_qc", label: "Audit & QC", icon: <ShieldCheck size={16} /> },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/projects" className="mr-4 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors self-start mt-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border bg-primary/10 text-primary border-primary/20`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center">
              <span>{project.customerName}</span>
              <span className="mx-2">•</span>
              <span>{project.orderRef}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{project.environment} Environment</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground mb-1">SLA Deadline</div>
          <div className={`font-bold flex items-center justify-end ${project.slaBreached ? 'text-destructive' : 'text-emerald-600'}`}>
            <Clock size={16} className="mr-1.5" />
            {project.dueDate ? format(new Date(project.dueDate), 'MMM dd, yyyy - HH:mm') : 'Not Set'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-lg">Project Details</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Category</p>
                    <p className="font-medium capitalize">{project.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Priority</p>
                    <p className={`font-medium capitalize ${project.priority === 'critical' ? 'text-destructive' : project.priority === 'high' ? 'text-amber-500' : ''}`}>
                      {project.priority}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Start Date</p>
                    <p className="font-medium">{project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">SLA TAT Allocation</p>
                    <p className="font-medium">{project.slaTat || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-lg flex items-center justify-between">
                  Activity Timeline
                  <span className="text-xs text-primary cursor-pointer hover:underline">View All</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5"></div>
                      <div className="w-px h-full bg-border my-1"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Project Created</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Auto-generated from Sales Order {project.orderRef}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(project.createdAt), 'MMM dd, HH:mm')}</p>
                    </div>
                  </div>
                  {/* More timeline items would load here dynamically */}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Gatekeeper Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${project.auditStatus === 'passed' ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Security Audit</p>
                        <p className="text-xs text-muted-foreground capitalize">{project.auditStatus || 'Pending'}</p>
                      </div>
                    </div>
                    {project.auditStatus === 'passed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${project.qcStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        <Settings size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quality Control</p>
                        <p className="text-xs text-muted-foreground capitalize">{project.qcStatus || 'Pending'}</p>
                      </div>
                    </div>
                    {project.qcStatus === 'approved' && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="h-[600px] border rounded-xl overflow-hidden shadow-sm">
            <KanbanBoard projectId={projectId} />
          </div>
        )}

        {activeTab === "vm_specs" && (
          <VmDeploymentForm projectId={projectId} />
        )}

        {activeTab === "documents" && (
          <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground mb-2">Project Documents</h3>
            <p className="mb-6">Upload LLDs, HLDs, Sign-off sheets, and other project artifacts.</p>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium">
              Upload Document
            </button>
          </div>
        )}

        {activeTab === "audit_qc" && (
          <div className="space-y-6">
            {!showAuditForm && (
              <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground mb-2">Audit & QC Center</h3>
                <p className="mb-6">Start a new compliance audit or request quality control review for delivery.</p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => setShowAuditForm(true)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 px-4 py-2 rounded-lg font-medium border border-blue-200 dark:border-blue-500/30"
                  >
                    Initiate Security Audit
                  </button>
                  <button 
                    onClick={() => setShowQcModal(true)}
                    className="bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 px-4 py-2 rounded-lg font-medium border border-purple-200 dark:border-purple-500/30"
                  >
                    Submit for QC Review
                  </button>
                </div>
              </div>
            )}

            {showAuditForm && (
              <AuditChecklistForm 
                projectId={projectId} 
                onComplete={() => {
                  setShowAuditForm(false);
                  fetchProject();
                }} 
              />
            )}
            
            {showQcModal && (
              <QcApprovalModal 
                projectId={projectId} 
                onClose={() => setShowQcModal(false)}
                onComplete={() => {
                  setShowQcModal(false);
                  fetchProject();
                }}
              />
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
