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
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-sidebar-hover shadow-xl overflow-hidden">
      {/* Premium brand header */}
      <div className="h-[72px] flex items-center px-6 border-b border-sidebar-hover/50 bg-sidebar-hover/20 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-indigo-500 opacity-80"></div>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md mr-3">
          M
        </div>
        <div className="font-bold text-xl tracking-tight">
          <span className="text-white">Mieux</span><span className="text-primary/90">Flow</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div className="space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-sidebar-foreground/40 uppercase">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-white bg-sidebar-hover shadow-inner" 
                    : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-hover/50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"></div>
                )}
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                )}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-hover bg-sidebar-hover/10">
        <div className="flex items-center space-x-3 mb-4 px-2 p-2 rounded-xl border border-transparent hover:border-sidebar-hover hover:bg-sidebar-hover/30 transition-all cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-sidebar">
            {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold truncate text-white">{user?.firstName || "System"} {user?.lastName || "User"}</p>
            <p className="text-[11px] text-primary/80 truncate capitalize font-medium">{user?.role?.replace('_', ' ') || "Admin"}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
