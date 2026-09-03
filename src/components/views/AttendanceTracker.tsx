import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { Student, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

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
  const [selectedClass, setSelectedClass] = useState('Grade 10 A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local fallback state if no provider
  const [localMap, setLocalMap] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({});

  // RBAC Permission check:
  // Administrator, School Principal, Head Teacher, and Teachers can mark and update attendance.
  const canMarkAttendance = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(currentRole);

  const classStudents = students.filter((s) => s.classGroup === selectedClass);
  const activeDayAttendance = attendanceState?.[selectedDate] || localMap;

  const handleMarkStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    if (!canMarkAttendance) {
      alert('Access Denied: Only Teachers, Principal, Head Teacher, and Administrators can mark attendance.');
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
      alert('Access Denied: You do not have permission to batch mark attendance.');
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

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        canMarkAttendance
          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canMarkAttendance ? (
            <>
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Attendance Register Permissions Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> to record attendance, mark late arrivals, and perform batch submissions.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Daily attendance registration is permitted for <strong>Teachers, Head Teacher, School Principal, and Administrator</strong>.
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
            <CalendarCheck className="h-5 w-5 text-indigo-600" /> Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mark daily class registers, track late arrivals, and generate attendance compliance analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
          />
        </div>
      </div>

      {/* Class Selector Dropdown with Search & Batch Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Class:</span>
          <DropdownWithSearch
            options={[
              { value: 'Grade 10 A', label: 'Grade 10 A', sublabel: 'Class Teacher: Mr. David Adeleke' },
              { value: 'Grade 10 B', label: 'Grade 10 B', sublabel: 'Class Teacher: Mrs. Grace Bello' },
              { value: 'Grade 11 Science', label: 'Grade 11 Science', sublabel: 'Class Teacher: Dr. Emeka Obi' },
              { value: 'Grade 12 Art', label: 'Grade 12 Art', sublabel: 'Class Teacher: Ms. Folake Coker' }
            ]}
            value={selectedClass}
            onChange={(val) => setSelectedClass(val)}
            placeholder="Select class..."
            searchPlaceholder="Search class level or group..."
            colorScheme="indigo"
            buttonLabel="Search Class"
          />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-slate-500 font-bold uppercase">Total Enrolled in Class</div>
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

      {/* Student Roster Attendance Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Admission No</th>
              <th className="py-3 px-4">Parent Phone</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Quick Mark</th>
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
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        currentStatus === 'Present'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : currentStatus === 'Absent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : currentStatus === 'Late'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {canMarkAttendance ? (
                      <div className="flex items-center justify-end gap-1">
                        {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleMarkStatus(std.id, st)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                              currentStatus === st
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Read-only</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
