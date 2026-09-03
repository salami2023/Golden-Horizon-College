import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Radio,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useRealTime } from '../context/RealTimeContext';

export const RealTimeSyncBadge: React.FC = () => {
  const {
    isConnected,
    isSyncing,
    lastSyncedAt,
    connectedPeers,
    auditLogs,
    notifications,
    dismissNotification,
    refreshState,
    currentRole
  } = useRealTime();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Live Badge in Header */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
          }`}
          title="Click to view Real-Time Sync status & active users"
        >
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>

          <span className="hidden sm:inline">
            {isConnected ? 'Real-Time Synced' : 'Reconnecting...'}
          </span>

          {connectedPeers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-[10px] font-mono">
              {connectedPeers.length} {connectedPeers.length === 1 ? 'user' : 'users'}
            </span>
          )}

          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                <h4 className="font-extrabold text-slate-900 dark:text-white">
                  Real-Time Multi-User Sync
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Connection Status Banner */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-emerald-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-amber-500" />
                )}
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {isConnected ? 'WebSocket Engine Active' : 'Connecting to Server...'}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> Last sync: {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              </div>

              <button
                onClick={refreshState}
                disabled={isSyncing}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 transition disabled:opacity-50"
                title="Force Synchronize with Central Server"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                <span className="text-[11px]">Sync</span>
              </button>
            </div>

            {/* Connected Authorized Users / Roles */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-blue-600" /> Active Authorized Sessions ({connectedPeers.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Instant Sync</span>
              </div>

              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                {connectedPeers.length === 0 ? (
                  <div className="text-[11px] text-slate-400 p-2 text-center bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    1 active session (Your current portal: {currentRole})
                  </div>
                ) : (
                  connectedPeers.map((peer, idx) => (
                    <div
                      key={peer.id || idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {peer.userName || peer.role}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {peer.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Activity & Mutation Stream */}
            <div className="mt-4">
              <span className="font-extrabold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1 mb-2">
                <Activity className="h-3.5 w-3.5 text-emerald-600" /> Real-Time Audit Feed
              </span>

              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1 text-[11px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-blue-600" />
                        {log.actorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-snug">
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
              All student, staff, fee, attendance and academic grade mutations propagate automatically in real time across all open sessions.
            </div>
          </div>
        )}
      </div>

      {/* Floating Real-Time Notifications Toast Container */}
      {notifications.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="pointer-events-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/40 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
            >
              <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {notif.title}
                  </h5>
                  <span className="text-[9px] font-mono text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
