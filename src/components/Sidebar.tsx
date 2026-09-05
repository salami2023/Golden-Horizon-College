import React from 'react';
import {
  LayoutDashboard,
  School,
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
  Sparkles,
  Globe,
  Phone
} from 'lucide-react';
import { UserRole, SchoolThemeConfig } from '../types';
import { useRealTime } from '../context/RealTimeContext';
import { DEFAULT_SCHOOL_LOGO_DATA_URI } from '../assets/schoolAssets';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS,
  isPrimaryClass,
  isSecondaryClass
} from '../utils/sectionHelpers';

export type ActiveTab =
  | 'dashboard'
  | 'classes'
  | 'subjects'
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
  const { schoolSettings, classes } = useRealTime();

  const classesCount = React.useMemo(() => {
    if (!classes) return 0;
    if (currentRole === 'head_teacher') {
      return classes.filter((c) => c.section === 'Primary' || isPrimaryClass(c.name)).length;
    }
    if (currentRole === 'principal') {
      return classes.filter((c) => c.section === 'Secondary' || isSecondaryClass(c.name)).length;
    }
    return classes.length;
  }, [classes, currentRole]);

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal', 'teacher', 'bursar', 'finance', 'parent', 'student'],
      badge: 'Live'
    },
    {
      id: 'classes' as ActiveTab,
      label: 'Classes',
      icon: School,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal'],
      badge: `${classesCount || 'Active'}`
    },
    {
      id: 'subjects' as ActiveTab,
      label: currentRole === 'head_teacher' ? 'Primary Subjects' : currentRole === 'principal' ? 'Secondary Subjects' : 'Subjects & Curriculum',
      icon: BookOpen,
      roles: ['super_admin', 'pioneer', 'head_teacher', 'principal'],
      badge: 'Curriculum'
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
      <div className={`flex items-center gap-3 pb-5 pt-6 border-b border-slate-800/80 ${isCollapsed ? 'px-4 justify-center' : 'px-5'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/95 p-1 text-white font-bold shadow-md shadow-blue-500/20 border border-slate-700">
          <img
            src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
            alt="Golden Horizon Logo"
            className="h-full w-full object-contain rounded-lg"
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[16px] font-black text-white tracking-tight leading-tight truncate">
              Golden Horizon
            </span>
            <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase truncate">
              {currentRole === 'principal'
                ? 'College (Secondary)'
                : currentRole === 'head_teacher'
                ? 'Nursery & Primary'
                : 'College & Primary'}
            </span>
          </div>
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

      {/* Footer Role & School Contact Info */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-[#1e293b]/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-[#2563eb] font-semibold text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="truncate font-bold">
              {currentRole === 'principal'
                ? (schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME)
                : currentRole === 'head_teacher'
                ? (schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME)
                : (schoolSettings?.schoolName || 'Golden Horizon Schools')}
            </span>
          </div>
          <div className="space-y-1 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="h-3 w-3 text-blue-400 shrink-0" />
              <span className="truncate font-mono">{schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="truncate font-mono">{schoolSettings?.phone || SCHOOL_CONTACT_DETAILS.phoneNumbers[0]}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
