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
  X
} from 'lucide-react';
import { Teacher, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // New staff form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 800 123 4567');
  const [qualification, setQualification] = useState('B.Ed / B.Sc Education');
  const [subjectsText, setSubjectsText] = useState('Mathematics, Further Maths');
  const [formClass, setFormClass] = useState('Grade 10 A');

  // RBAC Permission: Administrator, School Principal, Head Teacher have full access
  const hasFullAccess = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const filteredTeachers = teachers.filter((t) => {
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
      subjects: subjectsText.split(',').map((s) => s.trim()),
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
                <strong>Full Access Granted:</strong> As an <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong>, you have full authority to <strong>add, edit qualifications, assign classes, and delete</strong> teachers & staff.
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
          Role: {currentRole}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" /> Academic Staff & Teachers Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage subject allocation, form teacher assignments, and academic qualifications.
          </p>
        </div>

        {hasFullAccess && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Teaching Staff
          </button>
        )}
      </div>

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
              { value: 'Mathematics', label: 'Mathematics & Further Maths' },
              { value: 'English', label: 'English & Literature' },
              { value: 'Physics', label: 'Physics & Applied Sciences' },
              { value: 'Chemistry', label: 'Chemistry' },
              { value: 'Biology', label: 'Biology & Health Sciences' },
              { value: 'Economics', label: 'Economics & Commerce' },
              { value: 'Computer', label: 'Computer Science & ICT' }
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
                <div className="flex flex-wrap gap-1 justify-end">
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
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {tch.email}
              </span>
              <span className="font-mono">{tch.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Staff Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={editingTeacher.subjects.join(', ')}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subjects: e.target.value.split(',').map((s) => s.trim()) })}
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
                  <option value="Grade 10 A">Grade 10 A</option>
                  <option value="Grade 10 B">Grade 10 B</option>
                  <option value="Grade 11 Science">Grade 11 Science</option>
                  <option value="Grade 12 Art">Grade 12 Art</option>
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" /> Add Teaching Staff Member
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
                  placeholder="e.g. Mrs. Sarah Jenkins"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="s.jenkins@kwikschools.com"
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={subjectsText}
                  onChange={(e) => setSubjectsText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Form Teacher Class</label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Grade 10 A">Grade 10 A</option>
                  <option value="Grade 10 B">Grade 10 B</option>
                  <option value="Grade 11 Science">Grade 11 Science</option>
                  <option value="Grade 12 Art">Grade 12 Art</option>
                </select>
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
