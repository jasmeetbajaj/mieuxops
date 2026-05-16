"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CheckSquare, Search, Filter, Clock, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      case 'in_progress': return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case 'review': return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high' || priority === 'critical') return <AlertCircle size={14} className="text-destructive mr-1" />;
    return null;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track action items across all deployment projects.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
              <Filter size={16} className="mr-2" />
              All Projects
            </button>
            <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
              <Filter size={16} className="mr-2" />
              Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Task Title</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Assignee</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex justify-center mb-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    <CheckSquare size={32} className="mx-auto mb-3 opacity-20" />
                    No active tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground flex items-center">
                        {getPriorityIcon(task.priority)}
                        {task.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      {task.projectId ? `Project #${task.projectId.substring(0, 8)}` : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      {task.assigneeId ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {task.assigneeId.substring(0,2).toUpperCase()}
                          </div>
                          <span>User {task.assigneeId.substring(0, 4)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.dueDate ? (
                        <div className="flex items-center space-x-1.5 text-muted-foreground">
                          <Clock size={14} />
                          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
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
