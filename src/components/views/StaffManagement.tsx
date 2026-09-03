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
  Baby
} from 'lucide-react';
import { Teacher, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  SECONDARY_SUBJECTS,
  PRIMARY_SUBJECTS,
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  isSecondaryClass,
  isPrimaryClass
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

  // Available subjects & classes based on role
  const availableSubjects = isPrincipal
    ? SECONDARY_SUBJECTS
    : isHeadTeacher
    ? PRIMARY_SUBJECTS
    : [...SECONDARY_SUBJECTS, ...PRIMARY_SUBJECTS];

  const availableClasses = isPrincipal
    ? SECONDARY_CLASSES
    : isHeadTeacher
    ? PRIMARY_CLASSES
    : [...SECONDARY_CLASSES, ...PRIMARY_CLASSES];

  // New staff form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 800 123 4567');
  const [qualification, setQualification] = useState(
    isHeadTeacher ? 'NCE / B.Ed Primary Education' : 'B.Ed / B.Sc Education'
  );
  const [subjectsText, setSubjectsText] = useState(
    isHeadTeacher ? 'Numeracy, Literacy' : 'Mathematics, Further Maths'
  );
  const [formClass, setFormClass] = useState(isHeadTeacher ? 'Basic 1' : 'Grade 10 A');

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

    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject =
      selectedSubjectFilter === 'All' ||
      t.subjects.some((s) => s.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));

    return matchesSearch && matchesSubject;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can add staff members.');
      return;
    }
    if (!name) return;

    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      staffId: `KS-STF-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@kwikschools.com`,
      phone: phone || '+234 800 123 4567',
      qualification,
      subjects: subjectsText.split(',').map((s) => s.trim()).filter(Boolean),
      formClass,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      joinDate: new Date().toISOString().split('T')[0]
    };

    onAddTeacher(newTeacher);
    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess || !editingTeacher) {
      alert('Access Denied: You do not have permission to edit staff details.');
      return;
    }
    if (onUpdateTeacher) {
      onUpdateTeacher(editingTeacher);
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

        <div className="flex items-center gap-2 w-full md:w-auto">
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

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((tch) => (
          <div
            key={tch.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <img
                  src={tch.avatar}
                  alt={tch.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {tch.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold block mt-0.5 w-max">
                    {tch.staffId}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Award className="h-3 w-3 text-amber-500" /> {tch.qualification}
                  </p>
                </div>
              </div>

              {hasFullAccess && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTeacher(tch)}
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
        ))}
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

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={editingTeacher.subjects.join(', ')}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  e.g. {availableSubjects.slice(0, 3).join(', ')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Form Teacher Class</label>
                <select
                  value={editingTeacher.formClass || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, formClass: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {availableClasses.map((c) => (
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@kwikschools.com"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Teaching Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={subjectsText}
                  onChange={(e) => setSubjectsText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Suggestions: {availableSubjects.slice(0, 4).join(', ')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Form Teacher Class</label>
                <DropdownWithSearch
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...availableClasses.map((c) => ({ value: c, label: c }))
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
