"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.accessToken, res.data.user);
      // Middleware redirects to dashboard automatically
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-primary">Mieux</span>Flow
          </h1>
          <p className="text-muted-foreground">Enterprise Operations Command Center</p>
        </div>

        <div className="bg-card border shadow-xl rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-background border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="name@mieuxtech.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-background border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center mt-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Access Command Center"}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; 2026 Mieux Technologies Pvt Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
