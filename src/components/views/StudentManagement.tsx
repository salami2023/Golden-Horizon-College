import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Bus,
  Home,
  CheckCircle,
  X,
  CreditCard,
  FileSpreadsheet,
  Award,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Edit2,
  Trash2,
  ShieldCheck,
  Lock,
  Save,
  AlertCircle,
  GraduationCap,
  Baby,
  School
} from 'lucide-react';
import { Student, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  isSecondaryClass,
  isPrimaryClass,
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME
} from '../../utils/sectionHelpers';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  searchQuery: string;
  currentRole?: UserRole;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  searchQuery: externalSearch,
  currentRole = 'super_admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All'); // All, Boarders, Bus, Debtors
  const [sectionFilter, setSectionFilter] = useState<'All' | 'Secondary' | 'Primary'>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom class creation state in modal
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [customClassName, setCustomClassName] = useState('');

  // Default class options based on role
  const availableClassOptions =
    currentRole === 'principal'
      ? SECONDARY_CLASSES
      : currentRole === 'head_teacher'
      ? PRIMARY_CLASSES
      : [...SECONDARY_CLASSES, ...PRIMARY_CLASSES];

  // New Student Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newClassGroup, setNewClassGroup] = useState(
    currentRole === 'head_teacher' ? 'Basic 1' : 'Grade 10 A'
  );
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newIsBoarder, setNewIsBoarder] = useState(false);
  const [newIsBusEnrolled, setNewIsBusEnrolled] = useState(false);

  // Permission Check: Administrator, School Principal, Head Teacher have full access
  const hasFullAccess = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);

  const effectiveSearch = externalSearch || searchTerm;

  const filteredStudents = students.filter((std) => {
    // Role based strict section filtering
    if (currentRole === 'principal' && !isSecondaryClass(std.classGroup)) {
      return false;
    }
    if (currentRole === 'head_teacher' && !isPrimaryClass(std.classGroup)) {
      return false;
    }

    // Admin section toggle
    if (currentRole !== 'principal' && currentRole !== 'head_teacher') {
      if (sectionFilter === 'Secondary' && !isSecondaryClass(std.classGroup)) return false;
      if (sectionFilter === 'Primary' && !isPrimaryClass(std.classGroup)) return false;
    }

    const matchesSearch =
      std.firstName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      std.lastName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      std.admissionNo.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      std.parentName.toLowerCase().includes(effectiveSearch.toLowerCase());

    const matchesClass = classFilter === 'All' || std.classGroup === classFilter;

    let matchesCategory = true;
    if (categoryFilter === 'Boarders') matchesCategory = std.isBoarder;
    if (categoryFilter === 'Bus') matchesCategory = std.isBusEnrolled;
    if (categoryFilter === 'Debtors') matchesCategory = std.totalFeeDue > std.feePaid;

    return matchesSearch && matchesClass && matchesCategory;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can enrol students.');
      return;
    }
    if (!newFirstName || !newLastName) return;

    const finalClassGroup = isCustomClass && customClassName.trim() ? customClassName.trim() : newClassGroup;

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      admissionNo: `KS/2025/${Math.floor(100 + Math.random() * 900)}`,
      firstName: newFirstName,
      lastName: newLastName,
      gender: newGender,
      dob: currentRole === 'head_teacher' ? '2018-05-12' : '2008-05-12',
      classGroup: finalClassGroup,
      parentName: newParentName || 'Parent / Guardian',
      parentPhone: newParentPhone || '+234 800 000 0000',
      parentEmail: newParentEmail || `${newFirstName.toLowerCase()}@example.com`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      isBoarder: newIsBoarder,
      isBusEnrolled: newIsBusEnrolled,
      boardingHouse: newIsBoarder ? 'Queen Amina Hall - Room 04' : undefined,
      busRoute: newIsBusEnrolled ? 'Route 1 - Campus Central Shuttle' : undefined,
      status: 'Active',
      totalFeeDue: newIsBoarder ? 1600 : 1100,
      feePaid: 0,
      attendanceRate: 100,
      gpa: 3.5
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    // Reset fields
    setNewFirstName('');
    setNewLastName('');
    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');
    setNewIsBoarder(false);
    setNewIsBusEnrolled(false);
    setIsCustomClass(false);
    setCustomClassName('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFullAccess || !editingStudent) {
      alert('Access Denied: You do not have permission to edit student details.');
      return;
    }
    onUpdateStudent(editingStudent);
    if (selectedStudent?.id === editingStudent.id) {
      setSelectedStudent(editingStudent);
    }
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (!hasFullAccess || !deletingStudent) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can delete student records.');
      return;
    }
    if (onDeleteStudent) {
      onDeleteStudent(deletingStudent.id);
    }
    if (selectedStudent?.id === deletingStudent.id) {
      setSelectedStudent(null);
    }
    setDeletingStudent(null);
  };

  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';

  return (
    <div className="space-y-6">
      {/* Role Permission Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        hasFullAccess
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {hasFullAccess ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {isPrincipal ? (
                  <strong>Secondary School Principal Portal:</strong>
                ) : isHeadTeacher ? (
                  <strong>Primary School Head Teacher Portal:</strong>
                ) : (
                  <strong>Full Administrative Access:</strong>
                )}{' '}
                You have full authority to <strong>add, edit, update parent details, create classes, and delete</strong>{' '}
                {isPrincipal ? 'secondary student' : isHeadTeacher ? 'primary & nursery pupil' : 'student'} records.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Full edit, update, and delete access to student directory and parent details is reserved for <strong>Administrator, School Principal, and Head Teacher</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary School Student Directory & Parents
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Nursery Pupils Directory & Parents
              </>
            ) : (
              <>
                <Users className="h-5 w-5 text-emerald-600" /> Student Information Roster & Parent Registry
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isPrincipal
              ? 'Manage Junior Secondary (JSS 1-3) & Senior Secondary (SSS 1-3 / Grade 10-12) students, hostels, and verified parents.'
              : isHeadTeacher
              ? 'Manage Early Years (Nursery, Reception, Kindergarten, Nursery 1-2) and Primary (Basic 1 to Basic 5) pupils and parents.'
              : 'Manage whole-school student records, bus shuttle enrolment, boarding house rooms, and verified parent contacts.'}
          </p>
        </div>

        {hasFullAccess && (
          <button
            onClick={() => {
              setIsCustomClass(false);
              setCustomClassName('');
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> {isPrincipal ? 'Enrol Secondary Student' : isHeadTeacher ? 'Enrol Primary / Nursery Pupil' : 'Enrol New Student'}
          </button>
        )}
      </div>

      {/* Admin Section Tabs if not restricted by role */}
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
            All Sections ({students.length})
          </button>
          <button
            onClick={() => setSectionFilter('Secondary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              sectionFilter === 'Secondary'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> Secondary (Principal)
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

      {/* Search & Filter Matrix */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isHeadTeacher ? "Search pupil, class, parent..." : "Search student, admission no, parent..."}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdowns with Search Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 shrink-0">Class:</span>
            <DropdownWithSearch
              options={[
                { value: 'All', label: 'All Classes' },
                ...availableClassOptions.map((c) => ({ value: c, label: c }))
              ]}
              value={classFilter}
              onChange={(val) => setClassFilter(val)}
              placeholder="Select class..."
              searchPlaceholder="Filter class..."
              colorScheme="emerald"
              buttonLabel="Search"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 shrink-0">Category:</span>
            <DropdownWithSearch
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Boarders', label: 'Hostel Boarders' },
                { value: 'Bus', label: 'Bus Commuters' },
                { value: 'Debtors', label: 'Debtors (Unpaid)' }
              ]}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              placeholder="Select category..."
              searchPlaceholder="Filter category..."
              colorScheme="slate"
              buttonLabel="Filter"
            />
          </div>
        </div>

      </div>

      {/* Student Cards / Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Student Name & Admission</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Parent / Guardian Contact</th>
              <th className="py-3 px-4">Services Enrolled</th>
              <th className="py-3 px-4">Attendance & GPA</th>
              <th className="py-3 px-4">Fee Ledger Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.map((std) => {
              const isFeePaid = std.feePaid >= std.totalFeeDue;
              return (
                <tr
                  key={std.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                >
                  {/* Name & Admission */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {std.firstName} {std.lastName}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {std.admissionNo}
                      </span>
                    </div>
                  </td>

                  {/* Class Group */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {std.classGroup}
                    </span>
                  </td>

                  {/* Parent Info */}
                  <td className="py-3 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {std.parentName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {std.parentPhone}
                    </div>
                  </td>

                  {/* Services: Boarder / Bus */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {std.isBoarder && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Home className="h-3 w-3" /> Boarder
                        </span>
                      )}
                      {std.isBusEnrolled && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Bus className="h-3 w-3" /> Bus Shuttle
                        </span>
                      )}
                      {!std.isBoarder && !std.isBusEnrolled && (
                        <span className="text-[10px] text-slate-400 italic">Day Student</span>
                      )}
                    </div>
                  </td>

                  {/* Attendance & GPA */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      GPA: {std.gpa.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {std.attendanceRate}% Attendance
                    </div>
                  </td>

                  {/* Fee Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFeePaid
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {isFeePaid ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Fully Cleared
                        </>
                      ) : (
                        <>Due: ₦{(std.totalFeeDue - std.feePaid).toLocaleString()}</>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudent(std)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 text-xs transition"
                      >
                        View
                      </button>
                      
                      {hasFullAccess && (
                        <>
                          <button
                            onClick={() => setEditingStudent(std)}
                            title="Edit Student & Parent Details"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(std)}
                            title="Delete Student Record"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Admission No: {selectedStudent.admissionNo} • Class: {selectedStudent.classGroup}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                    {selectedStudent.status} Status
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 dark:bg-indigo-950 text-[10px] font-bold">
                    GPA: {selectedStudent.gpa}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Information Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Parent & Contact Details */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-emerald-600" /> Parent / Guardian Info
                  </h4>
                  {hasFullAccess && (
                    <button
                      onClick={() => {
                        setEditingStudent(selectedStudent);
                      }}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" /> Edit Details
                    </button>
                  )}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-sm">{selectedStudent.parentName}</p>
                  <p className="text-slate-500 flex items-center gap-1 mt-1 font-mono">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedStudent.parentPhone}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {selectedStudent.parentEmail || 'No email registered'}
                  </p>
                </div>
              </div>

              {/* Transportation & Residence */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bus className="h-4 w-4 text-blue-600" /> Services & Logistics
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Boarding House:</span>{' '}
                  {selectedStudent.isBoarder ? (selectedStudent.boardingHouse || 'Enrolled') : 'Day Student'}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Bus Shuttle:</span>{' '}
                  {selectedStudent.isBusEnrolled ? (selectedStudent.busRoute || 'Route 1 - Campus Central') : 'Not Enrolled'}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Fee Ledger:</span> ₦{selectedStudent.feePaid.toLocaleString()} paid of ₦{selectedStudent.totalFeeDue.toLocaleString()}
                </p>
              </div>

            </div>

            <div className="flex justify-between items-center pt-2">
              {hasFullAccess ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingStudent(selectedStudent);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Full Student Profile
                  </button>
                  <button
                    onClick={() => {
                      setDeletingStudent(selectedStudent);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Record
                  </button>
                </div>
              ) : <div />}
              
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Student & Parent Details ({editingStudent.admissionNo})
              </h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.firstName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Class Group</label>
                  <select
                    value={editingStudent.classGroup}
                    onChange={(e) => setEditingStudent({ ...editingStudent, classGroup: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {availableClassOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {!availableClassOptions.includes(editingStudent.classGroup) && (
                      <option value={editingStudent.classGroup}>{editingStudent.classGroup}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Transferred">Transferred</option>
                  </select>
                </div>
              </div>

              {/* Parent Details Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-600" /> Parent / Guardian Details
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.parentName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.parentPhone}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editingStudent.parentEmail || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentEmail: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStudent.isBoarder}
                    onChange={(e) => setEditingStudent({ ...editingStudent, isBoarder: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Boarding House Enrolment
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStudent.isBusEnrolled}
                    onChange={(e) => setEditingStudent({ ...editingStudent, isBusEnrolled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Bus Shuttle Service
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Student Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Student Record</h3>
                <p className="text-xs text-slate-500">This action will permanently delete this student record.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {deletingStudent.firstName} {deletingStudent.lastName} ({deletingStudent.admissionNo})
              </p>
              <p className="text-slate-500 mt-1">Class: {deletingStudent.classGroup} • Parent: {deletingStudent.parentName}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingStudent(null)}
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

      {/* Enrolment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" />
                {isPrincipal
                  ? `Enrol New Student to ${SECONDARY_SCHOOL_NAME}`
                  : isHeadTeacher
                  ? `Enrol New Pupil to ${PRIMARY_SCHOOL_NAME}`
                  : 'Enrol New Student to Golden Horizon Schools'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder={isHeadTeacher ? "e.g. Somto" : "e.g. Fatima"}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Adeleke"
                  />
                </div>
              </div>

              {/* Class Group Selection & Creation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Class Group Assignment
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomClass(!isCustomClass)}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {isCustomClass ? '← Choose Existing Class' : '+ Create New Class'}
                  </button>
                </div>

                {isCustomClass ? (
                  <div>
                    <input
                      type="text"
                      required={isCustomClass}
                      value={customClassName}
                      onChange={(e) => setCustomClassName(e.target.value)}
                      placeholder={
                        isPrincipal
                          ? 'e.g. SSS 1 Commercial, JSS 2 C'
                          : isHeadTeacher
                          ? 'e.g. Nursery 2 B, Basic 4 Gold, Playgroup'
                          : 'Enter custom class name...'
                      }
                      className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      This will create and assign this new class in the {isPrincipal ? 'Secondary' : isHeadTeacher ? 'Primary' : 'School'} roster.
                    </span>
                  </div>
                ) : (
                  <DropdownWithSearch
                    options={availableClassOptions.map((c) => ({ value: c, label: c }))}
                    value={newClassGroup}
                    onChange={(val) => setNewClassGroup(val)}
                    placeholder="Select class..."
                    searchPlaceholder="Search class..."
                    colorScheme="emerald"
                    buttonLabel="Select"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                  <DropdownWithSearch
                    options={[
                      { value: 'Female', label: 'Female' },
                      { value: 'Male', label: 'Male' }
                    ]}
                    value={newGender}
                    onChange={(val) => setNewGender(val as any)}
                    placeholder="Select gender..."
                    searchPlaceholder="Search gender..."
                    colorScheme="emerald"
                    buttonLabel="Select"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Parent / Guardian Details</label>
                <input
                  type="text"
                  placeholder="Parent Full Name"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Parent Phone Number"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                  <input
                    type="email"
                    placeholder="Parent Email"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsBoarder}
                    onChange={(e) => setNewIsBoarder(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Enrol in Boarding House
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsBusEnrolled}
                    onChange={(e) => setNewIsBusEnrolled(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Enrol in Bus Shuttle Service
                </label>
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Submit Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
