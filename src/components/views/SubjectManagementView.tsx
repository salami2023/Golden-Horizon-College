import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  School,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Copy,
  ArrowRight,
  Sparkles,
  BookMarked,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  X,
  GraduationCap,
  Info
} from 'lucide-react';
import { SchoolSubject, UserRole, SchoolClass } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import {
  isPrimaryClass,
  isSecondaryClass,
  isJuniorSecondaryClass,
  isSeniorSecondaryClass,
  getSubjectSecondaryTier,
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  JUNIOR_SECONDARY_CLASSES,
  SENIOR_SECONDARY_CLASSES,
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  getAcademicSessionAndTerm
} from '../../utils/sectionHelpers';

interface SubjectManagementViewProps {
  currentRole: UserRole;
}

export const SubjectManagementView: React.FC<SubjectManagementViewProps> = ({ currentRole }) => {
  const {
    subjects,
    classes,
    schoolSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    assignSubjectToClass,
    removeSubjectFromClass,
    bulkAssignSubjectsToClass,
    bulkRemoveSubjectsFromClass,
    duplicateCurriculum
  } = useRealTime();

  const actor = useMemo(() => ({
    role: currentRole,
    name: currentRole === 'principal'
      ? 'School Principal'
      : currentRole === 'head_teacher'
      ? 'Head Teacher'
      : currentRole === 'super_admin'
      ? 'Super Admin'
      : 'System Administrator'
  }), [currentRole]);

  // Section peculiarity enforcement
  // Principal => strictly Secondary
  // Head Teacher => strictly Primary
  // Super Admin / Pioneer => can toggle or view both
  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';
  const isSuperAdminOrPioneer = currentRole === 'super_admin' || currentRole === 'pioneer';
  const canManage = isPrincipal || isHeadTeacher || isSuperAdminOrPioneer;

  // Active section tab for super admins, or locked section for leaders
  const [adminSectionFilter, setAdminSectionFilter] = useState<'Secondary' | 'Primary' | 'All'>(
    isHeadTeacher ? 'Primary' : 'Secondary'
  );

  const activeSection = useMemo<'Secondary' | 'Primary' | 'All'>(() => {
    if (isPrincipal) return 'Secondary';
    if (isHeadTeacher) return 'Primary';
    return adminSectionFilter;
  }, [isPrincipal, isHeadTeacher, adminSectionFilter]);

  // Filtered classes matching the active section
  const sectionClasses = useMemo(() => {
    return classes.filter((cls) => {
      if (activeSection === 'Secondary') {
        return cls.section === 'Secondary' || isSecondaryClass(cls.name);
      }
      if (activeSection === 'Primary') {
        return cls.section === 'Primary' || isPrimaryClass(cls.name);
      }
      return true;
    });
  }, [classes, activeSection]);

  // Fallback class list if custom classes are empty
  const availableClassNames = useMemo(() => {
    if (sectionClasses.length > 0) {
      return sectionClasses.map((c) => c.name);
    }
    return activeSection === 'Primary' ? PRIMARY_CLASSES : SECONDARY_CLASSES;
  }, [sectionClasses, activeSection]);

  // Active View Tab: 'by_class' | 'catalog'
  const [viewMode, setViewMode] = useState<'by_class' | 'catalog'>('by_class');

  // Selected Class for 'by_class' view
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return availableClassNames[0] || (activeSection === 'Primary' ? 'Basic 1' : 'JSS 1 A');
  });

  // Ensure selectedClass stays valid when switching section
  React.useEffect(() => {
    if (!availableClassNames.includes(selectedClass)) {
      if (availableClassNames.length > 0) {
        setSelectedClass(availableClassNames[0]);
      }
    }
  }, [activeSection, availableClassNames, selectedClass]);

  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SchoolSubject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SchoolSubject | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formSection, setFormSection] = useState<'Primary' | 'Secondary'>('Secondary');
  const [formSecondaryTier, setFormSecondaryTier] = useState<'Junior Secondary' | 'Senior Secondary' | 'All Secondary'>('Junior Secondary');
  const [secondaryTierFilter, setSecondaryTierFilter] = useState<'All' | 'Junior Secondary' | 'Senior Secondary'>('All');
  const [formCategory, setFormCategory] = useState('Core');
  const [formWeeklyPeriods, setFormWeeklyPeriods] = useState<number>(4);
  const [formIsCompulsory, setFormIsCompulsory] = useState(true);
  const [formApplicableClasses, setFormApplicableClasses] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Duplicate Modal State
  const [duplicateSourceClass, setDuplicateSourceClass] = useState('');
  const [duplicateTargetClass, setDuplicateTargetClass] = useState('');

  // Multi-assign state
  const [selectedSubjectIdsToAssign, setSelectedSubjectIdsToAssign] = useState<string[]>([]);

  // Section-Filtered Subjects
  const sectionSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      if (activeSection === 'Secondary') return sub.section === 'Secondary';
      if (activeSection === 'Primary') return sub.section === 'Primary';
      return true;
    });
  }, [subjects, activeSection]);

  // Categories available in current section
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    sectionSubjects.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['All', ...Array.from(cats)];
  }, [sectionSubjects]);

  // Subjects assigned to the currently selected class
  const classSubjects = useMemo(() => {
    return sectionSubjects.filter((sub) => {
      return sub.applicableClasses.some((c) => {
        if (c === selectedClass) return true;
        // Prefix matching (e.g., 'JSS 1' applies to 'JSS 1 A')
        if (selectedClass.startsWith(c)) return true;
        return false;
      });
    });
  }, [sectionSubjects, selectedClass]);

  // Subjects in the section NOT assigned to the currently selected class
  const unassignedClassSubjects = useMemo(() => {
    const assignedIds = new Set(classSubjects.map((s) => s.id));
    return sectionSubjects.filter((s) => !assignedIds.has(s.id));
  }, [sectionSubjects, classSubjects]);

  // Filtered subjects for catalog
  const filteredCatalogSubjects = useMemo(() => {
    return sectionSubjects.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.description && sub.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || sub.category === selectedCategory;

      const matchesTier =
        activeSection !== 'Secondary' ||
        secondaryTierFilter === 'All' ||
        getSubjectSecondaryTier(sub) === secondaryTierFilter ||
        getSubjectSecondaryTier(sub) === 'All Secondary';

      return matchesSearch && matchesCat && matchesTier;
    });
  }, [sectionSubjects, searchQuery, selectedCategory, activeSection, secondaryTierFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = sectionSubjects.length;
    const core = sectionSubjects.filter((s) => s.isCompulsory).length;
    const electives = total - core;
    const totalWeeklyPeriods = classSubjects.reduce((sum, s) => sum + (s.weeklyPeriods || 4), 0);
    return {
      total,
      core,
      electives,
      classCount: availableClassNames.length,
      classSubjectCount: classSubjects.length,
      totalWeeklyPeriods
    };
  }, [sectionSubjects, classSubjects, availableClassNames]);

  const { academicSession, currentTerm } = getAcademicSessionAndTerm(schoolSettings);

  // Open Add Modal
  const handleOpenAddModal = (targetClass?: string) => {
    setFormError('');
    setFormName('');
    setFormCode('');
    const defaultSec = activeSection === 'Primary' ? 'Primary' : 'Secondary';
    setFormSection(defaultSec);
    const resolvedTier: 'Junior Secondary' | 'Senior Secondary' | 'All Secondary' = targetClass
      ? (isJuniorSecondaryClass(targetClass) ? 'Junior Secondary' : isSeniorSecondaryClass(targetClass) ? 'Senior Secondary' : 'Junior Secondary')
      : (selectedClass && isSeniorSecondaryClass(selectedClass) ? 'Senior Secondary' : 'Junior Secondary');
    setFormSecondaryTier(resolvedTier);
    setFormCategory('Core');
    setFormWeeklyPeriods(4);
    setFormIsCompulsory(true);
    setFormApplicableClasses(targetClass ? [targetClass] : (selectedClass ? [selectedClass] : []));
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (subject: SchoolSubject) => {
    setFormError('');
    setEditingSubject(subject);
    setFormName(subject.name);
    setFormCode(subject.code);
    setFormSection(subject.section);
    setFormSecondaryTier(getSubjectSecondaryTier(subject));
    setFormCategory(subject.category);
    setFormWeeklyPeriods(subject.weeklyPeriods || 4);
    setFormIsCompulsory(subject.isCompulsory);
    setFormApplicableClasses(subject.applicableClasses || []);
    setFormDescription(subject.description || '');
  };

  // Submit Add Subject
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Subject name is required');
      return;
    }

    // Auto-generate code if empty
    const codeSuffix =
      formSection === 'Primary'
        ? 'PRI'
        : formSecondaryTier === 'Junior Secondary'
        ? 'JSS'
        : formSecondaryTier === 'Senior Secondary'
        ? 'SSS'
        : 'SEC';

    const code = formCode.trim()
      ? formCode.trim().toUpperCase()
      : `${formName.substring(0, 3).toUpperCase()}-${codeSuffix}`;

    // Validate section peculiarity
    if (isPrincipal && formSection !== 'Secondary') {
      setFormError('Principal can only create subjects for the Secondary section');
      return;
    }
    if (isHeadTeacher && formSection !== 'Primary') {
      setFormError('Head Teacher can only create subjects for the Primary section');
      return;
    }

    const newSubject: SchoolSubject = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: formName.trim(),
      code,
      section: formSection,
      secondaryTier: formSection === 'Secondary' ? formSecondaryTier : undefined,
      category: formCategory,
      classLevels: formApplicableClasses,
      applicableClasses: formApplicableClasses,
      weeklyPeriods: Number(formWeeklyPeriods) || 4,
      isCompulsory: formIsCompulsory,
      status: 'Active',
      description: formDescription.trim() || undefined
    };

    try {
      await addSubject(newSubject, actor);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save subject');
    }
  };

  // Submit Edit Subject
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    if (!formName.trim()) {
      setFormError('Subject name is required');
      return;
    }

    // Validate section peculiarity
    if (isPrincipal && editingSubject.section !== 'Secondary') {
      setFormError('Principal cannot modify Primary curriculum');
      return;
    }
    if (isHeadTeacher && editingSubject.section !== 'Primary') {
      setFormError('Head Teacher cannot modify Secondary curriculum');
      return;
    }

    const updated: SchoolSubject = {
      ...editingSubject,
      name: formName.trim(),
      code: formCode.trim().toUpperCase(),
      secondaryTier: editingSubject.section === 'Secondary' ? formSecondaryTier : undefined,
      category: formCategory,
      weeklyPeriods: Number(formWeeklyPeriods) || 4,
      isCompulsory: formIsCompulsory,
      applicableClasses: formApplicableClasses,
      description: formDescription.trim() || undefined
    };

    try {
      await updateSubject(updated, actor);
      setEditingSubject(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to update subject');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingSubject) return;

    if (isPrincipal && deletingSubject.section !== 'Secondary') {
      alert('Principal cannot delete Primary subjects');
      setDeletingSubject(null);
      return;
    }
    if (isHeadTeacher && deletingSubject.section !== 'Primary') {
      alert('Head Teacher cannot delete Secondary subjects');
      setDeletingSubject(null);
      return;
    }

    try {
      await deleteSubject(deletingSubject.id, actor);
      setDeletingSubject(null);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  // Quick toggle compulsory for a subject
  const handleToggleCompulsory = async (subject: SchoolSubject) => {
    const updated: SchoolSubject = {
      ...subject,
      isCompulsory: !subject.isCompulsory
    };
    await updateSubject(updated, actor);
  };

  // Remove a subject from the current class
  const handleRemoveFromClass = async (subjectId: string, subjectName: string) => {
    if (window.confirm(`Remove "${subjectName}" from the curriculum of ${selectedClass}?`)) {
      await removeSubjectFromClass(subjectId, selectedClass, actor);
    }
  };

  // Open Bulk Assign Modal
  const handleOpenAssignModal = () => {
    setSelectedSubjectIdsToAssign([]);
    setIsAssignModalOpen(true);
  };

  // Submit Bulk Assign to Current Class
  const handleConfirmAssignSubjects = async () => {
    if (selectedSubjectIdsToAssign.length === 0) return;
    await bulkAssignSubjectsToClass(selectedSubjectIdsToAssign, selectedClass, actor);
    setIsAssignModalOpen(false);
  };

  // Open Duplicate Curriculum Modal
  const handleOpenDuplicateModal = () => {
    setDuplicateSourceClass(selectedClass);
    // Find another class in the same section
    const otherClass = availableClassNames.find((c) => c !== selectedClass) || '';
    setDuplicateTargetClass(otherClass);
    setIsDuplicateModalOpen(true);
  };

  // Submit Duplicate Curriculum
  const handleConfirmDuplicate = async () => {
    if (!duplicateSourceClass || !duplicateTargetClass) return;
    if (duplicateSourceClass === duplicateTargetClass) {
      alert('Source and target classes must be different');
      return;
    }
    await duplicateCurriculum(duplicateSourceClass, duplicateTargetClass, actor);
    setIsDuplicateModalOpen(false);
    setSelectedClass(duplicateTargetClass);
  };

  // If user role is not authorized
  if (!canManage) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center" id="subject-mgmt-denied">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subject Management Restricted</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-6">
          Curriculum and subject management is reserved exclusively for the <strong>School Principal</strong> (Secondary Section)
          and the <strong>Head Teacher</strong> (Primary Section) to maintain the distinct academic peculiarities of each school.
        </p>
      </div>
    );
  }

  const currentSchoolTitle = activeSection === 'Primary' ? PRIMARY_SCHOOL_NAME : SECONDARY_SCHOOL_NAME;
  const sectionLeaderLabel = isPrincipal
    ? 'Principal (Secondary Section)'
    : isHeadTeacher
    ? 'Head Teacher (Primary Section)'
    : 'Super Administrator';

  return (
    <div className="space-y-6 pb-12" id="subject-management-view">
      {/* Page Header with Section Peculiarity Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {activeSection === 'Primary' ? 'Primary Curriculum & Subjects' : 'Secondary Curriculum & Subjects'}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {currentSchoolTitle} • {academicSession} ({currentTerm})
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons & Admin Section Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Super Admin Section Switcher */}
            {isSuperAdminOrPioneer && (
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAdminSectionFilter('Secondary')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    adminSectionFilter === 'Secondary'
                      ? 'bg-white text-blue-700 shadow-sm font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Secondary (Principal)
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSectionFilter('Primary')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    adminSectionFilter === 'Primary'
                      ? 'bg-white text-emerald-700 shadow-sm font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Primary (Head Teacher)
                </button>
              </div>
            )}

            <button
              type="button"
              id="btn-add-subject-modal"
              onClick={() => handleOpenAddModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          </div>
        </div>

        {/* Section Peculiarity Context Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Section Peculiarity Active:</strong>{' '}
              {activeSection === 'Secondary' ? (
                <>
                  Secondary curriculum operates under <strong>WAEC / NECO / BECE</strong> standards with Science, Arts & Commercial streams.
                </>
              ) : (
                <>
                  Primary curriculum operates under <strong>Universal Basic Education (UBE) / EYFS</strong> standards focusing on Numeracy, Literacy & Sensory Foundation.
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white font-medium text-slate-600 border border-slate-200">
              Authority: {sectionLeaderLabel}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Total {activeSection} Subjects</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">{stats.classCount} Classes configured</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Core Compulsory</div>
          <div className="text-2xl font-bold text-emerald-600">{stats.core}</div>
          <div className="text-xs text-gray-400 mt-1">Mandatory for all students</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Electives / Vocational</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.electives}</div>
          <div className="text-xs text-gray-400 mt-1">Specialized & optional</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-500 mb-1">Current Class Load ({selectedClass})</div>
          <div className="text-2xl font-bold text-blue-600">{stats.classSubjectCount}</div>
          <div className="text-xs text-gray-500 mt-1">{stats.totalWeeklyPeriods} periods / week</div>
        </div>
      </div>

      {/* View Switcher Tabs (By Class vs Master Catalog) */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            type="button"
            id="tab-by-class"
            onClick={() => setViewMode('by_class')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              viewMode === 'by_class'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Class Curriculum View</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
              {stats.classCount} classes
            </span>
          </button>
          <button
            type="button"
            id="tab-catalog"
            onClick={() => setViewMode('catalog')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              viewMode === 'catalog'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Master Subject Catalog</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
              {stats.total} total
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: BY CLASS CURRICULUM */}
      {viewMode === 'by_class' && (
        <div className="space-y-6">
          {/* Class Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Select Class:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableClassNames.map((className) => {
                  const isSelected = selectedClass === className;
                  return (
                    <button
                      key={className}
                      type="button"
                      onClick={() => setSelectedClass(className)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {className}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Curriculum Actions for this Class */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                id="btn-assign-subjects"
                onClick={handleOpenAssignModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Subjects to {selectedClass}</span>
              </button>

              <button
                type="button"
                id="btn-duplicate-curriculum"
                onClick={handleOpenDuplicateModal}
                title="Duplicate subjects from another arm or grade"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs font-semibold border border-gray-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy from Another Class</span>
              </button>
            </div>
          </div>

          {/* Subjects Assigned to Selected Class */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <span>Curriculum for {selectedClass}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {classSubjects.length} Subjects Assigned
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Subjects taught to students in {selectedClass}. Each subject links to term grading, report cards, and timetables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(selectedClass)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Create Custom Subject for this Class</span>
                </button>
              </div>
            </div>

            {classSubjects.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">No Subjects Assigned to {selectedClass}</h4>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Select subjects from the {activeSection} curriculum catalog to assign to this class, or duplicate from another arm.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenAssignModal}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Assign Existing Subjects
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenDuplicateModal}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
                  >
                    Copy from Another Class
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Subject Name & Code</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Periods / Wk</th>
                      <th className="px-4 py-3">Compulsory Status</th>
                      <th className="px-4 py-3">Scope / Other Classes</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {classSubjects.map((sub) => {
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-gray-900">{sub.name}</div>
                            <div className="text-xs font-mono text-gray-500">{sub.code}</div>
                            {sub.description && (
                              <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{sub.description}</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{sub.weeklyPeriods || 4} periods</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCompulsory(sub)}
                              title="Click to toggle compulsory / elective"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                                sub.isCompulsory
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              }`}
                            >
                              {sub.isCompulsory ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Compulsory</span>
                                </>
                              ) : (
                                <span>Elective</span>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {sub.applicableClasses.slice(0, 3).map((cls) => (
                                <span
                                  key={cls}
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    cls === selectedClass
                                      ? 'bg-blue-100 text-blue-700 font-bold'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {cls}
                                </span>
                              ))}
                              {sub.applicableClasses.length > 3 && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium">
                                  +{sub.applicableClasses.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(sub)}
                                title="Edit Subject Details"
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFromClass(sub.id, sub.name)}
                                title={`Remove from ${selectedClass}`}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MASTER CATALOG */}
      {viewMode === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeSection} subjects by name or code...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      Category: {cat}
                    </option>
                  ))}
                </select>
              </div>

              {activeSection === 'Secondary' && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSecondaryTierFilter('All')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      secondaryTierFilter === 'All'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Secondary
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecondaryTierFilter('Junior Secondary')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      secondaryTierFilter === 'Junior Secondary'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Junior (JSS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecondaryTierFilter('Senior Secondary')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      secondaryTierFilter === 'Senior Secondary'
                        ? 'bg-white text-indigo-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Senior (SSS)
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Showing <strong>{filteredCatalogSubjects.length}</strong> of {sectionSubjects.length} subjects
            </div>
          </div>

          {/* Catalog Grid / Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Subject Name & Code</th>
                    <th className="px-4 py-3">Section & Tier</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Periods / Wk</th>
                    <th className="px-4 py-3">Compulsory</th>
                    <th className="px-4 py-3">Assigned Classes</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCatalogSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                        No subjects found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCatalogSubjects.map((sub) => {
                      const tier = getSubjectSecondaryTier(sub);
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-gray-900">{sub.name}</div>
                            <div className="text-xs font-mono text-gray-500">{sub.code}</div>
                            {sub.description && (
                              <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{sub.description}</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                  sub.section === 'Primary'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {sub.section}
                              </span>
                              {sub.section === 'Secondary' && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    tier === 'Junior Secondary'
                                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                                      : tier === 'Senior Secondary'
                                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {tier === 'Junior Secondary'
                                    ? 'Junior (JSS)'
                                    : tier === 'Senior Secondary'
                                    ? 'Senior (SSS)'
                                    : 'All Secondary'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                              {sub.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs text-gray-700 font-medium">{sub.weeklyPeriods || 4}</span>
                          </td>
                          <td className="px-4 py-4">
                            {sub.isCompulsory ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Compulsory
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-gray-500">Elective</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {sub.applicableClasses.length === 0 ? (
                                <span className="text-xs text-amber-600 font-medium">None assigned</span>
                              ) : (
                                sub.applicableClasses.slice(0, 4).map((cls) => (
                                  <span key={cls} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                    {cls}
                                  </span>
                                ))
                              )}
                              {sub.applicableClasses.length > 4 && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium">
                                  +{sub.applicableClasses.length - 4}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(sub)}
                                title="Edit Subject"
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingSubject(sub)}
                                title="Delete Subject Completely"
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW SUBJECT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Add New School Subject</h3>
                  <p className="text-xs text-gray-500">
                    Creating subject for <strong>{formSection} Curriculum</strong> ({academicSession})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Further Mathematics, Diction & Phonics, Coding"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FMTH-SEC, PHN-PRI"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Auto-generated if left blank</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formWeeklyPeriods}
                    onChange={(e) => setFormWeeklyPeriods(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <select
                    disabled={!isSuperAdminOrPioneer}
                    value={formSection}
                    onChange={(e) => {
                      const sec = e.target.value as 'Primary' | 'Secondary';
                      setFormSection(sec);
                      if (sec === 'Secondary') {
                        setFormApplicableClasses(availableClassNames.filter(isJuniorSecondaryClass));
                      } else {
                        setFormApplicableClasses([]);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 disabled:opacity-80"
                  >
                    <option value="Secondary">Secondary (College)</option>
                    <option value="Primary">Primary & Nursery</option>
                  </select>
                  {!isSuperAdminOrPioneer && (
                    <p className="text-[10px] text-gray-400 mt-0.5">Locked to your administrative section</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800"
                  >
                    <option value="Core">Core</option>
                    <option value="Sciences">Sciences</option>
                    <option value="STEM">STEM / Technology</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Vocational">Vocational</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Early Years">Early Years</option>
                    <option value="Aptitude">Aptitude</option>
                  </select>
                </div>
              </div>

              {/* Secondary Tier Selector: Junior vs Senior Secondary */}
              {formSection === 'Secondary' && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-900">
                      Secondary Level / Tier <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-blue-700 font-medium">Choose Junior or Senior level</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSecondaryTier('Junior Secondary');
                        const jss = availableClassNames.filter(isJuniorSecondaryClass);
                        setFormApplicableClasses(jss);
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'Junior Secondary'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span>Junior Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'Junior Secondary' ? 'text-blue-100' : 'text-gray-400'}`}>
                        JSS 1 – JSS 3
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSecondaryTier('Senior Secondary');
                        const sss = availableClassNames.filter(isSeniorSecondaryClass);
                        setFormApplicableClasses(sss);
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'Senior Secondary'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span>Senior Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'Senior Secondary' ? 'text-indigo-100' : 'text-gray-400'}`}>
                        SSS 1 – SSS 3
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSecondaryTier('All Secondary');
                        setFormApplicableClasses([...availableClassNames]);
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'All Secondary'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-slate-300'
                      }`}
                    >
                      <span>All Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'All Secondary' ? 'text-slate-200' : 'text-gray-400'}`}>
                        Both JSS & SSS
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="chk-compulsory"
                  checked={formIsCompulsory}
                  onChange={(e) => setFormIsCompulsory(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="chk-compulsory" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Mark as Compulsory (Required for all students in assigned classes)
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Assign Immediately to Classes ({formSection}
                    {formSection === 'Secondary' ? ` • ${formSecondaryTier}` : ''}):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetClasses =
                          formSection === 'Primary'
                            ? availableClassNames
                            : formSecondaryTier === 'Junior Secondary'
                            ? availableClassNames.filter(isJuniorSecondaryClass)
                            : formSecondaryTier === 'Senior Secondary'
                            ? availableClassNames.filter(isSeniorSecondaryClass)
                            : availableClassNames;
                        setFormApplicableClasses(targetClasses);
                      }}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => setFormApplicableClasses([])}
                      className="text-[11px] text-gray-500 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-36 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 gap-1.5">
                  {(formSection === 'Primary'
                    ? availableClassNames
                    : formSecondaryTier === 'Junior Secondary'
                    ? availableClassNames.filter(isJuniorSecondaryClass)
                    : formSecondaryTier === 'Senior Secondary'
                    ? availableClassNames.filter(isSeniorSecondaryClass)
                    : availableClassNames
                  ).map((className) => {
                    const isChecked = formApplicableClasses.includes(className);
                    return (
                      <button
                        type="button"
                        key={className}
                        onClick={() => {
                          if (isChecked) {
                            setFormApplicableClasses(formApplicableClasses.filter((c) => c !== className));
                          } else {
                            setFormApplicableClasses([...formApplicableClasses, className]);
                          }
                        }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                          isChecked ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{className}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Curriculum Focus / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Focuses on WAEC syllabus or foundational numeracy..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SUBJECT */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Edit Subject: {editingSubject.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{editingSubject.code} • {editingSubject.section}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formWeeklyPeriods}
                    onChange={(e) => setFormWeeklyPeriods(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800"
                >
                  <option value="Core">Core</option>
                  <option value="Sciences">Sciences</option>
                  <option value="STEM">STEM / Technology</option>
                  <option value="Languages">Languages</option>
                  <option value="Arts & Humanities">Arts & Humanities</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Vocational">Vocational</option>
                  <option value="Creative Arts">Creative Arts</option>
                  <option value="Early Years">Early Years</option>
                  <option value="Aptitude">Aptitude</option>
                </select>
              </div>

              {/* Secondary Tier Selector: Junior vs Senior Secondary */}
              {editingSubject.section === 'Secondary' && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-900">
                      Secondary Level / Tier <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-blue-700 font-medium">Choose Junior or Senior level</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormSecondaryTier('Junior Secondary')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'Junior Secondary'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span>Junior Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'Junior Secondary' ? 'text-blue-100' : 'text-gray-400'}`}>
                        JSS 1 – JSS 3
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSecondaryTier('Senior Secondary')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'Senior Secondary'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span>Senior Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'Senior Secondary' ? 'text-indigo-100' : 'text-gray-400'}`}>
                        SSS 1 – SSS 3
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSecondaryTier('All Secondary')}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border flex flex-col items-center gap-0.5 transition-all ${
                        formSecondaryTier === 'All Secondary'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-slate-300'
                      }`}
                    >
                      <span>All Secondary</span>
                      <span className={`text-[10px] font-normal ${formSecondaryTier === 'All Secondary' ? 'text-slate-200' : 'text-gray-400'}`}>
                        Both JSS & SSS
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="chk-edit-compulsory"
                  checked={formIsCompulsory}
                  onChange={(e) => setFormIsCompulsory(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="chk-edit-compulsory" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Mark as Compulsory
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Classes Assigned to ({formSection}
                    {formSection === 'Secondary' ? ` • ${formSecondaryTier}` : ''}):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetClasses =
                          formSection === 'Primary'
                            ? availableClassNames
                            : formSecondaryTier === 'Junior Secondary'
                            ? availableClassNames.filter(isJuniorSecondaryClass)
                            : formSecondaryTier === 'Senior Secondary'
                            ? availableClassNames.filter(isSeniorSecondaryClass)
                            : availableClassNames;
                        setFormApplicableClasses(targetClasses);
                      }}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => setFormApplicableClasses([])}
                      className="text-[11px] text-gray-500 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-36 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 gap-1.5">
                  {(formSection === 'Primary'
                    ? availableClassNames
                    : formSecondaryTier === 'Junior Secondary'
                    ? availableClassNames.filter(isJuniorSecondaryClass)
                    : formSecondaryTier === 'Senior Secondary'
                    ? availableClassNames.filter(isSeniorSecondaryClass)
                    : availableClassNames
                  ).map((className) => {
                    const isChecked = formApplicableClasses.includes(className);
                    return (
                      <button
                        type="button"
                        key={className}
                        onClick={() => {
                          if (isChecked) {
                            setFormApplicableClasses(formApplicableClasses.filter((c) => c !== className));
                          } else {
                            setFormApplicableClasses([...formApplicableClasses, className]);
                          }
                        }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                          isChecked ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{className}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN SUBJECTS TO CLASS */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Assign Subjects to {selectedClass}</h3>
                <p className="text-xs text-gray-500">
                  Select available subjects from the {activeSection} catalog to add to this class.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 space-y-3">
              {unassignedClassSubjects.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  All {activeSection} subjects are already assigned to {selectedClass}!
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-1">
                    <span>Available Subjects ({unassignedClassSubjects.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedSubjectIdsToAssign.length === unassignedClassSubjects.length) {
                          setSelectedSubjectIdsToAssign([]);
                        } else {
                          setSelectedSubjectIdsToAssign(unassignedClassSubjects.map((s) => s.id));
                        }
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {selectedSubjectIdsToAssign.length === unassignedClassSubjects.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>

                  {unassignedClassSubjects.map((sub) => {
                    const isChecked = selectedSubjectIdsToAssign.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedSubjectIdsToAssign(selectedSubjectIdsToAssign.filter((id) => id !== sub.id));
                          } else {
                            setSelectedSubjectIdsToAssign([...selectedSubjectIdsToAssign, sub.id]);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{sub.name}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {sub.code} • {sub.category}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{sub.weeklyPeriods || 4} periods</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-medium">
                {selectedSubjectIdsToAssign.length} subjects selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedSubjectIdsToAssign.length === 0}
                  onClick={handleConfirmAssignSubjects}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
                >
                  Assign to {selectedClass}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DUPLICATE / COPY CURRICULUM */}
      {isDuplicateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Copy Curriculum</h3>
                  <p className="text-xs text-gray-500">Duplicate subject allocations across classes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  All subjects currently assigned to the source class will also be assigned to the target class without removing any existing subjects.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Source Class (Copy From):</label>
                <select
                  value={duplicateSourceClass}
                  onChange={(e) => setDuplicateSourceClass(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
                >
                  {availableClassNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center text-gray-400">
                <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Class (Copy To):</label>
                <select
                  value={duplicateTargetClass}
                  onChange={(e) => setDuplicateTargetClass(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
                >
                  {availableClassNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={duplicateSourceClass === duplicateTargetClass}
                onClick={handleConfirmDuplicate}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
              >
                Duplicate Curriculum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Subject?</h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to completely remove <strong>"{deletingSubject.name}"</strong> ({deletingSubject.code}) from the {deletingSubject.section} curriculum?
              This will remove it from all assigned classes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
