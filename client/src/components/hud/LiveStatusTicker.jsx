import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import api from '../../services/api';

export const LiveStatusTicker = () => {
  const [stats, setStats] = useState({
    slotsAvailable: 610,
    totalSlots: 1000,
    systemStatus: 'ONLINE // 1,000+ CONCURRENT CAPACITY',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/public-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (e) {
        // Fallback default state
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0B0F19]/90 border-y border-[#2A3655]/50 py-2 px-4 backdrop-blur-md overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left Telemetry */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="font-bold">QUEST MODE: LIVE</span>
          </div>
          <span className="text-[#2A3655]">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>AZURE VM HIGH-SPEED CLUSTER</span>
          </div>
          <span className="text-[#2A3655] hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <span>COORDINATES:</span>
            <span className="text-white">JU SAVAR [23.8827° N, 90.2671° E]</span>
          </div>
        </div>

        {/* Right Slots Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#182035] border border-[#2A3655] text-slate-200">
            <span className="text-[#FF9E00] font-bold">{stats.slotsAvailable}</span>
            <span className="text-slate-400 text-[11px]">/ {stats.totalSlots} SLOTS REMAINING</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#00E5FF] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INSTANT QR PASS VERIFICATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
