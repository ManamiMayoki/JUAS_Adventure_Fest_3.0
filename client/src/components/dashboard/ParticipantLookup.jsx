import React, { useState } from 'react';
import { Search, X, AlertCircle, CheckCircle, Ticket, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { MissionPassTicket } from '../registration/MissionPassTicket';
import { useAudio } from '../../context/AudioContext';

export const ParticipantLookup = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { playClick, playRadarPing } = useAudio();

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await api.get(`/registrations/lookup?query=${encodeURIComponent(query.trim())}`);
      if (res.data.success) {
        playRadarPing();
        setResult(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'No matching mission pass found for your query.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0B0F19] border border-[#00E5FF]/40 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#121829] border-b border-[#2A3655] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-[#00E5FF]" />
            <div>
              <h3 className="font-display font-black text-xl text-white">
                PARTICIPANT PASS LOOKUP
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Search via Registration Code (e.g. JUAS-3.0#1042) or Registered Email
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#182035] text-slate-400 hover:text-white border border-[#2A3655]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Registration ID, Email, or Transaction ID..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121829] border border-[#2A3655] text-white text-sm focus:border-[#00E5FF] outline-none font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0B0F19] font-display font-black text-xs uppercase flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>{loading ? 'Searching...' : 'Lookup Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Error */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              <MissionPassTicket registration={result} onReset={() => setResult(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
