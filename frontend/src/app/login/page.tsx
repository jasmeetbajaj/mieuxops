"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-[400px]">
        {/* Simple Asana-like Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="font-semibold text-2xl tracking-tight text-foreground">mieuxflow</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-fade-in-up">
          <div className="mb-6 text-center">
            <h2 className="text-[20px] font-medium text-foreground">Log in</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-card border border-border hover:border-muted-foreground/50 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-foreground"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-muted-foreground">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 bg-card border border-border hover:border-muted-foreground/50 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-foreground"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-white font-medium text-[15px] rounded hover:bg-primary/90 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Log in"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-[13px] text-muted-foreground hover:underline transition-colors">Forgot your password?</a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-[12px] text-muted-foreground">
          By logging in, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}

