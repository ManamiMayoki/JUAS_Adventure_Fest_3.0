import React, { useState } from 'react';
import { Menu, X, Volume2, VolumeX, Shield, Lock, Compass, UserCheck } from 'lucide-react';
import { WantedStarMeter } from '../hud/WantedStarMeter';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenOrganizerModal, onOpenLookupModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMuted, toggleMute, playClick } = useAudio();
  const { isOrganizer, user, logout } = useAuth();

  const navLinks = [
    { name: 'Quests (Segments)', href: '#segments' },
    { name: 'Schedule & Map', href: '#schedule' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F19]/85 backdrop-blur-xl border-b border-[#2A3655]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logos */}
        <a
          href="#"
          onClick={playClick}
          className="flex items-center gap-3 group select-none"
        >
          <img
            src="/assets/logos/fest-emblem.svg"
            alt="Adventure Fest 3.0 Emblem"
            className="w-11 h-11 object-contain drop-shadow-[0_0_10px_rgba(255,158,0,0.4)] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-[#00E5FF] transition-colors">
                ADVENTURE FEST
              </span>
              <span className="px-1.5 py-0.2 rounded text-[11px] font-mono font-extrabold bg-[#FF2A85] text-white">
                3.0
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#00E5FF]/80 uppercase">
              JUAS // SCIENCE CLUB
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playClick}
              className="text-sm font-medium text-slate-300 hover:text-[#00E5FF] hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] transition-all"
            >
              {link.name}
            </a>
          ))}

          {/* Participant Lookup Pass Button */}
          <button
            onClick={() => {
              playClick();
              onOpenLookupModal();
            }}
            className="text-sm font-medium text-slate-300 hover:text-[#FF9E00] flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-[#FF9E00]" />
            <span>My Pass</span>
          </button>

          {/* Organizer Cost & Budget Section */}
          <button
            onClick={() => {
              playClick();
              onOpenOrganizerModal();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              isOrganizer
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/30'
                : 'bg-[#182035] text-slate-300 border border-[#2A3655] hover:border-[#FF9E00]/60 hover:text-white'
            }`}
          >
            {isOrganizer ? (
              <>
                <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Organizer Portal</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#FF9E00]" />
                <span>Cost & Budget</span>
              </>
            )}
          </button>
        </nav>

        {/* Right HUD Controls: Stars, Audio, Register CTA */}
        <div className="flex items-center gap-3">
          {/* Wanted / Quest Star Meter */}
          <WantedStarMeter />

          {/* Sound FX Audio Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#182035] border border-[#2A3655] text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-colors"
            title={isMuted ? 'Unmute tactical audio FX' : 'Mute tactical audio FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
          </button>

          {/* Main Register CTA */}
          <a
            href="#register"
            onClick={playClick}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-extrabold text-sm text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] via-[#FF9E00] to-[#FF2A85] hover:opacity-95 shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_25px_rgba(255,158,0,0.5)] transform hover:-translate-y-0.5 transition-all"
          >
            <Compass className="w-4 h-4 text-[#0B0F19]" />
            <span>REGISTER NOW</span>
          </a>

          {/* Mobile Tactical Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#182035] border border-[#2A3655] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Tactical Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19]/95 border-b border-[#2A3655] px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-[#182035] hover:text-[#00E5FF]"
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
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#FF9E00] hover:bg-[#182035] flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Lookup My Mission Pass</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(false);
              onOpenOrganizerModal();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono text-slate-300 hover:bg-[#182035] flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#FF9E00]" />
            <span>Event Cost & Organizer Portal</span>
          </button>

          <a
            href="#register"
            onClick={() => {
              playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-center py-3 rounded-xl font-bold text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] to-[#FF9E00]"
          >
            REGISTER NOW
          </a>
        </div>
      )}
    </header>
  );
};
