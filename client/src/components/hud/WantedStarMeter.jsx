import React from 'react';
import { Star } from 'lucide-react';
import { useQuest } from '../../context/QuestContext';
import { useAudio } from '../../context/AudioContext';

const STAR_LABELS = {
  1: 'RECRUIT',
  2: 'EXPLORER',
  3: 'PATHFINDER',
  4: 'VETERAN',
  5: 'QUEST READY',
};

export const WantedStarMeter = ({ minimal = false }) => {
  const { questStars } = useQuest();
  const { playBirdChirp } = useAudio();

  return (
    <div
      onClick={playBirdChirp}
      className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#121829] border border-[#2A3655] backdrop-blur-md cursor-pointer hover:border-[#00E5FF]/40 transition-all select-none"
      title={`Quest Level: ${questStars} of 5 (${STAR_LABELS[questStars]})`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const isActive = starNum <= questStars;
          return (
            <Star
              key={starNum}
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                isActive
                  ? 'text-[#FF9E00] fill-[#FF9E00]'
                  : 'text-slate-600 fill-transparent'
              }`}
            />
          );
        })}
      </div>
      {!minimal && (
        <span className="hidden xl:inline text-[10px] font-mono tracking-wider font-bold text-[#00E5FF] ml-1">
          {STAR_LABELS[questStars]}
        </span>
      )}
    </div>
  );
};
