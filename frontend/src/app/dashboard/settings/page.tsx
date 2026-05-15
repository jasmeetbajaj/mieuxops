"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-primary" size={28} />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-primary" />
            <h2 className="font-semibold">Profile Settings</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">First Name</label>
              <input className="w-full h-10 bg-background border rounded-lg px-3 text-sm" placeholder="First Name" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Last Name</label>
              <input className="w-full h-10 bg-background border rounded-lg px-3 text-sm" placeholder="Last Name" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium block mb-1">Email Address</label>
              <input className="w-full h-10 bg-background border rounded-lg px-3 text-sm" placeholder="email@mieuxtech.com" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h2 className="font-semibold">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {["Email Notifications", "WhatsApp Alerts", "SLA Breach Alerts", "Task Assignment Alerts"].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-primary" />
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Current Password</label>
              <input type="password" className="w-full h-10 bg-background border rounded-lg px-3 text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">New Password</label>
              <input type="password" className="w-full h-10 bg-background border rounded-lg px-3 text-sm" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
