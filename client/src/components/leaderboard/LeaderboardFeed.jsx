import React, { useState } from 'react';
import { Trophy, Radio, Flame, Sparkles } from 'lucide-react';

export const LeaderboardFeed = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const topSquads = [
    { rank: 1, name: 'Wild Foxes Alpha', score: '2,940 PTS', avatar: '🦊', tag: 'JU CSE 48' },
    { rank: 2, name: 'Siberian Soarers', score: '2,810 PTS', avatar: '🦅', tag: 'DU Zoology' },
    { rank: 3, name: 'Red Brick Runners', score: '2,750 PTS', avatar: '🦊', tag: 'JU Pharmacy' },
    { rank: 4, name: 'Cipher Navigators', score: '2,620 PTS', avatar: '🦅', tag: 'IUT Outdoor' },
    { rank: 5, name: 'Lake Patrol Vanguard', score: '2,490 PTS', avatar: '🦊', tag: 'JU Physics' },
  ];

  const liveAnnouncements = [
    {
      time: '10 mins ago',
      title: 'Marathon Route Water Point 03 Restocked',
      text: 'Electrolytes and cold water replenished at Transport Lake Ghat checkpoint.',
      badge: 'TRAIL UPDATE',
    },
    {
      time: '35 mins ago',
      title: 'Night Camp Stargazing Telescopes Calibrated',
      text: 'JU Science Club has set up 8-inch Dobsonian telescopes ready for Saturn & Jupiter observation.',
      badge: 'CAMP DISPATCH',
    },
    {
      time: '1 hour ago',
      title: 'Treasure Hunt Relic #4 Discovered',
      text: 'Squad "Wild Foxes Alpha" cracked the Old Arts Faculty Sanskrit inscription clue.',
      badge: 'QUEST FEED',
    },
  ];

  return (
    <section id="leaderboard" className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182035] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-3">
            <Radio className="w-3.5 h-3.5 text-[#FF2A85] animate-pulse" />
            <span>REAL-TIME FIELD TELEMETRY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            QUEST LEADERBOARD & <span className="text-neon-sunset">LIVE FEED</span>
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#00E5FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-[#121829] text-slate-400 border border-[#2A3655]'
            }`}
          >
            Squad Standings
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-[#FF9E00] text-[#0B0F19] shadow-[0_0_15px_rgba(255,158,0,0.4)]'
                : 'bg-[#121829] text-slate-400 border border-[#2A3655]'
            }`}
          >
            Live Announcements Feed
          </button>
        </div>

        {/* Content Box */}
        <div className="max-w-3xl mx-auto">
          {activeTab === 'leaderboard' ? (
            <div className="hud-panel rounded-2xl overflow-hidden border border-[#2A3655]">
              <div className="divide-y divide-[#2A3655]/60">
                {topSquads.map((squad) => (
                  <div
                    key={squad.rank}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#182035]/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-xs ${
                          squad.rank === 1
                            ? 'bg-[#FF9E00] text-[#0B0F19] shadow-[0_0_10px_#FF9E00]'
                            : squad.rank === 2
                            ? 'bg-[#00E5FF] text-[#0B0F19]'
                            : squad.rank === 3
                            ? 'bg-[#FF2A85] text-white'
                            : 'bg-[#182035] text-slate-400'
                        }`}
                      >
                        #{squad.rank}
                      </span>
                      <span className="text-2xl">{squad.avatar}</span>
                      <div className="text-left">
                        <div className="font-display font-extrabold text-white text-base">
                          {squad.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {squad.tag}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-black text-sm text-[#00E5FF]">
                      {squad.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {liveAnnouncements.map((ann, idx) => (
                <div
                  key={idx}
                  className="hud-panel p-5 rounded-2xl border-l-4 border-l-[#FF2A85] text-left"
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#FF2A85]/20 text-[#FF2A85] font-bold">
                      {ann.badge}
                    </span>
                    <span className="text-slate-500">{ann.time}</span>
                  </div>
                  <h4 className="font-display font-extrabold text-white text-base">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ann.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
