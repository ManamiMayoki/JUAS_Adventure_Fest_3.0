import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  Users,
  Compass,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAudio } from '../../context/AudioContext';
import { useQuest } from '../../context/QuestContext';
import { MissionPassTicket } from './MissionPassTicket';

export const RegistrationWizard = () => {
  const [step, setStep] = useState(1);
  const [availableSegments, setAvailableSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { playClick, playLevelUp, playBirdChirp } = useAudio();
  const {
    selectedAvatar,
    setSelectedAvatar,
    selectedSegments,
    setSelectedSegments,
    registrationSuccessData,
    setRegistrationSuccessData,
    setQuestStars,
  } = useQuest();

  // Form State
  const [formData, setFormData] = useState({
    leadParticipant: {
      name: '',
      email: '',
      phone: '',
      university: 'Jahangirnagar University',
      department: '',
      studentId: '',
      emergencyContact: '',
      tShirtSize: 'L',
    },
    squadName: '',
    squadMembers: [],
    payment: {
      method: 'bKash',
      transactionId: '',
      senderNumber: '',
      amountPaidBDT: 0,
    },
  });

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await api.get('/segments');
        if (res.data.success) {
          setAvailableSegments(res.data.data);
        }
      } catch (e) {}
    };
    fetchSegments();
  }, []);

  // Compute total registration fee
  const totalFeeBDT = selectedSegments.reduce((sum, seg) => sum + seg.feeBDT, 0);

  // Sync amount paid to total fee
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        amountPaidBDT: totalFeeBDT,
      },
    }));
  }, [totalFeeBDT]);

  // Determine if squad requires multiple member inputs
  const maxSquadRequired = selectedSegments.reduce((max, s) => Math.max(max, s.squadMax || 1), 1);
  const isSquadQuest = maxSquadRequired > 1;

  const handleNextStep = () => {
    playClick();
    setErrorMsg('');

    if (step === 1) {
      setStep(2);
      setQuestStars((prev) => Math.max(prev, 2));
    } else if (step === 2) {
      if (selectedSegments.length === 0) {
        setErrorMsg('Please select at least one quest segment to continue.');
        return;
      }
      setStep(3);
      setQuestStars((prev) => Math.max(prev, 3));
    } else if (step === 3) {
      const { leadParticipant } = formData;
      if (
        !leadParticipant.name ||
        !leadParticipant.email ||
        !leadParticipant.phone ||
        !leadParticipant.department ||
        !leadParticipant.studentId ||
        !leadParticipant.emergencyContact
      ) {
        setErrorMsg('Please complete all required participant information fields.');
        return;
      }
      setStep(4);
      setQuestStars((prev) => Math.max(prev, 4));
    }
  };

  const handlePrevStep = () => {
    playClick();
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSquadMember = () => {
    if (formData.squadMembers.length + 1 >= maxSquadRequired) {
      setErrorMsg(`Maximum squad size for selected quests is ${maxSquadRequired} members.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      squadMembers: [
        ...prev.squadMembers,
        { name: '', email: '', phone: '', studentId: '', tShirtSize: 'L' },
      ],
    }));
  };

  const handleRemoveSquadMember = (idx) => {
    setFormData((prev) => ({
      ...prev,
      squadMembers: prev.squadMembers.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.payment.transactionId || !formData.payment.senderNumber) {
      setErrorMsg('Please provide your payment Transaction ID and Sender Mobile Number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        avatarClass: selectedAvatar,
        leadParticipant: formData.leadParticipant,
        squadName: formData.squadName,
        squadMembers: formData.squadMembers,
        segmentIds: selectedSegments.map((s) => s._id),
        payment: formData.payment,
      };

      const res = await api.post('/registrations', payload);

      if (res.data.success) {
        playLevelUp();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00E5FF', '#FF9E00', '#FF2A85', '#10B981'],
        });
        setRegistrationSuccessData(res.data.data);
        setQuestStars(5);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit quest registration. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  // If successfully registered, show the Digital Mission Pass!
  if (registrationSuccessData) {
    return (
      <section id="register" className="py-20 bg-[#0B0F19] relative">
        <div className="max-w-4xl mx-auto px-4">
          <MissionPassTicket
            registration={registrationSuccessData}
            onReset={() => {
              setRegistrationSuccessData(null);
              setStep(1);
              setSelectedSegments([]);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 bg-[#0B0F19] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182035] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9E00]" />
            <span>INTERACTIVE SQUAD ENROLLMENT</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            QUEST <span className="text-neon-sunset">REGISTRATION WIZARD</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Step through 4 tactical checkpoints to acquire your official festival credentials.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="hud-panel p-4 rounded-2xl mb-8">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            {[
              { num: 1, label: 'Avatar Class' },
              { num: 2, label: 'Select Quests' },
              { num: 3, label: 'Squad Roster' },
              { num: 4, label: 'Field Pass' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all ${
                  step === s.num
                    ? 'bg-[#00E5FF] text-[#0B0F19] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : step > s.num
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'bg-[#182035] text-slate-500 border border-[#2A3655]'
                }`}
              >
                <div className="text-base font-display font-extrabold">{s.num}</div>
                <div className="text-[10px] truncate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs font-mono animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Multi-Step Wizard Body */}
        <div className="hud-panel p-6 sm:p-8 rounded-3xl border border-[#2A3655]">
          {/* STEP 1: CHOOSE AVATAR / CLASS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-left">
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Step 1: Choose Your Quest Class
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select your spirit mascot. Each class carries tactical personality traits and custom commemorative pass styling.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Pathfinder Fox Card */}
                <div
                  onClick={() => {
                    playBirdChirp();
                    setSelectedAvatar('Pathfinder Fox');
                  }}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedAvatar === 'Pathfinder Fox'
                      ? 'bg-[#182035] border-[#FF9E00] shadow-[0_0_25px_rgba(255,158,0,0.3)] ring-2 ring-[#FF9E00]'
                      : 'bg-[#121829] border-[#2A3655] hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">🦊</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF9E00]/20 text-[#FF9E00] border border-[#FF9E00]/40 font-bold">
                      GROUND NAVIGATOR
                    </span>
                  </div>
                  <h4 className="font-display font-black text-xl text-white">
                    Pathfinder Fox
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Ideal for marathon runners, trail athletes, and ground tacticians. Emphasizes endurance, rapid instinct, and campus trail mastery.
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#2A3655]/60 text-[11px] font-mono space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Agility & Speed:</span>
                      <span className="text-[#FF9E00]">★★★★★</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trail Navigation:</span>
                      <span className="text-[#FF9E00]">★★★★☆</span>
                    </div>
                  </div>
                </div>

                {/* Skywatcher Bird Card */}
                <div
                  onClick={() => {
                    playBirdChirp();
                    setSelectedAvatar('Skywatcher Bird');
                  }}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedAvatar === 'Skywatcher Bird'
                      ? 'bg-[#182035] border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)] ring-2 ring-[#00E5FF]'
                      : 'bg-[#121829] border-[#2A3655] hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">🦅</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold">
                      AERIAL STRATEGIST
                    </span>
                  </div>
                  <h4 className="font-display font-black text-xl text-white">
                    Skywatcher Bird
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Designed for treasure hunt squads, photographers, and puzzle solvers. Emphasizes eagle-eyed perception, cipher cracking, and overview strategy.
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#2A3655]/60 text-[11px] font-mono space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Cipher Analysis:</span>
                      <span className="text-[#00E5FF]">★★★★★</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perception:</span>
                      <span className="text-[#00E5FF]">★★★★★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT QUEST SEGMENTS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-left">
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Step 2: Choose Event Quests
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select one or more segments. The fee calculator will automatically tally your registration total in real time.
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {availableSegments.map((seg) => {
                  const isChecked = selectedSegments.some((s) => s._id === seg._id);
                  return (
                    <div
                      key={seg._id}
                      onClick={() => {
                        playClick();
                        setSelectedSegments((prev) =>
                          isChecked
                            ? prev.filter((s) => s._id !== seg._id)
                            : [...prev, seg]
                        );
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#182035] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                          : 'bg-[#121829] border-[#2A3655] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-[#00E5FF] border-[#00E5FF] text-[#0B0F19]'
                              : 'border-slate-500 bg-transparent'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-display font-extrabold text-white text-sm">
                            {seg.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {seg.scheduleTime} • {seg.location}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-[#FF9E00] text-sm">
                          ৳{seg.feeBDT} BDT
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          {seg.difficulty}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fee Calculator Subtotal Bar */}
              <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#2A3655] flex items-center justify-between font-mono">
                <span className="text-xs text-slate-300">
                  SELECTED QUESTS: <strong>{selectedSegments.length}</strong>
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-400 mr-2">TOTAL ENTRY FEE:</span>
                  <span className="text-lg font-bold text-[#00E5FF]">৳{totalFeeBDT} BDT</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SQUAD ROSTER & ACADEMIC INFO */}
          {step === 3 && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Step 3: Squad Leader & Member Roster
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter official participant details. T-shirt sizes and emergency contacts are used for race kits and trail safety.
                </p>
              </div>

              {/* Squad Name (if multi-member) */}
              {isSquadQuest && (
                <div>
                  <label className="block text-xs font-mono text-[#00E5FF] uppercase mb-1">
                    Squad / Team Call-Sign
                  </label>
                  <input
                    type="text"
                    value={formData.squadName}
                    onChange={(e) =>
                      setFormData({ ...formData, squadName: e.target.value })
                    }
                    placeholder="e.g. Phoenix Explorers // JU 49"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-sm focus:border-[#00E5FF] outline-none"
                  />
                </div>
              )}

              {/* Lead Participant Grid */}
              <div className="p-4 rounded-2xl bg-[#121829] border border-[#2A3655] space-y-4">
                <div className="text-xs font-mono font-bold text-[#FF9E00] uppercase">
                  {isSquadQuest ? 'SQUAD LEADER (PRIMARY CONTACT)' : 'PARTICIPANT DETAILS'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.leadParticipant.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.leadParticipant.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="tanvir@ju.ac.bd"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.leadParticipant.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Emergency Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.leadParticipant.emergencyContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            emergencyContact: e.target.value,
                          },
                        })
                      }
                      placeholder="018XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      University / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.leadParticipant.university}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            university: e.target.value,
                          },
                        })
                      }
                      placeholder="Jahangirnagar University"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Department & Student ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.leadParticipant.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            department: e.target.value,
                          },
                        })
                      }
                      placeholder="Chemistry // ID: 2021-081"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      T-Shirt Size
                    </label>
                    <select
                      value={formData.leadParticipant.tShirtSize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leadParticipant: {
                            ...formData.leadParticipant,
                            tShirtSize: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm focus:border-[#00E5FF] outline-none"
                    >
                      <option value="S">Small (S)</option>
                      <option value="M">Medium (M)</option>
                      <option value="L">Large (L)</option>
                      <option value="XL">Extra Large (XL)</option>
                      <option value="XXL">Double XL (XXL)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Squad Members (if squad size > 1) */}
              {isSquadQuest && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300">
                      SQUAD MEMBERS ({formData.squadMembers.length + 1} / {maxSquadRequired})
                    </span>
                    {formData.squadMembers.length + 1 < maxSquadRequired && (
                      <button
                        type="button"
                        onClick={handleAddSquadMember}
                        className="px-3 py-1 rounded-lg bg-[#182035] border border-[#00E5FF]/40 text-xs font-mono text-[#00E5FF] hover:bg-[#202945]"
                      >
                        + Add Member
                      </button>
                    )}
                  </div>

                  {formData.squadMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#2A3655] flex flex-wrap gap-2 items-center justify-between"
                    >
                      <span className="text-xs font-mono text-[#FF9E00]">
                        Member #{idx + 2}
                      </span>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...formData.squadMembers];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, squadMembers: updated });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#121829] border border-[#2A3655] text-xs text-white"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) => {
                          const updated = [...formData.squadMembers];
                          updated[idx].email = e.target.value;
                          setFormData({ ...formData, squadMembers: updated });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#121829] border border-[#2A3655] text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSquadMember(idx)}
                        className="text-xs text-red-400 hover:text-red-300 font-mono"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PAYMENT VERIFICATION & INSTANT PASS ISSUANCE */}
          {step === 4 && (
            <form onSubmit={handleSubmitRegistration} className="space-y-6 text-left">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Step 4: Payment Verification & Boarding Pass
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send exact total registration fee via bKash, Nagad, or Rocket to receive your instant digital Mission Pass.
                </p>
              </div>

              {/* Payment Summary Box */}
              <div className="p-4 rounded-2xl bg-[#121829] border border-[#2A3655] space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#2A3655]/60 text-xs font-mono">
                  <span className="text-slate-300">Total Payable Amount:</span>
                  <span className="text-lg font-bold text-[#00E5FF]">৳{totalFeeBDT} BDT</span>
                </div>

                {/* Mobile Financial Service Channels */}
                <div className="grid grid-cols-3 gap-2">
                  {['bKash', 'Nagad', 'Rocket'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          payment: { ...formData.payment, method: m },
                        })
                      }
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        formData.payment.method === m
                          ? 'bg-[#FF2A85] text-white shadow-[0_0_15px_rgba(255,42,133,0.4)]'
                          : 'bg-[#0B0F19] text-slate-400 border border-[#2A3655]'
                      }`}
                    >
                      {m} Merchant
                    </button>
                  ))}
                </div>

                {/* Merchant Instruction */}
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-[11px] font-mono text-slate-300 space-y-1">
                  <div>
                    Merchant Number (Send Money / Make Payment):{' '}
                    <strong className="text-[#FF9E00]">01711-000001</strong>
                  </div>
                  <div>Reference / Counter: <strong>FEST3</strong></div>
                </div>
              </div>

              {/* Transaction Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.payment.transactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment: {
                          ...formData.payment,
                          transactionId: e.target.value.toUpperCase(),
                        },
                      })
                    }
                    placeholder="e.g. 9J2K8L7M6N"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm font-mono uppercase focus:border-[#00E5FF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Sender Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.payment.senderNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment: {
                          ...formData.payment,
                          senderNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#2A3655] text-white text-xs sm:text-sm font-mono focus:border-[#00E5FF] outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-display font-black text-base text-[#0B0F19] bg-gradient-to-r from-[#00E5FF] via-[#FF9E00] to-[#FF2A85] hover:opacity-95 shadow-[0_0_30px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>AUTHENTICATING & GENERATING PASS...</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-[#0B0F19]" />
                    <span>FINALIZE & ISSUE MISSION PASS</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Wizard Navigation Footer */}
          {step < 4 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#2A3655]/60 mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 1}
                className="px-4 py-2 rounded-xl bg-[#121829] border border-[#2A3655] text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-display font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#00c8e0] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
