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
    <div className="w-64 bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-40">
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <span className="text-primary mr-1 relative z-10 shadow-glow-primary">Mieux</span><span className="relative z-10">Flow</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-white shadow-glow" 
                    : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-hover/50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary"></div>
                )}
                <div className={cn("relative z-10 transition-transform duration-300", isActive ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110")}>
                  {item.icon}
                </div>
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-4 px-2 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-glow-primary group-hover:scale-110 transition-transform">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-glow-destructive transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
