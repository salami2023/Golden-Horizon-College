import React, { useState, useMemo, useEffect } from 'react';
import {
  School,
  GraduationCap,
  Users,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Printer,
  X,
  Shield,
  BookOpen,
  UserPlus,
  RefreshCw,
  Archive,
  ArrowUpRight,
  ArrowDownLeft,
  CheckSquare,
  Square
} from 'lucide-react';
import { SchoolClass, Student, Teacher, UserRole } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import {
  isPrimaryClass,
  isSecondaryClass,
  filterTeachersByRole,
  resolveCurrentTeacher,
  isTeacherAssignedToClass
} from '../../utils/sectionHelpers';

interface ClassesViewProps {
  currentRole: UserRole;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ currentRole }) => {
  const {
    classes,
    students,
    teachers,
    addClass,
    updateClass,
    deleteClass,
    assignClassTeacher,
    removeClassTeacher,
    promoteStudent,
    demoteStudent,
    archiveStudent,
    bulkPromoteStudents,
    bulkDemoteStudents,
    bulkArchiveStudents,
    reactivateStudent
  } = useRealTime();

  const { currentUser } = useAuth();

  // Academic staff check
  const isAcademicStaff = currentRole === 'teacher';

  // Resolved teacher profile for current user
  const currentTeacher = useMemo(() => {
    return resolveCurrentTeacher(currentUser, teachers);
  }, [currentUser, teachers]);

  // Role verification: Admin (super_admin, pioneer), School Principal, Head Teacher, Academic Staff (Teacher)
  const isAuthorized = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(currentRole);

  // Role Section Access Control:
  // - teacher: restricted strictly to classes assigned to them
  // - head_teacher: restricted strictly to Primary School classes (Nursery, Reception, Basic 1–5)
  // - principal: restricted strictly to College / Secondary classes (JSS 1–3, SSS 1–3, Grade 10–12)
  // - super_admin / pioneer: full access across all campuses
  const userSectionScope = useMemo<'all' | 'primary' | 'secondary' | 'teacher'>(() => {
    if (isAcademicStaff) return 'teacher';
    if (currentRole === 'head_teacher') return 'primary';
    if (currentRole === 'principal') return 'secondary';
    return 'all';
  }, [currentRole, isAcademicStaff]);

  // Section verification predicate
  const isClassInUserSection = (cls: SchoolClass): boolean => {
    if (isAcademicStaff) {
      return isTeacherAssignedToClass(currentTeacher, cls, currentUser);
    }
    if (userSectionScope === 'primary') {
      return cls.section === 'Primary' || isPrimaryClass(cls.name);
    }
    if (userSectionScope === 'secondary') {
      return cls.section === 'Secondary' || isSecondaryClass(cls.name);
    }
    return true;
  };

  // Only classes permitted for this user's role
  const accessibleClasses = useMemo(() => {
    return classes.filter(isClassInUserSection);
  }, [classes, userSectionScope, isAcademicStaff, currentTeacher, currentUser]);

  // Available teachers filtered by section
  const availableTeachers = useMemo(() => {
    return filterTeachersByRole(teachers, currentRole);
  }, [teachers, currentRole]);

  // View state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<'All' | 'Primary' | 'Secondary'>(() => {
    if (currentRole === 'head_teacher') return 'Primary';
    if (currentRole === 'principal') return 'Secondary';
    return 'All';
  });

  // Keep section tab aligned if role changes
  useEffect(() => {
    if (currentRole === 'head_teacher' && activeSectionTab !== 'Primary') {
      setActiveSectionTab('Primary');
    } else if (currentRole === 'principal' && activeSectionTab !== 'Secondary') {
      setActiveSectionTab('Secondary');
    }
  }, [currentRole, activeSectionTab]);

  // For teachers, automatically select the first assigned class if none is selected
  useEffect(() => {
    if (isAcademicStaff && accessibleClasses.length > 0 && !selectedClassId) {
      setSelectedClassId(accessibleClasses[0].id);
    }
  }, [isAcademicStaff, accessibleClasses, selectedClassId]);

  // Auto-deselect if an unauthorized class is selected
  useEffect(() => {
    if (selectedClassId) {
      const cls = classes.find((c) => c.id === selectedClassId);
      if (cls && !isClassInUserSection(cls)) {
        setSelectedClassId(null);
        setSelectedStudentIds([]);
      }
    }
  }, [selectedClassId, classes, userSectionScope, isAcademicStaff, currentTeacher, currentUser]);

  const [classSearch, setClassSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'All' | 'Active' | 'Graduated' | 'Suspended'>('All');

  // Multi-selection state for students
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null);
  const [teacherAssignClass, setTeacherAssignClass] = useState<SchoolClass | null>(null);
  const [teacherRemoveClass, setTeacherRemoveClass] = useState<SchoolClass | null>(null);

  // Promotion / Demotion / Archiving Modals
  const [promoteStudentTarget, setPromoteStudentTarget] = useState<Student | null>(null);
  const [demoteStudentTarget, setDemoteStudentTarget] = useState<Student | null>(null);
  const [archiveStudentTarget, setArchiveStudentTarget] = useState<Student | null>(null);
  const [isBulkPromoteModalOpen, setIsBulkPromoteModalOpen] = useState(false);
  const [isBulkDemoteModalOpen, setIsBulkDemoteModalOpen] = useState(false);
  const [isBulkArchiveModalOpen, setIsBulkArchiveModalOpen] = useState(false);

  // Form states for class create/edit
  const [classFormData, setClassFormData] = useState({
    name: '',
    section: 'Secondary' as 'Primary' | 'Secondary',
    level: 'JSS 1',
    arm: 'A',
    category: 'Junior Secondary' as 'Senior Secondary' | 'Junior Secondary' | 'Primary' | 'Early Years',
    capacity: 35,
    room: '',
    academicSession: '2026/2027',
    description: '',
    classTeacherId: ''
  });

  // Target class selection state for promotion/demotion
  const [targetClassForPromotion, setTargetClassForPromotion] = useState('');
  const [archiveStatusSelection, setArchiveStatusSelection] = useState<'Graduated' | 'Suspended'>('Graduated');

  const actor = { role: currentRole, name: currentRole.toUpperCase() };

  // Current selected class object with strict section isolation
  const selectedClass = useMemo(() => {
    if (!selectedClassId) return null;
    const found = classes.find((c) => c.id === selectedClassId);
    if (found && isClassInUserSection(found)) {
      return found;
    }
    return null;
  }, [classes, selectedClassId, userSectionScope]);

  // Students in selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter(
      (s) => s.classGroup && s.classGroup.trim().toLowerCase() === selectedClass.name.trim().toLowerCase()
    );
  }, [students, selectedClass]);

  // Filtered students in selected class
  const filteredClassStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const matchSearch =
        studentSearch === '' ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.parentName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchStatus = studentStatusFilter === 'All' || s.status === studentStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [classStudents, studentSearch, studentStatusFilter]);

  // Map student counts per class
  const studentCountByClass = useMemo(() => {
    const map: Record<string, { total: number; active: number; boys: number; girls: number }> = {};
    students.forEach((s) => {
      if (!s.classGroup) return;
      const key = s.classGroup.trim().toLowerCase();
      if (!map[key]) {
        map[key] = { total: 0, active: 0, boys: 0, girls: 0 };
      }
      map[key].total += 1;
      if (s.status === 'Active') map[key].active += 1;
      if (s.gender === 'Male') map[key].boys += 1;
      if (s.gender === 'Female') map[key].girls += 1;
    });
    return map;
  }, [students]);

  // Filtered classes list - strictly from accessibleClasses
  const filteredClasses = useMemo(() => {
    return accessibleClasses.filter((cls) => {
      const matchSection =
        userSectionScope !== 'all' ||
        activeSectionTab === 'All' ||
        (activeSectionTab === 'Primary' && (cls.section === 'Primary' || isPrimaryClass(cls.name))) ||
        (activeSectionTab === 'Secondary' && (cls.section === 'Secondary' || isSecondaryClass(cls.name)));

      const query = classSearch.toLowerCase();
      const matchSearch =
        query === '' ||
        cls.name.toLowerCase().includes(query) ||
        cls.level.toLowerCase().includes(query) ||
        cls.arm.toLowerCase().includes(query) ||
        (cls.room && cls.room.toLowerCase().includes(query)) ||
        (cls.classTeacherName && cls.classTeacherName.toLowerCase().includes(query));

      return matchSection && matchSearch;
    });
  }, [accessibleClasses, userSectionScope, activeSectionTab, classSearch]);

  // Summary Metrics tailored to section scope
  const metrics = useMemo(() => {
    const totalClasses = accessibleClasses.length;
    const primaryClasses = accessibleClasses.filter((c) => c.section === 'Primary' || isPrimaryClass(c.name)).length;
    const secondaryClasses = accessibleClasses.filter((c) => c.section === 'Secondary' || isSecondaryClass(c.name)).length;
    const assignedTeachers = accessibleClasses.filter((c) => c.classTeacherId).length;

    // Pupil count within accessible classes
    const accessibleClassNames = new Set(accessibleClasses.map((c) => c.name.trim().toLowerCase()));
    const sectionPupils = students.filter(
      (s) => s.status === 'Active' && s.classGroup && accessibleClassNames.has(s.classGroup.trim().toLowerCase())
    ).length;

    // Early years vs Basic for primary
    const nurseryClasses = accessibleClasses.filter((c) => {
      const u = c.name.toUpperCase();
      return u.includes('NURSERY') || u.includes('RECEPTION') || u.includes('KINDERGARTEN') || u.includes('CRECHE');
    }).length;
    const basicClasses = accessibleClasses.filter((c) => {
      const u = c.name.toUpperCase();
      return u.includes('BASIC') || u.includes('PRIMARY');
    }).length;

    // Junior vs Senior for secondary
    const jssClasses = accessibleClasses.filter((c) => {
      const u = c.name.toUpperCase();
      return u.startsWith('JSS') || u.startsWith('JS ') || u.includes('JUNIOR');
    }).length;
    const sssClasses = accessibleClasses.filter((c) => {
      const u = c.name.toUpperCase();
      return u.startsWith('SSS') || u.startsWith('SS ') || u.includes('SENIOR') || u.startsWith('GRADE 1');
    }).length;

    return {
      totalClasses,
      primaryClasses,
      secondaryClasses,
      assignedTeachers,
      totalPupils: sectionPupils,
      nurseryClasses,
      basicClasses,
      jssClasses,
      sssClasses
    };
  }, [accessibleClasses, students]);

  // Authorization Shield
  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/60 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-2">
            Restricted Portal Access
          </h2>
          <p className="text-amber-700 dark:text-amber-400 text-sm max-w-md mx-auto">
            The Classes Management and Student Promotion Portal is reserved exclusively for the School Administrator,
            School Principal, and Head Teacher.
          </p>
        </div>
      </div>
    );
  }

  // Handle opening Add Class modal
  const openAddClassModal = () => {
    const defaultSection: 'Primary' | 'Secondary' =
      userSectionScope === 'primary' ? 'Primary' : userSectionScope === 'secondary' ? 'Secondary' : (activeSectionTab === 'Primary' ? 'Primary' : 'Secondary');
    setClassFormData({
      name: '',
      section: defaultSection,
      level: defaultSection === 'Primary' ? 'Basic 1' : 'JSS 1',
      arm: 'A',
      category: defaultSection === 'Primary' ? 'Primary' : 'Junior Secondary',
      capacity: 35,
      room: '',
      academicSession: '2026/2027',
      description: '',
      classTeacherId: ''
    });
    setIsAddClassModalOpen(true);
  };

  // Handle opening Edit Class modal
  const openEditClassModal = (cls: SchoolClass, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isClassInUserSection(cls)) return;
    setEditingClass(cls);
    setClassFormData({
      name: cls.name,
      section: cls.section,
      level: cls.level,
      arm: cls.arm,
      category: cls.category || (cls.section === 'Primary' ? 'Primary' : 'Junior Secondary'),
      capacity: cls.capacity,
      room: cls.room || '',
      academicSession: cls.academicSession || '2026/2027',
      description: cls.description || '',
      classTeacherId: cls.classTeacherId || ''
    });
  };

  // Save new class
  const handleSaveNewClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.name.trim()) return;

    // Enforce role-based section scope
    let finalSection = classFormData.section;
    if (userSectionScope === 'primary') finalSection = 'Primary';
    if (userSectionScope === 'secondary') finalSection = 'Secondary';

    const teacherObj = availableTeachers.find((t) => t.id === classFormData.classTeacherId);

    const newClass: SchoolClass = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: classFormData.name.trim(),
      section: finalSection,
      level: classFormData.level.trim(),
      arm: classFormData.arm.trim(),
      category: classFormData.category,
      capacity: Number(classFormData.capacity) || 35,
      room: classFormData.room.trim() || undefined,
      status: 'Active',
      academicSession: classFormData.academicSession.trim(),
      description: classFormData.description.trim() || undefined,
      classTeacherId: teacherObj ? teacherObj.id : undefined,
      classTeacherName: teacherObj ? teacherObj.name : undefined
    };

    await addClass(newClass, actor);

    // If teacher selected, also update teacher's formClass
    if (teacherObj) {
      await assignClassTeacher(newClass.id, teacherObj.id, teacherObj.name, newClass.name, actor);
    }

    setIsAddClassModalOpen(false);
  };

  // Save edited class
  const handleSaveEditClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !classFormData.name.trim()) return;
    if (!isClassInUserSection(editingClass)) return;

    // Enforce role-based section scope
    let finalSection = classFormData.section;
    if (userSectionScope === 'primary') finalSection = 'Primary';
    if (userSectionScope === 'secondary') finalSection = 'Secondary';

    const teacherObj = availableTeachers.find((t) => t.id === classFormData.classTeacherId);

    const updated: SchoolClass = {
      ...editingClass,
      name: classFormData.name.trim(),
      section: finalSection,
      level: classFormData.level.trim(),
      arm: classFormData.arm.trim(),
      category: classFormData.category,
      capacity: Number(classFormData.capacity) || 35,
      room: classFormData.room.trim() || undefined,
      academicSession: classFormData.academicSession.trim(),
      description: classFormData.description.trim() || undefined,
      classTeacherId: teacherObj ? teacherObj.id : undefined,
      classTeacherName: teacherObj ? teacherObj.name : undefined
    };

    await updateClass(updated, actor);

    if (teacherObj && teacherObj.id !== editingClass.classTeacherId) {
      await assignClassTeacher(updated.id, teacherObj.id, teacherObj.name, updated.name, actor);
    }

    setEditingClass(null);
  };

  // Delete class
  const handleConfirmDeleteClass = async () => {
    if (!deletingClass || !isClassInUserSection(deletingClass)) return;
    await deleteClass(deletingClass.id, actor);
    if (selectedClassId === deletingClass.id) {
      setSelectedClassId(null);
    }
    setDeletingClass(null);
  };

  // Assign Teacher submit
  const handleAssignTeacher = async (teacherId: string) => {
    if (!teacherAssignClass || !isClassInUserSection(teacherAssignClass)) return;
    const teacher = availableTeachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    await assignClassTeacher(teacherAssignClass.id, teacher.id, teacher.name, teacherAssignClass.name, actor);
    setTeacherAssignClass(null);
  };

  // Remove Teacher submit
  const handleRemoveTeacher = async () => {
    if (!teacherRemoveClass || !isClassInUserSection(teacherRemoveClass)) return;
    await removeClassTeacher(teacherRemoveClass.id, teacherRemoveClass.classTeacherId, teacherRemoveClass.name, actor);
    setTeacherRemoveClass(null);
  };

  // Handle single student promotion
  const handleConfirmPromote = async () => {
    if (!promoteStudentTarget || !targetClassForPromotion) return;
    const isTargetValid = accessibleClasses.some((c) => c.name.toLowerCase() === targetClassForPromotion.trim().toLowerCase());
    if (!isTargetValid) {
      alert('Target class must be in your authorized school section.');
      return;
    }
    await promoteStudent(
      promoteStudentTarget.id,
      targetClassForPromotion,
      promoteStudentTarget.classGroup,
      `${promoteStudentTarget.firstName} ${promoteStudentTarget.lastName}`,
      actor
    );
    setPromoteStudentTarget(null);
    setTargetClassForPromotion('');
  };

  // Handle single student demotion / reassignment
  const handleConfirmDemote = async () => {
    if (!demoteStudentTarget || !targetClassForPromotion) return;
    const isTargetValid = accessibleClasses.some((c) => c.name.toLowerCase() === targetClassForPromotion.trim().toLowerCase());
    if (!isTargetValid) {
      alert('Target class must be in your authorized school section.');
      return;
    }
    await demoteStudent(
      demoteStudentTarget.id,
      targetClassForPromotion,
      demoteStudentTarget.classGroup,
      `${demoteStudentTarget.firstName} ${demoteStudentTarget.lastName}`,
      actor
    );
    setDemoteStudentTarget(null);
    setTargetClassForPromotion('');
  };

  // Handle single student archive
  const handleConfirmArchive = async () => {
    if (!archiveStudentTarget) return;
    await archiveStudent(
      archiveStudentTarget.id,
      `${archiveStudentTarget.firstName} ${archiveStudentTarget.lastName}`,
      archiveStatusSelection,
      actor
    );
    setArchiveStudentTarget(null);
  };

  // Handle bulk promotion
  const handleConfirmBulkPromote = async () => {
    if (selectedStudentIds.length === 0 || !targetClassForPromotion) return;
    const isTargetValid = accessibleClasses.some((c) => c.name.toLowerCase() === targetClassForPromotion.trim().toLowerCase());
    if (!isTargetValid) {
      alert('Destination class must be within your authorized section.');
      return;
    }
    await bulkPromoteStudents(selectedStudentIds, targetClassForPromotion, actor);
    setSelectedStudentIds([]);
    setIsBulkPromoteModalOpen(false);
    setTargetClassForPromotion('');
  };

  // Handle bulk demotion
  const handleConfirmBulkDemote = async () => {
    if (selectedStudentIds.length === 0 || !targetClassForPromotion) return;
    const isTargetValid = accessibleClasses.some((c) => c.name.toLowerCase() === targetClassForPromotion.trim().toLowerCase());
    if (!isTargetValid) {
      alert('Destination class must be within your authorized section.');
      return;
    }
    await bulkDemoteStudents(selectedStudentIds, targetClassForPromotion, actor);
    setSelectedStudentIds([]);
    setIsBulkDemoteModalOpen(false);
    setTargetClassForPromotion('');
  };

  // Handle bulk archive
  const handleConfirmBulkArchive = async () => {
    if (selectedStudentIds.length === 0) return;
    await bulkArchiveStudents(selectedStudentIds, archiveStatusSelection, actor);
    setSelectedStudentIds([]);
    setIsBulkArchiveModalOpen(false);
  };

  // Toggle selection for all visible students
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredClassStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredClassStudents.map((s) => s.id));
    }
  };

  // Toggle single student selection
  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  // Export roster as CSV
  const handleExportRoster = () => {
    if (!selectedClass) return;
    const headers = ['Admission No', 'First Name', 'Last Name', 'Gender', 'Class', 'Status', 'Parent Name', 'Parent Phone', 'Parent Email'];
    const rows = filteredClassStudents.map((s) => [
      `"${s.admissionNo}"`,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      `"${s.gender}"`,
      `"${s.classGroup}"`,
      `"${s.status}"`,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${s.parentEmail}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedClass.name.replace(/\s+/g, '_')}_Student_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print class roster
  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div id="classes-management-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            userSectionScope === 'primary'
              ? 'bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : userSectionScope === 'secondary'
              ? 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
          }`}>
            {userSectionScope === 'secondary' ? <GraduationCap className="w-6 h-6" /> : <School className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {isAcademicStaff
                  ? 'My Assigned Classes & Student Rosters'
                  : userSectionScope === 'primary'
                  ? 'Primary Classes & Pupil Promotion'
                  : userSectionScope === 'secondary'
                  ? 'Secondary Classes & Student Promotion'
                  : 'School Classes & Pupil Promotion'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAcademicStaff
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : userSectionScope === 'primary'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : userSectionScope === 'secondary'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
              }`}>
                {isAcademicStaff
                  ? 'Academic Staff Portal'
                  : userSectionScope === 'primary'
                  ? 'Head Teacher Portal'
                  : userSectionScope === 'secondary'
                  ? 'Principal Portal'
                  : 'Admin Portal'}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAcademicStaff
                ? `Authorized access for ${currentUser?.name || 'Academic Staff'}. Viewing classes and student rosters directly assigned to your academic portfolio.`
                : userSectionScope === 'primary'
                ? 'Manage Primary School arms, Nursery & Basic class teachers, pupil rosters, and primary grade promotion.'
                : userSectionScope === 'secondary'
                ? 'Manage College/Secondary arms, JSS & SSS form masters, student rosters, and secondary promotion engine.'
                : 'Manage school arms, assign class/form teachers, review pupil rosters, and execute annual promotions or demotions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedClass && (
            <button
              id="back-to-classes-list-btn"
              onClick={() => {
                setSelectedClassId(null);
                setSelectedStudentIds([]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAcademicStaff ? 'My Classes' : userSectionScope === 'primary' ? 'Primary Classes' : userSectionScope === 'secondary' ? 'Secondary Classes' : 'All Classes'}
            </button>
          )}

          {!isAcademicStaff && (
            <button
              id="create-new-class-btn"
              onClick={openAddClassModal}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors ${
                userSectionScope === 'primary'
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              {userSectionScope === 'primary' ? 'Add Primary Class' : userSectionScope === 'secondary' ? 'Add Secondary Class' : 'Add New Class'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {userSectionScope === 'primary' ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Primary Classes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.totalClasses}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5" /> Primary School Section
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Early Years</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.nurseryClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nursery & Reception</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Basic Classes</div>
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{metrics.basicClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Basic 1 to Basic 5</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Class Teachers</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.assignedTeachers} <span className="text-sm font-normal text-slate-400">/ {metrics.totalClasses}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {metrics.totalClasses - metrics.assignedTeachers} Unassigned
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Active Pupils</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.totalPupils}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled in Primary</div>
            </div>
          </>
        ) : userSectionScope === 'secondary' ? (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">College Classes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.totalClasses}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Secondary Section
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Junior Secondary</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.jssClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">JSS 1–3 Streams</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Senior Secondary</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{metrics.sssClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">SSS 1–3 Streams</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Form Masters</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.assignedTeachers} <span className="text-sm font-normal text-slate-400">/ {metrics.totalClasses}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {metrics.totalClasses - metrics.assignedTeachers} Unassigned
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Active Students</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.totalPupils}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled in College</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Classes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.totalClasses}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5" /> Both Campuses
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Primary School</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.primaryClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nursery & Basic 1–5</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">College / Secondary</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.secondaryClasses}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">JSS 1–3 & SSS 1–3</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Form Teachers</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.assignedTeachers} <span className="text-sm font-normal text-slate-400">/ {metrics.totalClasses}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {metrics.totalClasses - metrics.assignedTeachers} Unassigned
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Active Pupils</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.totalPupils}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled Across Classes</div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      {!selectedClass ? (
        /* ==================== 1. ALL CLASSES DIRECTORY VIEW ==================== */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Campus Tabs or Locked Section Indicator */}
            {userSectionScope === 'primary' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Primary School Section</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-800/70 text-emerald-900 dark:text-emerald-200 font-bold uppercase tracking-wider">
                  Head Teacher Access Only
                </span>
              </div>
            ) : userSectionScope === 'secondary' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg text-xs font-semibold text-blue-800 dark:text-blue-300">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>College / Secondary Section</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200/70 dark:bg-blue-800/70 text-blue-900 dark:text-blue-200 font-bold uppercase tracking-wider">
                  Principal Access Only
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {(['All', 'Primary', 'Secondary'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSectionTab(tab)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      activeSectionTab === tab
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab === 'All' ? 'All Classes' : `${tab} Section`}
                  </button>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-classes-input"
                type="text"
                placeholder="Search class, room, arm or teacher..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Classes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => {
              const enrolled = studentCountByClass[cls.name.toLowerCase()]?.total || 0;
              const boys = studentCountByClass[cls.name.toLowerCase()]?.boys || 0;
              const girls = studentCountByClass[cls.name.toLowerCase()]?.girls || 0;
              const capacityPercent = Math.min(Math.round((enrolled / (cls.capacity || 35)) * 100), 100);

              const isPrimary = cls.section === 'Primary';

              return (
                <div
                  key={cls.id}
                  id={`class-card-${cls.id}`}
                  onClick={() => setSelectedClassId(cls.id)}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-4">
                    {/* Header: Class Name & Section Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {cls.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                              isPrimary
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {cls.section}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Level: <span className="font-medium text-slate-700 dark:text-slate-300">{cls.level}</span>
                          {cls.arm && <span> • Arm: {cls.arm}</span>}
                          {cls.room && <span> • {cls.room}</span>}
                        </p>
                      </div>

                      {/* Class Card Quick Actions */}
                      {!isAcademicStaff && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Edit Class Configuration"
                            onClick={(e) => openEditClassModal(cls, e)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete Class"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingClass(cls);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Class Teacher Assignment Block */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Class / Form Teacher</span>
                        {cls.classTeacherId && !isAcademicStaff ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTeacherRemoveClass(cls);
                            }}
                            className="text-[11px] text-rose-500 hover:text-rose-700 font-medium lowercase"
                          >
                            remove
                          </button>
                        ) : null}
                      </div>

                      {cls.classTeacherId && cls.classTeacherName ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                              {cls.classTeacherName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {cls.classTeacherName}
                              </div>
                              <div className="text-[10px] text-slate-400">Assigned Form Master</div>
                            </div>
                          </div>
                          {!isAcademicStaff && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeacherAssignClass(cls);
                              }}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-amber-600 dark:text-amber-400 italic">No teacher assigned</span>
                          {!isAcademicStaff && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeacherAssignClass(cls);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <UserPlus className="w-3.5 h-3.5" /> Assign Teacher
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Enrollment Bar & Pupil Counts */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Enrolled Pupils:</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {enrolled} / {cls.capacity || 35}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            capacityPercent > 90 ? 'bg-amber-500' : isPrimary ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{boys} Boys • {girls} Girls</span>
                        <span>{capacityPercent}% Capacity</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
                    <span>{isAcademicStaff ? 'View Class Roster & Pupils' : 'Manage Pupils & Promotions'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}

            {filteredClasses.length === 0 && (
              <div className="col-span-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <School className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  {isAcademicStaff ? 'No Classes Currently Assigned' : 'No classes found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {isAcademicStaff
                    ? `No classes are currently assigned to your teacher profile (${currentUser?.name || 'Academic Staff'}). Your School Principal or Head Teacher can allocate classes to you via the Teachers & Staff directory.`
                    : 'Try adjusting your search criteria or create a new school class.'}
                </p>
                {!isAcademicStaff && (
                  <button
                    onClick={openAddClassModal}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    <Plus className="w-4 h-4" /> Add Class
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== 2. SELECTED CLASS DETAIL & PUPILS ROSTER ==================== */
        <div className="space-y-4">
          {/* Class Profile Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedClass.name}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                      selectedClass.section === 'Primary'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    {selectedClass.section}
                  </span>
                  {selectedClass.category && (
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {selectedClass.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>Level: <strong className="text-slate-700 dark:text-slate-300">{selectedClass.level}</strong></span>
                  <span>Arm: <strong className="text-slate-700 dark:text-slate-300">{selectedClass.arm}</strong></span>
                  {selectedClass.room && <span>Room: <strong className="text-slate-700 dark:text-slate-300">{selectedClass.room}</strong></span>}
                  <span>Session: <strong className="text-slate-700 dark:text-slate-300">{selectedClass.academicSession || '2026/2027'}</strong></span>
                </div>
              </div>

              {/* Form Teacher Quick Card */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {selectedClass.classTeacherName ? selectedClass.classTeacherName.charAt(0) : '?'}
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Class / Form Teacher</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedClass.classTeacherName || 'None Assigned'}
                  </div>
                  {!isAcademicStaff && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <button
                        onClick={() => setTeacherAssignClass(selectedClass)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {selectedClass.classTeacherId ? 'Change' : 'Assign Teacher'}
                      </button>
                      {selectedClass.classTeacherId && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <button
                            onClick={() => setTeacherRemoveClass(selectedClass)}
                            className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Student Roster Filter & Bulk Actions Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pupils in this class..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                  {(['All', 'Active', 'Graduated', 'Suspended'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStudentStatusFilter(st)}
                      className={`px-2.5 py-1 font-medium rounded ${
                        studentStatusFilter === st
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {filteredClassStudents.length} {filteredClassStudents.length === 1 ? 'Pupil' : 'Pupils'}
                </span>
              </div>

              {/* Utility buttons: Export CSV & Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportRoster}
                  title="Export Roster as CSV"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={handlePrintRoster}
                  title="Print Class Roster"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>

            {/* Bulk Actions Ribbon when rows are selected */}
            {selectedStudentIds.length > 0 && !isAcademicStaff && (
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>{selectedStudentIds.length} {selectedStudentIds.length === 1 ? 'pupil' : 'pupils'} selected</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetClassForPromotion('');
                      setIsBulkPromoteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Bulk Promote
                  </button>
                  <button
                    onClick={() => {
                      setTargetClassForPromotion('');
                      setIsBulkDemoteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Bulk Demote/Move
                  </button>
                  <button
                    onClick={() => {
                      setArchiveStatusSelection('Graduated');
                      setIsBulkArchiveModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 rounded-md transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" /> Bulk Graduate / Archive
                  </button>
                  <button
                    onClick={() => setSelectedStudentIds([])}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline ml-2"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pupils Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      {!isAcademicStaff ? (
                        <button
                          type="button"
                          onClick={handleToggleSelectAll}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {selectedStudentIds.length > 0 && selectedStudentIds.length === filteredClassStudents.length ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono">#</span>
                      )}
                    </th>
                    <th className="p-3.5">Pupil Details</th>
                    <th className="p-3.5">Admission No</th>
                    <th className="p-3.5">Gender</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Parent / Guardian</th>
                    <th className="p-3.5 text-right">{isAcademicStaff ? 'Academic Status' : 'Class Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredClassStudents.map((std, stdIdx) => {
                    const isSelected = selectedStudentIds.includes(std.id);
                    return (
                      <tr
                        key={std.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          isSelected ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <td className="p-3.5 text-center text-xs text-slate-400 font-mono">
                          {!isAcademicStaff ? (
                            <button
                              type="button"
                              onClick={() => handleToggleStudentSelection(std.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <span>{stdIdx + 1}</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={std.avatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  `${std.firstName} ${std.lastName}`
                                )}&background=2563eb&color=fff`;
                              }}
                            />
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {std.firstName} {std.lastName}
                              </div>
                              <div className="text-xs text-slate-400">
                                {std.isBoarder ? 'Hostel Boarder' : 'Day Student'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                          {std.admissionNo}
                        </td>

                        <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">
                          {std.gender}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              std.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : std.status === 'Graduated'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {std.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{std.parentName}</div>
                          <div className="text-[11px] text-slate-400">{std.parentPhone}</div>
                        </td>

                        <td className="p-3.5 text-right">
                          {isAcademicStaff ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 rounded border border-emerald-200 dark:border-emerald-800">
                              Enrolled Pupil
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {std.status === 'Active' ? (
                                <>
                                  <button
                                    type="button"
                                    title="Promote Student"
                                    onClick={() => {
                                      setTargetClassForPromotion('');
                                      setPromoteStudentTarget(std);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                                  >
                                    <ArrowUpRight className="w-3.5 h-3.5" /> Promote
                                  </button>

                                  <button
                                    type="button"
                                    title="Demote or Reassign Class"
                                    onClick={() => {
                                      setTargetClassForPromotion('');
                                      setDemoteStudentTarget(std);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                                  >
                                    <ArrowDownLeft className="w-3.5 h-3.5" /> Move
                                  </button>

                                  <button
                                    type="button"
                                    title="Graduate / Archive Student"
                                    onClick={() => {
                                      setArchiveStatusSelection('Graduated');
                                      setArchiveStudentTarget(std);
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  title="Reactivate Student to Active"
                                  onClick={() => reactivateStudent(std.id, `${std.firstName} ${std.lastName}`, actor)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded border border-blue-200 dark:border-blue-800 transition-colors"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" /> Restore Active
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredClassStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <div className="font-semibold text-slate-700 dark:text-slate-300">No pupils found in this class</div>
                        <div className="text-xs mt-1">
                          No students are currently enrolled in {selectedClass.name} matching your filter.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 1. ADD CLASS MODAL */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Class</h3>
              </div>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary 4 Gold, JSS 2 Harmony, SS 1 Science"
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Campus Section *
                  </label>
                  <select
                    value={classFormData.section}
                    disabled={userSectionScope !== 'all'}
                    onChange={(e) => {
                      const sec = e.target.value as 'Primary' | 'Secondary';
                      setClassFormData({
                        ...classFormData,
                        section: sec,
                        category: sec === 'Primary' ? 'Primary' : 'Junior Secondary',
                        level: sec === 'Primary' ? 'Basic 1' : 'JSS 1'
                      });
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {userSectionScope === 'primary' ? (
                      <option value="Primary">Primary School (Head Teacher Scope)</option>
                    ) : userSectionScope === 'secondary' ? (
                      <option value="Secondary">College / Secondary (Principal Scope)</option>
                    ) : (
                      <>
                        <option value="Primary">Primary School</option>
                        <option value="Secondary">College / Secondary</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Grade Level *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basic 4, JSS 2, SSS 1"
                    value={classFormData.level}
                    onChange={(e) => setClassFormData({ ...classFormData, level: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Arm / Stream
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A, Gold, Science"
                    value={classFormData.arm}
                    onChange={(e) => setClassFormData({ ...classFormData, arm: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={classFormData.capacity}
                    onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Classroom
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 102"
                    value={classFormData.room}
                    onChange={(e) => setClassFormData({ ...classFormData, room: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Assign Class / Form Teacher (Optional)
                </label>
                <select
                  value={classFormData.classTeacherId}
                  onChange={(e) => setClassFormData({ ...classFormData, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- No Class Teacher Yet --</option>
                  {availableTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.staffId}) {t.formClass ? `[Currently Form for: ${t.formClass}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT CLASS MODAL */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Class: {editingClass.name}</h3>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Section
                  </label>
                  <select
                    value={classFormData.section}
                    disabled={userSectionScope !== 'all'}
                    onChange={(e) => setClassFormData({ ...classFormData, section: e.target.value as 'Primary' | 'Secondary' })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {userSectionScope === 'primary' ? (
                      <option value="Primary">Primary School (Head Teacher Scope)</option>
                    ) : userSectionScope === 'secondary' ? (
                      <option value="Secondary">College / Secondary (Principal Scope)</option>
                    ) : (
                      <>
                        <option value="Primary">Primary School</option>
                        <option value="Secondary">College / Secondary</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    required
                    value={classFormData.level}
                    onChange={(e) => setClassFormData({ ...classFormData, level: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Arm
                  </label>
                  <input
                    type="text"
                    value={classFormData.arm}
                    onChange={(e) => setClassFormData({ ...classFormData, arm: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={classFormData.capacity}
                    onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    value={classFormData.room}
                    onChange={(e) => setClassFormData({ ...classFormData, room: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Class / Form Teacher
                </label>
                <select
                  value={classFormData.classTeacherId}
                  onChange={(e) => setClassFormData({ ...classFormData, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                >
                  <option value="">-- No Class Teacher Assigned --</option>
                  {availableTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.staffId}) {t.formClass && t.formClass !== editingClass.name ? `[Current: ${t.formClass}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ASSIGN / CHANGE CLASS TEACHER MODAL */}
      {teacherAssignClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Assign Form Teacher: {teacherAssignClass.name}
                </h3>
              </div>
              <button
                onClick={() => setTeacherAssignClass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an educator from the staff directory to serve as the designated Form/Class Master for this class.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {availableTeachers.map((t) => {
                const isCurrent = t.id === teacherAssignClass.classTeacherId;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleAssignTeacher(t.id)}
                    className={`p-3 rounded-lg border text-sm cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</div>
                        <div className="text-xs text-slate-400">
                          {t.qualification} • {t.staffId}
                          {t.formClass && <span className="text-amber-600 dark:text-amber-400 ml-1">({t.formClass})</span>}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {isCurrent ? 'Current' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTeacherAssignClass(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONFIRM REMOVE TEACHER MODAL */}
      {teacherRemoveClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Remove Class Teacher</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove <strong>{teacherRemoveClass.classTeacherName}</strong> as Form Master for{' '}
                <strong>{teacherRemoveClass.name}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setTeacherRemoveClass(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveTeacher}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Yes, Remove Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONFIRM DELETE CLASS MODAL */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete Class: {deletingClass.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                This action will permanently delete this class from the school system. Any pupils currently assigned to this class should be promoted or reassigned first.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteClass}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Yes, Delete Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SINGLE STUDENT PROMOTE MODAL */}
      {promoteStudentTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Promote Pupil</h3>
              </div>
              <button onClick={() => setPromoteStudentTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div>Student: <strong className="text-slate-900 dark:text-slate-100">{promoteStudentTarget.firstName} {promoteStudentTarget.lastName}</strong></div>
              <div>Current Class: <strong className="text-slate-900 dark:text-slate-100">{promoteStudentTarget.classGroup}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Select Promotion Target Class *
              </label>
              <select
                value={targetClassForPromotion}
                onChange={(e) => setTargetClassForPromotion(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select Destination Class --</option>
                {accessibleClasses
                  .filter((c) => c.name !== promoteStudentTarget.classGroup)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.section} • {c.level})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPromoteStudentTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!targetClassForPromotion}
                onClick={handleConfirmPromote}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg"
              >
                Confirm Promotion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SINGLE STUDENT DEMOTE / REASSIGN MODAL */}
      {demoteStudentTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Demote / Reassign Pupil</h3>
              </div>
              <button onClick={() => setDemoteStudentTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div>Student: <strong className="text-slate-900 dark:text-slate-100">{demoteStudentTarget.firstName} {demoteStudentTarget.lastName}</strong></div>
              <div>Current Class: <strong className="text-slate-900 dark:text-slate-100">{demoteStudentTarget.classGroup}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Select New Class Arm / Level *
              </label>
              <select
                value={targetClassForPromotion}
                onChange={(e) => setTargetClassForPromotion(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Select Destination Class --</option>
                {accessibleClasses
                  .filter((c) => c.name !== demoteStudentTarget.classGroup)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.section} • {c.level})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDemoteStudentTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!targetClassForPromotion}
                onClick={handleConfirmDemote}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SINGLE STUDENT ARCHIVE MODAL */}
      {archiveStudentTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Graduate / Archive Pupil</h3>
              </div>
              <button onClick={() => setArchiveStudentTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Archive <strong>{archiveStudentTarget.firstName} {archiveStudentTarget.lastName}</strong> from active class rosters. All records and past report cards will remain safely archived.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Archive Status Category
              </label>
              <select
                value={archiveStatusSelection}
                onChange={(e) => setArchiveStatusSelection(e.target.value as 'Graduated' | 'Suspended')}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="Graduated">Graduated (School Alumnus)</option>
                <option value="Suspended">Suspended / Inactive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setArchiveStudentTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. BULK PROMOTE MODAL */}
      {isBulkPromoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Bulk Promote {selectedStudentIds.length} Pupils
                </h3>
              </div>
              <button onClick={() => setIsBulkPromoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              All <strong>{selectedStudentIds.length}</strong> selected pupils from {selectedClass?.name} will be promoted to the selected destination class.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Select Destination Class *
              </label>
              <select
                value={targetClassForPromotion}
                onChange={(e) => setTargetClassForPromotion(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="">-- Choose Target Class --</option>
                {accessibleClasses
                  .filter((c) => c.name !== selectedClass?.name)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.section} • {c.level})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsBulkPromoteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!targetClassForPromotion}
                onClick={handleConfirmBulkPromote}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                Promote Selected Cohort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. BULK DEMOTE / REASSIGN MODAL */}
      {isBulkDemoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Bulk Reassign / Demote {selectedStudentIds.length} Pupils
                </h3>
              </div>
              <button onClick={() => setIsBulkDemoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reassign <strong>{selectedStudentIds.length}</strong> selected pupils to an alternative class or arm.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Select Destination Class *
              </label>
              <select
                value={targetClassForPromotion}
                onChange={(e) => setTargetClassForPromotion(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="">-- Choose Destination Class --</option>
                {accessibleClasses
                  .filter((c) => c.name !== selectedClass?.name)
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.section} • {c.level})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsBulkDemoteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!targetClassForPromotion}
                onClick={handleConfirmBulkDemote}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                Reassign Cohort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. BULK ARCHIVE / GRADUATE MODAL */}
      {isBulkArchiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Bulk Graduate / Archive {selectedStudentIds.length} Pupils
                </h3>
              </div>
              <button onClick={() => setIsBulkArchiveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Graduate or archive <strong>{selectedStudentIds.length}</strong> selected pupils. They will be marked as alumni or inactive while their complete academic history is preserved.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Archive Status
              </label>
              <select
                value={archiveStatusSelection}
                onChange={(e) => setArchiveStatusSelection(e.target.value as 'Graduated' | 'Suspended')}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="Graduated">Graduated (Outgoing Class Cohort)</option>
                <option value="Suspended">Suspended / Left School</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsBulkArchiveModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkArchive}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
              >
                Confirm Bulk Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
