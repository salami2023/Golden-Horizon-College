import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileSpreadsheet,
  Laptop,
  CreditCard,
  CalendarCheck,
  HeartHandshake,
  Settings,
  Calendar,
  BookOpen,
  Bus,
  Send,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { UserRole, SchoolThemeConfig } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'students'
  | 'staff'
  | 'academics'
  | 'cbt'
  | 'timetable'
  | 'homework'
  | 'transport_hostel'
  | 'communication'
  | 'finance'
  | 'attendance'
  | 'parent_portal'
  | 'audit_logs'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  themeConfig: SchoolThemeConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  isCollapsed,
  onToggleCollapse,
  themeConfig
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'bursar', 'finance', 'parent', 'student'],
      badge: 'Live'
    },
    {
      id: 'students' as ActiveTab,
      label: 'Student Directory',
      icon: Users,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'bursar', 'finance'],
      badge: '1,248'
    },
    {
      id: 'staff' as ActiveTab,
      label: 'Teachers & Staff',
      icon: UserCheck,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal'],
      badge: '84'
    },
    {
      id: 'academics' as ActiveTab,
      label: 'Academics & Reports',
      icon: FileSpreadsheet,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'parent', 'student'],
      badge: 'AI Cards'
    },
    {
      id: 'cbt' as ActiveTab,
      label: 'CBT & E-Learning',
      icon: Laptop,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'student'],
      badge: 'Exam'
    },
    {
      id: 'timetable' as ActiveTab,
      label: 'School Timetable',
      icon: Calendar,
      roles: ['super_admin', 'pioneer', 'principal', 'teacher', 'bursar', 'finance', 'parent', 'student'],
      badge: 'Schedule'
    },
    {
      id: 'homework' as ActiveTab,
      label: 'Homework & Tasks',
      icon: BookOpen,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'student', 'parent'],
      badge: 'Tasks'
    },
    {
      id: 'transport_hostel' as ActiveTab,
      label: 'Bus & Hostel Services',
      icon: Bus,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'bursar', 'finance', 'parent', 'student'],
      badge: 'Logistics'
    },
    {
      id: 'communication' as ActiveTab,
      label: 'SMS & Broadcasting',
      icon: Send,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'bursar', 'finance', 'teacher'],
      badge: 'Broadcast'
    },
    {
      id: 'finance' as ActiveTab,
      label: 'Bursary & Finance',
      icon: CreditCard,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'bursar', 'finance', 'parent'],
      badge: 'Bursary'
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Attendance Register',
      icon: CalendarCheck,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'parent'],
      badge: 'Daily'
    },
    {
      id: 'parent_portal' as ActiveTab,
      label: 'Parent Details & Portal',
      icon: HeartHandshake,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'parent', 'teacher'],
      badge: 'Portal'
    },
    {
      id: 'audit_logs' as ActiveTab,
      label: 'Security & Audit Logs',
      icon: ShieldAlert,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal'],
      badge: 'Audit'
    },
    {
      id: 'settings' as ActiveTab,
      label: 'School Setup',
      icon: Settings,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal'],
      badge: 'Setup'
    }
  ];

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <aside
      className={`relative z-20 flex flex-col bg-[#0f172a] text-white transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-[240px]'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md hover:bg-slate-700 hover:text-white transition z-30"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Brand Header */}
      <div className={`flex items-center gap-2.5 pb-6 pt-6 border-b border-slate-800/80 ${isCollapsed ? 'px-4 justify-center' : 'px-6'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold">
          <ShieldCheck className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <span className="text-[20px] font-bold text-white tracking-tight">
            KwikSchools
          </span>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-0.5 py-4 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 text-[14px] transition-all duration-200 ${
                isCollapsed ? 'px-4 py-3 justify-center' : 'px-6 py-3'
              } ${
                isActive
                  ? 'bg-[#1e293b] text-white border-l-[4px] border-[#2563eb] font-semibold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50 border-l-[4px] border-transparent font-medium'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#94a3b8]'
                }`}
              />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-slate-800 text-[#94a3b8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Role Info */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-xl bg-[#1e293b]/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-[#2563eb] font-semibold text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            {currentRole === 'principal' ? 'Secondary Section' : currentRole === 'head_teacher' ? 'Primary & Nursery' : 'Portal Active'}
          </div>
          <p className="text-[11px] text-[#94a3b8] font-medium uppercase tracking-wider">
            {currentRole === 'principal'
              ? 'Secondary Principal Portal'
              : currentRole === 'head_teacher'
              ? 'Head Teacher Portal'
              : `${currentRole.replace('_', ' ')} Portal`}
          </p>
        </div>
      )}
    </aside>
  );
};
