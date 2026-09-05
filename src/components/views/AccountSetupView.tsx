import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Shield,
  Clock,
  Sparkles,
  School,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealTime } from '../../context/RealTimeContext';

export const AccountSetupView: React.FC = () => {
  const { currentUser, setupPassword, updateUserProfile } = useAuth();
  const { schoolSettings } = useRealTime();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const calculateStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setIsProfileLoading(true);

    try {
      await updateUserProfile(currentUser.id, { name, phone });
      setProfileSuccess('Profile details successfully updated!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // If password was already set, verify current password
    if (currentUser.hasSetPassword) {
      if (!currentPassword) {
        setPasswordError('Please enter your current password.');
        return;
      }
      if (currentUser.password !== currentPassword) {
        setPasswordError('The current password entered is incorrect.');
        return;
      }
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await setupPassword(currentUser.id, newPassword, phone);
      if (res.success) {
        setPasswordSuccess(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(null), 4000);
      } else {
        setPasswordError(res.message);
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const roleBadgeInfo: Record<string, { label: string; badgeColor: string; description: string }> = {
    pioneer: {
      label: 'Pioneer Master Authority',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-300',
      description: 'Full strategic, academic, administrative, and curriculum control across both Secondary and Primary divisions.'
    },
    super_admin: {
      label: 'System Administrator',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-300',
      description: 'Comprehensive administrative oversight across all students, staff, billing, exams, and system settings.'
    },
    head_teacher: {
      label: 'Head Teacher (Primary Division)',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 border-teal-300',
      description: 'Executive academic authority over Golden Horizon Nursery and Primary School curriculum, subjects, and teachers.'
    },
    principal: {
      label: 'School Principal (Secondary Division)',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300',
      description: 'Executive academic authority over Golden Horizon College curriculum, timetable, subjects, and staff.'
    },
    teacher: {
      label: 'Academic Staff / Teacher',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300',
      description: 'Teacher gradebook, CBT exam creation, attendance, and student report card management.'
    },
    finance: {
      label: 'Bursar & Finance Officer',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-300',
      description: 'Financial ledger, school fee invoicing, payment receipts, and balance reporting.'
    }
  };

  const currentRoleInfo = roleBadgeInfo[currentUser.role] || {
    label: currentUser.role.toUpperCase(),
    badgeColor: 'bg-slate-100 text-slate-800',
    description: 'School portal user account.'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-black text-xl shadow-lg">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${currentRoleInfo.badgeColor}`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {currentUser.email} (Username)
                <span className="text-blue-400">•</span>
                <Phone className="w-3.5 h-3.5" /> {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">Account Password Status</span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                {currentUser.hasSetPassword ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Custom Password Configured
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    Default Empty Password (Action Required)
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile Details & Role Privileges */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Details Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Profile Information
              </h2>
            </div>

            {profileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username (Email Address)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={currentUser.email}
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Email is used as your username and primary login ID.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234-..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProfileLoading}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isProfileLoading ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Role Privileges Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Role & Permissions
            </h2>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentRoleInfo.label}</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {currentRoleInfo.description}
              </p>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span>Account Created:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Login:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Password & Security Setup */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  {currentUser.hasSetPassword ? 'Change Account Password' : 'Set Up Your Private Password'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentUser.hasSetPassword
                    ? 'Enter your current password, then specify your new secure password.'
                    : 'Your account was provisioned with an empty password. Please create your private password below.'}
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              
              {/* Current Password - Only required if already set */}
              {currentUser.hasSetPassword && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {currentUser.hasSetPassword ? 'New Password' : 'Create Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 4 characters"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 25
                            ? 'w-1/4 bg-rose-500'
                            : strength <= 50
                            ? 'w-2/4 bg-amber-500'
                            : strength <= 75
                            ? 'w-3/4 bg-blue-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Password Strength</span>
                      <span className="font-semibold">
                        {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                <p className="font-semibold mb-0.5">Password Security Guidelines:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
                  <li>Use at least 6 characters for optimal account protection.</li>
                  <li>Incorporate a mix of uppercase letters, numbers, and symbols.</li>
                  <li>Your password is encrypted and securely saved for future portal logins.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isPasswordLoading ? 'Updating Password...' : 'Save & Secure Account'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
