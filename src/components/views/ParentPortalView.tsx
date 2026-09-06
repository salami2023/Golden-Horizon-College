import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  UserCheck,
  CreditCard,
  FileText,
  Bus,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Lock,
  Download,
  Edit2,
  Save,
  X,
  Globe
} from 'lucide-react';
import { Student, StudentReportCard, Invoice, UserRole } from '../../types';
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

interface ParentPortalViewProps {
  students: Student[];
  reportCards: StudentReportCard[];
  invoices: Invoice[];
  onUpdateStudent?: (student: Student) => void;
  currentRole?: UserRole;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  reportCards,
  invoices,
  onUpdateStudent,
  currentRole = 'parent'
}) => {
  const { schoolSettings } = useRealTime();
  const { currentUser } = useAuth();

  const isPrincipalContext = currentRole === 'principal' || currentUser?.role === 'principal';
  const isHeadTeacherContext = currentRole === 'head_teacher' || currentUser?.role === 'head_teacher';

  const [sectionFilter, setSectionFilter] = useState<'all' | 'secondary' | 'primary'>(
    isPrincipalContext ? 'secondary' : isHeadTeacherContext ? 'primary' : 'all'
  );

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

  const [selectedStudentId, setSelectedStudentId] = useState<string>(availableStudents[0]?.id || '');
  const [isEditingParent, setIsEditingParent] = useState(false);

  // RBAC Permission Check: Administrator, School Principal, Head Teacher, and Parent have permission to update parent details
  const canEditParent = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'parent'].includes(currentRole);

  const activeStudent = availableStudents.find((s) => s.id === selectedStudentId) || availableStudents[0] || null;
  const activeReport = activeStudent ? reportCards.find((r) => r.studentId === activeStudent.id) : null;
  const activeInvoice = activeStudent ? invoices.find((i) => i.studentId === activeStudent.id) : null;

  // Parent Edit State
  const [guardianName, setGuardianName] = useState(activeStudent?.parentName || '');
  const [guardianPhone, setGuardianPhone] = useState(activeStudent?.parentPhone || '');
  const [guardianEmail, setGuardianEmail] = useState(activeStudent?.parentEmail || '');
  const [guardianAddress, setGuardianAddress] = useState(activeStudent?.address || '');

  const handleOpenEdit = () => {
    if (!activeStudent) return;
    setGuardianName(activeStudent.parentName);
    setGuardianPhone(activeStudent.parentPhone);
    setGuardianEmail(activeStudent.parentEmail);
    setGuardianAddress(activeStudent.address);
    setIsEditingParent(true);
  };

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditParent || !activeStudent) return;

    const updatedStudent: Student = {
      ...activeStudent,
      parentName: guardianName,
      parentPhone: guardianPhone,
      parentEmail: guardianEmail,
      address: guardianAddress
    };

    if (onUpdateStudent) onUpdateStudent(updatedStudent);
    setIsEditingParent(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        canEditParent
          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canEditParent ? (
            <>
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Parent & Guardian Access Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with access to student records, live progress tracking, and parent contact details management.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Read-Only View:</strong> Parent details editing is reserved for <strong>Administrator, School Principal, Head Teacher, and Guardians</strong>.
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
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shadow-sm flex items-center justify-center">
            <img
              src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
              alt="School Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-indigo-600" />
              {activeStudent
                ? isPrimaryClass(activeStudent.classGroup)
                  ? `${schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME} Parent Portal`
                  : `${schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME} Parent Portal`
                : `${schoolSettings?.schoolName || 'Golden Horizon'} Parent & Guardian Portal`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official terminal report cards, continuous assessments, fee balances, and institutional contact helpline.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <a
                href={`https://${schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Globe className="h-3 w-3" /> {schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}
              </a>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-emerald-600" /> {schoolSettings?.email || SCHOOL_CONTACT_DETAILS.emails[0]}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="h-3 w-3 text-amber-600" /> {schoolSettings?.phone || SCHOOL_CONTACT_DETAILS.phoneNumbers[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Child Selector with Dropdown and Search Button */}
        <div className="flex items-center gap-2">
          {!isPrincipalContext && !isHeadTeacherContext && (
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold mr-2">
              <button
                type="button"
                onClick={() => setSectionFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sectionFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSectionFilter('secondary')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sectionFilter === 'secondary'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Secondary
              </button>
              <button
                type="button"
                onClick={() => setSectionFilter('primary')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sectionFilter === 'primary'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Primary
              </button>
            </div>
          )}
          <DropdownWithSearch
            options={availableStudents.map((std) => ({
              value: std.id,
              label: `${std.firstName} ${std.lastName}`,
              sublabel: `${std.admissionNo} • ${std.classGroup}`,
              badge: std.classGroup
            }))}
            value={selectedStudentId}
            onChange={(val) => {
              setSelectedStudentId(val);
              setIsEditingParent(false);
            }}
            placeholder="Select child..."
            searchPlaceholder="Search child by name or admission..."
            colorScheme="indigo"
            buttonLabel="Search"
          />
        </div>
      </div>

      {activeStudent && (
        <div className="space-y-6">
          
          {/* Child Card Overview & Parent Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Student Info Card */}
            <div className="md:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {activeStudent.firstName} {activeStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Admission No: <strong>{activeStudent.admissionNo}</strong> • Class: <strong>{activeStudent.classGroup}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                    {activeStudent.attendanceRate}% Attendance
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs">
                    Cumulative GPA: {activeStudent.gpa}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs">
                    {activeStudent.gender}
                  </span>
                </div>
              </div>

              {/* Registered Parent Details */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <UserCheck className="h-4 w-4 text-indigo-600" />
                    <span>Parent / Guardian: <strong>{activeStudent.parentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {activeStudent.parentPhone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {activeStudent.parentEmail}</span>
                  </div>
                </div>

                {canEditParent && (
                  <button
                    onClick={handleOpenEdit}
                    className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Parent Details
                  </button>
                )}
              </div>
            </div>

            {/* Quick Fee Pay Card */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Fee Balance</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ₦{(activeInvoice?.balanceDue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Invoice: {activeInvoice?.invoiceNo || 'INV-2025-CURRENT'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {(activeInvoice?.balanceDue || 0) > 0 ? (
                  <button
                    onClick={() => alert(`Redirecting to secure online payment gateway for ₦${activeInvoice?.balanceDue?.toLocaleString()}...`)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" /> Settle Fees Online
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 py-2">
                    <CheckCircle2 className="h-4 w-4" /> All School Fees Settled
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Academic Report Card Summary */}
          {activeReport && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" /> Terminal Academic Report Card Summary
                </h4>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Download Report Card PDF
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Position in Class</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">
                    #{activeReport.classPosition} / {activeReport.totalStudentsInClass}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Terminal Average</span>
                  <span className="font-extrabold text-emerald-600 text-base">
                    {activeReport.averageScore}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">School Days Present</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">
                    {activeReport.attendanceDaysPresent} / {activeReport.totalSchoolDays} Days
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Status</span>
                  <span className="font-extrabold text-indigo-600 text-base">
                    PROMOTED
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-xs">
                <strong className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1">
                  Class Teacher's Remark:
                </strong>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{activeReport.formTeacherRemark}"
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Edit Parent Modal */}
      {isEditingParent && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-indigo-600" /> Update Parent / Guardian Details
              </h3>
              <button onClick={() => setIsEditingParent(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParent} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Guardian Full Name</label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={guardianAddress}
                  onChange={(e) => setGuardianAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingParent(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Parent Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
