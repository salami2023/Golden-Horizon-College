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
  Phone,
  Globe,
  Baby,
  ExternalLink
} from 'lucide-react';
import { SchoolSettings, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  COMBINED_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS
} from '../../utils/sectionHelpers';

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
  const [schoolName, setSchoolName] = useState(
    settings?.schoolName || COMBINED_SCHOOL_NAME
  );
  const [secondarySchoolName, setSecondarySchoolName] = useState(
    settings?.secondarySchoolName || SECONDARY_SCHOOL_NAME
  );
  const [primarySchoolName, setPrimarySchoolName] = useState(
    settings?.primarySchoolName || PRIMARY_SCHOOL_NAME
  );
  const [website, setWebsite] = useState(
    settings?.website || SCHOOL_CONTACT_DETAILS.website
  );
  const [email, setEmail] = useState(
    settings?.email || SCHOOL_CONTACT_DETAILS.emails[0]
  );
  const [altEmail, setAltEmail] = useState(
    settings?.altEmail || SCHOOL_CONTACT_DETAILS.emails[1]
  );
  const [phone, setPhone] = useState(
    settings?.phone || SCHOOL_CONTACT_DETAILS.phoneDisplay
  );
  const [motto, setMotto] = useState(
    settings?.motto || 'Excellence in Knowledge, Innovation & Character'
  );
  const [academicSession, setAcademicSession] = useState(
    settings?.academicSession || '2025/2026 Academic Session'
  );
  const [currentTerm, setCurrentTerm] = useState(
    settings?.currentTerm || '2nd Term'
  );
  const [principalName, setPrincipalName] = useState(
    settings?.principalName || 'Dr. Elizabeth Sterling'
  );
  const [headTeacherName, setHeadTeacherName] = useState(
    settings?.headTeacherName || 'Mrs. Folashade Adeleke'
  );
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
      if (settings.schoolName) setSchoolName(settings.schoolName);
      if (settings.secondarySchoolName) setSecondarySchoolName(settings.secondarySchoolName);
      if (settings.primarySchoolName) setPrimarySchoolName(settings.primarySchoolName);
      if (settings.website) setWebsite(settings.website);
      if (settings.email) setEmail(settings.email);
      if (settings.altEmail) setAltEmail(settings.altEmail);
      if (settings.phone) setPhone(settings.phone);
      if (settings.motto) setMotto(settings.motto);
      if (settings.academicSession) setAcademicSession(settings.academicSession);
      if (settings.currentTerm) setCurrentTerm(settings.currentTerm);
      if (settings.principalName) setPrincipalName(settings.principalName);
      if (settings.headTeacherName) setHeadTeacherName(settings.headTeacherName);
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
        secondarySchoolName,
        primarySchoolName,
        website,
        email,
        altEmail,
        phone,
        phoneNumbers: phone.split(',').map((p) => p.trim()).filter(Boolean),
        motto,
        academicSession,
        currentTerm,
        principalName,
        headTeacherName
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
                <strong>Executive Setup Authority Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with full authority to modify school profiles, contact information, and academic parameters.
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
            <Settings className="h-5 w-5 text-emerald-600" /> Institutional Setup & Section Profiles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure institutional identities, official contact channels, term parameters, and leadership credentials.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" /> Institutional configuration updated and synchronized across all portals!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Dual Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Secondary Section Card: Golden Horizon College */}
          <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-950 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary Section
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                College Division
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Secondary School Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={secondarySchoolName}
                onChange={(e) => setSecondarySchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-indigo-700 dark:text-indigo-300 disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official title used on WAEC/NECO records, high school reports, and student IDs.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Executive Principal Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60 font-semibold"
              />
            </div>
          </div>

          {/* Primary Section Card: Golden Horizon Nursery and Primary School */}
          <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-950 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Nursery Section
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                Early Years & Primary
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Primary School Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={primarySchoolName}
                onChange={(e) => setPrimarySchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-amber-700 dark:text-amber-300 disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official title used on primary continuous assessments, report cards, and admissions.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Head Teacher / Headmistress Name
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={headTeacherName}
                onChange={(e) => setHeadTeacherName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60 font-semibold"
              />
            </div>
          </div>

        </div>

        {/* Official Contact Details for Both Sections */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" /> Official School Contact Details (Both Sections)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official digital channels, institutional emails, and telephone helplines for Golden Horizon College & Nursery/Primary School.
              </p>
            </div>
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs transition self-start sm:self-auto"
            >
              <Globe className="h-3.5 w-3.5" /> Visit {website} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Globe className="h-3.5 w-3.5 text-blue-600" /> Official Website
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60 text-blue-600 dark:text-blue-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-emerald-600" /> Primary Official Email
              </label>
              <input
                type="email"
                disabled={!canManageSetup}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-purple-600" /> Administrative Email
              </label>
              <input
                type="email"
                disabled={!canManageSetup}
                value={altEmail}
                onChange={(e) => setAltEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Phone className="h-3.5 w-3.5 text-amber-600" /> Official Phone Numbers (Comma Separated)
            </label>
            <input
              type="text"
              disabled={!canManageSetup}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-medium disabled:opacity-60"
            />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold">Active lines:</span>
              {phone.split(',').map((num, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold border border-slate-200 dark:border-slate-700"
                >
                  {num.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Calendar & Common Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <School className="h-4 w-4 text-emerald-600" /> Combined Institutional Motto & Heading
            </h3>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Institutional Combined Heading
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shared School Motto
              </label>
              <input
                type="text"
                disabled={!canManageSetup}
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="h-4 w-4 text-emerald-600" /> Academic Session & Term Config
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
          </div>
        </div>

        {canManageSetup && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save School Configuration
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
