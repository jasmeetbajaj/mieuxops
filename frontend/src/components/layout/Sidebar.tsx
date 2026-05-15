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
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight border-b border-white/5">
        <span className="text-white mr-1">Mieux</span><span className="text-white/70">Flow</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-sidebar-foreground/70 hover:text-white hover:bg-white/5"
                )}
              >
                <div className={cn(isActive ? "text-white" : "text-sidebar-foreground/70")}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-3 mb-4 px-2 hover:bg-white/5 p-2 rounded-md transition-colors cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-white/50 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
