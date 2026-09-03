import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  BookOpen,
  User,
  MapPin,
  Download,
  Sparkles,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { TimetableSlot, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface TimetableScheduleViewProps {
  timetable: TimetableSlot[];
  onAddSlot?: (slot: TimetableSlot) => void;
  onUpdateSlot?: (slot: TimetableSlot) => void;
  onDeleteSlot?: (slotId: string) => void;
  currentRole?: UserRole;
}

export const TimetableScheduleView: React.FC<TimetableScheduleViewProps> = ({
  timetable,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  currentRole = 'principal'
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Grade 10 A');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // RBAC Permission Check: Principal, Super Admin, Pioneer have permission to edit/update timetable
  const canManageTimetable = ['super_admin', 'pioneer', 'principal'].includes(currentRole);

  const [newSubject, setNewSubject] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newTime, setNewTime] = useState('11:15 AM - 12:00 PM');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const classes = ['Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Science'];

  const filteredSlots = timetable.filter(
    (item) => item.classGroup === selectedClass && item.day === selectedDay
  );

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageTimetable) {
      alert('Access Denied: Only the School Principal has authority to modify the master timetable.');
      return;
    }
    if (!newSubject || !newTeacher) return;

    const slot: TimetableSlot = {
      id: `tt-${Date.now()}`,
      day: selectedDay as any,
      periodTime: newTime,
      classGroup: selectedClass,
      subject: newSubject,
      teacherName: newTeacher,
      roomNo: newRoom || 'Room 101'
    };

    if (onAddSlot) onAddSlot(slot);
    setNewSubject('');
    setNewTeacher('');
    setNewRoom('');
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageTimetable || !editingSlot) return;
    if (onUpdateSlot) onUpdateSlot(editingSlot);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    if (!canManageTimetable) return;
    if (window.confirm('Delete this timetable period slot?')) {
      if (onDeleteSlot) onDeleteSlot(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        canManageTimetable
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canManageTimetable ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Principal Timetable Authority Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with master timetable editing and slot reallocation privileges.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Read-Only View:</strong> School master timetable scheduling is reserved for the <strong>School Principal</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Calendar className="h-3.5 w-3.5 text-blue-600" /> Master Schedule
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            School Timetable & Class Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            2025/2026 Academic Session • Term 2 Weekly Master Schedule.
          </p>
        </div>

        {canManageTimetable && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" /> Add Period Slot
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar with Dropdown and Search Button */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-blue-600" /> Class:
            </span>
            <DropdownWithSearch
              options={classes.map((cls) => ({
                value: cls,
                label: cls,
                badge: cls.includes('10') ? 'Senior 1' : cls.includes('11') ? 'Senior 2' : 'Senior 3'
              }))}
              value={selectedClass}
              onChange={(val) => setSelectedClass(val)}
              placeholder="Select class..."
              searchPlaceholder="Search timetable class..."
              colorScheme="blue"
              buttonLabel="Search Class"
            />
          </div>

          {/* Day Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">Day:</span>
            <DropdownWithSearch
              options={days.map((day) => ({
                value: day,
                label: day
              }))}
              value={selectedDay}
              onChange={(val) => setSelectedDay(val)}
              placeholder="Select day..."
              searchPlaceholder="Filter day..."
              colorScheme="slate"
              buttonLabel="Select Day"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>Showing <strong>{filteredSlots.length}</strong> scheduled periods</span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
              <th className="py-3.5 px-4">Period Time</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Assigned Educator</th>
              <th className="py-3.5 px-4">Classroom / Lab</th>
              {canManageTimetable && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {slot.periodTime}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                      {slot.subject}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {slot.teacherName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {slot.roomNo}
                    </div>
                  </td>
                  {canManageTimetable && (
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingSlot(slot)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                          title="Edit Slot"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                          title="Delete Slot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManageTimetable ? 5 : 4} className="py-8 text-center text-slate-400">
                  No periods scheduled for {selectedClass} on {selectedDay}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Period Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> Add Period Slot
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Further Mathematics"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Educator Name</label>
                <input
                  type="text"
                  required
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  placeholder="e.g. Dr. Adeyemi Adeleke"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Period Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Lab 201"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Schedule Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Period Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Timetable Period
              </h3>
              <button onClick={() => setEditingSlot(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={editingSlot.subject}
                  onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Educator Name</label>
                <input
                  type="text"
                  required
                  value={editingSlot.teacherName}
                  onChange={(e) => setEditingSlot({ ...editingSlot, teacherName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Period Time</label>
                  <input
                    type="text"
                    value={editingSlot.periodTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, periodTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={editingSlot.roomNo}
                    onChange={(e) => setEditingSlot({ ...editingSlot, roomNo: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
