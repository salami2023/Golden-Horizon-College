import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Bell,
  Palette,
  Search,
  UserCheck,
  ChevronDown,
  Sparkles,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  LogOut,
  KeyRound,
  Phone,
  Mail,
  User,
  Layers,
  ArrowRightLeft,
  ShieldCheck
} from 'lucide-react';
import { UserRole, SchoolThemeConfig } from '../types';
import { RealTimeSyncBadge } from './RealTimeSyncBadge';
import { useRealTime } from '../context/RealTimeContext';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_SCHOOL_LOGO_DATA_URI } from '../assets/schoolAssets';
import { getAllowedPortalsForUser, PortalDef } from '../utils/sectionHelpers';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  themeConfig: SchoolThemeConfig;
  onOpenCustomizer: () => void;
  onSearch: (query: string) => void;
  onSelectTab?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  themeConfig,
  onOpenCustomizer,
  onSearch,
  onSelectTab
}) => {
  const { schoolSettings } = useRealTime();
  const { currentUser, logout, setIsPasswordSetupOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; subtitle: string; color: string }> = {
    pioneer: { title: 'Pioneer', badge: 'Full Access', subtitle: 'Pioneer Master Access', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
    super_admin: { title: 'Administrator', badge: 'Full Access', subtitle: 'System Administrator', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
    principal: { title: 'School Principal', badge: 'Executive', subtitle: 'Executive Leadership (Secondary)', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    head_teacher: { title: 'Head Teacher', badge: 'Executive', subtitle: 'Executive Academic Leadership (Primary)', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
    teacher: { title: 'Class/Subject Teacher', badge: 'Academic', subtitle: 'Academic Staff', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    finance: { title: 'Bursar / Finance', badge: 'Accounts', subtitle: 'Finance & Bursary', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    parent: { title: 'Parent Portal', badge: 'Family', subtitle: 'Parent / Guardian', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
    student: { title: 'Student Portal', badge: 'Learner', subtitle: 'Enrolled Student', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  };

  const allowedPortals = useMemo(() => {
    return getAllowedPortalsForUser(currentUser?.role || currentRole);
  }, [currentUser?.role, currentRole]);

  const activePortal = allowedPortals.find((p) => p.role === currentRole) || {
    role: currentRole,
    title: roleLabels[currentRole]?.title || currentRole,
    subtitle: roleLabels[currentRole]?.subtitle || '',
    badge: roleLabels[currentRole]?.badge || '',
    color: roleLabels[currentRole]?.color || '',
    section: 'all' as const,
    description: ''
  };

  const isCrossPortalSwitched = currentUser && currentRole !== currentUser.role;

  const handleSwitchPortal = (targetRole: UserRole) => {
    onRoleChange(targetRole);
    setShowPortalMenu(false);
    setShowRoleDropdown(false);
    if (onSelectTab) {
      if (targetRole === 'parent') {
        onSelectTab('parent_portal');
      } else if (targetRole === 'student') {
        onSelectTab('student_portal');
      } else if (targetRole === 'teacher') {
        onSelectTab('classes');
      } else if (targetRole === 'finance') {
        onSelectTab('finance');
      } else {
        onSelectTab('dashboard');
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors h-16 sm:h-20">
      <div className="flex h-16 sm:h-20 items-center justify-between px-5 sm:px-7">
        
        {/* Brand & Academic Term Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md shadow-blue-600/15 border border-slate-200 dark:border-slate-700 p-1">
              <img
                src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
                alt="School Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-[10.5px] sm:text-[12px] md:text-[13.5px] tracking-tight text-slate-900 dark:text-white leading-tight">
                  {schoolSettings?.schoolName || 'Golden Horizon College/Primary'}
                </span>
                <span className="hidden sm:inline-block text-[7.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Portal
                </span>
              </div>
              <p className="hidden md:flex items-center gap-1.5 text-[8.5px] text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="h-3 w-3 text-blue-600 shrink-0" />
                <span>{schoolSettings?.academicSession || '2026/2027 Academic Session'} • {schoolSettings?.currentTerm || '1st Term'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative max-w-lg w-full mx-7">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search students, staff, classes, invoices..."
            className="w-full pl-9 pr-3.5 py-2 text-[10.5px] placeholder:text-[10.5px] rounded-lg border-none bg-[#f1f5f9] dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>

        {/* Right Action Tools: Portal Switcher, Customizer & Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Real-Time Live Sync Status & Presence Badge */}
          <RealTimeSyncBadge />

          {/* Portal Switcher Dropdown (for users with cross-portal privileges) */}
          {allowedPortals.length > 1 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowPortalMenu(!showPortalMenu);
                  setShowRoleDropdown(false);
                  setShowNotifications(false);
                }}
                title="Switch School Portal"
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[9px] font-bold transition shadow-xs cursor-pointer ${
                  isCrossPortalSwitched
                    ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-800 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                    : 'border-blue-200 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                }`}
              >
                <ArrowRightLeft className={`h-3.5 w-3.5 ${isCrossPortalSwitched ? 'text-amber-600 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`} />
                <div className="text-left hidden sm:block">
                  <div className="text-[7px] uppercase font-bold tracking-wider opacity-75">
                    {isCrossPortalSwitched ? 'Viewing Portal' : 'Active Portal'}
                  </div>
                  <div className="text-[10px] font-black truncate max-w-[130px] md:max-w-[170px] leading-tight">
                    {activePortal.title}
                  </div>
                </div>
                <span className="sm:hidden text-[9px] font-bold truncate max-w-[80px]">
                  {activePortal.title}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Portal Selection Menu */}
              {showPortalMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-3 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-blue-600" />
                        Authorized School Portals
                      </h4>
                      <p className="text-[8px] text-slate-500 mt-0.5">
                        Role-based portal access granted to {currentUser?.name || 'Administrator'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPortalMenu(false)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {isCrossPortalSwitched && (
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-2">
                      <div className="text-[8.5px] text-amber-900 dark:text-amber-200 font-medium">
                        Switched from <strong>{currentUser?.role.replace('_', ' ')}</strong>
                      </div>
                      <button
                        onClick={() => currentUser && handleSwitchPortal(currentUser.role)}
                        className="px-2.5 py-1 text-[8px] font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shrink-0"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}

                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
                    {allowedPortals.map((portal) => {
                      const isCurrent = portal.role === currentRole;
                      return (
                        <button
                          key={portal.role}
                          onClick={() => handleSwitchPortal(portal.role)}
                          className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 ring-1 ring-blue-400/40'
                              : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-slate-900 dark:text-white">
                                {portal.title}
                              </span>
                              {isCurrent && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                              )}
                            </div>
                            <div className="text-[8px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {portal.description}
                            </div>
                          </div>
                          <span className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${portal.color}`}>
                            {portal.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme & Layout Customizer Trigger */}
          <button
            onClick={onOpenCustomizer}
            title="Customize Theme & Layout"
            className="relative flex items-center gap-2 px-3 py-1.5 text-[8.5px] font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          >
            <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Theme</span>
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleDropdown(false);
                setShowPortalMenu(false);
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-blue-600" /> System Notifications
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 mt-2.5 max-h-64 overflow-y-auto text-[8.5px]">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-[9px]">CBT Exam Activated</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-[8.5px]">Grade 10 Math CBT Mid-Term is now live for students.</p>
                      <span className="text-[7.5px] text-slate-400 mt-0.5 block">10 minutes ago</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex gap-2.5">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-[9px]">Fee Payment Logged</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-[8.5px]">₦1,200 received for Amina Bello (Grade 10 A).</p>
                      <span className="text-[7.5px] text-slate-400 mt-0.5 block">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowPortalMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-blue-600 font-bold text-[10px] text-white shadow-sm">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                  : <UserCheck className="h-4 w-4" />}
              </div>
              <div className="text-left hidden md:block max-w-[140px]">
                <div className="text-[9.5px] font-bold text-slate-800 dark:text-white leading-tight truncate">
                  {currentUser?.name || roleLabels[currentRole].title}
                </div>
                <div className="text-[8px] text-blue-600 dark:text-blue-400 font-medium truncate">
                  {roleLabels[currentRole].subtitle}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-2.5 space-y-2">
                
                {/* User Card */}
                {currentUser && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5 text-slate-400" />
                      {currentUser.email}
                    </p>
                    {currentUser.phone && (
                      <p className="text-[8.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        {currentUser.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Account Setup & Password Action */}
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    if (onSelectTab) {
                      onSelectTab('account_setup');
                    } else {
                      setIsPasswordSetupOpen(true);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 transition flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Account Setup & Password
                  </span>
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold">
                    {currentUser?.hasSetPassword ? 'Configured' : 'Set Password'}
                  </span>
                </button>

                {/* Switch Role View - Scoped to authorized portals */}
                <div className="pt-1">
                  <div className="px-2 py-1 text-[7.5px] font-bold text-slate-400 uppercase tracking-wider">
                    Authorized Portals ({allowedPortals.length})
                  </div>
                  <div className="max-h-44 overflow-y-auto space-y-0.5">
                    {allowedPortals.map((portal) => (
                      <button
                        key={portal.role}
                        onClick={() => handleSwitchPortal(portal.role)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[8.5px] font-medium flex items-center justify-between transition cursor-pointer ${
                          currentRole === portal.role
                            ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate pr-1">{portal.title}</span>
                        <span className={`text-[7px] px-1 py-0.5 rounded font-semibold shrink-0 ${portal.color}`}>
                          {portal.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[9px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

