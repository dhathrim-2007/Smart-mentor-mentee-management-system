import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CaseDetailsModal from '../components/CaseDetailsModal';
import CriticalAlertModal from '../components/CriticalAlertModal';
import {
  Activity,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Users,
  Search,
  Filter,
  RefreshCw,
  PhoneCall,
  Clock,
  Eye,
  CheckCircle2,
  Lock,
  Mic,
  FileSpreadsheet,
  Flame,
  UserCheck,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Role Simulation
  const [activeRole, setActiveRole] = useState('Nodal Officer');

  // Modals
  const [selectedCaseForModal, setSelectedCaseForModal] = useState(null);
  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null);

  // Active Tab: 'monitor' | 'priority' | 'alerts' | 'stats'
  const [activeTab, setActiveTab] = useState('monitor');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, casesRes, alertsRes] = await Promise.all([
        api.fetchDashboardStats(),
        api.fetchCases({
          riskLevel: riskFilter,
          status: statusFilter,
          channel: channelFilter,
          language: languageFilter,
          search: searchQuery
        }),
        api.fetchAlerts()
      ]);

      setStats(statsRes.data);
      setCases(casesRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [riskFilter, statusFilter, channelFilter, languageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDashboardData();
  };

  const handleUpdateCase = async (id, updatePayload) => {
    try {
      const res = await api.updateCase(id, updatePayload);
      if (res.success) {
        setSelectedCaseForModal(res.data);
        setCases(prev => prev.map(c => (c.id === id ? res.data : c)));
      }
    } catch (err) {
      console.error('Failed to update case:', err);
    }
  };

  const handleQuickEscalate = async (alertCaseId, protocol) => {
    try {
      await api.assignSupportService({
        caseId: alertCaseId,
        serviceType: protocol,
        assignedTo: `Emergency Escalation Team (${activeRole})`,
        notes: `Rapid escalation dispatched: ${protocol}`,
        actor: activeRole
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      await api.updateAlertStatus(alertId, {
        status: newStatus,
        notes: `Status updated to ${newStatus} by ${activeRole}`,
        actor: activeRole
      });
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  // Client-side filtering for priority and stage
  const filteredCases = cases.filter(c => {
    if (priorityFilter !== 'ALL') {
      if (!c.priority || !c.priority.startsWith(priorityFilter)) return false;
    }
    if (stageFilter !== 'ALL') {
      if (!c.stage || c.stage.toLowerCase() !== stageFilter.toLowerCase()) return false;
    }
    return true;
  });

  const p1Cases = cases.filter(c => c.priority && c.priority.startsWith('Priority 1'));
  const p2Cases = cases.filter(c => c.priority && c.priority.startsWith('Priority 2'));
  const p3Cases = cases.filter(c => c.priority && c.priority.startsWith('Priority 3'));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gov-blue uppercase tracking-widest">
              Live Operator Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight mt-1">
            NHAA Victim Support Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time multi-channel stress triage, PoA protection dispatch & audit telemetry
          </p>
        </div>

        {/* Role Selector & Demo Mode Quick Trigger */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold px-1 sm:px-2">Role:</span>
            {['Nodal Officer', 'Counsellor', 'Legal Counsel', 'Super Admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all ${
                  activeRole === role
                    ? 'bg-gov-blue text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 shadow-sm min-h-[36px]"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Banner if active critical alerts exist */}
      {alerts && alerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  PRIORITY ACTION REQUIRED
                </span>
                <h3 className="font-bold text-sm text-red-950">
                  {alerts.length} Critical Victim Stress Alert(s) Pending Escalation
                </h3>
              </div>
              <p className="text-xs text-red-800 mt-1">
                Lethal threat or immediate danger signals flagged by AI acoustic & lexical risk scoring.
              </p>
            </div>
          </div>
          <div className="flex space-x-2 flex-shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedAlertForModal(alerts[0])}
              className="flex-1 md:flex-initial bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5 min-h-[40px]"
            >
              <Flame className="w-4 h-4" />
              <span>Review Top Alert</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className="flex-1 md:flex-initial bg-white text-red-700 font-bold text-xs px-3 py-2.5 rounded-xl border border-red-300 hover:bg-red-50 min-h-[40px]"
            >
              View All ({alerts.length})
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Active</span>
          <span className="text-2xl font-black text-gov-navy font-mono">
            {stats?.totalCases || '1,248'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Ingested via 14566</span>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
          <span className="text-[11px] font-bold text-red-700 uppercase block flex items-center space-x-1">
            <Flame className="w-3 h-3 text-red-600" />
            <span>Critical</span>
          </span>
          <span className="text-2xl font-black text-red-700 font-mono">
            {stats?.criticalCases || '36'}
          </span>
          <span className="text-[10px] text-red-600 font-semibold block mt-1">SVI &ge; 75 / Immediate</span>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
          <span className="text-[11px] font-bold text-orange-700 uppercase block">High Risk</span>
          <span className="text-2xl font-black text-orange-700 font-mono">
            {stats?.highRiskCases || '184'}
          </span>
          <span className="text-[10px] text-orange-600 font-semibold block mt-1">SVI 50-74 / Priority</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase block">Moderate</span>
          <span className="text-2xl font-black text-amber-800 font-mono">
            {stats?.moderateCases || '426'}
          </span>
          <span className="text-[10px] text-amber-700 block mt-1">SVI 25-49 / Counselling</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Low Risk</span>
          <span className="text-2xl font-black text-emerald-800 font-mono">
            {stats?.lowCases || '602'}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-1">SVI 0-24 / Routine</span>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-[11px] font-bold text-gov-blue uppercase block">Priority 1 Queue</span>
          <span className="text-2xl font-black text-gov-blue font-mono">
            {p1Cases.length}
          </span>
          <span className="text-[10px] text-blue-700 block mt-1">Immediate Review</span>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('monitor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'monitor'
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>All Cases Monitor ({filteredCases.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('priority')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'priority'
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Prioritized Queue (P1/P2/P3)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Early Warning Alerts ({alerts.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Case ID, District, or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-blue min-h-[40px]"
            />
          </form>
        </div>

        {/* Filter Dropdowns Strip */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <span className="font-bold text-slate-700 mr-1">Filters:</span>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium min-h-[36px]"
          >
            <option value="ALL">All Priorities</option>
            <option value="Priority 1">Priority 1 (Immediate Review)</option>
            <option value="Priority 2">Priority 2 (Follow-up Soon)</option>
            <option value="Priority 3">Priority 3 (Routine)</option>
          </select>

          {/* Stage */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium min-h-[36px]"
          >
            <option value="ALL">All Legal Stages</option>
            <option value="Complaint Registration">Complaint</option>
            <option value="Investigation">Investigation</option>
            <option value="Trial">Trial / Hearing</option>
            <option value="Rehabilitation">Rehabilitation</option>
            <option value="Compensation">Compensation</option>
            <option value="Follow-up">Follow-up</option>
          </select>

          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium min-h-[36px]"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>

          {/* Channel */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium min-h-[36px]"
          >
            <option value="ALL">All Channels</option>
            <option value="Voice">Voice / Audio</option>
            <option value="Web">Web Portal</option>
            <option value="IVRS">IVRS</option>
            <option value="Mobile App">Mobile App</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium min-h-[36px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          {(riskFilter !== 'ALL' || statusFilter !== 'ALL' || channelFilter !== 'ALL' || priorityFilter !== 'ALL' || stageFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRiskFilter('ALL');
                setStatusFilter('ALL');
                setChannelFilter('ALL');
                setPriorityFilter('ALL');
                setStageFilter('ALL');
                setSearchQuery('');
              }}
              className="text-gov-blue hover:underline text-xs font-semibold ml-2 min-h-[36px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: ALL CASES MONITOR */}
      {activeTab === 'monitor' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Live Ingestion Queue
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {filteredCases.length} cases
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Masked identifiers in compliance with DPDP Act
            </span>
          </div>

          {/* MOBILE RESPONSIVE CARDS (Visible only on <768px screens) */}
          <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
            {filteredCases.map((c) => {
              const isCrit = c.riskLevel === 'CRITICAL';
              const isHigh = c.riskLevel === 'HIGH';
              const isMod = c.riskLevel === 'MODERATE';
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                    isCrit ? 'bg-red-50/40 border-red-200' :
                    isHigh ? 'bg-orange-50/30 border-orange-200' :
                    'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-gov-navy">{c.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCrit ? 'bg-red-600 text-white' :
                        isHigh ? 'bg-orange-600 text-white' :
                        isMod ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        SVI {c.svi}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.priority?.startsWith('Priority 1') ? 'bg-red-100 text-red-800' :
                      c.priority?.startsWith('Priority 2') ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {c.priority ? c.priority.split('—')[0] : 'P2'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Stage:</span> <strong>{c.stage || 'Investigation'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">District:</span> {c.district || c.state}
                    </div>
                    <div>
                      <span className="text-slate-400">Trajectory:</span> {c.prediction || 'STABLE'}
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span> {c.status}
                    </div>
                  </div>

                  {c.keyIndicators && c.keyIndicators.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.keyIndicators.slice(0, 3).map((ind, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedCaseForModal(c)}
                      className="w-full bg-gov-blue hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors min-h-[44px]"
                    >
                      Review & Triage Case
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (Visible on >=768px screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3 text-center">SVI</th>
                  <th className="px-4 py-3">Trajectory</th>
                  <th className="px-4 py-3">District / State</th>
                  <th className="px-4 py-3">Key Stress Factors</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Officer</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredCases.map((c) => {
                  const isCrit = c.riskLevel === 'CRITICAL';
                  const isHigh = c.riskLevel === 'HIGH';
                  const isMod = c.riskLevel === 'MODERATE';
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCrit ? 'bg-red-50/30' : isHigh ? 'bg-orange-50/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-gov-navy whitespace-nowrap">
                        {c.id}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.priority?.startsWith('Priority 1') ? 'bg-red-100 text-red-800 border border-red-200' :
                          c.priority?.startsWith('Priority 2') ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {c.priority ? c.priority.split('—')[0] : 'Priority 2'}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {c.stage || 'Investigation'}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`inline-block font-mono font-black text-xs px-2 py-0.5 rounded ${
                          isCrit ? 'bg-red-100 text-red-800 border border-red-200' :
                          isHigh ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          isMod ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {c.svi}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-bold ${
                          c.prediction === 'POTENTIAL ESCALATION' ? 'text-red-600' :
                          c.prediction === 'WORSENING' ? 'text-orange-600' :
                          c.prediction === 'IMPROVING' ? 'text-emerald-600' :
                          'text-slate-600'
                        }`}>
                          {c.prediction || 'STABLE'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {c.district ? `${c.district}, ${c.state}` : c.state}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.keyIndicators?.slice(0, 2).map((ind, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'IN_REVIEW' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap max-w-xs truncate text-[11px]">
                        {c.assignedOfficer || 'Unassigned'}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedCaseForModal(c)}
                          className="bg-gov-blue hover:bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          Review & Triage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRIORITIZED QUEUE VIEW */}
      {activeTab === 'priority' && (
        <div className="space-y-6">
          {/* Priority 1 Tier */}
          <div className="bg-red-50/50 rounded-2xl p-5 border-2 border-red-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <h3 className="font-bold text-sm text-red-950 uppercase tracking-wide">
                  Priority 1 — Immediate Human Review ({p1Cases.length} Cases)
                </h3>
              </div>
              <span className="text-xs bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full">
                SLA: Within 24h
              </span>
            </div>
            <p className="text-xs text-red-800">
              Triggered by critical distress score (SVI &ge; 75), upward distress velocity, or explicit threats of violence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {p1Cases.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gov-navy">{c.id} ({c.district}, {c.state})</span>
                    <span className="font-mono font-black text-red-600 text-sm">SVI {c.svi}</span>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "{c.narrativeSummary || c.narrative}"
                  </p>
                  <div className="text-[11px] text-red-700 bg-red-50 p-2 rounded border border-red-100">
                    <strong>Reason:</strong> {c.priorityReason || 'Critical safety and psychological vulnerability.'}
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCaseForModal(c)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg"
                    >
                      Emergency Intervention &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority 2 Tier */}
          <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-300 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-orange-950 uppercase tracking-wide">
                Priority 2 — Follow-up Soon ({p2Cases.length} Cases)
              </h3>
              <span className="text-xs bg-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                SLA: Within 48h
              </span>
            </div>
            <p className="text-xs text-orange-800">
              Triggered by elevated distress trend, sleep disruption, or missed scheduled check-ins.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {p2Cases.slice(0, 4).map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-orange-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gov-navy">{c.id} ({c.district})</span>
                    <span className="font-mono font-bold text-orange-600">SVI {c.svi}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Stage:</strong> {c.stage} • <strong>Trajectory:</strong> {c.prediction}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {c.priorityReason}
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCaseForModal(c)}
                      className="bg-gov-blue text-white font-bold text-xs px-3.5 py-1.5 rounded-lg"
                    >
                      Schedule Follow-up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority 3 Tier */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
              Priority 3 — Routine Monitoring ({p3Cases.length} Cases)
            </h3>
            <p className="text-xs text-slate-500">
              Stable distress trajectory, no pending alerts. Automated weekly check-in reminders active.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: EARLY WARNING ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-900 flex items-center justify-between">
            <span className="font-bold">
              Early Warning Alert Engine: Real-time notification of distress escalation and safety triggers.
            </span>
            <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded text-[11px]">
              {alerts.length} ALERTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-white rounded-2xl p-5 border-2 border-red-400 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    <span className="font-mono font-bold text-sm text-slate-900">{alt.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      alt.status === 'NEW' ? 'bg-red-100 text-red-800 font-black animate-pulse' :
                      alt.status === 'ACKNOWLEDGED' ? 'bg-amber-100 text-amber-800' :
                      alt.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {alt.status || 'NEW'}
                    </span>
                  </div>
                  <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                    SVI: {alt.svi || 85}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <strong>Case:</strong> {alt.caseId || 'CASE-1042'} • <strong>Jurisdiction:</strong> {alt.district || 'District'}, {alt.state}
                  </div>
                  <div>
                    <strong>Trigger:</strong> {alt.trigger}
                  </div>
                  <div>
                    <strong>Why Generated:</strong> {alt.whyGenerated || alt.explanation}
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <strong>Recommended Action:</strong> {alt.recommendedAction}
                </div>

                {/* Action buttons to acknowledge, assign, resolve */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {alt.status === 'NEW' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateAlertStatus(alt.id, 'ACKNOWLEDGED')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  {alt.status !== 'RESOLVED' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateAlertStatus(alt.id, 'RESOLVED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const found = cases.find(c => c.id === alt.caseId);
                      if (found) setSelectedCaseForModal(found);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 min-h-[36px]"
                  >
                    View Case File
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Details Drawer / Modal */}
      {selectedCaseForModal && (
        <CaseDetailsModal
          caseItem={selectedCaseForModal}
          onClose={() => setSelectedCaseForModal(null)}
          onUpdateCase={handleUpdateCase}
        />
      )}

      {/* Critical Alert Emergency Modal */}
      {selectedAlertForModal && (
        <CriticalAlertModal
          alertCase={selectedAlertForModal}
          onClose={() => setSelectedAlertForModal(null)}
          onQuickEscalate={handleQuickEscalate}
        />
      )}
    </div>
  );
}
