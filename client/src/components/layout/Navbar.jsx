import React, { useState } from 'react';
import { Menu, X, Volume2, VolumeX, Shield, Lock } from 'lucide-react';
import { WantedStarMeter } from '../hud/WantedStarMeter';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenOrganizerModal, onOpenLookupModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMuted, toggleMute, playClick } = useAudio();
  const { isOrganizer } = useAuth();

  const navLinks = [
    { name: 'Quests', href: '#segments' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#2A3655]/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          onClick={playClick}
          className="flex items-center gap-2.5 select-none shrink-0"
        >
          <img
            src="/assets/logos/fest-emblem.svg"
            alt="Adventure Fest"
            className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,158,0,0.3)]"
          />
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white hover:text-[#00E5FF] transition-colors">
              ADVENTURE FEST
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF2A85] text-white">
              3.0
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playClick}
              className="text-xs font-medium text-slate-300 hover:text-[#00E5FF] transition-colors"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={() => {
              playClick();
              onOpenLookupModal();
            }}
            className="text-xs font-medium text-slate-300 hover:text-[#FF9E00] transition-colors"
          >
            My Pass
          </button>
        </nav>

        {/* Right Actions: Compact & Minimal */}
        <div className="flex items-center gap-2.5">
          {/* Organizer Cost & Budget Icon Button */}
          <button
            onClick={() => {
              playClick();
              onOpenOrganizerModal();
            }}
            title={isOrganizer ? 'Organizer Portal (Active)' : 'Organizer Cost & Budget (Protected)'}
            className={`p-2 rounded-xl transition-all ${
              isOrganizer
                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/25'
                : 'bg-[#121829] text-slate-400 hover:text-[#FF9E00] border border-[#2A3655] hover:border-[#FF9E00]/40'
            }`}
          >
            {isOrganizer ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>

          {/* Wanted Star Meter (Minimal 5-star view) */}
          <WantedStarMeter minimal />

          {/* Sound FX Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-[#121829] border border-[#2A3655] text-slate-400 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors"
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
          </button>

          {/* Minimal Register CTA */}
          <a
            href="#register"
            onClick={playClick}
            className="px-4 py-1.5 rounded-xl font-display font-extrabold text-xs tracking-wide text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] via-[#FF9E00] to-[#FF2A85] hover:opacity-95 shadow-sm transition-all shrink-0"
          >
            Register
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#121829] border border-[#2A3655] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Tactical Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19]/98 border-b border-[#2A3655] px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-[#121829] hover:text-[#00E5FF]"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(false);
              onOpenLookupModal();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#FF9E00] hover:bg-[#121829]"
          >
            My Mission Pass
          </button>

          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(false);
              onOpenOrganizerModal();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:bg-[#121829] flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF9E00]" />
            <span>Organizer Cost Portal</span>
          </button>

          <a
            href="#register"
            onClick={() => {
              playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-center py-2.5 rounded-xl font-bold text-xs text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] to-[#FF9E00]"
          >
            Register Now
          </a>
        </div>
      )}
    </header>
  );
};
