import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Upload,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  Save,
  X,
  GraduationCap,
  Baby
} from 'lucide-react';
import { HomeworkAssignment, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import {
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  SECONDARY_SUBJECTS,
  PRIMARY_SUBJECTS,
  isSecondaryClass,
  isPrimaryClass,
  resolveCurrentTeacher,
  isTeacherAssignedToClass,
  isTeacherClassTeacher,
  isTeacherAllocatedToSubject,
  getTeacherAssignedClassNames
} from '../../utils/sectionHelpers';

interface HomeworkAssignmentsViewProps {
  homeworkList: HomeworkAssignment[];
  onAddHomework?: (hw: HomeworkAssignment) => void;
  onUpdateHomework?: (hw: HomeworkAssignment) => void;
  onDeleteHomework?: (hwId: string) => void;
  currentRole?: UserRole;
}

export const HomeworkAssignmentsView: React.FC<HomeworkAssignmentsViewProps> = ({
  homeworkList,
  onAddHomework,
  onUpdateHomework,
  onDeleteHomework,
  currentRole = 'teacher'
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

  // Classes assigned to this teacher (Form class + subject classes)
  const teacherAssignedClassNames = useMemo(() => {
    if (!isTeacher) return [];
    return getTeacherAssignedClassNames(currentTeacher, classes, currentUser);
  }, [isTeacher, currentTeacher, classes, currentUser]);

  const [showModal, setShowModal] = useState(false);
  const [editingHw, setEditingHw] = useState<HomeworkAssignment | null>(null);

  // Class & subject pools
  const availableClasses = useMemo(() => {
    if (isTeacher) {
      return teacherAssignedClassNames;
    }
    if (isPrincipal) return SECONDARY_CLASSES;
    if (isHeadTeacher) return PRIMARY_CLASSES;
    return [...SECONDARY_CLASSES, ...PRIMARY_CLASSES];
  }, [isTeacher, teacherAssignedClassNames, isPrincipal, isHeadTeacher]);

  const allCurriculumSubjects = useMemo(() => {
    if (isPrincipal) return SECONDARY_SUBJECTS.map((s) => s.name);
    if (isHeadTeacher) return PRIMARY_SUBJECTS.map((s) => s.name);
    return [...SECONDARY_SUBJECTS.map((s) => s.name), ...PRIMARY_SUBJECTS.map((s) => s.name)];
  }, [isPrincipal, isHeadTeacher]);

  const availableSubjects = useMemo(() => {
    if (isTeacher) {
      if (currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
        return currentTeacher.subjects;
      }
      return allCurriculumSubjects;
    }
    return allCurriculumSubjects;
  }, [isTeacher, currentTeacher, allCurriculumSubjects]);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(availableSubjects[0] || 'Mathematics');
  const [classGroup, setClassGroup] = useState(availableClasses[0] || 'Grade 10 A');
  const [dueDate, setDueDate] = useState('2025-10-28');
  const [points, setPoints] = useState(20);
  const [description, setDescription] = useState('');

  // Keep classGroup & subject in sync when available lists change
  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(classGroup)) {
      setClassGroup(availableClasses[0]);
    }
  }, [availableClasses, classGroup]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [availableSubjects, subject]);

  // RBAC Permission Check: Teachers, Principal, Head Teacher, Super Admin can edit/update homework
  const canManageHomework = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(currentRole);
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const filteredHomeworkList = useMemo(() => {
    return homeworkList.filter((hw) => {
      // Role-level section filter
      if (isPrincipal && !isSecondaryClass(hw.classGroup)) {
        return false;
      }
      if (isHeadTeacher && !isPrimaryClass(hw.classGroup)) {
        return false;
      }

      if (isTeacher) {
        const isClassAssigned = isTeacherAssignedToClass(currentTeacher, hw.classGroup, currentUser, classes);
        if (!isClassAssigned) return false;

        const isFormTeacher = isTeacherClassTeacher(currentTeacher, hw.classGroup, currentUser, classes);
        const isSubjectAllocated = isTeacherAllocatedToSubject(currentTeacher, hw.subject);
        if (!isFormTeacher && !isSubjectAllocated && currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
          return false;
        }
      }

      const matchesClass = classFilter === 'All' || hw.classGroup === classFilter;
      const matchesSubject = subjectFilter === 'All' || hw.subject === subjectFilter;
      return matchesClass && matchesSubject;
    });
  }, [homeworkList, isPrincipal, isHeadTeacher, isTeacher, currentTeacher, currentUser, classes, classFilter, subjectFilter]);

  const canEditOrDeleteHw = (hw: HomeworkAssignment) => {
    if (!canManageHomework) return false;
    if (!isTeacher) return true;
    const isClassAssigned = isTeacherAssignedToClass(currentTeacher, hw.classGroup, currentUser, classes);
    if (!isClassAssigned) return false;
    const isFormTeacher = isTeacherClassTeacher(currentTeacher, hw.classGroup, currentUser, classes);
    const isSubjectAllocated = isTeacherAllocatedToSubject(currentTeacher, hw.subject);
    if (!isFormTeacher && !isSubjectAllocated && currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
      return false;
    }
    return true;
  };

  const handleCreateHW = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageHomework) {
      alert('Access Denied: Only teachers and administrators can create coursework assignments.');
      return;
    }
    if (!title || !description) return;

    if (isTeacher) {
      if (!teacherAssignedClassNames.includes(classGroup)) {
        alert(`Access Denied: You can only assign homework to classes assigned to you (${teacherAssignedClassNames.join(', ') || 'None assigned'}).`);
        return;
      }
      const isFormT = isTeacherClassTeacher(currentTeacher, classGroup, currentUser, classes);
      const isAllocatedSub = isTeacherAllocatedToSubject(currentTeacher, subject);
      if (!isFormT && !isAllocatedSub && currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
        alert(`Access Denied: You can only assign homework for subjects allocated to you (${currentTeacher.subjects.join(', ')}).`);
        return;
      }
    }

    const newHw: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      title,
      subject,
      classGroup,
      teacherName: isPrincipal
        ? 'Secondary Academic Faculty'
        : isHeadTeacher
        ? 'Primary & Early Years Staff'
        : isTeacher
        ? (currentTeacher?.name || currentUser?.displayName || 'Class Teacher')
        : 'Academic Department',
      dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      maxPoints: points,
      description,
      submissionsCount: 0,
      totalStudents: 32
    };

    if (onAddHomework) onAddHomework(newHw);
    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHw || !canEditOrDeleteHw(editingHw)) return;
    if (onUpdateHomework) onUpdateHomework(editingHw);
    setEditingHw(null);
  };

  const handleDelete = (hw: HomeworkAssignment) => {
    if (!canEditOrDeleteHw(hw)) return;
    if (window.confirm('Delete this homework assignment?')) {
      if (onDeleteHomework) onDeleteHomework(hw.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        canManageHomework
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canManageHomework ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                {isTeacher ? (
                  <>
                    <strong>Teacher Homework Portal:</strong> Authorized to create, edit, and assign homework for your assigned classes (<strong>{teacherAssignedClassNames.join(', ') || 'No classes assigned'}</strong>){' '}
                    {currentTeacher?.subjects?.length ? <>and allocated subjects (<strong>{currentTeacher.subjects.join(', ')}</strong>)</> : null}.
                  </>
                ) : isPrincipal ? (
                  <strong>Secondary Principal Homework Portal:</strong>
                ) : isHeadTeacher ? (
                  <strong>Primary Head Teacher Homework Portal:</strong>
                ) : (
                  <strong>Assignment Management Active:</strong>
                )}{' '}
                {!isTeacher && (
                  <>
                    Authorized to create, edit, monitor, and grade coursework for{' '}
                    {isPrincipal ? 'Secondary School classes' : isHeadTeacher ? 'Primary & Nursery classes' : 'all classes'}.
                  </>
                )}
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Student View Mode:</strong> Coursework creation and editing is managed by <strong>Teachers, Head Teacher, and Principal</strong>.
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
              {teacherAssignedClassNames.length} Assigned {teacherAssignedClassNames.length === 1 ? 'Class' : 'Classes'}
            </span>
          )}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
            {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
          </span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Academic Tasks Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-6 w-6 text-indigo-600" /> Secondary School Homework & Assignments
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-6 w-6 text-amber-600" /> Primary & Nursery Homework & Activity Tasks
              </>
            ) : (
              'Homework & Course Assignments'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isTeacher
              ? 'Create, publish, and evaluate homework and assignments for your assigned classes.'
              : isPrincipal
              ? 'Create, manage, and evaluate homework and projects for Junior & Senior Secondary classes.'
              : isHeadTeacher
              ? 'Create, manage, and evaluate take-home worksheets, handwriting, and fun exercises for Nursery and Basic 1-5.'
              : 'Create, collect, and review student coursework & take-home assignments.'}
          </p>
        </div>

        {canManageHomework && (
          <button
            onClick={() => {
              if (availableClasses.length === 0) {
                alert('You do not have any assigned classes. Please contact administration.');
                return;
              }
              setSubject(availableSubjects[0] || 'Mathematics');
              setClassGroup(availableClasses[0] || 'Grade 10 A');
              setShowModal(true);
            }}
            disabled={isTeacher && availableClasses.length === 0}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Create New Assignment
          </button>
        )}
      </div>

      {/* Filter Bar with Dropdowns and Search Buttons */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Filter Class:</span>
            <DropdownWithSearch
              options={[
                { value: 'All', label: 'All Assigned Classes' },
                ...availableClasses.map((c) => ({ value: c, label: c }))
              ]}
              value={classFilter}
              onChange={(val) => setClassFilter(val)}
              placeholder="Select class..."
              searchPlaceholder="Search class..."
              colorScheme="blue"
              buttonLabel="Filter Class"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Subject:</span>
            <DropdownWithSearch
              options={[
                { value: 'All', label: 'All Subjects' },
                ...availableSubjects.map((s) => ({ value: s, label: s }))
              ]}
              value={subjectFilter}
              onChange={(val) => setSubjectFilter(val)}
              placeholder="Select subject..."
              searchPlaceholder="Search subject..."
              colorScheme="slate"
              buttonLabel="Filter Subject"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Showing <strong>{filteredHomeworkList.length}</strong> assignments
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHomeworkList.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm">No homework assignments found</p>
            <p className="text-xs mt-1">
              {isTeacher
                ? `No assignments found for your assigned classes (${teacherAssignedClassNames.join(', ') || 'None assigned'}). Click "Create New Assignment" to publish homework for your students.`
                : 'Click "Create New Assignment" to publish new coursework.'}
            </p>
          </div>
        ) : (
          filteredHomeworkList.map((hw) => {
            const submissionPct = Math.round((hw.submissionsCount / hw.totalStudents) * 100);
            const canManageThis = canEditOrDeleteHw(hw);

            return (
              <div
                key={hw.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500 transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                      {hw.subject} • {hw.classGroup}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" /> Due: {hw.dueDate}
                      </span>
                      {canManageThis && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingHw(hw)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                            title="Edit Assignment"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(hw)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                            title="Delete Assignment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 group-hover:text-blue-600 transition">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {hw.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Submissions Tracked</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {hw.submissionsCount} / {hw.totalStudents} ({submissionPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${submissionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" /> Create New Assignment
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHW} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4: Algebraic Fractions Exercise"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <DropdownWithSearch
                  options={availableSubjects.map((s) => ({ value: s, label: s }))}
                  value={subject}
                  onChange={(val) => setSubject(val)}
                  placeholder="Select subject..."
                  searchPlaceholder="Search academic subject..."
                  colorScheme="blue"
                  buttonLabel="Subject"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Class</label>
                <DropdownWithSearch
                  options={availableClasses.map((c) => ({ value: c, label: c }))}
                  value={classGroup}
                  onChange={(val) => setClassGroup(val)}
                  placeholder="Select target class..."
                  searchPlaceholder="Search class..."
                  colorScheme="blue"
                  buttonLabel="Class"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Points</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 20)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write clear instructions for students to complete this task..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Assignment
              </h3>
              <button onClick={() => setEditingHw(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingHw.title}
                  onChange={(e) => setEditingHw({ ...editingHw, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={editingHw.dueDate}
                  onChange={(e) => setEditingHw({ ...editingHw, dueDate: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={editingHw.description}
                  onChange={(e) => setEditingHw({ ...editingHw, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingHw(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

