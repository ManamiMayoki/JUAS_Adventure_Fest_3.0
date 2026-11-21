import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const { playClick } = useAudio();

  const faqs = [
    {
      q: 'Who is eligible to participate in Adventure Fest 3.0?',
      a: 'Adventure Fest 3.0 is open to university students, college students, outdoor enthusiasts, and registered running squads from all across Bangladesh. You do not need to be a JU student to participate.',
    },
    {
      q: 'Can I register for multiple quest segments?',
      a: 'Yes! The registration wizard allows combining multiple events (e.g., Marathon + Night Camp + Photography). The system dynamically calculates your total entry fee and issues a single unified QR Mission Pass.',
    },
    {
      q: 'How does payment verification work?',
      a: 'After sending money through bKash, Nagad, or Rocket to the official merchant number, submit your TrxID and Sender Number in Step 4. Your Mission Pass will be generated instantly and marked "Pending Verification". JUAS organizers verify transactions within 2-4 hours.',
    },
    {
      q: 'What is included in the registration kit?',
      a: 'Every registered participant receives an official fest dry-fit t-shirt, custom brass commemorative medal (upon completing their segment), official credentials pass, energy hydration packs, and access to medical stations.',
    },
    {
      q: 'What safety measures and wildlife protocols are in place?',
      a: 'JUAS coordinates directly with the JU Proctor Office and Medical Center. Paramedics and hydration stations are stationed along the entire 10K perimeter loop. As Jahangirnagar University is an eco-sensitive sanctuary for migratory birds and jackals, strict Leave-No-Trace rules and no-horn policies are enforced.',
    },
  ];

  const toggleFAQ = (idx) => {
    playClick();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#070A12] relative select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182035] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>KNOWLEDGE BASE & GUIDELINES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            FREQUENTLY ASKED <span className="text-neon-sunset">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="hud-panel rounded-2xl border border-[#2A3655] overflow-hidden text-left transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-display font-extrabold text-base sm:text-lg text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00E5FF] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#2A3655]/50 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
