import React, { useState, useMemo } from 'react';
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
  Sparkles,
  GraduationCap,
  Baby,
  Globe,
  Phone
} from 'lucide-react';
import { BroadcastLog, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS,
  resolveCurrentTeacher,
  isTeacherSubjectOnly
} from '../../utils/sectionHelpers';

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
  const { classes, teachers } = useRealTime();
  const { currentUser } = useAuth();
  const isTeacher = currentRole === 'teacher';
  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';

  const currentTeacher = useMemo(() => {
    return resolveCurrentTeacher(currentUser, teachers);
  }, [currentUser, teachers]);

  const isSubjectOnlyTeacher = useMemo(() => {
    if (!isTeacher) return false;
    return isTeacherSubjectOnly(currentTeacher, classes, currentUser);
  }, [isTeacher, currentTeacher, classes, currentUser]);

  const [channel, setChannel] = useState<'SMS' | 'Email' | 'WhatsApp'>('SMS');
  const [recipientGroup, setRecipientGroup] = useState(
    isPrincipal
      ? 'All Secondary School Parents'
      : isHeadTeacher
      ? 'All Primary & Nursery Parents'
      : 'All School Parents'
  );
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [historyChannelFilter, setHistoryChannelFilter] = useState('All');

  const filteredBroadcasts = broadcasts.filter((bc) => {
    if (isPrincipal) {
      const isPrimOnly = bc.recipientGroup.toLowerCase().includes('nursery') ||
        bc.recipientGroup.toLowerCase().includes('basic') ||
        bc.recipientGroup.toLowerCase().includes('primary');
      if (isPrimOnly) return false;
    }

    if (isHeadTeacher) {
      const isSecOnly = bc.recipientGroup.toLowerCase().includes('grade') ||
        bc.recipientGroup.toLowerCase().includes('secondary') ||
        bc.recipientGroup.toLowerCase().includes('jss') ||
        bc.recipientGroup.toLowerCase().includes('sss');
      if (isSecOnly) return false;
    }

    if (historyChannelFilter === 'All') return true;
    return bc.channel === historyChannelFilter;
  });

  // Role-specific recipient options
  const recipientOptions = isPrincipal
    ? [
        { value: 'All Secondary School Parents', label: 'All Secondary School Parents (640)', badge: '640' },
        { value: 'Junior Secondary (JSS 1-3) Parents', label: 'Junior Secondary (JSS 1-3) Parents (320)', badge: '320' },
        { value: 'Senior Secondary (SSS 1-3) Parents', label: 'Senior Secondary (SSS 1-3) Parents (320)', badge: '320' },
        { value: 'Grade 10 A Parents', label: 'Grade 10 A Parents (32)', badge: '32' },
        { value: 'Grade 10 B Parents', label: 'Grade 10 B Parents (30)', badge: '30' },
        { value: 'Grade 11 Science Parents', label: 'Grade 11 Science Parents (28)', badge: '28' },
        { value: 'Grade 12 Art Parents', label: 'Grade 12 Art Parents (25)', badge: '25' },
        { value: 'Secondary Academic Teachers', label: 'Secondary Teaching Faculty (48)', badge: '48' },
        { value: 'Secondary Boarding House Parents', label: 'Secondary Boarding Parents (54)', badge: '54' },
        { value: 'Secondary Fee Debtors', label: 'Secondary Outstanding Fee Debtors (38)', badge: '38' }
      ]
    : isHeadTeacher
    ? [
        { value: 'All Primary & Nursery Parents', label: 'All Primary & Nursery Parents (608)', badge: '608' },
        { value: 'Nursery & Kindergarten Parents', label: 'Early Years (Nursery & KG) Parents (180)', badge: '180' },
        { value: 'Basic 1 to Basic 5 Parents', label: 'Basic 1 - Basic 5 Parents (428)', badge: '428' },
        { value: 'Basic 1 Parents', label: 'Basic 1 Parents (28)', badge: '28' },
        { value: 'Basic 2 Parents', label: 'Basic 2 Parents (30)', badge: '30' },
        { value: 'Basic 3 Parents', label: 'Basic 3 Parents (32)', badge: '32' },
        { value: 'Basic 4 Parents', label: 'Basic 4 Parents (26)', badge: '26' },
        { value: 'Basic 5 Parents', label: 'Basic 5 Parents (30)', badge: '30' },
        { value: 'Primary School Teaching Staff', label: 'Primary Teaching Staff (36)', badge: '36' },
        { value: 'Primary Shuttle Bus Parents', label: 'Primary Bus Shuttle Parents (45)', badge: '45' },
        { value: 'Primary Fee Debtors', label: 'Primary Outstanding Fee Debtors (24)', badge: '24' }
      ]
    : [
        { value: 'All School Parents', label: 'All School Parents (1,248)', badge: '1,248' },
        { value: 'All Secondary School Parents', label: 'Secondary School Parents (640)', badge: '640' },
        { value: 'All Primary & Nursery Parents', label: 'Primary & Nursery Parents (608)', badge: '608' },
        { value: 'Grade 10 A Parents', label: 'Grade 10 A Parents (32)', badge: '32' },
        { value: 'Basic 1 Parents', label: 'Basic 1 Parents (28)', badge: '28' },
        { value: 'Boarding House Parents', label: 'Boarding House Parents (84)', badge: '84' },
        { value: 'Bus Shuttle Riders Parents', label: 'Bus Shuttle Parents (92)', badge: '92' },
        { value: 'All Academic Teachers', label: 'All Academic Staff (84)', badge: '84' },
        { value: 'Outstanding Fee Debtors', label: 'Fee Debtors (62)', badge: '62' }
      ];

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
        totalRecipients: recipientGroup.includes('Grade') || recipientGroup.includes('Basic') ? 32 : isPrincipal ? 640 : isHeadTeacher ? 608 : 1248
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

  if (isTeacher && isSubjectOnlyTeacher) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-300">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            SMS & Communication Broadcast Restricted
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Teachers assigned to subjects only do not have access to SMS and communication broadcasts.
            School broadcasts are managed exclusively by School Leadership and Administrative Officers.
          </p>
        </div>
        <div className="pt-2 text-[11px] font-semibold text-slate-500">
          Allocated Subject(s): <span className="font-bold text-slate-700 dark:text-slate-300">{currentTeacher?.subjects?.join(', ') || 'Assigned Subjects'}</span>
        </div>
      </div>
    );
  }

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
                {isPrincipal ? (
                  <strong>Secondary Principal SMS Portal:</strong>
                ) : isHeadTeacher ? (
                  <strong>Primary Head Teacher SMS Portal:</strong>
                ) : (
                  <strong>Broadcast Access Authorized:</strong>
                )}{' '}
                You have full access to dispatch and manage SMS, WhatsApp, and Email broadcasts for{' '}
                {isPrincipal ? 'Secondary School parents and staff' : isHeadTeacher ? 'Primary & Nursery parents and staff' : 'all parents and staff'}.
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
          {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Send className="h-3.5 w-3.5 text-blue-600" /> Real-Time Mass Communication Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-6 w-6 text-indigo-600" /> {SECONDARY_SCHOOL_NAME} - Broadcast Hub
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-6 w-6 text-amber-600" /> {PRIMARY_SCHOOL_NAME} - Communication Hub
              </>
            ) : (
              'Golden Horizon Schools - Broadcast & Notification Center'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isPrincipal
              ? `Dispatch instant SMS notifications, WAEC/NECO alerts, and fee notices for ${SECONDARY_SCHOOL_NAME}.`
              : isHeadTeacher
              ? `Dispatch instant SMS notifications, nursery updates, and announcements for ${PRIMARY_SCHOOL_NAME}.`
              : 'Dispatch instant SMS notifications, fee reminders, and urgent alerts across both sections.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span className="flex items-center gap-1 font-mono text-blue-600 dark:text-blue-400">
              <Globe className="h-3 w-3" /> {SCHOOL_CONTACT_DETAILS.website}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-emerald-600" /> {SCHOOL_CONTACT_DETAILS.emails[0]}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Phone className="h-3 w-3 text-amber-600" /> {SCHOOL_CONTACT_DETAILS.phoneNumbers[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" /> Dispatch New Broadcast
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
                options={recipientOptions}
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
                placeholder={
                  isPrincipal
                    ? 'e.g. Dear Secondary School Parents, please be informed that SS3 mock examinations commence on Monday...'
                    : isHeadTeacher
                    ? 'e.g. Dear Primary Parents, please note that our Nursery & Primary Sports Fiesta is scheduled for this Friday...'
                    : 'Type broadcast message text here...'
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !messageText.trim() || !hasBroadcastAccess}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Dispatching Broadcast...' : `Send ${channel} to ${recipientGroup}`}
            </button>
          </form>
        </div>

        {/* Transmission Logs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Transmission Logs & Delivery Status
              </h3>
              <p className="text-[11px] text-slate-400">
                Audited history of outbound SMS, Email, and WhatsApp communications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Channel:</span>
              <DropdownWithSearch
                options={[
                  { value: 'All', label: 'All Channels' },
                  { value: 'SMS', label: 'SMS Only' },
                  { value: 'WhatsApp', label: 'WhatsApp Only' },
                  { value: 'Email', label: 'Email Only' }
                ]}
                value={historyChannelFilter}
                onChange={(val) => setHistoryChannelFilter(val)}
                placeholder="Filter channel..."
                searchPlaceholder="Search channel..."
                colorScheme="blue"
                buttonLabel="Filter"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredBroadcasts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">No broadcast history found</p>
                <p className="text-xs mt-1">Sent broadcasts will appear here.</p>
              </div>
            ) : (
              filteredBroadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          bc.channel === 'SMS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                            : bc.channel === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                        }`}
                      >
                        {bc.channel}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {bc.recipientGroup}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Users className="h-3 w-3" /> {bc.totalRecipients} recipients
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {bc.sentAt}
                      </span>
                      {hasBroadcastAccess && (
                        <button
                          onClick={() => handleDelete(bc.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Delete Broadcast Log"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {bc.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
