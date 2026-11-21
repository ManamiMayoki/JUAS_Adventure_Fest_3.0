import React, { useState } from 'react';
import { Compass, MapPin, Maximize2, Minimize2, Radio } from 'lucide-react';
import { useQuest, CAMPUS_ZONES } from '../../context/QuestContext';
import { useAudio } from '../../context/AudioContext';

export const CampusRadar = () => {
  const { currentZone, currentZoneIndex } = useQuest();
  const { playRadarPing } = useAudio();
  const [collapsed, setCollapsed] = useState(false);

  const blips = [
    { x: 30, y: 70, name: 'Basecamp' },
    { x: 50, y: 30, name: 'Marathon' },
    { x: 75, y: 45, name: 'Ruins' },
    { x: 25, y: 25, name: 'Night Camp' },
    { x: 65, y: 80, name: 'Checkpoint' },
  ];

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      {collapsed ? (
        <button
          onClick={() => {
            playRadarPing();
            setCollapsed(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#121829]/95 border border-[#00E5FF]/40 text-[#00E5FF] shadow-2xl backdrop-blur-md hover:bg-[#182035] transition-all text-xs font-mono"
        >
          <Radio className="w-4 h-4 animate-pulse text-[#00E5FF]" />
          <span>RADAR // {currentZone.name}</span>
        </button>
      ) : (
        <div className="w-56 p-3 rounded-2xl bg-[#0B0F19]/95 border border-[#2A3655] shadow-[0_0_30px_rgba(0,229,255,0.15)] backdrop-blur-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#2A3655]/60">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00E5FF] font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#FF9E00]" />
              <span>JU CAMPUS RADAR</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-slate-400 hover:text-white"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Circular Radar Display */}
          <div
            onClick={playRadarPing}
            className="relative w-48 h-48 mx-auto my-2 rounded-full border border-[#00E5FF]/30 bg-[#0B0F19] overflow-hidden cursor-crosshair group shadow-inner"
          >
            {/* Range Rings */}
            <div className="absolute inset-4 rounded-full border border-[#00E5FF]/15" />
            <div className="absolute inset-12 rounded-full border border-[#00E5FF]/20" />
            <div className="absolute inset-20 rounded-full border border-[#00E5FF]/30" />

            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#00E5FF]/20" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#00E5FF]/20" />

            {/* Radar Rotating Sweep Line */}
            <div className="absolute inset-0 rounded-full origin-center animate-radar-sweep pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#00E5FF]/25 to-transparent origin-bottom-right" />
            </div>

            {/* Campus Zone Blips */}
            {blips.map((blip, idx) => {
              const isCurrent = idx === currentZoneIndex;
              return (
                <div
                  key={idx}
                  style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/blip"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#FF9E00] ring-4 ring-[#FF9E00]/40 scale-125'
                        : 'bg-[#00E5FF]/60 hover:bg-[#00E5FF]'
                    }`}
                  />
                  <span className="absolute left-3 top-[-6px] hidden group-hover/blip:block bg-[#121829] text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#2A3655] whitespace-nowrap text-white z-10">
                    {blip.name}
                  </span>
                </div>
              );
            })}

            {/* Center Player Pointer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#FF2A85] rounded-full shadow-[0_0_8px_#FF2A85]" />
          </div>

          {/* Active Zone & GPS Telemetry */}
          <div className="pt-1.5 border-t border-[#2A3655]/60 flex flex-col gap-0.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[#FF9E00] font-semibold">{currentZone.tag}</span>
              <span className="text-slate-400">23.88°N 90.26°E</span>
            </div>
            <div className="text-slate-200 font-medium truncate">{currentZone.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};
