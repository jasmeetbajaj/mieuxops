"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CheckCircle, Clock, Server, ShieldCheck, Activity, GripVertical, Plus } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  department: string;
  status: string;
  assignedToId?: string;
  slaDeadline?: string;
}

export const KanbanBoard = ({ projectId }: { projectId: string }) => {
  const [columns, setColumns] = useState<Record<string, Task[]>>({
    todo: [],
    assigned: [],
    in_progress: [],
    audit: [],
    qc: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDept, setNewTaskDept] = useState("network");

  const fetchKanban = async () => {
    try {
      const res = await api.get(`/tasks/kanban/${projectId}`);
      setColumns(res.data);
    } catch (error) {
      console.error("Failed to load kanban", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanban();
  }, [projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      await api.post("/tasks", {
        projectId,
        title: newTaskTitle,
        department: newTaskDept,
        kanbanColumn: "todo",
        status: "pending",
        position: columns.todo.length,
      });
      setNewTaskTitle("");
      setShowNewTaskForm(false);
      fetchKanban();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const getDeptColor = (dept: string) => {
    const colors: Record<string, string> = {
      network: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      security: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      storage: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      backup: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      cloud: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    };
    return colors[dept] || "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  };

  const columnHeaders = [
    { id: "todo", title: "To Do", icon: <Clock size={16} /> },
    { id: "assigned", title: "Assigned", icon: <Server size={16} /> },
    { id: "in_progress", title: "In Progress", icon: <Activity size={16} /> },
    { id: "audit", title: "Audit Pending", icon: <ShieldCheck size={16} /> },
    { id: "qc", title: "QC Pending", icon: <Activity size={16} /> },
    { id: "completed", title: "Completed", icon: <CheckCircle size={16} /> },
  ];

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Project Tasks Workflow</h2>
        <button 
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} className="mr-1" /> Add Task
        </button>
      </div>

      {showNewTaskForm && (
        <form onSubmit={handleCreateTask} className="mb-6 bg-card border p-4 rounded-xl shadow-sm flex items-end gap-4 animate-in slide-in-from-top-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Task Title</label>
            <input 
              value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} 
              placeholder="e.g. Allocate subnets for DB tier" 
              className="w-full h-9 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
            />
          </div>
          <div className="w-48 space-y-2">
            <label className="text-sm font-medium">Department</label>
            <select 
              value={newTaskDept} onChange={(e) => setNewTaskDept(e.target.value)}
              className="w-full h-9 bg-background border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            >
              <option value="network">Network</option>
              <option value="security">Security</option>
              <option value="storage">Storage</option>
              <option value="backup">Backup</option>
              <option value="cloud">Cloud / TSPlus</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button type="button" onClick={() => setShowNewTaskForm(false)} className="h-9 px-4 border rounded-lg hover:bg-secondary">Cancel</button>
            <button type="submit" className="h-9 px-4 bg-primary text-primary-foreground rounded-lg">Save</button>
          </div>
        </form>
      )}

      <div className="flex flex-1 overflow-x-auto pb-4 gap-6 snap-x">
        {columnHeaders.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-muted/30 rounded-xl border snap-center">
            <div className="p-3 border-b bg-card rounded-t-xl flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center space-x-2 font-semibold">
                {col.icon}
                <span>{col.title}</span>
              </div>
              <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-md">
                {columns[col.id]?.length || 0}
              </span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[300px]">
              {columns[col.id]?.map((task: Task) => (
                <div key={task.id} className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getDeptColor(task.department)}`}>
                      {task.department}
                    </span>
                    <GripVertical size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-sm font-medium leading-snug mb-3">{task.title}</h4>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {task.assignedToId ? (
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold" title="Assigned User">
                        US
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                    {task.slaDeadline && (
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <Clock size={10} className="mr-1" />
                        {format(new Date(task.slaDeadline), 'MMM dd')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {!columns[col.id]?.length && (
                <div className="h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground italic">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
