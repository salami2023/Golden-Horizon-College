import React, { useState } from 'react';
import {
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccessReset?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccessReset
}) => {
  const { requestPasswordReset, resetPasswordWithCode } = useAuth();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.trim()) {
      setError('Please enter your registered email address (username).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccessMsg(res.message);
        if (res.resetCode) {
          setGeneratedCode(res.resetCode);
          setResetCode(res.resetCode); // Pre-fill for easy testing
        }
        setStep('verify');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!resetCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithCode(email, resetCode, newPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (onSuccessReset) onSuccessReset(email);
          onClose();
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Reset Account Password</h3>
              <p className="text-[11px] text-blue-100/90 mt-0.5">
                {step === 'request'
                  ? 'A password reset link and code will be sent to your email'
                  : 'Verify your code and establish your new password'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleSendReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Registered Email (Username)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tpapyconsults@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Enter the email associated with your Pioneer, Admin, or Head Teacher account.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  {isLoading ? 'Sending Reset Email...' : 'Send Password Reset Link'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleApplyReset} className="space-y-3.5">
              {generatedCode && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                  <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    <span>Email Dispatch Simulation</span>
                    <span className="text-[10px] bg-blue-200 dark:bg-blue-900 px-1.5 py-0.5 rounded">Inbox</span>
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    To: <span className="font-semibold">{email}</span>
                  </p>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Security Reset PIN:</span>
                      <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 tracking-wider">
                        {generatedCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Valid for 30 mins</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold text-center tracking-widest rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  ← Resend Email
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isLoading ? 'Resetting Password...' : 'Save & Log In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
