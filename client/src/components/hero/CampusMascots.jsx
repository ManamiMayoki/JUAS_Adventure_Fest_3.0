import React from 'react';
import { Shield, Compass, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useQuest } from '../../context/QuestContext';
import { useAudio } from '../../context/AudioContext';

export const CampusMascots = () => {
  const { selectedAvatar, setSelectedAvatar } = useQuest();
  const { playClick, playHover, playBirdChirp, playLevelUp } = useAudio();

  const handleSelectFox = () => {
    playLevelUp();
    setSelectedAvatar('Pathfinder Fox');
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectBird = () => {
    playBirdChirp();
    setSelectedAvatar('Skywatcher Bird');
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-[#070A12] relative select-none border-y border-[#2A3655]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121829] border border-[#00E5FF]/40 text-xs font-mono text-[#00E5FF] mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9E00]" />
            <span>CAMPUS ICONS // DUAL SPIRIT CLASSES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            CHOOSE YOUR <span className="text-neon-sunset">SPIRIT CLASS</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
            Jahangirnagar University is guarded by two legendary wildlife spirits. Choose your allegiance to embark on trail athletics or aerial cipher exploration.
          </p>
        </div>

        {/* Dual Mascot Cards Grid: One Fox & One Bird */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: The Golden Fox */}
          <div
            onMouseEnter={playHover}
            className={`hud-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden border ${
              selectedAvatar === 'Pathfinder Fox'
                ? 'border-[#FF9E00] shadow-[0_0_35px_rgba(255,158,0,0.35)] ring-2 ring-[#FF9E00]/60 -translate-y-1'
                : 'border-[#2A3655] hover:border-[#FF9E00]/60 hover:-translate-y-1'
            }`}
          >
            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9E00] to-[#FF2A85]" />

            <div>
              {/* Badge & Class Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-2 rounded-2xl bg-[#182035] border border-[#FF9E00]/40 shadow-inner">
                  🦊
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#FF9E00]/20 text-[#FF9E00] border border-[#FF9E00]/40 uppercase tracking-wider">
                  GROUND NAVIGATOR
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[#FF9E00] transition-colors">
                The Golden Fox
              </h3>
              <div className="text-xs font-mono font-bold text-[#FF9E00] tracking-wide mt-1">
                PATHFINDER FOX // TRAIL MASTER
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-sans">
                Embody the clever, agile <strong className="text-white">Golden Jackal</strong> of Jahangirnagar. Masters of the 10K perimeter loop, red-brick pathways, and obstacle relays. Built for runners, sprinters, and endurance athletes who thrive on physical grit.
              </p>

              {/* Tactical Stats Radar Bars */}
              <div className="mt-6 p-4 rounded-2xl bg-[#0B0F19] border border-[#2A3655]/60 space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Speed & Stamina:</span>
                    <span className="text-[#FF9E00] font-bold">95%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#FF9E00] rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Campus Trail Mastery:</span>
                    <span className="text-[#FF9E00] font-bold">98%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#FF9E00] rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Wilderness Reflex:</span>
                    <span className="text-[#FF9E00] font-bold">90%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#FF9E00] rounded-full w-[90%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Select Button: Arcade Style */}
            <div className="mt-6 pt-4 border-t border-[#2A3655]/60">
              <button
                type="button"
                onMouseEnter={playHover}
                onClick={handleSelectFox}
                className={`w-full py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  selectedAvatar === 'Pathfinder Fox'
                    ? 'bg-[#FF9E00] text-[#0B0F19] shadow-[0_0_25px_rgba(255,158,0,0.5)]'
                    : 'bg-[#182035] text-slate-200 border border-[#2A3655] hover:border-[#FF9E00] hover:text-[#FF9E00] hover:scale-[1.02]'
                }`}
              >
                {selectedAvatar === 'Pathfinder Fox' ? (
                  <>
                    <Check className="w-4 h-4 text-[#0B0F19]" />
                    <span>Pathfinder Fox Selected</span>
                  </>
                ) : (
                  <>
                    <span>Choose Pathfinder Fox</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: The Migratory Bird */}
          <div
            onMouseEnter={playHover}
            className={`hud-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden border ${
              selectedAvatar === 'Skywatcher Bird'
                ? 'border-[#00E5FF] shadow-[0_0_35px_rgba(0,229,255,0.35)] ring-2 ring-[#00E5FF]/60 -translate-y-1'
                : 'border-[#2A3655] hover:border-[#00E5FF]/60 hover:-translate-y-1'
            }`}
          >
            {/* Top Teal Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00E5FF] to-[#10B981]" />

            <div>
              {/* Badge & Class Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-2 rounded-2xl bg-[#182035] border border-[#00E5FF]/40 shadow-inner">
                  🦅
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 uppercase tracking-wider">
                  AERIAL STRATEGIST
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[#00E5FF] transition-colors">
                The Migratory Bird
              </h3>
              <div className="text-xs font-mono font-bold text-[#00E5FF] tracking-wide mt-1">
                SKYWATCHER BIRD // CIPHER CRACKER
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-sans">
                Embody the majestic <strong className="text-white">Siberian and Himalayan winter guests</strong> soaring above JU lakes. Masters of bird sanctuary habitats, tactical treasure hunts, and BioQuest Olympiads. Built for puzzle squads, photographers, and thinkers.
              </p>

              {/* Tactical Stats Radar Bars */}
              <div className="mt-6 p-4 rounded-2xl bg-[#0B0F19] border border-[#2A3655]/60 space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Cipher & Cryptics:</span>
                    <span className="text-[#00E5FF] font-bold">96%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#00E5FF] rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Aerial Observation:</span>
                    <span className="text-[#00E5FF] font-bold">99%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#00E5FF] rounded-full w-[99%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Strategy & Lore:</span>
                    <span className="text-[#00E5FF] font-bold">92%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                    <div className="h-full bg-[#00E5FF] rounded-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Select Button: Arcade Style */}
            <div className="mt-6 pt-4 border-t border-[#2A3655]/60">
              <button
                type="button"
                onMouseEnter={playHover}
                onClick={handleSelectBird}
                className={`w-full py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  selectedAvatar === 'Skywatcher Bird'
                    ? 'bg-[#00E5FF] text-[#0B0F19] shadow-[0_0_25px_rgba(0,229,255,0.5)]'
                    : 'bg-[#182035] text-slate-200 border border-[#2A3655] hover:border-[#00E5FF] hover:text-[#00E5FF] hover:scale-[1.02]'
                }`}
              >
                {selectedAvatar === 'Skywatcher Bird' ? (
                  <>
                    <Check className="w-4 h-4 text-[#0B0F19]" />
                    <span>Skywatcher Bird Selected</span>
                  </>
                ) : (
                  <>
                    <span>Choose Skywatcher Bird</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
