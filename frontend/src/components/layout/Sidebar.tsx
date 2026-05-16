"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  ShieldCheck, 
  Activity, 
  Users, 
  Settings,
  LogOut,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Projects", href: "/dashboard/projects", icon: <FolderKanban size={20} /> },
    { label: "Tasks", href: "/dashboard/tasks", icon: <CheckSquare size={20} /> },
    { label: "Audit Center", href: "/dashboard/audit", icon: <ShieldCheck size={20} /> },
    { label: "QC Center", href: "/dashboard/qc", icon: <Activity size={20} /> },
    { label: "Documents", href: "/dashboard/documents", icon: <FolderOpen size={20} /> },
  ];

  if (user?.role === "super_admin" || user?.role === "owner") {
    navItems.push({ label: "Team", href: "/dashboard/team", icon: <Users size={20} /> });
    navItems.push({ label: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> });
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-sidebar">
      {/* Brand header */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-hover/30">
        <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center mr-3 shadow-sm">
          {/* Mock Asana-like 3-dot logo */}
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="font-semibold text-lg tracking-tight text-white">
          MieuxFlow
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                  isActive 
                    ? "text-white bg-sidebar-hover" 
                    : "text-sidebar-foreground hover:text-white hover:bg-sidebar-hover/50"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4 px-2 py-2 rounded-md hover:bg-sidebar-hover/50 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium truncate text-white">{user?.firstName || "System"} {user?.lastName || "User"}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
