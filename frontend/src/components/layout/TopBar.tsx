"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";

export const TopBar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:4000", {
      path: "/socket.io",
      transports: ["websocket"],
      query: { userId: user.id }
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected for notifications");
    });

    newSocket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search projects, tasks, orders..." 
            className="w-full h-10 bg-background border rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <button onClick={() => setShowDropdown(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications.
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className={`p-3 text-sm hover:bg-muted/30 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                        <div className="font-medium mb-1">{notif.title}</div>
                        <div className="text-muted-foreground text-xs leading-relaxed">{notif.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-2">{format(new Date(), 'HH:mm')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 border-t text-center">
                <button className="text-xs font-medium text-primary hover:underline">View All Activity Logs</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-border mx-2"></div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.department || 'System'} Dept</p>
        </div>
      </div>
    </header>
  );
};
