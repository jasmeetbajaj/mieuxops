"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Search, Filter, ArrowRight, Clock, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      processing: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">Manage incoming deployments and sales requests.</p>
        </div>
        <Link 
          href="/dashboard/orders/new" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create Order
        </Link>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or customer..." 
              className="w-full h-9 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border px-3 py-1.5 rounded-md bg-background">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Project Type</th>
                <th className="px-6 py-4 font-medium">SLA / Delivery</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex justify-center mb-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <FileText size={32} className="mx-auto mb-3 opacity-20" />
                    No orders found. Create your first order to get started.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.companyName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize">{order.projectType.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground capitalize">{order.environment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-muted-foreground text-xs mb-1">
                        <Clock size={12} className="mr-1" />
                        {order.slaTat}
                      </div>
                      <div className="font-medium">
                        {order.deliveryDate ? format(new Date(order.deliveryDate), 'MMM dd, yyyy') : 'TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center justify-end w-full group">
                        View <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
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
