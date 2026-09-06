import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Laptop,
  CreditCard,
  FileText,
  Bus,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Student, StudentReportCard, CBTExam, HomeworkAssignment, TimetableSlot, Invoice, UserRole, SchoolSettings } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  isPrimaryClass,
  isSecondaryClass,
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS
} from '../../utils/sectionHelpers';
import { DEFAULT_SCHOOL_LOGO_DATA_URI } from '../../assets/schoolAssets';

interface StudentPortalViewProps {
  students: Student[];
  reportCards: StudentReportCard[];
  cbtExams?: CBTExam[];
  homeworkList?: HomeworkAssignment[];
  timetable?: TimetableSlot[];
  invoices?: Invoice[];
  currentRole?: UserRole;
  onNavigate?: (tab: any) => void;
  schoolSettings?: SchoolSettings;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  reportCards,
  cbtExams = [],
  homeworkList = [],
  timetable = [],
  invoices = [],
  currentRole = 'student',
  onNavigate,
  schoolSettings: propSchoolSettings
}) => {
  const { schoolSettings: contextSchoolSettings } = useRealTime();
  const { currentUser } = useAuth();
  const schoolSettings = propSchoolSettings || contextSchoolSettings;

  // Determine section context:
  // - Principal viewing student portal => strictly Secondary
  // - Head Teacher viewing pupil portal => strictly Primary
  // - Admin / Pioneer => All, with toggle
  const isPrincipalContext = currentRole === 'principal' || currentUser?.role === 'principal';
  const isHeadTeacherContext = currentRole === 'head_teacher' || currentUser?.role === 'head_teacher';

  const [sectionFilter, setSectionFilter] = useState<'all' | 'secondary' | 'primary'>(
    isPrincipalContext ? 'secondary' : isHeadTeacherContext ? 'primary' : 'all'
  );

  // Scoped students based on role and section
  const availableStudents = useMemo(() => {
    if (isPrincipalContext) {
      return students.filter((s) => isSecondaryClass(s.classGroup));
    }
    if (isHeadTeacherContext) {
      return students.filter((s) => isPrimaryClass(s.classGroup));
    }
    if (sectionFilter === 'secondary') {
      return students.filter((s) => isSecondaryClass(s.classGroup));
    }
    if (sectionFilter === 'primary') {
      return students.filter((s) => isPrimaryClass(s.classGroup));
    }
    return students;
  }, [students, isPrincipalContext, isHeadTeacherContext, sectionFilter]);

  // Selected Student State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(availableStudents[0]?.id || '');

  // Keep active student valid when section filter changes
  const activeStudent = useMemo(() => {
    const found = availableStudents.find((s) => s.id === selectedStudentId);
    return found || availableStudents[0] || null;
  }, [availableStudents, selectedStudentId]);

  // Related data for active student
  const activeReport = useMemo(() => {
    if (!activeStudent) return null;
    return reportCards.find((r) => r.studentId === activeStudent.id);
  }, [reportCards, activeStudent]);

  const activeInvoice = useMemo(() => {
    if (!activeStudent) return null;
    return invoices.find((i) => i.studentId === activeStudent.id);
  }, [invoices, activeStudent]);

  const activeExams = useMemo(() => {
    if (!activeStudent) return [];
    return cbtExams.filter((e) => e.classGroup === activeStudent.classGroup);
  }, [cbtExams, activeStudent]);

  const activeHomework = useMemo(() => {
    if (!activeStudent) return [];
    return homeworkList.filter((h) => h.classGroup === activeStudent.classGroup);
  }, [homeworkList, activeStudent]);

  const activeTimetable = useMemo(() => {
    if (!activeStudent) return [];
    return timetable.filter((t) => t.className === activeStudent.classGroup);
  }, [timetable, activeStudent]);

  // Portal Sub-Tab State: 'academics' | 'cbt' | 'homework' | 'timetable' | 'finance'
  const [activeModule, setActiveModule] = useState<'academics' | 'cbt' | 'homework' | 'timetable' | 'finance'>('academics');

  const isPrimary = activeStudent ? isPrimaryClass(activeStudent.classGroup) : isHeadTeacherContext;
  const portalTitle = isPrimary
    ? `${schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME} Pupil Portal`
    : `${schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME} Student Portal`;

  return (
    <div className="space-y-6">
      
      {/* Role Permission Context Banner */}
      <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
          <span>
            <strong>{isPrimary ? "Pupil's Portal (Primary Section)" : "Student's Portal (Secondary Section)"}:</strong>{' '}
            {isPrincipalContext
              ? 'Authorized as School Principal with executive oversight over secondary student records, grades, CBT tests, and academic progress.'
              : isHeadTeacherContext
              ? 'Authorized as Head Teacher with executive oversight over primary pupil records, continuous assessments, and learning tasks.'
              : 'Direct student & learner academic portal for continuous assessment, CBT tests, report cards, and timetable schedule.'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
            Portal: {isPrimary ? 'Primary Pupil' : 'Secondary Student'}
          </span>
        </div>
      </div>

      {/* Header & Student Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shadow-sm flex items-center justify-center">
            <img
              src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
              alt="School Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-sky-600" />
                {portalTitle}
              </h2>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                isPrimary
                  ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
              }`}>
                {isPrimary ? 'Basic / Primary' : 'College / Secondary'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official terminal report cards, continuous assessments, CBT e-learning, homework submissions, and class schedule.
            </p>
          </div>
        </div>

        {/* Section Filter (for Admin/Pioneer) & Student Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {!isPrincipalContext && !isHeadTeacherContext && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSectionFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  sectionFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSectionFilter('secondary')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  sectionFilter === 'secondary'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Secondary
              </button>
              <button
                onClick={() => setSectionFilter('primary')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  sectionFilter === 'primary'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Primary
              </button>
            </div>
          )}

          {/* Student Selector */}
          <div className="w-full sm:w-72">
            <DropdownWithSearch
              options={availableStudents.map((std) => ({
                value: std.id,
                label: `${std.firstName} ${std.lastName}`,
                sublabel: `${std.admissionNo} • ${std.classGroup}`,
                badge: std.classGroup
              }))}
              value={selectedStudentId}
              onChange={(val) => setSelectedStudentId(val)}
              placeholder="Select student / pupil..."
              searchPlaceholder="Search student by name or admission..."
              colorScheme="sky"
              buttonLabel="Select"
            />
          </div>
        </div>
      </div>

      {activeStudent ? (
        <div className="space-y-6">
          
          {/* Student Identity Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {activeStudent.firstName[0]}
                  {activeStudent.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {activeStudent.firstName} {activeStudent.lastName}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {activeStudent.admissionNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Class: <strong className="text-slate-900 dark:text-white">{activeStudent.classGroup}</strong> • Gender: <strong className="text-slate-900 dark:text-white">{activeStudent.gender}</strong> • Parent: <strong className="text-slate-900 dark:text-white">{activeStudent.parentName}</strong>
                  </p>
                </div>
              </div>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Attendance</div>
                  <div className="text-base font-black text-emerald-800 dark:text-emerald-200">{activeStudent.attendanceRate}%</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Current GPA</div>
                  <div className="text-base font-black text-blue-800 dark:text-blue-200">{activeStudent.gpa}</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Category</div>
                  <div className="text-xs font-black text-purple-800 dark:text-purple-200">
                    {activeStudent.isBoarder ? 'Boarder' : 'Day Student'}
                  </div>
                </div>
                {activeStudent.isBusEnrolled && (
                  <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Transport</div>
                    <div className="text-xs font-black text-amber-800 dark:text-amber-200 flex items-center gap-1">
                      <Bus className="h-3 w-3" /> Bus Service
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portal Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveModule('academics')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeModule === 'academics'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              Academic Report Card
            </button>
            <button
              onClick={() => setActiveModule('cbt')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeModule === 'cbt'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="h-4 w-4" />
              CBT & E-Learning ({activeExams.length})
            </button>
            <button
              onClick={() => setActiveModule('homework')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeModule === 'homework'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Homework & Tasks ({activeHomework.length})
            </button>
            <button
              onClick={() => setActiveModule('timetable')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeModule === 'timetable'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Class Timetable ({activeTimetable.length})
            </button>
            <button
              onClick={() => setActiveModule('finance')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeModule === 'finance'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              School Fees & Billing
            </button>
          </div>

          {/* Module 1: Academic Report Card */}
          {activeModule === 'academics' && (
            <div className="space-y-6">
              {activeReport ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        {activeReport.term} Performance Assessment ({activeReport.academicSession})
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Class Group: {activeReport.classGroup} • Position: <strong className="text-slate-900 dark:text-white">{activeReport.positionInClass}</strong> • Overall Average: <strong className="text-blue-600 dark:text-blue-400">{activeReport.overallAverage}%</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                    >
                      <Printer className="h-4 w-4" />
                      Print Card
                    </button>
                  </div>

                  {/* Subject Scores Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-3 text-center">CA 1 (20)</th>
                          <th className="py-3 px-3 text-center">CA 2 (20)</th>
                          <th className="py-3 px-3 text-center">Exam (60)</th>
                          <th className="py-3 px-3 text-center">Total (100)</th>
                          <th className="py-3 px-3 text-center">Grade</th>
                          <th className="py-3 px-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {activeReport.subjects.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                            <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">{sub.ca1}</td>
                            <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">{sub.ca2}</td>
                            <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">{sub.exam}</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">{sub.total}</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                                sub.grade === 'A'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : sub.grade === 'B'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : sub.grade === 'C'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              }`}>
                                {sub.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">{sub.remarks || 'Satisfactory'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Remarks Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Class Teacher's Remark:
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        "{activeReport.formTeacherRemark || 'Consistent and attentive student. Good effort across all learning domains.'}"
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isPrimary ? "Head Teacher's Remark:" : "Principal's Executive Remark:"}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        "{activeReport.principalRemark || 'A commendable terminal performance. Maintain steady diligence in subsequent terms.'}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                  <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No report card found for this student.</p>
                  <p className="text-xs text-slate-500 mt-1">Terminal evaluations are compiled by assigned class teachers and administrators.</p>
                </div>
              )}
            </div>
          )}

          {/* Module 2: CBT & E-Learning Tests */}
          {activeModule === 'cbt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active CBT Tests & Quizzes</h4>
                  <p className="text-xs text-slate-500">Computer-based assessment modules scheduled for {activeStudent.classGroup}.</p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('cbt')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Open Full CBT Hub <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {activeExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeExams.map((exam) => (
                    <div key={exam.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {exam.subject}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{exam.title}</h5>
                          <p className="text-xs text-slate-500">{exam.topic || 'Continuous Assessment Examination'}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          exam.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {exam.isActive ? 'Live Assessment' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-500" /> {exam.durationMinutes} Mins
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {exam.questions.length} Questions
                        </span>
                      </div>
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('cbt')}
                          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                        >
                          Launch Assessment / Take Test
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                  <p className="text-xs text-slate-500">No scheduled CBT examinations active for {activeStudent.classGroup} at this time.</p>
                </div>
              )}
            </div>
          )}

          {/* Module 3: Homework & Assignments */}
          {activeModule === 'homework' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Homework & Learning Tasks</h4>
                  <p className="text-xs text-slate-500">Academic assignments and home study exercises for {activeStudent.classGroup}.</p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('homework')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Open Homework Center <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {activeHomework.length > 0 ? (
                <div className="space-y-3">
                  {activeHomework.map((hw) => (
                    <div key={hw.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            {hw.subject}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">{hw.title}</h5>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">{hw.description}</p>
                      </div>
                      <div className="flex sm:flex-col items-end gap-1 shrink-0 text-xs">
                        <span className="text-slate-500">Due: <strong className="text-slate-900 dark:text-white">{hw.dueDate}</strong></span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{hw.maxScore} Points</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                  <p className="text-xs text-slate-500">No active homework tasks assigned for {activeStudent.classGroup}.</p>
                </div>
              )}
            </div>
          )}

          {/* Module 4: Class Timetable */}
          {activeModule === 'timetable' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Class Timetable & Schedule</h4>
                  <p className="text-xs text-slate-500">Weekly class periods and lesson timings for {activeStudent.classGroup}.</p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('timetable')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View School Timetable <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {activeTimetable.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Day</th>
                        <th className="py-2.5 px-4">Period / Time</th>
                        <th className="py-2.5 px-4">Subject</th>
                        <th className="py-2.5 px-4">Teacher</th>
                        <th className="py-2.5 px-4">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activeTimetable.map((slot) => (
                        <tr key={slot.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{slot.day}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">{slot.time}</td>
                          <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">{slot.subject}</td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{slot.teacherName || 'Allocated Staff'}</td>
                          <td className="py-2.5 px-4 text-slate-500">{slot.room || 'Classroom'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                  <p className="text-xs text-slate-500">No timetable schedule published yet for {activeStudent.classGroup}.</p>
                </div>
              )}
            </div>
          )}

          {/* Module 5: School Fees & Invoices */}
          {activeModule === 'finance' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  Term Fees Summary & Ledger
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="text-[11px] text-slate-500">Total Invoiced</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      ₦{activeStudent.totalFeeDue.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">Amount Paid</div>
                    <div className="text-lg font-black text-emerald-800 dark:text-emerald-200">
                      ₦{activeStudent.feePaid.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                    <div className="text-[11px] text-rose-700 dark:text-rose-300">Outstanding Balance</div>
                    <div className="text-lg font-black text-rose-800 dark:text-rose-200">
                      ₦{(activeStudent.totalFeeDue - activeStudent.feePaid).toLocaleString()}
                    </div>
                  </div>
                </div>
                {activeInvoice && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Invoice Ref: <strong className="font-mono text-slate-900 dark:text-white">{activeInvoice.invoiceNumber}</strong></span>
                    <span>Status: <strong className={activeInvoice.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{activeInvoice.status}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <User className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Student Records in this Section</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Please select an active student or check the section filters.
          </p>
        </div>
      )}

      {/* Institutional Contact Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <a
            href={`https://${schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-600 dark:text-blue-400"
          >
            {schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}
          </a>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <Mail className="h-4 w-4 text-emerald-600" />
          <span>{schoolSettings?.email || SCHOOL_CONTACT_DETAILS.emails[0]}</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <Phone className="h-4 w-4 text-amber-600" />
          <span>{schoolSettings?.phone || SCHOOL_CONTACT_DETAILS.phoneNumbers[0]}</span>
        </div>
      </div>

    </div>
  );
};
