import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle, RotateCcw, ShieldCheck, Star } from 'lucide-react';

export const MissionPassTicket = ({ registration, onReset }) => {
  if (!registration) return null;

  const {
    registrationId,
    avatarClass,
    leadParticipant,
    squadName,
    segments,
    totalFeeBDT,
    payment,
    questLevelStars,
    createdAt,
  } = registration;

  const isVerified = payment?.status === 'verified';

  return (
    <div className="w-full space-y-6 animate-fade-in select-none">
      {/* Top Banner Alert */}
      <div className="hud-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-[#10B981]">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-[#10B981]" />
          <div className="text-left">
            <h4 className="font-display font-extrabold text-white text-base">
              REGISTRATION CONFIRMED // FIELD CREDENTIAL ISSUED
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Save or screenshot this official boarding pass. Present the QR code at Basecamp for wristbands and race kits.
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg bg-[#182035] border border-[#2A3655] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Registration</span>
        </button>
      </div>

      {/* The Printable / Downloadable Mission Boarding Pass Card */}
      <div
        id="mission-boarding-pass"
        className="relative rounded-3xl bg-[#0B0F19] border-2 border-[#00E5FF]/60 shadow-[0_0_40px_rgba(0,229,255,0.25)] overflow-hidden text-left"
      >
        {/* Pass Top Neon Gradient Bar */}
        <div className="h-2.5 bg-gradient-to-r from-[#00E5FF] via-[#FF9E00] to-[#FF2A85]" />

        {/* Pass Header */}
        <div className="p-6 sm:p-8 bg-[#121829] border-b border-[#2A3655] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logos/fest-emblem.svg"
              alt="Fest Emblem"
              className="w-12 h-12 object-contain drop-shadow-[0_0_10px_#FF9E00]"
            />
            <div>
              <div className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold tracking-widest">
                OFFICIAL PARTICIPANT MISSION PASS // JUAS 2026
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                ADVENTURE FEST 3.0
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              MISSION CODE
            </span>
            <span className="font-mono font-black text-xl sm:text-2xl text-[#00E5FF] tracking-wider drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
              {registrationId}
            </span>
          </div>
        </div>

        {/* Pass Core Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1 & 2: Participant & Squad Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  PARTICIPANT / SQUAD LEAD
                </span>
                <span className="font-display font-extrabold text-white text-base">
                  {leadParticipant?.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  AVATAR CLASS
                </span>
                <span className="font-mono font-bold text-[#FF9E00] text-sm">
                  {avatarClass === 'Pathfinder Fox' ? '🦊 Pathfinder Fox' : '🦅 Skywatcher Bird'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  INSTITUTION & DEPT
                </span>
                <span className="font-mono text-xs text-slate-200 block truncate">
                  {leadParticipant?.university}
                </span>
                <span className="font-mono text-[11px] text-slate-400 block truncate">
                  {leadParticipant?.department}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  SQUAD CALL-SIGN
                </span>
                <span className="font-mono text-xs text-[#00E5FF] font-bold">
                  {squadName || 'Solo Operative'}
                </span>
              </div>
            </div>

            {/* Registered Segments */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase mb-1.5">
                ENROLLED QUEST SEGMENTS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {segments?.map((seg) => (
                  <span
                    key={seg._id || seg.code}
                    className="px-2.5 py-1 rounded-lg bg-[#182035] border border-[#2A3655] text-xs font-mono text-slate-200"
                  >
                    {seg.title || seg.code}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment & Security Status */}
            <div className="pt-3 border-t border-[#2A3655]/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400">PAYMENT STATUS: </span>
                <span
                  className={`font-bold ${
                    isVerified ? 'text-[#10B981]' : 'text-[#FF9E00]'
                  }`}
                >
                  {isVerified ? 'VERIFIED ✓' : 'UNDER VERIFICATION (PENDING)'}
                </span>
              </div>
              <div className="text-slate-400">
                TRX: <span className="text-white font-mono">{payment?.transactionId}</span>
              </div>
            </div>
          </div>

          {/* Col 3: QR Code & Verification Stamp */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#121829] border border-[#2A3655] text-center">
            {/* Scannable QR Code */}
            <div className="p-2.5 bg-white rounded-xl shadow-lg mb-3">
              <QRCodeSVG
                value={JSON.stringify({
                  id: registrationId,
                  name: leadParticipant?.name,
                  avatar: avatarClass,
                  status: payment?.status,
                  event: 'JUAS Adventure Fest 3.0',
                })}
                size={140}
                level="H"
              />
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF] font-bold">
              SCAN TO VERIFY CREDENTIALS
            </span>
            <span className="text-[9px] font-mono text-slate-400 mt-1">
              LAT 23.8827° N // JU SAVAR
            </span>
          </div>
        </div>

        {/* Pass Bottom Bar */}
        <div className="p-4 bg-[#070A12] border-t border-[#2A3655] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div>JUAS-FEST-PASS-2026-ENCRYPTED</div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>OFFICIAL STAMP OF JUAS & JU SCIENCE CLUB</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print, Download */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 rounded-xl bg-[#182035] border border-[#2A3655] hover:border-[#00E5FF] text-xs font-mono text-white flex items-center gap-2 transition-all shadow-md"
        >
          <Printer className="w-4 h-4 text-[#00E5FF]" />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
};
