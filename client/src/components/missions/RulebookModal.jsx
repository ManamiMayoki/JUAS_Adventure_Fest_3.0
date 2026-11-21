import React from 'react';
import { X, ShieldAlert, CheckCircle, Clock, MapPin, Printer } from 'lucide-react';

export const RulebookModal = ({ segment, onClose }) => {
  if (!segment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-[#00E5FF]/40 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-6 bg-[#121829] border-b border-[#2A3655] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold">
              OFFICIAL MISSION BRIEFING & RULEBOOK // {segment.code}
            </div>
            <h3 className="font-display font-black text-2xl text-white mt-1">
              {segment.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#182035] text-slate-400 hover:text-white border border-[#2A3655]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#182035]/60 border border-[#2A3655] font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TIME</span>
              <span className="text-white font-bold">{segment.scheduleTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ZONE</span>
              <span className="text-[#00E5FF] font-bold">{segment.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DIFFICULTY</span>
              <span className="text-[#FF9E00] font-bold">{segment.difficulty}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ENTRY FEE</span>
              <span className="text-[#10B981] font-bold">৳{segment.feeBDT} BDT</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-display font-extrabold text-white text-base mb-2">
              Mission Overview
            </h4>
            <p className="leading-relaxed text-slate-300">
              {segment.description}
            </p>
          </div>

          {/* Official Rule Protocols */}
          <div>
            <h4 className="font-display font-extrabold text-white text-base mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF2A85]" />
              <span>Standard Operational Protocols</span>
            </h4>
            <ul className="space-y-2.5">
              {segment.rules?.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00E5FF] mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-xs sm:text-sm">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Wildlife & Conservation Ethics */}
          <div className="p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-slate-300">
            <strong className="text-[#00E5FF] block font-mono font-bold mb-1">
              JU WILDLIFE & MIGRATORY SANCTUARY PROTOCOL
            </strong>
            Strict Leave-No-Trace outdoors policy applies across all campus grounds and lake embankments. Harming wildlife or littering will result in immediate squad disqualification and forfeiture of credentials.
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-[#121829] border-t border-[#2A3655] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182035] border border-[#2A3655] text-xs font-mono text-slate-300 hover:text-white"
          >
            <Printer className="w-4 h-4" />
            <span>Print Rulebook PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-display font-bold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
