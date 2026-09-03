import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  Users,
  Clock,
  AlertTriangle,
  Lock,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { RealTimeAuditEvent, ConnectedPeer, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface AuditLogsViewProps {
  auditLogs: RealTimeAuditEvent[];
  connectedPeers: ConnectedPeer[];
  currentRole: UserRole;
  onRefresh?: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  auditLogs,
  connectedPeers,
  currentRole,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  const isAdministrator = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || log.actorRole === filterRole;
    const matchesAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());

    return matchesSearch && matchesRole && matchesAction;
  });

  const unauthorizedAttempts = auditLogs.filter(
    (l) => l.action.toLowerCase().includes('denied') || l.action.toLowerCase().includes('unauthorized')
  );

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Actor Role,Actor Name,Action,Entity,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorRole}","${l.actorName}","${l.action}","${l.entity}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kwikschools-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        isAdministrator
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {isAdministrator ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Security Audit Center Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with access to live system telemetry, role-based mutation logs, and unauthorized access records.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Restricted Telemetry:</strong> Security audit logs and unauthorized attempt telemetry are only accessible to <strong>Administrator, School Principal, and Head Teacher</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" /> Security & Real-Time Audit Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full compliance audit trail of all data updates, role authorizations, and live database sync operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" /> Refresh Logs
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Audit Events</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {auditLogs.length}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            Real-time server sync
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Connected Peers</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            {connectedPeers.length || 1} Sessions
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Synchronized in real-time
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Denied Attempts</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {unauthorizedAttempts.length}
          </div>
          <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
            Blocked by RBAC policy
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Database Engine</span>
          <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            Cloud SQL + Firestore
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            Full ACID + WebSocket sync
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action, entity, or details..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">Role:</span>
            <DropdownWithSearch
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'super_admin', label: 'Super Admin', badge: 'Admin' },
                { value: 'principal', label: 'Principal', badge: 'Leadership' },
                { value: 'head_teacher', label: 'Head Teacher', badge: 'Leadership' },
                { value: 'bursar', label: 'Bursar', badge: 'Finance' },
                { value: 'finance', label: 'Finance Staff', badge: 'Finance' },
                { value: 'teacher', label: 'Teacher', badge: 'Academic' },
                { value: 'parent', label: 'Parent', badge: 'Portal' },
                { value: 'student', label: 'Student', badge: 'Portal' }
              ]}
              value={filterRole}
              onChange={(val) => setFilterRole(val)}
              placeholder="Filter by role..."
              searchPlaceholder="Search role..."
              colorScheme="indigo"
              buttonLabel="Role"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Action:</span>
            <DropdownWithSearch
              options={[
                { value: 'all', label: 'All Actions' },
                { value: 'CREATE', label: 'CREATE Event', badge: 'Create' },
                { value: 'UPDATE', label: 'UPDATE Event', badge: 'Update' },
                { value: 'DELETE', label: 'DELETE Event', badge: 'Delete' },
                { value: 'UNAUTHORIZED', label: 'Unauthorized / Denied', badge: 'Security' }
              ]}
              value={filterAction}
              onChange={(val) => setFilterAction(val)}
              placeholder="Filter by action..."
              searchPlaceholder="Search action..."
              colorScheme="slate"
              buttonLabel="Action"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Event Details</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const isDenied =
                  log.action.toLowerCase().includes('denied') ||
                  log.action.toLowerCase().includes('unauthorized');

                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                      isDenied ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {log.actorName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          isDenied
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                      {log.entity}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isDenied ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 text-[11px] font-bold">
                          <XCircle className="h-3.5 w-3.5" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Success
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No security audit events found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
