import React from 'react';
import { Compass, Mail, Phone, MapPin, Heart, ShieldCheck, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#070A12] border-t border-[#2A3655]/60 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A3655]/50">
          {/* Col 1: Club Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logos/fest-emblem.svg"
                alt="Fest Emblem"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-black text-xl text-white">
                ADVENTURE FEST 3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Presented jointly by <strong>Jahangirnagar University Adventure Society (JUAS)</strong> and <strong>JU Science Club (JUSC)</strong>. Promoting outdoor stewardship, wildlife preservation, and tactical problem solving.
            </p>
            <div className="text-[11px] font-mono text-[#00E5FF]">
              TAGLINE: Wild Campus Meets Neon Quest
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Tactical Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <a href="#segments" className="hover:text-[#00E5FF] transition-colors">
                  Quest Directory (6 Segments)
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-[#00E5FF] transition-colors">
                  Campus Trail Map & Timeline
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-[#00E5FF] transition-colors">
                  Squad & Solo Registration
                </a>
              </li>
              <li>
                <a href="#leaderboard" className="hover:text-[#00E5FF] transition-colors">
                  Live Feed & Quest Scores
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#00E5FF] transition-colors">
                  Rulebook & Emergency FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates & Contact */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Basecamp Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF9E00] shrink-0 mt-0.5" />
                <span>Central Field & TSC Complex, Jahangirnagar University, Savar, Dhaka-1342</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>adventure@ju.ac.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF2A85] shrink-0" />
                <span>+880 1711-000001 (Control Room)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Azure Infrastructure Telemetry */}
          <div className="p-4 rounded-2xl bg-[#121829] border border-[#2A3655]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] font-bold mb-2">
              <Terminal className="w-4 h-4" />
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Infrastructure:</span>
                <span className="text-white">Azure B2s Cluster</span>
              </div>
              <div className="flex justify-between">
                <span>Target Concurrency:</span>
                <span className="text-[#00E5FF]">1,000+ Active Users</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Engine:</span>
                <span className="text-[#FF9E00]">Redis In-Memory</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-white">MongoDB Pool (50)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 JUAS & JU Science Club. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered for outdoor spirits with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF2A85] fill-[#FF2A85] inline" />
            <span>at Jahangirnagar University</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
