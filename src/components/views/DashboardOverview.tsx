import React from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  Laptop,
  GraduationCap,
  Sparkles,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Student, Teacher, Invoice, CBTExam, Announcement, UserRole, SchoolSettings } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import { DEFAULT_SCHOOL_LOGO_DATA_URI } from '../../assets/schoolAssets';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS,
  isSecondaryClass,
  isPrimaryClass,
  filterTeachersByRole
} from '../../utils/sectionHelpers';

interface DashboardOverviewProps {
  students: Student[];
  teachers: Teacher[];
  invoices: Invoice[];
  cbtExams: CBTExam[];
  announcements: Announcement[];
  onNavigate: (tab: any) => void;
  currentRole: UserRole;
  schoolSettings?: SchoolSettings;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  teachers,
  invoices,
  cbtExams,
  announcements,
  onNavigate,
  currentRole,
  schoolSettings: propSchoolSettings
}) => {
  const { schoolSettings: contextSchoolSettings } = useRealTime();
  const schoolSettings = propSchoolSettings || contextSchoolSettings;

  const activeSession = schoolSettings?.academicSession || '2025/2026 Academic Session';
  const activeTerm = schoolSettings?.currentTerm || '2nd Term';
  const activeSchoolName = currentRole === 'principal'
    ? (schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME)
    : currentRole === 'head_teacher'
    ? (schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME)
    : (schoolSettings?.schoolName || `${schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME} & Primary`);

  const activeWebsite = schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website;
  const activeEmailsDisplay = schoolSettings?.email
    ? (schoolSettings.altEmail ? `${schoolSettings.email} or ${schoolSettings.altEmail}` : schoolSettings.email)
    : SCHOOL_CONTACT_DETAILS.emailsDisplay;
  const activePhoneDisplay = schoolSettings?.phone || SCHOOL_CONTACT_DETAILS.phoneDisplay;

  // Real-Time Database Breakdown by Role
  const secondaryStudents = students.filter((s) => isSecondaryClass(s.classGroup));
  const primaryPupils = students.filter((s) => isPrimaryClass(s.classGroup));

  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';
  const isAllSchoolLeader = currentRole === 'pioneer' || currentRole === 'super_admin' || currentRole === 'finance';

  // Role-Specific Real-Time Student / Pupil Metric
  let studentMetricLabel = 'Total Students & Pupils';
  let studentMetricValue = students.length;
  let studentMetricSubtitle = `${secondaryStudents.length} Secondary Students • ${primaryPupils.length} Primary Pupils`;

  if (isPrincipal) {
    studentMetricLabel = 'Total Students';
    studentMetricValue = secondaryStudents.length;
    studentMetricSubtitle = `${secondaryStudents.length} Secondary Students in ${schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME}`;
  } else if (isHeadTeacher) {
    studentMetricLabel = 'Total Pupils';
    studentMetricValue = primaryPupils.length;
    studentMetricSubtitle = `${primaryPupils.length} Primary Pupils in ${schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME}`;
  } else if (isAllSchoolLeader) {
    studentMetricLabel = 'Total Students / Pupils';
    studentMetricValue = students.length;
    studentMetricSubtitle = `${secondaryStudents.length} Students (Secondary) • ${primaryPupils.length} Pupils (Primary)`;
  }

  // Real-Time Staff Metric
  const roleTeachers = isPrincipal
    ? filterTeachersByRole(teachers, 'principal')
    : isHeadTeacher
    ? filterTeachersByRole(teachers, 'head_teacher')
    : teachers;

  const staffMetricLabel = isPrincipal
    ? 'Secondary Staff'
    : isHeadTeacher
    ? 'Primary Staff'
    : 'Total Staff';

  const staffMetricValue = roleTeachers.length;
  const staffMetricSubtitle = isPrincipal
    ? `${roleTeachers.length} Certified Secondary Educators`
    : isHeadTeacher
    ? `${roleTeachers.length} Certified Primary Educators`
    : `${roleTeachers.length} Certified Educators Across All Wings`;

  // Real-Time Student Subset for Attendance & Academic Distribution
  const roleStudents = isPrincipal
    ? secondaryStudents
    : isHeadTeacher
    ? primaryPupils
    : students;

  const averageAttendance = roleStudents.length > 0
    ? (roleStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / roleStudents.length).toFixed(1)
    : '0.0';

  // Real-Time Revenue & Fees in Nigerian Naira (₦)
  const roleInvoices = isPrincipal
    ? invoices.filter((inv) => isSecondaryClass(inv.classGroup))
    : isHeadTeacher
    ? invoices.filter((inv) => isPrimaryClass(inv.classGroup))
    : invoices;

  const totalInvoiced = roleInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalCollected = roleInvoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
  const totalOutstanding = Math.max(0, totalInvoiced - totalCollected);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  // Chart Data in Nigerian Naira (₦)
  const monthlyRevenueData = [
    { month: 'May', Tuition: 450000, Books: 80000, Bus: 60000 },
    { month: 'Jun', Tuition: 520000, Books: 95000, Bus: 72000 },
    { month: 'Jul', Tuition: 380000, Books: 60000, Bus: 50000 },
    { month: 'Aug', Tuition: 680000, Books: 120000, Bus: 85000 },
    { month: 'Sep', Tuition: 840000, Books: 145000, Bus: 110000 },
    { month: 'Oct', Tuition: 920000, Books: 160000, Bus: 125000 },
  ];

  // Dynamic Grade Distribution calculated from real student roster
  const gradeCounts = {
    'Grade A (70-100%)': 0,
    'Grade B (60-69%)': 0,
    'Grade C (50-59%)': 0,
    'Grade D (40-49%)': 0,
    'Grade F (Below 40%)': 0,
  };

  roleStudents.forEach((s) => {
    const g = s.gpa || 3.5;
    if (g >= 3.6) gradeCounts['Grade A (70-100%)']++;
    else if (g >= 3.0) gradeCounts['Grade B (60-69%)']++;
    else if (g >= 2.3) gradeCounts['Grade C (50-59%)']++;
    else if (g >= 1.5) gradeCounts['Grade D (40-49%)']++;
    else gradeCounts['Grade F (Below 40%)']++;
  });

  const totalEvaluated = roleStudents.length || 1;
  const gradeDistribution = [
    { name: 'Grade A (70-100%)', value: Math.round((gradeCounts['Grade A (70-100%)'] / totalEvaluated) * 100), color: '#10b981' },
    { name: 'Grade B (60-69%)', value: Math.round((gradeCounts['Grade B (60-69%)'] / totalEvaluated) * 100), color: '#3b82f6' },
    { name: 'Grade C (50-59%)', value: Math.round((gradeCounts['Grade C (50-59%)'] / totalEvaluated) * 100), color: '#f59e0b' },
    { name: 'Grade D (40-49%)', value: Math.round((gradeCounts['Grade D (40-49%)'] / totalEvaluated) * 100), color: '#8b5cf6' },
    { name: 'Grade F (Below 40%)', value: Math.round((gradeCounts['Grade F (Below 40%)'] / totalEvaluated) * 100), color: '#ef4444' },
  ];

  // Recent 5 students for real-time table
  const recentStudentsList = roleStudents.slice(0, 5);

  const roleConfigMap: Record<UserRole, { welcome: string; roleLabel: string }> = {
    pioneer: { welcome: 'Welcome back, Pioneer', roleLabel: 'Pioneer Master (Full Access)' },
    super_admin: { welcome: 'Welcome back, Administrator', roleLabel: 'System Administrator (Full Access)' },
    principal: { welcome: 'Welcome back, School Principal', roleLabel: 'Executive Principal (Executive Access)' },
    head_teacher: { welcome: 'Welcome back, Head Teacher', roleLabel: 'Head Teacher (Executive Access)' },
    teacher: { welcome: 'Welcome back, Teacher', roleLabel: 'Class / Subject Teacher' },
    finance: { welcome: 'Welcome back, Bursar', roleLabel: 'Bursar & Finance Officer' },
    parent: { welcome: 'Welcome to Parent Portal', roleLabel: 'Guardian / Parent' },
    student: { welcome: 'Welcome back, Student', roleLabel: 'Enrolled Student' },
  };

  const currentRoleConfig = roleConfigMap[currentRole] || roleConfigMap.super_admin;

  return (
    <div className="space-y-6">
      
      {/* Banner Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 text-white border border-slate-800 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-white p-1.5 shadow-lg border border-white/20 flex items-center justify-center">
              <img
                src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
                alt="Golden Horizon Crest"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                {activeSchoolName}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {currentRoleConfig.welcome}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl">
                {currentRoleConfig.roleLabel} • {activeSession} • {activeTerm} Overview
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('academics')}
              className="px-4 py-2 rounded-lg bg-white text-slate-900 font-semibold text-xs shadow-sm hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-blue-600" />
              Generate AI Report Cards
            </button>
            <button
              onClick={() => onNavigate('cbt')}
              className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Laptop className="h-4 w-4" />
              Manage CBT Tests
            </button>
          </div>
        </div>

        {/* Institutional Contact Bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={activeWebsite.startsWith('http') ? activeWebsite : `https://${activeWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-300 transition"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-mono">{activeWebsite}</span>
            </a>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">{activeEmailsDisplay}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono text-[11px]">{activePhoneDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat Card 1: Dynamic Student / Pupil Count */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{studentMetricLabel}</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            {studentMetricValue.toLocaleString()}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 truncate" title={studentMetricSubtitle}>
            {studentMetricSubtitle}
          </p>
        </div>

        {/* Stat Card 2: Dynamic Staff Count */}
        <div
          onClick={() => onNavigate('staff')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{staffMetricLabel}</span>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            {staffMetricValue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate" title={staffMetricSubtitle}>
            {staffMetricSubtitle}
          </p>
        </div>

        {/* Stat Card 3: Real-Time Avg Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Avg. Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            {averageAttendance}%
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Real-time Roster Attendance Rate
          </p>
        </div>

        {/* Stat Card 4: Real-Time Fee Revenue in Naira (₦) */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Fee Revenue (₦)</span>
            <CreditCard className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            ₦{totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 truncate" title={`${collectionRate}% Collected of ₦${totalInvoiced.toLocaleString()} Invoiced`}>
            {collectionRate}% Collected (₦{totalInvoiced.toLocaleString()} Invoiced)
          </p>
        </div>

      </div>

      {/* Lower Content Grid: Recent Registrations & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registrations Table Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 px-5 border-b border-slate-200 dark:border-slate-800 font-semibold text-base text-[#1e293b] dark:text-white flex justify-between items-center">
            <span>Recent Registrations ({recentStudentsList.length})</span>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#f8fafc] dark:bg-slate-800/80 text-[#64748b] dark:text-slate-400 font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left p-3 px-5">Admission No</th>
                  <th className="text-left p-3 px-5">Student / Pupil Name</th>
                  <th className="text-left p-3 px-5">Class Wing</th>
                  <th className="text-left p-3 px-5">Status</th>
                  <th className="text-left p-3 px-5">Fee Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-[#1e293b] dark:text-slate-200">
                {recentStudentsList.length > 0 ? (
                  recentStudentsList.map((std) => {
                    const balance = std.totalFeeDue - std.feePaid;
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">{std.admissionNo}</td>
                        <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">{std.firstName} {std.lastName}</td>
                        <td className="p-3 px-5 text-slate-600 dark:text-slate-300">{std.classGroup}</td>
                        <td className="p-3 px-5">
                          <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                            {std.status}
                          </span>
                        </td>
                        <td className="p-3 px-5 font-mono text-xs font-bold">
                          {balance <= 0 ? (
                            <span className="text-emerald-600">Cleared</span>
                          ) : (
                            <span className="text-rose-600">₦{balance.toLocaleString()} due</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400 text-xs">
                      No student records found in current view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 px-5 border-b border-slate-200 dark:border-slate-800 font-semibold text-base text-[#1e293b] dark:text-white">
            Upcoming Events
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-4">
              <div className="text-[11px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
                TOMORROW • 09:00 AM
              </div>
              <div className="text-sm font-medium text-[#1e293b] dark:text-slate-200">
                Parent-Teacher Conference
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
                OCT 15, 2023 • 02:00 PM
              </div>
              <div className="text-sm font-medium text-[#1e293b] dark:text-slate-200">
                Annual Science Fair Presentation
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
                OCT 18, 2023
              </div>
              <div className="text-sm font-medium text-[#1e293b] dark:text-slate-200">
                Mid-Term Assessment Begins
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
                OCT 22, 2023
              </div>
              <div className="text-sm font-medium text-[#1e293b] dark:text-slate-200">
                Sports Day Planning Committee
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Breakdown Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#2563eb]" /> Revenue & Collections Breakdown (₦)
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Monthly income streams across Tuition, Books & Transport (in Nigerian Naira ₦)
              </p>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
            >
              View Ledgers <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} tickFormatter={(val: any) => `₦${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any) => [`₦${Number(val).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="Tuition" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Books" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bus" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Grade Distribution Donut */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#2563eb]" /> Grade Distribution
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {activeTerm} CA
            </span>
          </div>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mb-2">
            Student score breakdown across senior classes
          </p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 text-xs">
            {gradeDistribution.map((g) => (
              <div key={g.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                  <span className="text-[11px] font-medium">{g.name}</span>
                </div>
                <span className="font-semibold text-[11px]">{g.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
