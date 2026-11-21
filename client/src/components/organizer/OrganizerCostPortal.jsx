import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Search,
  Filter,
  LogOut,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export const OrganizerCostPortal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { playClick, playLevelUp } = useAudio();

  const [activeTab, setActiveTab] = useState('budget'); // 'budget' or 'registrations'
  const [budgetData, setBudgetData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regSearch, setRegSearch] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // New Budget Item Form Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'Logistics & Permits',
    title: '',
    description: '',
    plannedAmountBDT: 0,
    actualAmountBDT: 0,
    receiptNumber: '',
    receiptNote: '',
    status: 'planned',
    isIncome: false,
  });

  const categories = [
    'Logistics & Permits',
    'Kits, Medals & T-Shirts',
    'Marathon Hydration & Medical',
    'Treasure Hunt & Quest Props',
    'Food & Refreshments',
    'Sound, Lighting & Stage',
    'Branding & Printing',
    'Emergency & Contingency',
    'Sponsorship & Grant Inflow',
  ];

  const fetchBudgetSummary = async () => {
    try {
      const res = await api.get('/budget/summary');
      if (res.data.success) {
        setBudgetData(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get(`/registrations?status=${regStatusFilter}&search=${encodeURIComponent(regSearch)}`);
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([fetchBudgetSummary(), fetchRegistrations()]).finally(() =>
        setLoading(false)
      );
    }
  }, [isOpen, regStatusFilter]);

  if (!isOpen) return null;

  const handleCreateBudgetItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        plannedAmountBDT: Number(newItem.plannedAmountBDT),
        actualAmountBDT: Number(newItem.actualAmountBDT),
        isIncome: newItem.category === 'Sponsorship & Grant Inflow' || newItem.isIncome,
      };
      const res = await api.post('/budget/items', payload);
      if (res.data.success) {
        playLevelUp();
        setIsItemModalOpen(false);
        setNewItem({
          category: 'Logistics & Permits',
          title: '',
          description: '',
          plannedAmountBDT: 0,
          actualAmountBDT: 0,
          receiptNumber: '',
          receiptNote: '',
          status: 'planned',
          isIncome: false,
        });
        fetchBudgetSummary();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this budget line item?')) return;
    try {
      await api.delete(`/budget/items/${id}`);
      playClick();
      fetchBudgetSummary();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyPayment = async (regId, status) => {
    try {
      playClick();
      const res = await api.patch(`/registrations/${regId}/verify`, { status });
      if (res.data.success) {
        fetchRegistrations();
        fetchBudgetSummary();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    window.open(`${api.defaults.baseURL}/budget/export/csv`, '_blank');
  };

  const financials = budgetData?.financials || {};
  const participants = budgetData?.participants || {};
  const isSurplus = (financials.netSurplusDeficitBDT || 0) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0B0F19] border border-[#00E5FF]/40 rounded-3xl shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden text-left">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#121829] border-b border-[#2A3655] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#182035] border border-[#00E5FF]/40 text-[#00E5FF]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#00E5FF] font-bold tracking-wider">
                ORGANIZER PORTAL // TREASURY & LOGISTICS
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                Cost Calculator & Financial Ledger
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
              Logged in as: <strong className="text-white">{user?.name}</strong> ({user?.role})
            </span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#182035] text-slate-400 hover:text-red-400 border border-[#2A3655] flex items-center gap-1.5 text-xs font-mono"
              title="Logout Organizer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#182035] text-slate-400 hover:text-white border border-[#2A3655]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 bg-[#0B0F19] border-b border-[#2A3655] flex gap-3 text-xs font-mono">
          <button
            onClick={() => {
              playClick();
              setActiveTab('budget');
            }}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'budget'
                ? 'bg-[#00E5FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-[#182035] text-slate-400 border border-[#2A3655]'
            }`}
          >
            Budget & Break-Even Simulator
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('registrations');
            }}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'registrations'
                ? 'bg-[#FF9E00] text-[#0B0F19] shadow-[0_0_15px_rgba(255,158,0,0.4)]'
                : 'bg-[#182035] text-slate-400 border border-[#2A3655]'
            }`}
          >
            Payment Verification ({registrations.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {activeTab === 'budget' ? (
            <>
              {/* Financial Metrics Cards (Dynamic Per-Head & Break-Even) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="hud-panel p-4 rounded-2xl border-l-4 border-l-[#00E5FF]">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    REGISTRATION REVENUE
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                    ৳{(financials.registrationRevenueBDT || 0).toLocaleString()} BDT
                  </div>
                  <span className="text-[10px] font-mono text-[#00E5FF]">
                    {participants.verifiedRegistrations || 0} Confirmed Payers
                  </span>
                </div>

                <div className="hud-panel p-4 rounded-2xl border-l-4 border-l-[#FF9E00]">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    SPONSORSHIP INFLOW
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                    ৳{(financials.sponsorshipInflowBDT || 0).toLocaleString()} BDT
                  </div>
                  <span className="text-[10px] font-mono text-[#FF9E00]">
                    Grameenphone & Outdoor Grants
                  </span>
                </div>

                <div className="hud-panel p-4 rounded-2xl border-l-4 border-l-[#FF2A85]">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    ACTUAL EXPENSES
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                    ৳{(financials.totalActualExpensesBDT || 0).toLocaleString()} BDT
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Planned: ৳{(financials.totalPlannedExpensesBDT || 0).toLocaleString()}
                  </span>
                </div>

                <div
                  className={`hud-panel p-4 rounded-2xl border-l-4 ${
                    isSurplus ? 'border-l-[#10B981]' : 'border-l-red-500'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    NET SURPLUS / (DEFICIT)
                  </span>
                  <div
                    className={`text-xl sm:text-2xl font-black font-display mt-1 ${
                      isSurplus ? 'text-[#10B981]' : 'text-red-400'
                    }`}
                  >
                    ৳{(financials.netSurplusDeficitBDT || 0).toLocaleString()} BDT
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Cost/Participant: ৳{financials.perParticipantCostBDT || 0} BDT
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs font-mono text-slate-300">
                  BREAK-EVEN PARTICIPANTS TARGET:{' '}
                  <strong className="text-[#FF9E00]">
                    {financials.breakEvenParticipantsNeeded || 100} Participants
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl bg-[#182035] border border-[#2A3655] hover:border-[#00E5FF] text-xs font-mono text-white flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-[#182035] border border-[#2A3655] hover:border-[#00E5FF] text-xs font-mono text-white flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4 text-[#00E5FF]" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    onClick={() => setIsItemModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#0B0F19] text-xs font-display font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Line Item</span>
                  </button>
                </div>
              </div>

              {/* Expense Ledger Table */}
              <div className="hud-panel rounded-2xl overflow-hidden border border-[#2A3655]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#121829] border-b border-[#2A3655] text-slate-400">
                      <tr>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Item Description</th>
                        <th className="p-3.5 text-right">Planned (BDT)</th>
                        <th className="p-3.5 text-right">Actual (BDT)</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5">Receipt Note</th>
                        <th className="p-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A3655]/60 text-slate-300">
                      {budgetData?.items?.map((item) => (
                        <tr key={item._id} className="hover:bg-[#182035]/60">
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                item.isIncome
                                  ? 'bg-[#10B981]/20 text-[#10B981]'
                                  : 'bg-[#182035] text-[#00E5FF]'
                              }`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-white font-medium max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="p-3.5 text-right text-slate-400">
                            ৳{item.plannedAmountBDT.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right text-[#FF9E00] font-bold">
                            ৳{item.actualAmountBDT.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 truncate max-w-xs">
                            {item.receiptNote || '—'}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Tab 2: Registrations & Payment Approval */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchRegistrations()}
                    placeholder="Search by ID, name, email, TrxID..."
                    className="w-full px-3 py-2 rounded-xl bg-[#121829] border border-[#2A3655] text-xs font-mono text-white outline-none focus:border-[#FF9E00]"
                  />
                  <button
                    onClick={fetchRegistrations}
                    className="px-3 py-2 rounded-xl bg-[#182035] border border-[#2A3655] text-xs font-mono text-white"
                  >
                    Search
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Filter:</span>
                  {['all', 'pending', 'verified', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setRegStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg uppercase ${
                        regStatusFilter === st
                          ? 'bg-[#FF9E00] text-[#0B0F19] font-bold'
                          : 'bg-[#182035] text-slate-400 border border-[#2A3655]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registrations List */}
              <div className="hud-panel rounded-2xl overflow-hidden border border-[#2A3655]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#121829] border-b border-[#2A3655] text-slate-400">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Participant</th>
                      <th className="p-3">University</th>
                      <th className="p-3">TrxID & Method</th>
                      <th className="p-3 text-right">Fee (BDT)</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A3655]/60 text-slate-300">
                    {registrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-[#182035]/60">
                        <td className="p-3 font-bold text-[#00E5FF]">
                          {reg.registrationId}
                        </td>
                        <td className="p-3">
                          <div className="text-white font-medium">
                            {reg.leadParticipant?.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {reg.leadParticipant?.email} • {reg.leadParticipant?.phone}
                          </div>
                        </td>
                        <td className="p-3 text-slate-400">
                          {reg.leadParticipant?.university}
                        </td>
                        <td className="p-3">
                          <span className="text-[#FF9E00] font-bold">
                            {reg.payment?.transactionId}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {reg.payment?.method} ({reg.payment?.senderNumber})
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-white">
                          ৳{reg.totalFeeBDT}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              reg.payment?.status === 'verified'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : reg.payment?.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-[#FF9E00]/20 text-[#FF9E00]'
                            }`}
                          >
                            {reg.payment?.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1.5">
                            {reg.payment?.status !== 'verified' && (
                              <button
                                onClick={() => handleVerifyPayment(reg._id, 'verified')}
                                className="px-2 py-1 rounded bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/40 text-[10px] font-bold"
                              >
                                Verify
                              </button>
                            )}
                            {reg.payment?.status !== 'rejected' && (
                              <button
                                onClick={() => handleVerifyPayment(reg._id, 'rejected')}
                                className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal to Add New Budget Item */}
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-lg bg-[#0B0F19] border border-[#00E5FF] p-6 rounded-2xl shadow-2xl">
              <h3 className="font-display font-black text-xl text-white mb-4">
                Add Budget / Expense Line Item
              </h3>
              <form onSubmit={handleCreateBudgetItem} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Expense Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full p-2 rounded bg-[#121829] border border-[#2A3655] text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="e.g. Marathon Electrolytes & Medical kits"
                    className="w-full p-2 rounded bg-[#121829] border border-[#2A3655] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Planned (BDT)</label>
                    <input
                      type="number"
                      required
                      value={newItem.plannedAmountBDT}
                      onChange={(e) =>
                        setNewItem({ ...newItem, plannedAmountBDT: e.target.value })
                      }
                      className="w-full p-2 rounded bg-[#121829] border border-[#2A3655] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Actual (BDT)</label>
                    <input
                      type="number"
                      value={newItem.actualAmountBDT}
                      onChange={(e) =>
                        setNewItem({ ...newItem, actualAmountBDT: e.target.value })
                      }
                      className="w-full p-2 rounded bg-[#121829] border border-[#2A3655] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Receipt Note / Voucher</label>
                  <input
                    type="text"
                    value={newItem.receiptNote}
                    onChange={(e) => setNewItem({ ...newItem, receiptNote: e.target.value })}
                    placeholder="e.g. Approved by JU Medical Officer"
                    className="w-full p-2 rounded bg-[#121829] border border-[#2A3655] text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="px-4 py-2 rounded bg-[#182035] text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00E5FF] text-[#0B0F19] font-bold"
                  >
                    Save Line Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
