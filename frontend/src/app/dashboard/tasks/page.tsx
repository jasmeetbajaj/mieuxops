"use client";

import React from "react";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare className="text-primary" size={28} />
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
        <CheckSquare size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Tasks are managed per-project.</p>
        <p className="text-sm mt-1">Navigate to a specific project to view and manage its tasks.</p>
      </div>
    </div>
  );
}
