import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9fa] flex flex-col font-sans text-[#1e1e20]">
      {/* Navigation */}
      <header className="h-20 border-b border-[#e8ecee] bg-white flex items-center justify-between px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#8780f2] flex items-center justify-center text-white font-bold text-xl">M</div>
          <span className="text-xl font-bold tracking-tight">MieuxFlow</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-sm font-medium hover:text-[#8780f2] transition-colors">
            Sign In
          </Link>
          <Link href="/login" className="bg-[#1e1e20] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#2b2c36] transition-colors">
            Access Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#e8ecee] bg-white px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Enterprise Edition v2.0 is Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1e1e20] leading-tight">
            The Command Center for <br />
            <span className="text-[#8780f2]">Enterprise Operations.</span>
          </h1>
          
          <p className="text-xl text-[#5b5b66] max-w-2xl mx-auto leading-relaxed">
            MieuxFlow connects your projects, tasks, and teams into a single, unified platform. Track SLAs, monitor deliverables, and scale your operations effortlessly.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center bg-[#8780f2] text-white px-8 py-4 rounded-md text-base font-bold hover:bg-[#726ce0] transition-colors shadow-sm"
            >
              Sign in to Workspace
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="pt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-[#5b5b66] font-medium">
            <div className="flex items-center"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Bank-Grade Security</div>
            <div className="flex items-center"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Real-time Telemetry</div>
            <div className="flex items-center"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> SLA Tracking</div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[#5b5b66] border-t border-[#e8ecee] bg-white">
        &copy; 2026 Mieux Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}
