import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Compass, Flag } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const CampusMapSchedule = () => {
  const [activeDay, setActiveDay] = useState(1);
  const { playClick } = useAudio();

  const timelineDay1 = [
    {
      time: '05:45 AM',
      title: 'Basecamp Muster & RFID Bib Distribution',
      location: 'Central Field TSC Pavilions',
      desc: 'Mandatory reporting and physical race bib pickup for JU Wild Trail Marathon.',
      tag: 'LOGISTICS',
    },
    {
      time: '06:30 AM',
      title: 'JU Wild Trail Marathon Flag-off (10K / 5K)',
      location: 'Perimeter Lake Trails',
      desc: 'Endurance run weaving through lake banks, botanical trees, and university red-brick alleys.',
      tag: 'ATHLETICS',
    },
    {
      time: '11:00 AM',
      title: 'Marathon Finisher Ceremony & Hydration Feast',
      location: 'Central Cafeteria Lawn',
      desc: 'Commemorative brass medals awarded to all registered marathon finishers.',
      tag: 'CEREMONY',
    },
    {
      time: '02:00 PM',
      title: 'The Golden Fox Cipher Quest (Treasure Hunt)',
      location: 'Old Arts Faculty to Ruins Zone',
      desc: 'Tactical scavenger hunt across campus ruins; squads decipher cryptic hints to discover secret lockboxes.',
      tag: 'TACTICAL',
    },
    {
      time: '07:00 PM',
      title: 'Bushcraft & Stargazing Night Camp Check-in',
      location: 'Taragonj Sanctuary Perimeter',
      desc: 'Tent pitching, campfire survival cooking, and high-powered telescope stargazing by JU Science Club.',
      tag: 'SURVIVAL',
    },
  ];

  const timelineDay2 = [
    {
      time: '06:30 AM',
      title: 'Bushcraft Morning Tea & Camp Decamp',
      location: 'Sanctuary Shore',
      desc: 'Morning wilderness tea following strict Leave-No-Trace packing standards.',
      tag: 'SURVIVAL',
    },
    {
      time: '07:30 AM',
      title: 'Siberian Migratory Bird Shootout (Photography)',
      location: 'Transport Lake Observatory',
      desc: 'Live nature photography exhibition documenting winter guests over JU lakes.',
      tag: 'CREATIVE',
    },
    {
      time: '11:30 AM',
      title: 'BioQuest & Navigation Olympiad (Quiz)',
      location: 'Zahir Raihan Auditorium',
      desc: 'Survival science, biodiversity trivia, and emergency triage written and buzzer rounds.',
      tag: 'SCIENCE',
    },
    {
      time: '03:00 PM',
      title: 'Extreme Obstacle & Rescue Relay',
      location: 'Physical Education Grounds',
      desc: 'High-octane team obstacle course: crawls, rope crossings, and firecraft trials.',
      tag: 'ATHLETICS',
    },
    {
      time: '06:30 PM',
      title: 'Grand Closing Gala & Champion Prize Awards',
      location: 'Muktamancha Amphitheater',
      desc: 'Trophies, ৳100K prize pool distribution, and acoustic celebration under the open night sky.',
      tag: 'GALA',
    },
  ];

  const activeTimeline = activeDay === 1 ? timelineDay1 : timelineDay2;

  return (
    <section id="schedule" className="py-20 bg-[#070A12] relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182035] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#FF9E00]" />
            <span>CAMPUS RADAR TIMELINE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            SCHEDULE & <span className="text-neon-sunset">EXPEDITION MAP</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Chronological field operations across 2 days of adrenaline and wilderness discovery.
          </p>
        </div>

        {/* Day Switcher Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { day: 1, label: 'DAY 01 // TRAIL & NIGHT CAMP' },
            { day: 2, label: 'DAY 02 // PHOTO, RELAY & GALA' },
          ].map((d) => (
            <button
              key={d.day}
              onClick={() => {
                playClick();
                setActiveDay(d.day);
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-mono font-bold transition-all ${
                activeDay === d.day
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#FF9E00] text-[#0B0F19] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-[#121829] text-slate-400 border border-[#2A3655] hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Timeline Layout */}
        <div className="max-w-4xl mx-auto space-y-6">
          {activeTimeline.map((item, idx) => (
            <div
              key={idx}
              className="hud-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#00E5FF] hover:border-l-[#FF9E00] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-[#00E5FF] font-mono text-xs font-bold shrink-0">
                  <Clock className="w-4 h-4 mb-1 text-[#FF9E00]" />
                  <span>{item.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182035] text-[#FF2A85] border border-[#2A3655] font-bold">
                      {item.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF9E00]" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
