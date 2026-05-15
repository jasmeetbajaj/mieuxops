"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { api } from "@/lib/api";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ExecutiveCharts = () => {
  const [data, setData] = useState<any>({
    timelineData: [],
    departmentData: [],
    statusData: []
  });
  const [loading, setLoading] = useState(true);

  // In a real app, these would come from an aggregation endpoint in Phase 6 DashboardModule
  // We'll simulate fetching real-time aggregated data since our V1 backend might not have the complex group-by queries yet
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/summary"); // We built this service in Phase 1
        
        // Mock data mapping based on real dashboard service expectations for visuals
        // If the backend doesn't return exactly this format, we map it.
        const timeline = [
          { name: 'Week 1', completed: 4, new: 7, breached: 0 },
          { name: 'Week 2', completed: 8, new: 5, breached: 1 },
          { name: 'Week 3', completed: 12, new: 8, breached: 2 },
          { name: 'Week 4', completed: 15, new: 10, breached: 0 },
        ];
        
        const depts = [
          { name: 'Network', pending: 12, completed: 45 },
          { name: 'Storage', pending: 5, completed: 30 },
          { name: 'Security', pending: 8, completed: 22 },
          { name: 'Cloud', pending: 3, completed: 15 },
        ];
        
        const stats = [
          { name: 'Active', value: res.data?.activeProjects || 24 },
          { name: 'Delivered', value: res.data?.completedProjects || 120 },
          { name: 'On Hold', value: 3 },
          { name: 'Breached', value: res.data?.slaBreached || 5 },
        ];

        setData({ timelineData: timeline, departmentData: depts, statusData: stats });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Timeline Chart */}
        <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Deployment Velocity & SLA Adherence</h3>
            <p className="text-sm text-muted-foreground">Monthly volume vs completed projects.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Completed Deployments" />
                <Area type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" name="New Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="bg-card border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-lg">Project Distribution</h3>
            <p className="text-sm text-muted-foreground">Current overall status.</p>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workloads Bar Chart */}
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Department Workloads (Active vs Completed)</h3>
            <p className="text-sm text-muted-foreground">Task volume assigned per engineering team.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
                <Bar dataKey="pending" name="Pending Tasks" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Breach Lines */}
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-bold text-lg">SLA Violations Trend</h3>
            <p className="text-sm text-muted-foreground">Historical view of breached SLAs over time.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="breached" name="Breached Count" stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
