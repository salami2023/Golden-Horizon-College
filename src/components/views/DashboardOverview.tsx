import React from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Student, Teacher, Invoice, CBTExam, Announcement, UserRole, SchoolSettings } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS
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

  // Calculations
  const totalStudents = students.length * 208; // Scaling for realistic school figure (e.g. 1,248)
  const totalTeachers = teachers.length * 28;  // e.g. 84
  const activeCBTs = cbtExams.filter((c) => c.status === 'Active').length;
  
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0) * 85;
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0) * 85;
  const totalOutstanding = totalInvoiced - totalCollected;

  const averageAttendance = (
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)
  ).toFixed(1);

  // Chart Mock Data
  const monthlyRevenueData = [
    { month: 'May', Tuition: 45000, Books: 8000, Bus: 6000 },
    { month: 'Jun', Tuition: 52000, Books: 9500, Bus: 7200 },
    { month: 'Jul', Tuition: 38000, Books: 6000, Bus: 5000 },
    { month: 'Aug', Tuition: 68000, Books: 12000, Bus: 8500 },
    { month: 'Sep', Tuition: 84000, Books: 14500, Bus: 11000 },
    { month: 'Oct', Tuition: 92000, Books: 16000, Bus: 12500 },
  ];

  const attendanceTrendData = [
    { day: 'Mon', Grade10: 98, Grade11: 96, Grade12: 95 },
    { day: 'Tue', Grade10: 97, Grade11: 98, Grade12: 96 },
    { day: 'Wed', Grade10: 99, Grade11: 97, Grade12: 98 },
    { day: 'Thu', Grade10: 96, Grade11: 95, Grade12: 97 },
    { day: 'Fri', Grade10: 95, Grade11: 94, Grade12: 92 },
  ];

  const gradeDistribution = [
    { name: 'Grade A (70-100%)', value: 42, color: '#10b981' },
    { name: 'Grade B (60-69%)', value: 35, color: '#3b82f6' },
    { name: 'Grade C (50-59%)', value: 15, color: '#f59e0b' },
    { name: 'Grade D (40-49%)', value: 5, color: '#8b5cf6' },
    { name: 'Grade F (Below 40%)', value: 3, color: '#ef4444' },
  ];

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
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              {activeSchoolName}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentRoleConfig.welcome}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {currentRoleConfig.roleLabel} • {activeSession} • {activeTerm} Overview
            </p>
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
        
        {/* Stat Card 1: Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Students</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            1,248
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +4.2% this term
          </p>
        </div>

        {/* Stat Card 2: Total Staff */}
        <div
          onClick={() => onNavigate('staff')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Staff</span>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            84
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            12 Academic Departments
          </p>
        </div>

        {/* Stat Card 3: Avg Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Avg. Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            94.2%
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Optimal Daily Rate
          </p>
        </div>

        {/* Stat Card 4: Monthly Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition group"
        >
          <div className="text-[12px] font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Monthly Revenue</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#1e293b] dark:text-white">
            $52,400
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            78.5% Invoices Collected
          </p>
        </div>

      </div>

      {/* Lower Content Grid: Recent Registrations & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registrations Table Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 px-5 border-b border-slate-200 dark:border-slate-800 font-semibold text-base text-[#1e293b] dark:text-white flex justify-between items-center">
            <span>Recent Registrations</span>
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
                  <th className="text-left p-3 px-5">ID</th>
                  <th className="text-left p-3 px-5">Student Name</th>
                  <th className="text-left p-3 px-5">Grade</th>
                  <th className="text-left p-3 px-5">Status</th>
                  <th className="text-left p-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-[#1e293b] dark:text-slate-200">
                <tr>
                  <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">#ST-4021</td>
                  <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">James Wilson</td>
                  <td className="p-3 px-5 text-slate-600 dark:text-slate-300">Grade 10-A</td>
                  <td className="p-3 px-5">
                    <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                      Active
                    </span>
                  </td>
                  <td className="p-3 px-5 text-slate-500 dark:text-slate-400 text-xs">Oct 12, 2023</td>
                </tr>
                <tr>
                  <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">#ST-4020</td>
                  <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">Elena Rodriguez</td>
                  <td className="p-3 px-5 text-slate-600 dark:text-slate-300">Grade 8-C</td>
                  <td className="p-3 px-5">
                    <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                      Active
                    </span>
                  </td>
                  <td className="p-3 px-5 text-slate-500 dark:text-slate-400 text-xs">Oct 12, 2023</td>
                </tr>
                <tr>
                  <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">#ST-4019</td>
                  <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">Marcus Thompson</td>
                  <td className="p-3 px-5 text-slate-600 dark:text-slate-300">Grade 12-B</td>
                  <td className="p-3 px-5">
                    <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                      Active
                    </span>
                  </td>
                  <td className="p-3 px-5 text-slate-500 dark:text-slate-400 text-xs">Oct 11, 2023</td>
                </tr>
                <tr>
                  <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">#ST-4018</td>
                  <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">Sarah Jenkins</td>
                  <td className="p-3 px-5 text-slate-600 dark:text-slate-300">Grade 9-A</td>
                  <td className="p-3 px-5">
                    <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                      Active
                    </span>
                  </td>
                  <td className="p-3 px-5 text-slate-500 dark:text-slate-400 text-xs">Oct 10, 2023</td>
                </tr>
                <tr>
                  <td className="p-3 px-5 font-mono text-xs font-semibold text-slate-500">#ST-4017</td>
                  <td className="p-3 px-5 font-semibold text-slate-800 dark:text-white">David Chen</td>
                  <td className="p-3 px-5 text-slate-600 dark:text-slate-300">Grade 11-B</td>
                  <td className="p-3 px-5">
                    <span className="bg-[#dcfce7] text-[#166534] dark:bg-emerald-950 dark:text-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-block">
                      Active
                    </span>
                  </td>
                  <td className="p-3 px-5 text-slate-500 dark:text-slate-400 text-xs">Oct 10, 2023</td>
                </tr>
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
                <DollarSign className="h-4 w-4 text-[#2563eb]" /> Revenue & Collections Breakdown ($)
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Monthly income streams across Tuition, Books & Transport
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
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
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
