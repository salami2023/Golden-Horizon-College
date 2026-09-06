import React, { useState } from 'react';
import {
  UserCheck,
  Mail,
  Phone,
  BookOpen,
  Award,
  Plus,
  Search,
  ShieldCheck,
  Edit2,
  Trash2,
  Lock,
  Save,
  AlertCircle,
  X,
  GraduationCap,
  Baby,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Teacher, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  SECONDARY_SUBJECTS,
  PRIMARY_SUBJECTS,
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  JUNIOR_SECONDARY_CLASSES,
  SENIOR_SECONDARY_CLASSES,
  JUNIOR_SECONDARY_SUBJECTS,
  SENIOR_SECONDARY_SUBJECTS,
  isSecondaryClass,
  isPrimaryClass,
  isJuniorSecondaryClass,
  isSeniorSecondaryClass,
  getTeacherSecondaryTier
} from '../../utils/sectionHelpers';

interface StaffManagementProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  currentRole?: UserRole;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  currentRole = 'super_admin'
}) => {
  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [sectionFilter, setSectionFilter] = useState<'All' | 'Secondary' | 'Primary'>('All');
  const [secondaryTierFilter, setSecondaryTierFilter] = useState<'All' | 'Junior Secondary' | 'Senior Secondary'>('All');

  // Secondary Tier & Subject Allocation State for Adding Staff
  const [addStaffSection, setAddStaffSection] = useState<'Secondary' | 'Primary'>(isHeadTeacher ? 'Primary' : 'Secondary');
  const [addSecondaryTier, setAddSecondaryTier] = useState<'Junior Secondary' | 'Senior Secondary' | 'All Secondary'>('Junior Secondary');
  const [allocatedSubjects, setAllocatedSubjects] = useState<string[]>(
    isHeadTeacher ? ['Numeracy', 'Literacy'] : ['Mathematics (Junior)', 'Basic Science & Technology']
  );

  // Edit Teacher modal state for secondary tier
  const [editSecondaryTier, setEditSecondaryTier] = useState<'Junior Secondary' | 'Senior Secondary' | 'All Secondary'>('Junior Secondary');

  // Available subjects & classes based on role
  const availableSubjects: string[] = (isPrincipal
    ? SECONDARY_SUBJECTS
    : isHeadTeacher
    ? PRIMARY_SUBJECTS
    : [...SECONDARY_SUBJECTS, ...PRIMARY_SUBJECTS]).map((s) => s.name);

  const availableClasses = isPrincipal
    ? SECONDARY_CLASSES
    : isHeadTeacher
    ? PRIMARY_CLASSES
    : [...SECONDARY_CLASSES, ...PRIMARY_CLASSES];

  const isAddingSecondary = isPrincipal || (!isHeadTeacher && addStaffSection === 'Secondary');

  const addClassOptions = isAddingSecondary
    ? addSecondaryTier === 'Junior Secondary'
      ? JUNIOR_SECONDARY_CLASSES
      : addSecondaryTier === 'Senior Secondary'
      ? SENIOR_SECONDARY_CLASSES
      : SECONDARY_CLASSES
    : PRIMARY_CLASSES;

  const addSubjectList = isAddingSecondary
    ? addSecondaryTier === 'Junior Secondary'
      ? JUNIOR_SECONDARY_SUBJECTS
      : addSecondaryTier === 'Senior Secondary'
      ? SENIOR_SECONDARY_SUBJECTS
      : SECONDARY_SUBJECTS
    : PRIMARY_SUBJECTS;

  const isEditingSecondary = editingTeacher
    ? isPrincipal ||
      Boolean(editingTeacher.secondaryTier) ||
      (editingTeacher.formClass ? isSecondaryClass(editingTeacher.formClass) : !isHeadTeacher)
    : false;

  const editClassOptions = isEditingSecondary
    ? editSecondaryTier === 'Junior Secondary'
      ? JUNIOR_SECONDARY_CLASSES
      : editSecondaryTier === 'Senior Secondary'
      ? SENIOR_SECONDARY_CLASSES
      : SECONDARY_CLASSES
    : PRIMARY_CLASSES;

  const editSubjectList = isEditingSecondary
    ? editSecondaryTier === 'Junior Secondary'
      ? JUNIOR_SECONDARY_SUBJECTS
      : editSecondaryTier === 'Senior Secondary'
      ? SENIOR_SECONDARY_SUBJECTS
      : SECONDARY_SUBJECTS
    : PRIMARY_SUBJECTS;

  const handleSelectAddTier = (tier: 'Junior Secondary' | 'Senior Secondary' | 'All Secondary') => {
    setAddSecondaryTier(tier);
    if (tier === 'Junior Secondary') {
      setFormClass(JUNIOR_SECONDARY_CLASSES[0]);
      setAllocatedSubjects(['Mathematics (Junior)', 'Basic Science & Technology']);
      setSubjectsText('Mathematics (Junior), Basic Science & Technology');
    } else if (tier === 'Senior Secondary') {
      setFormClass(SENIOR_SECONDARY_CLASSES[0]);
      setAllocatedSubjects(['General Mathematics', 'Physics']);
      setSubjectsText('General Mathematics, Physics');
    } else {
      setFormClass(SECONDARY_CLASSES[0]);
      setAllocatedSubjects(['Mathematics (Junior)', 'General Mathematics']);
      setSubjectsText('Mathematics (Junior), General Mathematics');
    }
  };

  // New staff form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 800 123 4567');
  const [qualification, setQualification] = useState(
    isHeadTeacher ? 'NCE / B.Ed Primary Education' : 'B.Ed / B.Sc Education'
  );
  const [subjectsText, setSubjectsText] = useState(
    isHeadTeacher ? 'Numeracy, Literacy' : 'Mathematics (Junior), Basic Science & Technology'
  );
  const [formClass, setFormClass] = useState(isHeadTeacher ? 'Basic 1' : 'JSS 1 A');
  const [provisionNotice, setProvisionNotice] = useState<string | null>(null);

  // RBAC Permission: Administrator, School Principal, Head Teacher have full access
  const hasFullAccess = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const filteredTeachers = teachers.filter((t) => {
    // Filter by role section
    if (isPrincipal) {
      const isSec = (t.formClass && isSecondaryClass(t.formClass)) ||
        t.subjects.some(s => SECONDARY_SUBJECTS.some(secS => secS.name.toLowerCase().includes(s.toLowerCase())));
      if (!isSec && t.formClass && isPrimaryClass(t.formClass)) return false;
    }

    if (isHeadTeacher) {
      const isPrim = (t.formClass && isPrimaryClass(t.formClass)) ||
        t.subjects.some(s => PRIMARY_SUBJECTS.some(primS => primS.name.toLowerCase().includes(s.toLowerCase())));
      if (!isPrim && t.formClass && isSecondaryClass(t.formClass)) return false;
    }

    if (!isPrincipal && !isHeadTeacher) {
      if (sectionFilter === 'Secondary') {
        const isSec = (t.formClass && isSecondaryClass(t.formClass)) ||
          t.subjects.some(s => SECONDARY_SUBJECTS.some(secS => secS.name.toLowerCase().includes(s.toLowerCase())));
        if (!isSec) return false;
      }
      if (sectionFilter === 'Primary') {
        const isPrim = (t.formClass && isPrimaryClass(t.formClass)) ||
          t.subjects.some(s => PRIMARY_SUBJECTS.some(primS => primS.name.toLowerCase().includes(s.toLowerCase())));
        if (!isPrim) return false;
      }
    }

    // Secondary Tier filter (Junior vs Senior)
    if ((isPrincipal || sectionFilter === 'Secondary') && secondaryTierFilter !== 'All') {
      const tier = getTeacherSecondaryTier(t);
      if (secondaryTierFilter === 'Junior Secondary' && tier !== 'Junior Secondary' && tier !== 'All Secondary') return false;
      if (secondaryTierFilter === 'Senior Secondary' && tier !== 'Senior Secondary' && tier !== 'All Secondary') return false;
    }

    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject =
      selectedSubjectFilter === 'All' ||
      t.subjects.some((s) => s.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));

    return matchesSearch && matchesSubject;
  });

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    const tier = getTeacherSecondaryTier(tch);
    setEditSecondaryTier(tier === 'Primary' ? 'Junior Secondary' : tier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess) {
      alert('Access Denied: Only Pioneer, Administrator, School Principal, and Head Teacher can add staff members.');
      return;
    }
    if (!name.trim()) return;

    const registeredEmail = email.trim() || `${name.toLowerCase().trim().replace(/[^a-z0-9]/g, '.')}@goldenhorizon.edu.ng`;

    // Combine allocated subjects with any custom comma-separated subjects
    const manualSubjects = subjectsText.split(',').map((s) => s.trim()).filter(Boolean);
    const combinedSubjects = Array.from(new Set([...allocatedSubjects, ...manualSubjects]));

    const isSec = isPrincipal || addStaffSection === 'Secondary';

    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      staffId: `GH-STF-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: registeredEmail,
      phone: phone.trim() || '+234 800 123 4567',
      qualification,
      secondaryTier: isSec ? addSecondaryTier : undefined,
      subjects: combinedSubjects.length > 0 ? combinedSubjects : [isSec ? 'General Mathematics' : 'Numeracy'],
      formClass,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      joinDate: new Date().toISOString().split('T')[0]
    };

    onAddTeacher(newTeacher);
    setShowAddModal(false);
    setProvisionNotice(
      `Teacher "${newTeacher.name}" added successfully! Registered email "${newTeacher.email}" is now active for portal login with an initial empty password.`
    );
    setName('');
    setEmail('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess || !editingTeacher) {
      alert('Access Denied: You do not have permission to edit staff details.');
      return;
    }
    const isSec = editingTeacher.formClass ? isSecondaryClass(editingTeacher.formClass) : true;
    const updatedTch: Teacher = {
      ...editingTeacher,
      secondaryTier: isSec ? editSecondaryTier : undefined
    };
    if (onUpdateTeacher) {
      onUpdateTeacher(updatedTch);
    }
    setEditingTeacher(null);
  };

  const handleConfirmDelete = () => {
    if (!hasFullAccess || !deletingTeacher) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can delete staff records.');
      return;
    }
    if (onDeleteTeacher) {
      onDeleteTeacher(deletingTeacher.id);
    }
    setDeletingTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        hasFullAccess
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {hasFullAccess ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                {isPrincipal ? (
                  <strong>Secondary Principal Portal:</strong>
                ) : isHeadTeacher ? (
                  <strong>Primary Head Teacher Portal:</strong>
                ) : (
                  <strong>Full Access Granted:</strong>
                )}{' '}
                You have full authority to <strong>add, edit qualifications, assign subjects/classes, and delete</strong>{' '}
                {isPrincipal ? 'secondary teaching staff' : isHeadTeacher ? 'primary teaching staff' : 'teachers & staff'}.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Full management of teachers and staff is reserved for <strong>Administrator, School Principal, and Head Teacher</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary School Teaching Staff & Faculty
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Early Years Teaching Faculty
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5 text-blue-600" /> Academic Staff & Teachers Directory
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPrincipal
              ? 'Manage secondary subject allocation, form tutors (JSS 1-3 & SSS 1-3), and teacher qualifications.'
              : isHeadTeacher
              ? 'Manage primary & nursery subject teachers, class teachers (Nursery to Basic 5), and qualifications.'
              : 'Manage subject allocation, form teacher assignments, and academic qualifications.'}
          </p>
        </div>

        {hasFullAccess && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> {isPrincipal ? 'Add Secondary Teacher' : isHeadTeacher ? 'Add Primary Teacher' : 'Add Teaching Staff'}
          </button>
        )}
      </div>

      {/* Teacher Authentication Provision Notice Banner */}
      {provisionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start justify-between gap-3 text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 dark:text-white">Staff Login Account Active</p>
              <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">{provisionNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setProvisionNotice(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Section Tabs */}
      {!isPrincipal && !isHeadTeacher && (
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-fit">
          <button
            onClick={() => setSectionFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              sectionFilter === 'All'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Staff ({teachers.length})
          </button>
          <button
            onClick={() => setSectionFilter('Secondary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              sectionFilter === 'Secondary'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> Secondary Faculty (Principal)
          </button>
          <button
            onClick={() => setSectionFilter('Primary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              sectionFilter === 'Primary'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Baby className="h-3.5 w-3.5" /> Primary & Nursery (Head Teacher)
          </button>
        </div>
      )}

      {/* Search & Subject Filter Bar with Search Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by teacher name, subject or staff ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Secondary Tier Filter for Secondary section */}
          {(isPrincipal || sectionFilter === 'Secondary') && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 px-2">Level:</span>
              <button
                type="button"
                onClick={() => setSecondaryTierFilter('All')}
                className={`px-2.5 py-1 rounded-lg transition text-xs ${
                  secondaryTierFilter === 'All'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Secondary
              </button>
              <button
                type="button"
                onClick={() => setSecondaryTierFilter('Junior Secondary')}
                className={`px-2.5 py-1 rounded-lg transition text-xs ${
                  secondaryTierFilter === 'Junior Secondary'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Junior (JSS 1-3)
              </button>
              <button
                type="button"
                onClick={() => setSecondaryTierFilter('Senior Secondary')}
                className={`px-2.5 py-1 rounded-lg transition text-xs ${
                  secondaryTierFilter === 'Senior Secondary'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Senior (SSS 1-3)
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Subject Area:</span>
            <DropdownWithSearch
              options={[
                { value: 'All', label: 'All Subject Areas' },
                ...availableSubjects.map((s) => ({ value: s, label: s }))
              ]}
              value={selectedSubjectFilter}
              onChange={(val) => setSelectedSubjectFilter(val)}
              placeholder="Filter subject..."
              searchPlaceholder="Search subject area..."
              colorScheme="blue"
              buttonLabel="Filter"
            />
          </div>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((tch) => {
          const isPrim = isPrimaryClass(tch.formClass || '');
          const tier = isPrim ? 'Primary' : getTeacherSecondaryTier(tch);
          return (
            <div
              key={tch.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {tch.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold block w-max">
                      {tch.staffId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${
                      tier === 'Junior Secondary'
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        : tier === 'Senior Secondary'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                        : tier === 'All Secondary'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    }`}>
                      {tier === 'Junior Secondary' ? 'Junior Secondary' : tier === 'Senior Secondary' ? 'Senior Secondary' : tier === 'All Secondary' ? 'Cross-Tier Secondary' : 'Primary / Nursery'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Award className="h-3 w-3 text-amber-500" /> {tch.qualification}
                  </p>
                </div>

                {hasFullAccess && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tch)}
                      title="Edit Teacher Record"
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingTeacher(tch)}
                      title="Delete Teacher Record"
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-bold flex items-center gap-1 text-slate-500">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Subjects:
                </span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                  {tch.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[10px] font-bold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pt-1">
                <span className="font-bold flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Form Class:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {tch.formClass || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 truncate max-w-[60%]">
                <Mail className="h-3 w-3 shrink-0" /> {tch.email}
              </span>
              <span className="font-mono">{tch.phone}</span>
            </div>
          </div>
        );
      })}
    </div>

      {/* Edit Staff Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Staff ({editingTeacher.staffId})
              </h3>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qualification</label>
                <input
                  type="text"
                  value={editingTeacher.qualification}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Secondary Tier Selector in Edit Modal */}
              {isEditingSecondary && (
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Secondary Section Level / Tier
                    </label>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      Filters Subjects & Classes
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditSecondaryTier('Junior Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        editSecondaryTier === 'Junior Secondary'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div>Junior Secondary</div>
                      <div className={`text-[10px] ${editSecondaryTier === 'Junior Secondary' ? 'text-blue-100' : 'text-slate-400'}`}>
                        JSS 1 – JSS 3
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSecondaryTier('Senior Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        editSecondaryTier === 'Senior Secondary'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div>Senior Secondary</div>
                      <div className={`text-[10px] ${editSecondaryTier === 'Senior Secondary' ? 'text-indigo-100' : 'text-slate-400'}`}>
                        SSS 1 – SSS 3
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSecondaryTier('All Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        editSecondaryTier === 'All Secondary'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                      }`}
                    >
                      <div>All Secondary</div>
                      <div className={`text-[10px] ${editSecondaryTier === 'All Secondary' ? 'text-purple-100' : 'text-slate-400'}`}>
                        JSS & SSS
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Subject Allocation with Interactive Chips */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Allocated Subjects ({editingTeacher.subjects.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-400">Click to toggle</span>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 max-h-36 overflow-y-auto mb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {editSubjectList.map((s) => {
                      const isSelected = editingTeacher.subjects.includes(s.name);
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            const exists = editingTeacher.subjects.includes(s.name);
                            const updated = exists
                              ? editingTeacher.subjects.filter(sub => sub !== s.name)
                              : [...editingTeacher.subjects, s.name];
                            setEditingTeacher({ ...editingTeacher, subjects: updated });
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                          }`}
                        >
                          <span>{s.name}</span>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                  Assigned Subjects (Comma-separated text / Custom additions):
                </label>
                <input
                  type="text"
                  value={editingTeacher.subjects.join(', ')}
                  onChange={(e) => setEditingTeacher({
                    ...editingTeacher,
                    subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. Mathematics, English Language"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Form Teacher Class</label>
                <select
                  value={editingTeacher.formClass || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, formClass: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {editClassOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Staff Record</h3>
                <p className="text-xs text-slate-500">Remove teaching staff member from school registry.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-800 dark:text-slate-200">{deletingTeacher.name} ({deletingTeacher.staffId})</p>
              <p className="text-slate-500 mt-1">Subjects: {deletingTeacher.subjects.join(', ')} • Form Class: {deletingTeacher.formClass || 'None'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                {isPrincipal ? 'Add Secondary School Teacher' : isHeadTeacher ? 'Add Primary / Nursery Teacher' : 'Add Teaching Staff Member'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isHeadTeacher ? "e.g. Mrs. Joy Danladi" : "e.g. Mr. Chidi Okafor"}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px]">(Login Username)</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. teacher.name@example.com"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <KeyRound className="h-3 w-3 text-amber-500 flex-shrink-0" />
                  This email is the login username. Default password will be empty on their first login.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Section Selector (for Admin/Pioneer) */}
              {!isPrincipal && !isHeadTeacher && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    School Section <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddStaffSection('Secondary');
                        handleSelectAddTier(addSecondaryTier);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        addStaffSection === 'Secondary'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <GraduationCap className="h-3.5 w-3.5" /> Secondary School
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddStaffSection('Primary');
                        setFormClass('Basic 1');
                        setAllocatedSubjects(['Numeracy', 'Literacy']);
                        setSubjectsText('Numeracy, Literacy');
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        addStaffSection === 'Primary'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                      }`}
                    >
                      <Baby className="h-3.5 w-3.5" /> Primary & Nursery
                    </button>
                  </div>
                </div>
              )}

              {/* Secondary Tier Selector */}
              {isAddingSecondary && (
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Secondary Section Level / Tier <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      Filters Subjects & Classes
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAddTier('Junior Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        addSecondaryTier === 'Junior Secondary'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div>Junior Secondary</div>
                      <div className={`text-[10px] ${addSecondaryTier === 'Junior Secondary' ? 'text-blue-100' : 'text-slate-400'}`}>
                        JSS 1 – JSS 3
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAddTier('Senior Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        addSecondaryTier === 'Senior Secondary'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div>Senior Secondary</div>
                      <div className={`text-[10px] ${addSecondaryTier === 'Senior Secondary' ? 'text-indigo-100' : 'text-slate-400'}`}>
                        SSS 1 – SSS 3
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAddTier('All Secondary')}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        addSecondaryTier === 'All Secondary'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                      }`}
                    >
                      <div>All Secondary</div>
                      <div className={`text-[10px] ${addSecondaryTier === 'All Secondary' ? 'text-purple-100' : 'text-slate-400'}`}>
                        JSS & SSS
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Subject Allocation with Interactive Chips */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Teaching Subject Allocation ({allocatedSubjects.length} selected)
                  </label>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        const allNames = addSubjectList.map(s => s.name);
                        setAllocatedSubjects(allNames);
                        setSubjectsText(allNames.join(', '));
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAllocatedSubjects([]);
                        setSubjectsText('');
                      }}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 max-h-36 overflow-y-auto mb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {addSubjectList.map((s) => {
                      const isSelected = allocatedSubjects.includes(s.name);
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            const next = allocatedSubjects.includes(s.name)
                              ? allocatedSubjects.filter(sub => sub !== s.name)
                              : [...allocatedSubjects, s.name];
                            setAllocatedSubjects(next);
                            setSubjectsText(next.join(', '));
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                          }`}
                        >
                          <span>{s.name}</span>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                  Assigned Subjects (Comma-separated text / Custom additions):
                </label>
                <input
                  type="text"
                  value={subjectsText}
                  onChange={(e) => {
                    setSubjectsText(e.target.value);
                    setAllocatedSubjects(e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
                  }}
                  placeholder="e.g. Mathematics, English Language"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Form Teacher Class</label>
                <DropdownWithSearch
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...addClassOptions.map((c) => ({ value: c, label: c }))
                  ]}
                  value={formClass}
                  onChange={(val) => setFormClass(val)}
                  placeholder="Select assigned class..."
                  searchPlaceholder="Search class..."
                  colorScheme="blue"
                  buttonLabel="Select"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Save Staff Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
