import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Mail,
  Bell,
  CheckCircle2,
  PhoneCall,
  Plus,
  Clock,
  Users,
  ShieldCheck,
  Lock,
  Trash2,
  Sparkles
} from 'lucide-react';
import { BroadcastLog, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface CommunicationCenterViewProps {
  broadcasts: BroadcastLog[];
  onSendBroadcast?: (bc: BroadcastLog) => void;
  onDeleteBroadcast?: (broadcastId: string) => void;
  currentRole?: UserRole;
}

export const CommunicationCenterView: React.FC<CommunicationCenterViewProps> = ({
  broadcasts,
  onSendBroadcast,
  onDeleteBroadcast,
  currentRole = 'super_admin'
}) => {
  const [channel, setChannel] = useState<'SMS' | 'Email' | 'WhatsApp'>('SMS');
  const [recipientGroup, setRecipientGroup] = useState('All School Parents');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [historyChannelFilter, setHistoryChannelFilter] = useState('All');

  const filteredBroadcasts = broadcasts.filter((bc) => {
    if (historyChannelFilter === 'All') return true;
    return bc.channel === historyChannelFilter;
  });

  // RBAC Permission Check:
  // Admin, Principal, Head Teacher, Bursar, Finance have full access to SMS & Broadcasting.
  const hasBroadcastAccess = [
    'super_admin',
    'pioneer',
    'principal',
    'head_teacher',
    'bursar',
    'finance'
  ].includes(currentRole);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasBroadcastAccess) {
      alert('Access Denied: Only Administrator, Principal, Head Teacher, Bursar, and Finance staff can dispatch broadcasts.');
      return;
    }
    if (!messageText) return;

    setIsSending(true);
    setTimeout(() => {
      const newBc: BroadcastLog = {
        id: `bc-${Date.now()}`,
        channel,
        recipientGroup,
        message: messageText,
        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Delivered',
        totalRecipients: recipientGroup.includes('Grade 10') ? 32 : 1248
      };

      if (onSendBroadcast) onSendBroadcast(newBc);
      setMessageText('');
      setIsSending(false);
    }, 400);
  };

  const handleDelete = (id: string) => {
    if (!hasBroadcastAccess) {
      alert('Access Denied: You do not have permission to delete broadcast logs.');
      return;
    }
    if (window.confirm('Delete this broadcast transmission record?')) {
      if (onDeleteBroadcast) onDeleteBroadcast(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        hasBroadcastAccess
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {hasBroadcastAccess ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Broadcast Access Authorized:</strong> As <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong>, you have full access to dispatch and manage SMS, WhatsApp, and Email broadcasts.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Mass SMS and broadcast dispatching is restricted to <strong>Administrator, Principal, Head Teacher, Bursar, and Finance</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Send className="h-3.5 w-3.5 text-blue-600" /> Real-Time Mass Communication Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Bulk SMS, Email & WhatsApp Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch instant notifications, fee reminders, bus notifications, and emergency alerts to parents & staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" /> Dispatch New Message
          </h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Communication Channel
              </label>
              <DropdownWithSearch
                options={[
                  { value: 'SMS', label: 'SMS Gateway (Direct to Mobile Phone)', badge: 'Instant' },
                  { value: 'WhatsApp', label: 'WhatsApp Official Business API', badge: 'Rich Text' },
                  { value: 'Email', label: 'Institutional Email Broadcast', badge: 'HTML / Attachments' }
                ]}
                value={channel}
                onChange={(val) => setChannel(val as 'SMS' | 'Email' | 'WhatsApp')}
                disabled={!hasBroadcastAccess}
                placeholder="Select communication channel..."
                searchPlaceholder="Search channel type..."
                colorScheme="blue"
                buttonLabel="Select Channel"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Recipient Group
              </label>
              <DropdownWithSearch
                options={[
                  { value: 'All School Parents', label: 'All School Parents (1,248)', badge: '1,248' },
                  { value: 'Grade 10 A Parents', label: 'Grade 10 A Parents (32)', badge: '32' },
                  { value: 'Boarding House Parents', label: 'Boarding House Parents (84)', badge: '84' },
                  { value: 'Bus Shuttle Riders Parents', label: 'Bus Shuttle Parents (92)', badge: '92' },
                  { value: 'All Academic Teachers', label: 'All Academic Staff (84)', badge: '84' },
                  { value: 'Outstanding Fee Debtors', label: 'Fee Debtors (62)', badge: '62' }
                ]}
                value={recipientGroup}
                onChange={(val) => setRecipientGroup(val)}
                disabled={!hasBroadcastAccess}
                placeholder="Select recipient group..."
                searchPlaceholder="Search recipient list..."
                colorScheme="blue"
                buttonLabel="Select Group"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Message Content
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {messageText.length} chars • {Math.ceil(messageText.length / 160) || 1} SMS
                </span>
              </div>
              <textarea
                disabled={!hasBroadcastAccess}
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={hasBroadcastAccess ? "Type your announcement or fee reminder notice here..." : "Read-only access."}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {hasBroadcastAccess && (
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Transmitting Broadcast...' : 'Send Broadcast Now'}
              </button>
            )}
          </form>
        </div>

        {/* Transmission History */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" /> Transmission History & Logs
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter Logs:</span>
              <DropdownWithSearch
                options={[
                  { value: 'All', label: 'All Channels' },
                  { value: 'SMS', label: 'SMS Only' },
                  { value: 'WhatsApp', label: 'WhatsApp Only' },
                  { value: 'Email', label: 'Email Broadcasts' }
                ]}
                value={historyChannelFilter}
                onChange={(val) => setHistoryChannelFilter(val)}
                placeholder="Filter logs..."
                searchPlaceholder="Search channel logs..."
                colorScheme="slate"
                buttonLabel="Filter"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredBroadcasts.map((bc) => (
              <div
                key={bc.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                      {bc.channel}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {bc.recipientGroup}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {bc.sentAt}
                    </span>
                    {hasBroadcastAccess && (
                      <button
                        onClick={() => handleDelete(bc.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {bc.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {bc.status} ({bc.totalRecipients} recipients)
                  </span>
                  <span className="font-mono text-[10px]">ID: {bc.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
