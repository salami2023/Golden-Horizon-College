import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Settings,
  Save,
  School,
  GraduationCap,
  Award,
  ShieldCheck,
  Check,
  Lock,
  Building,
  Mail,
  Phone,
  Globe,
  Baby,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Stamp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Crown,
  UserPlus,
  Trash2,
  Shield,
  X,
  Key,
  AlertTriangle,
  Search,
  Users
} from 'lucide-react';
import { SchoolSettings, UserRole, UserAccount } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import { useAuth } from '../../context/AuthContext';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  COMBINED_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS
} from '../../utils/sectionHelpers';
import {
  DEFAULT_SCHOOL_LOGO_DATA_URI,
  DEFAULT_SCHOOL_STAMP_DATA_URI
} from '../../assets/schoolAssets';

interface SchoolSettingsViewProps {
  settings?: SchoolSettings;
  onUpdateSettings?: (settings: Partial<SchoolSettings>) => void;
  currentRole?: UserRole;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentRole = 'super_admin'
}) => {
  const { users, addLeadershipUser, deleteLeadershipUser, currentUser } = useAuth();
  const isPioneer = currentRole === 'pioneer' || currentUser?.role === 'pioneer';

  // Pioneer Leadership Management State
  const [isAddLeadershipModalOpen, setIsAddLeadershipModalOpen] = useState(false);
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderEmail, setNewLeaderEmail] = useState('');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
  const [newLeaderRole, setNewLeaderRole] = useState<'super_admin' | 'principal' | 'head_teacher' | 'finance'>('principal');
  const [newLeaderPassword, setNewLeaderPassword] = useState('Pioneer@2026');
  const [leadershipFilter, setLeadershipFilter] = useState<'all' | 'super_admin' | 'principal' | 'head_teacher' | 'finance'>('all');
  const [leadershipSearch, setLeadershipSearch] = useState('');
  const [deletingUserTarget, setDeletingUserTarget] = useState<UserAccount | null>(null);
  const [leadershipActionFeedback, setLeadershipActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [schoolName, setSchoolName] = useState(
    settings?.schoolName || COMBINED_SCHOOL_NAME
  );
  const [secondarySchoolName, setSecondarySchoolName] = useState(
    settings?.secondarySchoolName || SECONDARY_SCHOOL_NAME
  );
  const [primarySchoolName, setPrimarySchoolName] = useState(
    settings?.primarySchoolName || PRIMARY_SCHOOL_NAME
  );
  const [website, setWebsite] = useState(
    settings?.website || SCHOOL_CONTACT_DETAILS.website
  );
  const [email, setEmail] = useState(
    settings?.email || SCHOOL_CONTACT_DETAILS.emails[0]
  );
  const [altEmail, setAltEmail] = useState(
    settings?.altEmail || SCHOOL_CONTACT_DETAILS.emails[1]
  );
  const [phone, setPhone] = useState(
    settings?.phone || SCHOOL_CONTACT_DETAILS.phoneDisplay
  );
  const [motto, setMotto] = useState(
    settings?.motto || 'Excellence in Knowledge, Innovation & Character'
  );
  const [academicSession, setAcademicSession] = useState(
    settings?.academicSession || '2026/2027 Academic Session'
  );
  const [currentTerm, setCurrentTerm] = useState(
    settings?.currentTerm || '1st Term'
  );
  const [principalName, setPrincipalName] = useState(
    settings?.principalName || 'Dr. Elizabeth Sterling'
  );
  const [headTeacherName, setHeadTeacherName] = useState(
    settings?.headTeacherName || 'Mrs. Folashade Adeleke'
  );
  const [logoUrl, setLogoUrl] = useState<string>(
    settings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI
  );
  const [stampUrl, setStampUrl] = useState<string>(
    settings?.stampUrl || DEFAULT_SCHOOL_STAMP_DATA_URI
  );
  const [logoUploadMsg, setLogoUploadMsg] = useState<string | null>(null);
  const [stampUploadMsg, setStampUploadMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  // RBAC Permission Check: Administrator, School Principal and Head Teacher have full access to school setup
  const canManageSetup = [
    'super_admin',
    'pioneer',
    'principal',
    'head_teacher'
  ].includes(currentRole);

  useEffect(() => {
    if (settings) {
      if (settings.schoolName) setSchoolName(settings.schoolName);
      if (settings.secondarySchoolName) setSecondarySchoolName(settings.secondarySchoolName);
      if (settings.primarySchoolName) setPrimarySchoolName(settings.primarySchoolName);
      if (settings.website) setWebsite(settings.website);
      if (settings.email) setEmail(settings.email);
      if (settings.altEmail) setAltEmail(settings.altEmail);
      if (settings.phone) setPhone(settings.phone);
      if (settings.motto) setMotto(settings.motto);
      if (settings.academicSession) setAcademicSession(settings.academicSession);
      if (settings.currentTerm) setCurrentTerm(settings.currentTerm);
      if (settings.principalName) setPrincipalName(settings.principalName);
      if (settings.headTeacherName) setHeadTeacherName(settings.headTeacherName);
      if (settings.logoUrl) setLogoUrl(settings.logoUrl);
      if (settings.stampUrl) setStampUrl(settings.stampUrl);
    }
  }, [settings]);

  // Handle Logo file upload
  const handleLogoUpload = (file: File) => {
    if (!canManageSetup) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoUrl(dataUrl);
        setLogoUploadMsg('New logo uploaded successfully!');
        setTimeout(() => setLogoUploadMsg(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Stamp file upload
  const handleStampUpload = (file: File) => {
    if (!canManageSetup) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, or WebP recommended)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setStampUrl(dataUrl);
        setStampUploadMsg('Official school stamp uploaded successfully!');
        setTimeout(() => setStampUploadMsg(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    if (!canManageSetup) return;
    setLogoUrl(DEFAULT_SCHOOL_LOGO_DATA_URI);
    setLogoUploadMsg('Default Golden Horizon crest restored!');
    setTimeout(() => setLogoUploadMsg(null), 3000);
  };

  const handleResetStamp = () => {
    if (!canManageSetup) return;
    setStampUrl(DEFAULT_SCHOOL_STAMP_DATA_URI);
    setStampUploadMsg('Official Golden Horizon stamp restored!');
    setTimeout(() => setStampUploadMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSetup) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can modify school setup.');
      return;
    }
    if (onUpdateSettings) {
      onUpdateSettings({
        schoolName,
        secondarySchoolName,
        primarySchoolName,
        website,
        email,
        altEmail,
        phone,
        phoneNumbers: phone.split(',').map((p) => p.trim()).filter(Boolean),
        motto,
        academicSession,
        currentTerm,
        principalName,
        headTeacherName,
        logoUrl,
        stampUrl
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const leadershipUsers = useMemo(() => {
    return users.filter((u) => ['super_admin', 'principal', 'head_teacher', 'finance'].includes(u.role));
  }, [users]);

  const filteredLeadershipUsers = useMemo(() => {
    return leadershipUsers.filter((u) => {
      if (leadershipFilter !== 'all' && u.role !== leadershipFilter) return false;
      if (leadershipSearch.trim()) {
        const q = leadershipSearch.trim().toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [leadershipUsers, leadershipFilter, leadershipSearch]);

  const handleAddLeadershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderName.trim() || !newLeaderEmail.trim()) {
      setLeadershipActionFeedback({ type: 'error', message: 'Please provide both full name and email address.' });
      return;
    }
    const res = addLeadershipUser({
      name: newLeaderName.trim(),
      email: newLeaderEmail.trim(),
      phone: newLeaderPhone.trim() || undefined,
      role: newLeaderRole,
      temporaryPassword: newLeaderPassword.trim() || 'Pioneer@2026'
    });

    if (res.success) {
      setLeadershipActionFeedback({ type: 'success', message: res.message });
      setIsAddLeadershipModalOpen(false);
      if (newLeaderRole === 'principal') {
        setPrincipalName(newLeaderName.trim());
      } else if (newLeaderRole === 'head_teacher') {
        setHeadTeacherName(newLeaderName.trim());
      }
      setNewLeaderName('');
      setNewLeaderEmail('');
      setNewLeaderPhone('');
      setNewLeaderRole('principal');
      setNewLeaderPassword('Pioneer@2026');
      setTimeout(() => setLeadershipActionFeedback(null), 6000);
    } else {
      setLeadershipActionFeedback({ type: 'error', message: res.message });
    }
  };

  const handleConfirmDeleteUser = () => {
    if (!deletingUserTarget) return;
    const res = deleteLeadershipUser(deletingUserTarget.id);
    if (res.success) {
      setLeadershipActionFeedback({ type: 'success', message: res.message });
      setDeletingUserTarget(null);
      setTimeout(() => setLeadershipActionFeedback(null), 6000);
    } else {
      setLeadershipActionFeedback({ type: 'error', message: res.message });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return {
          title: 'System Administrator',
          classes: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          dot: 'bg-indigo-500'
        };
      case 'principal':
        return {
          title: 'School Principal (Secondary)',
          classes: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          dot: 'bg-blue-500'
        };
      case 'head_teacher':
        return {
          title: 'Head Teacher (Primary)',
          classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 'finance':
        return {
          title: 'Bursar / Finance Officer',
          classes: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500'
        };
      default:
        return {
          title: role.replace('_', ' '),
          classes: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Pioneer Authority Management Section: Only visible in Pioneer Portal */}
      {isPioneer && (
        <div className="p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-orange-500/5 dark:from-amber-950/20 dark:via-amber-900/15 dark:to-slate-900 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 dark:border-amber-800/60 pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Pioneer Authority: Key Leadership Governance
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    Pioneer Exclusive Privilege
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  As the Pioneer, you have sovereign authority to appoint or delete school leadership personnel—including <strong>System Administrators</strong>, the <strong>School Principal</strong> (Secondary), the <strong>Head Teacher</strong> (Primary), and the <strong>Bursar / Finance Officer</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddLeadershipModalOpen(true);
                setLeadershipActionFeedback(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Appoint Leadership Personnel
            </button>
          </div>

          {/* Action Feedback Banner */}
          {leadershipActionFeedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                leadershipActionFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {leadershipActionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{leadershipActionFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setLeadershipActionFeedback(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <div className="flex flex-wrap items-center gap-1 text-xs">
              {[
                { id: 'all', label: 'All Roles', count: leadershipUsers.length },
                { id: 'super_admin', label: 'Admin', count: leadershipUsers.filter((u) => u.role === 'super_admin').length },
                { id: 'principal', label: 'Principal', count: leadershipUsers.filter((u) => u.role === 'principal').length },
                { id: 'head_teacher', label: 'Head Teacher', count: leadershipUsers.filter((u) => u.role === 'head_teacher').length },
                { id: 'finance', label: 'Bursar/Finance', count: leadershipUsers.filter((u) => u.role === 'finance').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLeadershipFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    leadershipFilter === tab.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    leadershipFilter === tab.id ? 'bg-amber-700/60 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leadership by name or email..."
                value={leadershipSearch}
                onChange={(e) => setLeadershipSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Leadership Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeadershipUsers.map((user) => {
              const badge = getRoleBadge(user.role);
              const isCurrentSessionUser = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrentSessionUser && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.title}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{user.hasSetPassword ? 'Password Active' : 'Initial Passcode Ready'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeletingUserTarget(user)}
                      className="px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Revoke and remove leadership access"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete User
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredLeadershipUsers.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No leadership accounts found</p>
                <p className="text-slate-400 mt-0.5">Adjust your role filter or click "Appoint Leadership Personnel" to add one.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        canManageSetup
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canManageSetup ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Executive Setup Authority Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with full authority to modify school profiles, contact information, and academic parameters.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Read-Only Configuration Mode:</strong> School setup modification is restricted to <strong>Administrator, School Principal, and Head Teacher</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-600" /> Institutional Setup & Section Profiles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure institutional identities, official contact channels, term parameters, and leadership credentials.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" /> Institutional configuration updated and synchronized across all portals!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Institutional Branding: School Logo & School Stamp Upload Section */}
        <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-900/50 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" /> Institutional Visual Identity & Official Stamp
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Manage the authoritative school crest logo used across the portal and the verified school stamp applied to terminal report cards.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              Admin &amp; Executive Authority Only
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Section 1: School Logo Upload */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="h-4 w-4 text-blue-600" /> Official School Logo / Crest
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> System Default Loaded
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  This logo represents Golden Horizon College &amp; Nursery/Primary School. It appears in the sidebar brand header, top navigation bar, student result cards, parent portal, and official documents.
                </p>

                {logoUploadMsg && (
                  <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {logoUploadMsg}
                  </div>
                )}

                {/* Logo Preview & Drop Area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files?.[0]) handleLogoUpload(e.dataTransfer.files[0]);
                  }}
                  className="p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center gap-4 transition hover:border-blue-400"
                >
                  <div className="relative shrink-0 flex items-center justify-center h-28 w-28 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Golden Horizon School Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      Golden Horizon Crest
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                      Drag and drop image here, or browse from computer. Recommended: High-res PNG, SVG, or JPG (500x500px).
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={logoInputRef}
                        accept="image/*"
                        disabled={!canManageSetup}
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={!canManageSetup}
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload School Logo
                      </button>
                      <button
                        type="button"
                        disabled={!canManageSetup}
                        onClick={handleResetLogo}
                        title="Reset to default Golden Horizon attachment crest"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Display target: All App Headers &amp; Letterheads</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">Active Everywhere</span>
              </div>
            </div>

            {/* Section 2: School Stamp Upload */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                    <Stamp className="h-4 w-4 text-indigo-600" /> Official School Stamp / Seal
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Seal Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Official school stamp applied at the base of every terminal report card, positioned directly beneath the Principal and Head Teacher's comments and signature.
                </p>

                {stampUploadMsg && (
                  <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {stampUploadMsg}
                  </div>
                )}

                {/* Stamp Preview & Drop Area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files?.[0]) handleStampUpload(e.dataTransfer.files[0]);
                  }}
                  className="p-4 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center gap-4 transition hover:border-indigo-400"
                >
                  <div className="relative shrink-0 flex items-center justify-center h-28 w-28 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
                    {stampUrl ? (
                      <div className="transform -rotate-6 transition hover:rotate-0">
                        <img
                          src={stampUrl}
                          alt="Official Golden Horizon Stamp"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <Stamp className="h-10 w-10 text-slate-400" />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-600 text-white uppercase shadow-xs">
                      Official
                    </span>
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      Official Certification Stamp
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                      Drag and drop image here. Transparent PNG or SVG recommended so it stamps cleanly over white report paper.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={stampInputRef}
                        accept="image/*"
                        disabled={!canManageSetup}
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleStampUpload(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={!canManageSetup}
                        onClick={() => stampInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload School Stamp
                      </button>
                      <button
                        type="button"
                        disabled={!canManageSetup}
                        onClick={handleResetStamp}
                        title="Reset to default official Golden Horizon stamp"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Display target: Base of Report Cards</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Under Principal/Head Remark</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dual Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Secondary Section Card: Golden Horizon College */}
          <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-950 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary Section
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                College Division
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Secondary School Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={secondarySchoolName}
                onChange={(e) => setSecondarySchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-indigo-700 dark:text-indigo-300 disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official title used on WAEC/NECO records, high school reports, and student IDs.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Executive Principal Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60 font-semibold"
              />
            </div>
          </div>

          {/* Primary Section Card: Golden Horizon Nursery and Primary School */}
          <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-950 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Nursery Section
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                Early Years & Primary
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Primary School Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={primarySchoolName}
                onChange={(e) => setPrimarySchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-amber-700 dark:text-amber-300 disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official title used on primary continuous assessments, report cards, and admissions.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Head Teacher / Headmistress Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={headTeacherName}
                onChange={(e) => setHeadTeacherName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60 font-semibold"
              />
            </div>
          </div>

        </div>

        {/* Official Contact Details for Both Sections */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" /> Official School Contact Details (Both Sections)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official digital channels, institutional emails, and telephone helplines for Golden Horizon College & Nursery/Primary School.
              </p>
            </div>
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs transition self-start sm:self-auto"
            >
              <Globe className="h-3.5 w-3.5" /> Visit {website} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Globe className="h-3.5 w-3.5 text-blue-600" /> Official Website
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60 text-blue-600 dark:text-blue-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-emerald-600" /> Primary Official Email
              </label>
              <input
                type="email"
                disabled={!canManageSetup}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-purple-600" /> Administrative Email
              </label>
              <input
                type="email"
                disabled={!canManageSetup}
                value={altEmail}
                onChange={(e) => setAltEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Phone className="h-3.5 w-3.5 text-amber-600" /> Official Phone Numbers (Comma Separated)
            </label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
            />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold">Active lines:</span>
              {phone.split(',').map((num, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold border border-slate-200 dark:border-slate-700"
                >
                  {num.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Calendar & Common Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <School className="h-4 w-4 text-emerald-600" /> Combined Institutional Motto & Heading
            </h3>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Institutional Combined Heading
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shared School Motto
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="h-4 w-4 text-emerald-600" /> Academic Session & Term Config
            </h3>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Academic Session</label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Active Term</label>
              <DropdownWithSearch
                disabled={!canManageSetup}
                options={[
                  { value: '1st Term', label: '1st Term', sublabel: `Autumn / Michaelmas${currentTerm === '1st Term' ? ' (Active)' : ''}`, badge: '1st Term' },
                  { value: '2nd Term', label: '2nd Term', sublabel: `Spring / Lent${currentTerm === '2nd Term' ? ' (Active)' : ''}`, badge: '2nd Term' },
                  { value: '3rd Term', label: '3rd Term', sublabel: `Summer / Trinity${currentTerm === '3rd Term' ? ' (Active)' : ''}`, badge: '3rd Term' }
                ]}
                value={currentTerm}
                onChange={(val) => setCurrentTerm(val)}
                placeholder="Select active term..."
                searchPlaceholder="Search term..."
                colorScheme="emerald"
                buttonLabel="Term"
              />
            </div>
          </div>
        </div>

        {canManageSetup && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save School Configuration
            </button>
          </div>
        )}
      </form>

      {/* Pioneer Modal: Appoint Leadership Personnel */}
      {isAddLeadershipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Appoint School Leadership
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pioneer executive assignment of leadership & governance personnel.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLeadershipModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLeadershipSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Leadership Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'principal' as const,
                      label: 'School Principal',
                      sub: 'Secondary School (College)',
                      color: 'border-blue-300 bg-blue-50/50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800'
                    },
                    {
                      id: 'head_teacher' as const,
                      label: 'Head Teacher',
                      sub: 'Primary & Early Years',
                      color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800'
                    },
                    {
                      id: 'finance' as const,
                      label: 'Bursar / Finance',
                      sub: 'Accounts & School Fees',
                      color: 'border-amber-300 bg-amber-50/50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800'
                    },
                    {
                      id: 'super_admin' as const,
                      label: 'System Admin',
                      sub: 'General School Administration',
                      color: 'border-indigo-300 bg-indigo-50/50 text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200 dark:border-indigo-800'
                    }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewLeaderRole(r.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        newLeaderRole === r.id
                          ? `${r.color} ring-2 ring-amber-500 font-bold shadow-xs`
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] opacity-75">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Christopher Adewale"
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address (Username for Login) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. principal@goldenhorizonschools.ng"
                  value={newLeaderEmail}
                  onChange={(e) => setNewLeaderEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +234 803 123 4567"
                  value={newLeaderPhone}
                  onChange={(e) => setNewLeaderPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span>Initial Temporary Passcode</span>
                  <span className="text-[10px] text-slate-400 font-normal">Can be changed upon login</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={newLeaderPassword}
                    onChange={(e) => setNewLeaderPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadershipModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Appoint &amp; Issue Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pioneer Modal: Confirm Delete Leadership User */}
      {deletingUserTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Revoke &amp; Delete Leadership Access
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pioneer governance action
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete access for{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                {deletingUserTarget.name}
              </strong>{' '}
              ({getRoleBadge(deletingUserTarget.role).title})?
            </p>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-[11px] text-rose-800 dark:text-rose-300">
              This will immediately delete their account ({deletingUserTarget.email}) and permanently revoke all access permissions to the school portal.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUserTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Trash2 className="w-4 h-4" /> Yes, Revoke &amp; Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
