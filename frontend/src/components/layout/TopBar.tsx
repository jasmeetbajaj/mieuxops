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
    <header className="h-[56px] bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search projects, tasks, orders..." 
            className="w-full h-8 bg-secondary/70 border border-transparent rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-card transition-all"
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in-up origin-top-right border border-border">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
                <button onClick={() => setShowDropdown(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-3">
                      <Bell size={18} />
                    </div>
                    <p className="text-sm font-medium text-foreground">All caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notif, idx) => (
                      <div key={idx} className={`p-4 text-sm hover:bg-secondary/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                        <div className="font-medium mb-1 text-foreground flex items-center">
                          {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>}
                          {notif.title}
                        </div>
                        <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-2 font-medium">{format(new Date(), 'HH:mm')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-border bg-secondary/5 text-center">
                <button className="text-xs font-semibold text-primary hover:underline transition-colors">View All</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold text-sm">
            {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
          </div>
        </div>
      </div>
    </header>
  );
}
