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
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects, tasks, orders..." 
            className="w-full h-10 bg-secondary/70 border border-transparent rounded-full pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all shadow-sm inset-shadow-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2.5 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10 focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white shadow-sm animate-pulse-slow"></span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 glass-panel !bg-white/95 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up origin-top-right border-border">
              <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
                <button onClick={() => setShowDropdown(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-3">
                      <Bell size={20} />
                    </div>
                    <p className="text-sm font-medium text-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">No new notifications.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className={`p-4 text-sm hover:bg-secondary/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary/5 relative' : ''}`}>
                        {!notif.isRead && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full"></div>}
                        <div className="font-medium mb-1 text-foreground">{notif.title}</div>
                        <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-2 font-medium">{format(new Date(), 'HH:mm')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-border bg-secondary/10 text-center">
                <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All Activity Logs</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-border"></div>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">{user?.department || 'System'} Dept</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-indigo-500/80 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
            {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
          </div>
        </div>
      </div>
    </header>
  );
};
