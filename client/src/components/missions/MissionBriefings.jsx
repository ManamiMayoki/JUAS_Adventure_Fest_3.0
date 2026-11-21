import React, { useState, useEffect } from 'react';
import {
  Compass,
  Footprints,
  Tent,
  Camera,
  BookOpen,
  Shield,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import api from '../../services/api';
import { useAudio } from '../../context/AudioContext';
import { useQuest } from '../../context/QuestContext';

const ICON_MAP = {
  Footprints,
  Compass,
  Tent,
  Camera,
  BookOpen,
  Shield,
};

export const MissionBriefings = ({ onOpenRulebook }) => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { playClick, playRadarPing } = useAudio();
  const { selectedSegments, setSelectedSegments } = useQuest();

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await api.get('/segments');
        if (res.data.success) {
          setSegments(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load segments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);

  const categories = ['All', 'Athletics', 'Tactical Exploration', 'Bushcraft & Survival', 'Creative & Science'];

  const filteredSegments =
    activeCategory === 'All'
      ? segments
      : segments.filter((s) => s.category === activeCategory);

  const toggleSelectSegment = (segment) => {
    playClick();
    setSelectedSegments((prev) => {
      const exists = prev.find((s) => s._id === segment._id);
      if (exists) {
        return prev.filter((s) => s._id !== segment._id);
      } else {
        return [...prev, segment];
      }
    });
  };

  return (
    <section id="segments" className="py-20 relative bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] tracking-widest uppercase mb-2">
              <Compass className="w-4 h-4 text-[#FF9E00]" />
              <span>ACTIVE MISSION DIRECTORY</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
              SELECT YOUR <span className="text-neon-sunset">QUESTS</span>
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-slate-400 max-w-md text-sm">
            Each mission carries its own tactical difficulty, squad parameters, and official field pass. Combine multiple quests to maximize your festival experience.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#00E5FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-[#121829] text-slate-300 border border-[#2A3655] hover:border-[#00E5FF]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSegments.map((segment) => {
            const IconComponent = ICON_MAP[segment.iconName] || Compass;
            const isSelected = selectedSegments.some((s) => s._id === segment._id);
            const remaining = Math.max(0, segment.totalSlots - segment.registeredSlots);
            const fillPercentage = Math.min(100, (segment.registeredSlots / segment.totalSlots) * 100);

            return (
              <div
                key={segment._id}
                className={`hud-panel rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                  isSelected
                    ? 'border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.25)] ring-1 ring-[#00E5FF]'
                    : 'hover:border-[#2A3655]/90 hover:-translate-y-1'
                }`}
              >
                {/* Glowing Top Border Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#FF9E00]'
                      : 'bg-[#2A3655] group-hover:bg-[#00E5FF]'
                  }`}
                />

                {/* Top Badge & Difficulty */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#182035] text-[#00E5FF] border border-[#2A3655]">
                      {segment.code}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-extrabold uppercase ${
                        segment.difficulty === 'Elite'
                          ? 'bg-[#FF2A85]/20 text-[#FF2A85] border border-[#FF2A85]/40'
                          : segment.difficulty === 'Veteran'
                          ? 'bg-[#FF9E00]/20 text-[#FF9E00] border border-[#FF9E00]/40'
                          : 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                      }`}
                    >
                      {segment.difficulty}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-[#182035] border border-[#2A3655] text-[#FF9E00] group-hover:text-[#00E5FF] transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-white group-hover:text-[#00E5FF] transition-colors">
                        {segment.title}
                      </h3>
                      <p className="text-xs text-[#00E5FF] font-mono mt-0.5">
                        {segment.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 mb-5 leading-relaxed">
                    {segment.description}
                  </p>

                  {/* Tactical Specs Table */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mb-5 p-3 rounded-xl bg-[#0B0F19]/80 border border-[#2A3655]/50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span className="truncate">{segment.scheduleTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF9E00]" />
                      <span className="truncate">{segment.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF2A85]" />
                      <span>
                        Squad: {segment.squadMin === segment.squadMax ? segment.squadMin : `${segment.squadMin}-${segment.squadMax}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <Award className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>৳{segment.feeBDT} BDT</span>
                    </div>
                  </div>

                  {/* Slot Capacity Meter */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-slate-400">SLOT CAPACITY</span>
                      <span className="text-[#00E5FF] font-bold">
                        {remaining} LEFT ({segment.totalSlots} TOTAL)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#182035] overflow-hidden">
                      <div
                        style={{ width: `${fillPercentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          fillPercentage > 85 ? 'bg-[#FF2A85]' : 'bg-[#00E5FF]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#2A3655]/60">
                  <button
                    onClick={() => {
                      playRadarPing();
                      onOpenRulebook(segment);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#182035] hover:bg-[#202945] text-slate-300 hover:text-white border border-[#2A3655] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FF9E00]" />
                    <span>Rulebook</span>
                  </button>

                  <button
                    onClick={() => toggleSelectSegment(segment)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#10B981] text-[#0B0F19] shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-r from-[#00E5FF] to-[#FF9E00] text-[#0B0F19] hover:opacity-95'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#0B0F19]" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Quest</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
