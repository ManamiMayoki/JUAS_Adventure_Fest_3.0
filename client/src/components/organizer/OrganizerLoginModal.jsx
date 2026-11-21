import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Key, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export const OrganizerLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { playClick, playLevelUp } = useAudio();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      playLevelUp();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Check your organizer credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    playClick();
    if (type === 'admin') {
      setEmail('admin@juas.org');
      setPassword('AdventureFest2026!');
    } else {
      setEmail('organizer@juas.org');
      setPassword('WildQuest2026!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#0B0F19] border border-[#FF9E00]/50 rounded-3xl shadow-[0_0_50px_rgba(255,158,0,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#121829] border-b border-[#2A3655] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#FF9E00]" />
            <div>
              <h3 className="font-display font-black text-xl text-white">
                ORGANIZER AUTHENTICATION
              </h3>
              <p className="text-[11px] font-mono text-[#FF9E00]">
                RBAC ACCESS // JUAS TREASURY & LOGISTICS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#182035] text-slate-400 hover:text-white border border-[#2A3655]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Authorized Organizer Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@juas.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121829] border border-[#2A3655] text-white text-xs sm:text-sm font-mono focus:border-[#FF9E00] outline-none"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121829] border border-[#2A3655] text-white text-xs sm:text-sm font-mono focus:border-[#FF9E00] outline-none"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-display font-black text-xs uppercase bg-[#FF9E00] text-[#0B0F19] hover:bg-[#e08b00] shadow-[0_0_20px_rgba(255,158,0,0.4)] transition-all"
            >
              {loading ? 'Verifying Security Clearance...' : 'Authenticate & Unlock'}
            </button>
          </form>

          {/* Quick Fill Credentials Demo Badges */}
          <div className="mt-6 pt-4 border-t border-[#2A3655]/60 text-center">
            <span className="text-[10px] font-mono text-slate-400 block mb-2">
              DEMO / EVALUATION CLEARANCE PRESETS
            </span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-3 py-1 rounded-lg bg-[#182035] border border-[#2A3655] hover:border-[#FF9E00] text-[11px] font-mono text-slate-300"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('organizer')}
                className="px-3 py-1 rounded-lg bg-[#182035] border border-[#2A3655] hover:border-[#00E5FF] text-[11px] font-mono text-slate-300"
              >
                Logistics Organizer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
