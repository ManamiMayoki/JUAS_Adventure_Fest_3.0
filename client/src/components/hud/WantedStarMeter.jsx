import React from 'react';
import { Star } from 'lucide-react';
import { useQuest } from '../../context/QuestContext';
import { useAudio } from '../../context/AudioContext';

const STAR_LABELS = {
  1: 'RECRUIT // SCOUTING',
  2: 'EXPLORER // ACTIVE',
  3: 'PATHFINDER // SQUAD READY',
  4: 'VETERAN // QUEST COMMITTED',
  5: 'QUEST READY // MISSION PASS UNLOCKED',
};

export const WantedStarMeter = () => {
  const { questStars } = useQuest();
  const { playBirdChirp } = useAudio();

  return (
    <div
      onClick={playBirdChirp}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121829]/90 border border-[#2A3655] backdrop-blur-md shadow-lg cursor-pointer hover:border-[#00E5FF]/50 transition-all group"
      title="Quest Level Meter — Complete registrations and explore zones to reach 5 Stars"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const isActive = starNum <= questStars;
          return (
            <div key={starNum} className="relative">
              <Star
                className={`w-4 h-4 transition-all duration-300 ${
                  isActive
                    ? 'text-[#FF9E00] fill-[#FF9E00] star-active'
                    : 'text-slate-600 fill-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[10px] font-mono tracking-wider font-bold text-[#00E5FF]">
          {STAR_LABELS[questStars] || 'RECRUIT'}
        </span>
      </div>
    </div>
  );
};
