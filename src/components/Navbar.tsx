import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { UserRole, SchoolThemeConfig } from '../types';
import { RealTimeSyncBadge } from './RealTimeSyncBadge';
import { useRealTime } from '../context/RealTimeContext';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  themeConfig: SchoolThemeConfig;
  onOpenCustomizer: () => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  themeConfig,
  onOpenCustomizer,
  onSearch
}) => {
  const { schoolSettings } = useRealTime();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; subtitle: string; color: string }> = {
    pioneer: { title: 'Pioneer', badge: 'Full Access', subtitle: 'Pioneer Master Access', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
    super_admin: { title: 'Administrator', badge: 'Full Access', subtitle: 'System Administrator', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
    principal: { title: 'School Principal', badge: 'Executive', subtitle: 'Executive Leadership', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    head_teacher: { title: 'Head Teacher', badge: 'Executive', subtitle: 'Executive Academic Leadership', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
    teacher: { title: 'Class/Subject Teacher', badge: 'Academic', subtitle: 'Academic Staff', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    finance: { title: 'Bursar / Finance', badge: 'Accounts', subtitle: 'Finance & Bursary', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    parent: { title: 'Parent Portal', badge: 'Family', subtitle: 'Parent / Guardian', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
    student: { title: 'Student Portal', badge: 'Learner', subtitle: 'Enrolled Student', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors h-16">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Brand & Academic Term Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/20">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-[8.5px] sm:text-[10px] md:text-[11px] tracking-tight text-slate-900 dark:text-white leading-tight">
                  {schoolSettings?.schoolName || 'Golden Horizon College/Primary'}
                </span>
                <span className="hidden sm:inline-block text-[6px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Portal
                </span>
              </div>
              <p className="hidden md:flex items-center gap-1 text-[7px] text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="h-2.5 w-2.5 text-blue-600 shrink-0" />
                <span>{schoolSettings?.academicSession || '2025/2026 Academic Session'} • {schoolSettings?.currentTerm || '2nd Term'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative max-w-md w-full mx-6">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search students, staff, classes, invoices..."
            className="w-full pl-8 pr-3 py-1.5 text-[8.5px] placeholder:text-[8.5px] rounded-lg border-none bg-[#f1f5f9] dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>

        {/* Right Action Tools: Role Selector, Customizer & Notifications */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Real-Time Live Sync Status & Presence Badge */}
          <RealTimeSyncBadge />

          {/* Theme & Layout Customizer Trigger */}
          <button
            onClick={onOpenCustomizer}
            title="Customize Theme & Layout"
            className="relative flex items-center gap-1.5 px-2.5 py-1 text-[7px] font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          >
            <Palette className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Theme</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-[8.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-blue-600" /> System Notifications
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto text-[7px]">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-[7.5px]">CBT Exam Activated</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-[7px]">Grade 10 Math CBT Mid-Term is now live for students.</p>
                      <span className="text-[6px] text-slate-400 mt-0.5 block">10 minutes ago</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-[7.5px]">Fee Payment Logged</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-[7px]">$1,200 received for Amina Bello (Grade 10 A).</p>
                      <span className="text-[6px] text-slate-400 mt-0.5 block">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-bold text-[7.5px] text-white">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[7.5px] font-semibold text-slate-800 dark:text-white leading-tight">
                  {roleLabels[currentRole].title}
                </div>
                <div className="text-[6.5px] text-slate-500 dark:text-slate-400">
                  {roleLabels[currentRole].subtitle}
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-1.5 space-y-1">
                <div className="px-2.5 py-1.5 text-[6.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Select System Role View
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      onRoleChange(roleKey);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[7px] font-medium flex items-center justify-between transition ${
                      currentRole === roleKey
                        ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{roleLabels[roleKey].title}</span>
                    <span className={`text-[6px] px-1 py-0.5 rounded font-semibold ${roleLabels[roleKey].color}`}>
                      {roleLabels[roleKey].badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
