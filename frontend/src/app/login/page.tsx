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
    <div className="min-h-screen bg-[#f9f9fa] flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-[#8780f2] flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-sm">
            M
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1e1e20] mb-1">
            Welcome to MieuxFlow
          </h1>
          <p className="text-sm text-[#5b5b66]">Sign in to your workspace</p>
        </div>

        <div className="bg-white border border-[#e8ecee] shadow-sm rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-md mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1e1e20]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-white border border-[#e8ecee] rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8780f2]/50 focus:border-[#8780f2] transition-all text-[#1e1e20]"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1e1e20]">Password</label>
                <a href="#" className="text-xs text-[#8780f2] hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 bg-white border border-[#e8ecee] rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8780f2]/50 focus:border-[#8780f2] transition-all text-[#1e1e20]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#8780f2] text-white font-medium rounded-md hover:bg-[#726ce0] focus:outline-none focus:ring-2 focus:ring-[#8780f2] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Log in"}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-[#5b5b66] mt-8">
          &copy; 2026 Mieux Technologies Pvt Ltd.
        </p>
      </div>
    </div>
  );
}
