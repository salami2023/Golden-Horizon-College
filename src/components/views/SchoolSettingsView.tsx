import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  School,
  GraduationCap,
  Award,
  ShieldCheck,
  Check,
  Lock,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { SchoolSettings, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface SchoolSettingsViewProps {
  settings?: SchoolSettings;
  onUpdateSettings?: (settings: Partial<SchoolSettings>) => void;
  currentRole?: UserRole;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentRole = 'super_admin'
}) => {
  const [schoolName, setSchoolName] = useState(settings?.schoolName || 'KwikSchools International Academy');
  const [motto, setMotto] = useState(settings?.motto || 'Excellence in Knowledge, Innovation & Character');
  const [academicSession, setAcademicSession] = useState(settings?.academicSession || '2025/2026 Academic Session');
  const [currentTerm, setCurrentTerm] = useState(settings?.currentTerm || '2nd Term');
  const [principalName, setPrincipalName] = useState(settings?.principalName || 'Dr. Elizabeth Sterling');
  const [isSaved, setIsSaved] = useState(false);

  // RBAC Permission Check: Administrator, School Principal and Head Teacher have full access to school setup
  const canManageSetup = [
    'super_admin',
    'pioneer',
    'principal',
    'head_teacher'
  ].includes(currentRole);

  useEffect(() => {
    if (settings) {
      setSchoolName(settings.schoolName);
      setMotto(settings.motto);
      setAcademicSession(settings.academicSession);
      setCurrentTerm(settings.currentTerm);
      setPrincipalName(settings.principalName);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSetup) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can modify school setup.');
      return;
    }
    if (onUpdateSettings) {
      onUpdateSettings({
        schoolName,
        motto,
        academicSession,
        currentTerm,
        principalName
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        canManageSetup
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canManageSetup ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Executive Setup Authority Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with full access to modify school setup, academic terms, grading systems, and institutional profile.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Read-Only Configuration Mode:</strong> School setup modification is restricted to <strong>Administrator, School Principal, and Head Teacher</strong>.
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
            <Settings className="h-5 w-5 text-emerald-600" /> KwikSchools System Setup & Configuration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure academic term parameters, grading scales, principal credentials, and official letterheads.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" /> School configuration updated and synchronized across all portals!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* School Profile Section */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <School className="h-4 w-4 text-emerald-600" /> Institution Profile & Letterhead
          </h3>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Official School Name</label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold disabled:opacity-60"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">School Motto</label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Principal / Headmaster Name</label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Academic Calendar Configuration */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GraduationCap className="h-4 w-4 text-emerald-600" /> Academic Session & Term Config
          </h3>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Academic Session</label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Active Term</label>
            <DropdownWithSearch
              disabled={!canManageSetup}
              options={[
                { value: '1st Term', label: '1st Term', sublabel: 'Autumn / Michaelmas', badge: '1st Term' },
                { value: '2nd Term', label: '2nd Term', sublabel: 'Spring / Lent (Current)', badge: '2nd Term' },
                { value: '3rd Term', label: '3rd Term', sublabel: 'Summer / Trinity', badge: '3rd Term' }
              ]}
              value={currentTerm}
              onChange={(val) => setCurrentTerm(val)}
              placeholder="Select active term..."
              searchPlaceholder="Search term..."
              colorScheme="emerald"
              buttonLabel="Term"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grading System</label>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">WAEC / Cambridge 5-tier (A1 - F9)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Standard</span>
            </div>
          </div>
        </div>

        {canManageSetup && (
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save School Configuration
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
