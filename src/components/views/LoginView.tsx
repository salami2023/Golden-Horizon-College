import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Phone,
  User,
  Sparkles,
  School,
  Calendar,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealTime } from '../../context/RealTimeContext';
import { ForgotPasswordModal } from '../modals/ForgotPasswordModal';
import { PasswordSetupModal } from '../modals/PasswordSetupModal';
import { DEFAULT_SCHOOL_LOGO_DATA_URI } from '../../assets/schoolAssets';

export const LoginView: React.FC = () => {
  const { login, users, isPasswordSetupOpen, setIsPasswordSetupOpen, currentUser, syncTeachersWithUsers } = useAuth();
  const { schoolSettings, teachers } = useRealTime();

  // Automatically keep all registered teachers synced into user accounts directory
  useEffect(() => {
    if (teachers && teachers.length > 0) {
      syncTeachersWithUsers(teachers);
    }
  }, [teachers, syncTeachersWithUsers]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Quick fill helper for the pre-configured accounts
  const handleSelectAccount = (accountEmail: string) => {
    setEmail(accountEmail);
    const targetUser = users.find((u) => u.email.toLowerCase() === accountEmail.toLowerCase());
    if (targetUser) {
      if (!targetUser.hasSetPassword) {
        setPassword('');
        setInfoMessage(
          `Account for ${targetUser.name} selected. Default password is empty. Click "Sign In" to proceed to set up your password.`
        );
        setErrorMessage(null);
      } else {
        setPassword('');
        setInfoMessage(`Account for ${targetUser.name} selected. Please enter your configured password.`);
        setErrorMessage(null);
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email username.');
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresPasswordSetup) {
        setInfoMessage(result.message || 'Please establish your account password to continue.');
      }
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Top Header Brand */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md p-1.5 flex items-center justify-center border border-white/20">
            <img
              src={schoolSettings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI}
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block">
              {schoolSettings?.schoolName || 'Golden Horizon College & Primary'}
            </span>
            <span className="text-[11px] text-blue-200/80 font-medium">
              Official Executive, Faculty & Administrative Portal
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] text-blue-200">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{schoolSettings?.academicSession || '2026/2027'} • {schoolSettings?.currentTerm || '1st Term'}</span>
        </div>
      </div>

      {/* Center Stage: Login Form & Registered Credentials */}
      <div className="max-w-5xl mx-auto w-full py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Sign In Form Box */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/95 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200/80 dark:border-slate-800/90 backdrop-blur-xl">
            
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-200 dark:border-blue-900/40">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Secure Staff Access</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Sign In to School Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your registered email as username. Default password for new accounts is empty.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span>{infoMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Username / Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address (Username)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tpapyconsults@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (leave empty if first login)"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5">
                  * Default password is empty. Leave blank to establish your password upon login.
                </p>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>First-time setup workflow enabled</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
              </span>
            </div>

          </div>

          {/* Right Column: Pre-Provisioned Accounts Tray */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-white">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-blue-400" />
                Provisioned User Accounts
              </h2>
              <p className="text-[11.5px] text-slate-300 leading-relaxed mb-4">
                Click any account card below to auto-fill the login form. Default password for each is empty; users set their custom password on first login.
              </p>

              <div className="space-y-2.5">
                
                {/* Pioneer Card */}
                <button
                  type="button"
                  onClick={() => handleSelectAccount('tpapyconsults@gmail.com')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                    email.toLowerCase() === 'tpapyconsults@gmail.com'
                      ? 'bg-blue-600/30 border-blue-400 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Pioneer (Master)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {users.find((u) => u.email === 'tpapyconsults@gmail.com')?.hasSetPassword
                        ? 'Password Configured'
                        : 'Default Empty Password'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">SHITTU SANNY Bolaji Muhamad</p>
                  <p className="text-[11px] text-blue-200 mt-0.5 font-mono">
                    tpapyconsults@gmail.com
                  </p>
                  <p className="text-[10.5px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    +234-8140121575 / +22997137120
                  </p>
                </button>

                {/* Administrator Cards (Dynamic: Default & Pioneer-Delegated) */}
                {users
                  .filter((u) => u.role === 'super_admin')
                  .map((admin) => (
                    <button
                      key={admin.id || admin.email}
                      type="button"
                      onClick={() => handleSelectAccount(admin.email)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        email.toLowerCase() === admin.email.toLowerCase()
                          ? 'bg-blue-600/30 border-blue-400 shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          Administrator
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {admin.hasSetPassword
                            ? 'Password Configured'
                            : 'Default Empty Password'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white">{admin.name}</p>
                      <p className="text-[11px] text-blue-200 mt-0.5 font-mono">
                        {admin.email}
                      </p>
                      {admin.phone && (
                        <p className="text-[10.5px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {admin.phone}
                        </p>
                      )}
                    </button>
                  ))}

                {/* Head Teacher Card */}
                <button
                  type="button"
                  onClick={() => handleSelectAccount('danzoomowunmi@gmail.com')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                    email.toLowerCase() === 'danzoomowunmi@gmail.com'
                      ? 'bg-blue-600/30 border-blue-400 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      Head Teacher (Primary)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {users.find((u) => u.email === 'danzoomowunmi@gmail.com')?.hasSetPassword
                        ? 'Password Configured'
                        : 'Default Empty Password'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">Danzo Sonate Omowunmi</p>
                  <p className="text-[11px] text-blue-200 mt-0.5 font-mono">
                    danzoomowunmi@gmail.com
                  </p>
                  <p className="text-[10.5px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    08028186395
                  </p>
                </button>

                {/* Registered Teaching Staff Section */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      Teaching Staff ({users.filter((u) => u.role === 'teacher').length})
                    </span>
                    <span className="text-[9.5px] text-slate-400">Added in Staff Page</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {users
                      .filter((u) => u.role === 'teacher')
                      .map((tchUser) => (
                        <button
                          key={tchUser.id}
                          type="button"
                          onClick={() => handleSelectAccount(tchUser.email)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 ${
                            email.toLowerCase() === tchUser.email.toLowerCase()
                              ? 'bg-blue-600/30 border-blue-400 shadow-md'
                              : 'bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              Teacher
                            </span>
                            <span className="text-[9.5px] text-slate-400">
                              {tchUser.hasSetPassword ? 'Password Configured' : 'Default Empty Password'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white truncate">{tchUser.name}</p>
                          <p className="text-[11px] text-blue-200 font-mono truncate">{tchUser.email}</p>
                          {tchUser.phone && (
                            <p className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              {tchUser.phone}
                            </p>
                          )}
                        </button>
                      ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-900/30 border border-blue-700/40 text-[11px] text-blue-200">
              <span className="font-semibold text-white">Notice:</span> Password resets are dispatched directly to the email registered as username.
            </div>

          </div>

        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-6xl mx-auto w-full text-center py-2 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Golden Horizon College (Secondary) & Golden Horizon Nursery & Primary School. All rights reserved.
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
        onSuccessReset={(resetEmail) => {
          setEmail(resetEmail);
          setInfoMessage(`Password reset successfully for ${resetEmail}! You can now sign in with your new password.`);
        }}
      />

      {/* Mandatory Password Setup Modal on first login */}
      <PasswordSetupModal
        isOpen={isPasswordSetupOpen}
        onClose={() => setIsPasswordSetupOpen(false)}
        isMandatory={currentUser ? !currentUser.hasSetPassword : false}
      />

    </div>
  );
};
