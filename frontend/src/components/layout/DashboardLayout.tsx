"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/context/AuthContext";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
