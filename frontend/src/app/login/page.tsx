"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Loader2, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-background flex font-sans overflow-hidden">
      {/* Left Side: Animated Brand Area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-sidebar flex-col justify-between p-12 overflow-hidden">
        {/* Subtle animated gradient orbs in background */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30">
            M
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">MieuxFlow</span>
        </div>

        <div className="relative z-10 max-w-md animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Intelligence driven <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-300">operations</span>.
          </h1>
          <p className="text-sidebar-foreground/70 text-lg leading-relaxed">
            Unify your enterprise workflows, accelerate SLA delivery, and gain deep operational insights in real-time.
          </p>
          
          {/* Mock testimonial / stats card */}
          <div className="mt-12 glass-panel !bg-white/5 !border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-sidebar flex items-center justify-center text-[10px] text-white font-medium">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-sidebar-foreground/80 font-medium">Trusted by leading enterprises</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-sidebar-foreground/50">
          &copy; {new Date().getFullYear()} Mieux Technologies Pvt Ltd. All rights reserved.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile brand header (hidden on large screens) */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
            M
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">MieuxFlow</span>
        </div>

        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-sm font-medium text-foreground transition-colors group-focus-within:text-primary">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2 relative group">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground transition-colors group-focus-within:text-primary">Password</label>
                <a href="#" className="text-sm text-primary hover:underline font-medium transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Contact administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

