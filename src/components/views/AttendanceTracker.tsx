import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Check,
  Calendar,
  ShieldCheck,
  Lock,
  GraduationCap,
  Baby,
  UserCheck
} from 'lucide-react';
import { Student, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import {
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  isSecondaryClass,
  isPrimaryClass,
  resolveCurrentTeacher,
  isTeacherClassTeacher,
  getTeacherAssignedClassNames,
  getTeacherClassTeacherAssignedClasses,
  isTeacherSubjectOnly
} from '../../utils/sectionHelpers';

interface AttendanceTrackerProps {
  students: Student[];
  attendanceState?: Record<string, Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>;
  onMarkAttendance?: (date: string, studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => void;
  onBatchMarkAttendance?: (date: string, classGroup: string, batch: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }[]) => void;
  currentRole?: UserRole;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  attendanceState,
  onMarkAttendance,
  onBatchMarkAttendance,
  currentRole = 'super_admin'
}) => {
  const { classes, teachers } = useRealTime();
  const { currentUser } = useAuth();
  const isTeacher = currentRole === 'teacher';
  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';

  // Resolved teacher profile for authenticated user
  const currentTeacher = useMemo(() => {
    return resolveCurrentTeacher(currentUser, teachers);
  }, [currentUser, teachers]);

  // Classes assigned to this teacher as designated class/form teacher
  const teacherClassTeacherClasses = useMemo(() => {
    if (!isTeacher) return [];
    return getTeacherClassTeacherAssignedClasses(currentTeacher, classes, currentUser);
  }, [isTeacher, currentTeacher, classes, currentUser]);

  const isSubjectOnlyTeacher = useMemo(() => {
    if (!isTeacher) return false;
    return isTeacherSubjectOnly(currentTeacher, classes, currentUser);
  }, [isTeacher, currentTeacher, classes, currentUser]);

  // Discover existing classes from student data
  const existingClasses: string[] = Array.from(new Set(students.map((s) => s.classGroup))).filter(
    (c): c is string => Boolean(c)
  );

  const availableClasses: string[] = useMemo(() => {
    if (isTeacher) {
      return teacherClassTeacherClasses;
    }
    if (isPrincipal) {
      return Array.from<string>(new Set([...SECONDARY_CLASSES, ...existingClasses.filter(c => isSecondaryClass(c))]));
    }
    if (isHeadTeacher) {
      return Array.from<string>(new Set([...PRIMARY_CLASSES, ...existingClasses.filter(c => isPrimaryClass(c))]));
    }
    return Array.from<string>(new Set([...SECONDARY_CLASSES, ...PRIMARY_CLASSES, ...existingClasses]));
  }, [isTeacher, teacherClassTeacherClasses, isPrincipal, isHeadTeacher, existingClasses]);

  const initialClass = isTeacher
    ? (teacherClassTeacherClasses[0] || 'Grade 10 A')
    : isHeadTeacher
    ? (availableClasses.find(c => isPrimaryClass(c)) || 'Basic 1')
    : (availableClasses.find(c => isSecondaryClass(c)) || 'Grade 10 A');

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local fallback state if no provider
  const [localMap, setLocalMap] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({});

  // Check if current user is the designated Class Teacher for the selected class
  const isClassTeacher = useMemo(() => {
    if (['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole)) return true;
    if (isTeacher) {
      return isTeacherClassTeacher(currentTeacher, selectedClass, currentUser, classes);
    }
    return false;
  }, [currentRole, isTeacher, currentTeacher, selectedClass, currentUser, classes]);

  // Find designated class teacher name
  const designatedClassTeacherName = useMemo(() => {
    const matchedCls = classes.find((c) => c.name === selectedClass);
    if (matchedCls?.classTeacherName) return matchedCls.classTeacherName;
    const formT = teachers.find((t) => t.formClass === selectedClass);
    return formT?.name || 'Assigned Form Teacher';
  }, [classes, teachers, selectedClass]);

  // RBAC Permission check:
  // Class Teachers and Leadership can mark attendance. Subject teachers have view-only access.
  const canMarkAttendance = isClassTeacher;

  const classStudents = students.filter((s) => s.classGroup === selectedClass);
  const activeDayAttendance = attendanceState?.[selectedDate] || localMap;

  const handleMarkStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    if (!canMarkAttendance) {
      alert(`Access Denied: Only the designated Class Teacher (${designatedClassTeacherName}) or administration can mark attendance for ${selectedClass}.`);
      return;
    }
    if (onMarkAttendance) {
      onMarkAttendance(selectedDate, studentId, status);
    } else {
      setLocalMap((prev) => ({ ...prev, [studentId]: status }));
    }
  };

  const handleBatchMarkAll = (status: 'Present' | 'Absent') => {
    if (!canMarkAttendance) {
      alert(`Access Denied: Only the designated Class Teacher (${designatedClassTeacherName}) can perform batch attendance marking for ${selectedClass}.`);
      return;
    }
    const batchList = classStudents.map((s) => ({ studentId: s.id, status }));
    if (onBatchMarkAttendance) {
      onBatchMarkAttendance(selectedDate, selectedClass, batchList);
    } else {
      const updated: Record<string, 'Present' | 'Absent'> = {};
      classStudents.forEach((s) => {
        updated[s.id] = status;
      });
      setLocalMap((prev) => ({ ...prev, ...updated }));
    }
  };

  const totalPresent = classStudents.filter((s) => (activeDayAttendance[s.id] || 'Present') === 'Present').length;
  const totalAbsent = classStudents.filter((s) => activeDayAttendance[s.id] === 'Absent').length;

  if (isTeacher && isSubjectOnlyTeacher) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-900 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-300">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Attendance Register Access Restricted
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Teachers assigned to subjects only do not have access to the class attendance register.
            Daily attendance recording and register management are reserved exclusively for designated Class Teachers and School Administrators.
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
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        canMarkAttendance
          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canMarkAttendance ? (
            <>
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                {isTeacher ? (
                  <><strong>Designated Class Teacher Active:</strong> You are the class teacher for <strong>{selectedClass}</strong>. Full attendance marking and batch submission privileges enabled.</>
                ) : isPrincipal ? (
                  <><strong>Secondary Principal Portal:</strong> Authorized to record attendance for Secondary School classes.</>
                ) : isHeadTeacher ? (
                  <><strong>Primary Head Teacher Portal:</strong> Authorized to record attendance for Primary & Nursery classes.</>
                ) : (
                  <><strong>Attendance Register Active:</strong> Authorized to record attendance, mark late arrivals, and perform batch submissions.</>
                )}
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Subject Teacher Mode (Read-Only):</strong> You teach in <strong>{selectedClass}</strong>, but attendance marking is restricted to the designated Class Teacher (<strong>{designatedClassTeacherName}</strong>).
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              isClassTeacher
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
            }`}>
              {isClassTeacher ? 'Form Teacher' : 'Subject Teacher'}
            </span>
          )}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
            {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary School Attendance Register
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Early Years Attendance Register
              </>
            ) : (
              <>
                <CalendarCheck className="h-5 w-5 text-indigo-600" /> Daily Attendance Register
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isTeacher
              ? 'Attendance registers for your assigned classes. Class teachers have full marking access.'
              : isPrincipal
              ? 'Mark daily registers for Junior & Senior Secondary classes and track student attendance compliance.'
              : isHeadTeacher
              ? 'Mark daily registers for Nursery, Reception, Kindergarten and Basic 1-5 classes.'
              : 'Mark daily class registers, track late arrivals, and generate attendance compliance analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Class Selector Dropdown with Search & Batch Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Class:</span>
          {availableClasses.length > 0 ? (
            <DropdownWithSearch
              options={availableClasses.map((c) => ({
                value: c,
                label: c,
                sublabel: `${students.filter((s) => s.classGroup === c).length} students enrolled`,
                badge: isTeacher && isTeacherClassTeacher(currentTeacher, c, currentUser, classes) ? 'Class Teacher' : undefined
              }))}
              value={selectedClass}
              onChange={(val) => setSelectedClass(val)}
              placeholder="Select class..."
              searchPlaceholder="Search class level or group..."
              colorScheme="indigo"
              buttonLabel="Select Class"
            />
          ) : (
            <span className="text-xs font-semibold text-rose-600">No classes assigned to you</span>
          )}
        </div>

        {canMarkAttendance && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBatchMarkAll('Present')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" /> Mark All Present
            </button>
            <button
              onClick={() => handleBatchMarkAll('Absent')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <XCircle className="h-3.5 w-3.5" /> Mark All Absent
            </button>
          </div>
        )}
      </div>

      {/* Empty State if teacher has no classes */}
      {isTeacher && availableClasses.length === 0 && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <CalendarCheck className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Classes Assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not currently have any form classes or subject classes assigned to your profile. Please contact the administrator or school principal.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {availableClasses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Enrolled in {selectedClass}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{classStudents.length}</div>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-emerald-600 font-bold uppercase">Marked Present</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{totalPresent}</div>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-rose-600 font-bold uppercase">Marked Absent</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{totalAbsent}</div>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-xs text-indigo-600 font-bold uppercase">Attendance Rate</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {classStudents.length ? Math.round((totalPresent / classStudents.length) * 100) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Student Roster Attendance Table */}
      {availableClasses.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {classStudents.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No students currently enrolled in {selectedClass}</p>
              <p className="text-xs mt-1">Enrol students or pupils into this class from the Enrolment tab.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4">Parent Phone</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">
                    {canMarkAttendance ? 'Quick Mark' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {classStudents.map((std) => {
                  const currentStatus = activeDayAttendance[std.id] || 'Present';
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatar}
                            alt={std.firstName}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {std.firstName} {std.lastName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">{std.admissionNo}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{std.parentPhone}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : currentStatus === 'Absent'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : currentStatus === 'Late'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {canMarkAttendance ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleMarkStatus(std.id, 'Present')}
                              className={`p-1.5 rounded-lg border transition ${
                                currentStatus === 'Present'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Mark Present"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMarkStatus(std.id, 'Late')}
                              className={`p-1.5 rounded-lg border transition ${
                                currentStatus === 'Late'
                                  ? 'bg-amber-500 text-white border-amber-500'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Mark Late"
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMarkStatus(std.id, 'Absent')}
                              className={`p-1.5 rounded-lg border transition ${
                                currentStatus === 'Absent'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Mark Absent"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMarkStatus(std.id, 'Excused')}
                              className={`p-1.5 rounded-lg border transition ${
                                currentStatus === 'Excused'
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Mark Excused"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic flex items-center justify-end gap-1">
                            <Lock className="h-3 w-3" /> View Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};
