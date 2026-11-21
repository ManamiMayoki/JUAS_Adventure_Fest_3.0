import React from 'react';
import { ArrowRight, Compass, Flame } from 'lucide-react';
import { WildernessCanvas } from '../3d/WildernessCanvas';
import { useAudio } from '../../context/AudioContext';

export const HeroBanner = () => {
  const { playClick, playBirdChirp } = useAudio();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-4 pb-16">
      {/* 3D Scene Background Canvas - 100% Full Visibility */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-auto">
        <WildernessCanvas />
      </div>

      {/* Subtle Bottom Transition Gradient Only (so scene stays fully bright & visible) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-[#0B0F19] to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Tactical Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0F19]/80 border border-[#00E5FF]/50 backdrop-blur-md mb-5 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
          <Flame className="w-4 h-4 text-[#FF9E00] animate-bounce" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF]">
            JAHANGIRNAGAR UNIVERSITY // WILD CAMPUS MEETS NEON QUEST
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase max-w-5xl leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          ANSWER THE <br />
          <span className="text-neon-sunset drop-shadow-[0_0_40px_rgba(255,42,133,0.6)]">
            WILD CALL
          </span>
        </h1>

        {/* Hero Subtitle with dark text backdrop pill for high readability over bright 3D scene */}
        <div className="mt-5 px-5 py-2.5 rounded-2xl bg-[#0B0F19]/75 backdrop-blur-md border border-[#2A3655]/60 max-w-3xl">
          <p className="text-sm sm:text-lg text-slate-200 font-normal leading-relaxed">
            Embark on a gamified campus adventure inspired by the cunning <strong className="text-[#FF9E00]">Golden Fox</strong> and soaring <strong className="text-[#00E5FF]">Siberian Migratory Birds</strong>. Traverse red-brick trails, crack cryptic ciphers, and bivouac under starry lake skies.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#register"
            onClick={() => {
              playClick();
              playBirdChirp();
            }}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-display font-black text-sm sm:text-base text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] via-[#FF9E00] to-[#FF2A85] shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:shadow-[0_0_40px_rgba(255,158,0,0.7)] transform hover:-translate-y-1 transition-all group"
          >
            <span>JOIN THE QUEST</span>
            <ArrowRight className="w-5 h-5 text-[#0B0F19] group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#segments"
            onClick={playClick}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-semibold text-white bg-[#0B0F19]/85 border border-[#2A3655] hover:border-[#00E5FF] hover:text-[#00E5FF] backdrop-blur-md shadow-lg transition-all"
          >
            <Compass className="w-4 h-4 text-[#00E5FF]" />
            <span>EXPLORE 6 QUEST SEGMENTS</span>
          </a>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-4xl">
          <div className="hud-panel p-3.5 rounded-2xl text-left border-l-4 border-l-[#00E5FF] bg-[#0B0F19]/85 backdrop-blur-md">
            <div className="text-2xl font-black font-display text-white">6</div>
            <div className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold">Quest Segments</div>
          </div>
          <div className="hud-panel p-3.5 rounded-2xl text-left border-l-4 border-l-[#FF9E00] bg-[#0B0F19]/85 backdrop-blur-md">
            <div className="text-2xl font-black font-display text-white">1,000+</div>
            <div className="text-[11px] font-mono text-[#FF9E00] uppercase font-bold">Concurrent Slots</div>
          </div>
          <div className="hud-panel p-3.5 rounded-2xl text-left border-l-4 border-l-[#FF2A85] bg-[#0B0F19]/85 backdrop-blur-md">
            <div className="text-2xl font-black font-display text-white">৳100K+</div>
            <div className="text-[11px] font-mono text-[#FF2A85] uppercase font-bold">Prizes & Medals</div>
          </div>
          <div className="hud-panel p-3.5 rounded-2xl text-left border-l-4 border-l-[#10B981] bg-[#0B0F19]/85 backdrop-blur-md">
            <div className="text-2xl font-black font-display text-white">2 DAYS</div>
            <div className="text-[11px] font-mono text-[#10B981] uppercase font-bold">Campus Lore</div>
          </div>
        </div>
      </div>
    </section>
  );
};
