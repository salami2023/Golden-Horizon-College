import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, UserRole, Teacher } from '../types';
import { INITIAL_USER_ACCOUNTS } from '../data/mockUsers';

interface LoginResult {
  success: boolean;
  requiresPasswordSetup?: boolean;
  message?: string;
  user?: UserAccount;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (email: string, password?: string) => LoginResult;
  logout: () => void;
  setupPassword: (userId: string, newPassword: string, newPhone?: string) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; resetCode?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (userId: string, updates: Partial<UserAccount>) => Promise<void>;
  registerOrSyncTeacherAccount: (teacher: Teacher) => UserAccount;
  deleteTeacherAccount: (teacherIdOrEmail: string) => void;
  syncTeachersWithUsers: (teachers: Teacher[]) => void;
  addAdminUser: (admin: { name: string; email: string; phone?: string; temporaryPassword?: string }) => { success: boolean; message: string; user?: UserAccount };
  addLeadershipUser: (leader: {
    name: string;
    email: string;
    phone?: string;
    role: 'super_admin' | 'principal' | 'head_teacher' | 'finance';
    temporaryPassword?: string;
  }) => { success: boolean; message: string; user?: UserAccount };
  removeAdminUser: (userIdOrEmail: string) => { success: boolean; message: string };
  deleteLeadershipUser: (userIdOrEmail: string) => { success: boolean; message: string };
  updateAdminUser: (userId: string, updates: Partial<UserAccount>) => { success: boolean; message: string };
  isPasswordSetupOpen: boolean;
  setIsPasswordSetupOpen: (open: boolean) => void;
  setCurrentUserRole: (role: UserRole) => void;
}

const USERS_STORAGE_KEY = 'golden_horizon_users_accounts_v2';
const ACTIVE_SESSION_STORAGE_KEY = 'golden_horizon_active_session_v2';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users from localStorage or fall back to INITIAL_USER_ACCOUNTS
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed: UserAccount[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initial accounts if missing (e.g. ensure pioneer, admin, head teacher exist)
          const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()));
          const missingDefaults = INITIAL_USER_ACCOUNTS.filter(
            (def) => !existingEmails.has(def.email.toLowerCase())
          );
          return [...parsed, ...missingDefaults];
        }
      }
    } catch (err) {
      console.warn('Failed to load users from localStorage:', err);
    }
    return INITIAL_USER_ACCOUNTS;
  });

  // Load active session from localStorage
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const activeStored = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (activeStored) {
        const parsedUser: UserAccount = JSON.parse(activeStored);
        if (parsedUser && parsedUser.id) {
          return parsedUser;
        }
      }
    } catch (err) {
      console.warn('Failed to restore active auth session:', err);
    }
    return null;
  });

  const [isPasswordSetupOpen, setIsPasswordSetupOpen] = useState(false);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.warn('Failed to persist users to localStorage:', err);
    }
  }, [users]);

  // Sync active user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Failed to persist active session:', err);
    }
  }, [currentUser]);

  // Login implementation
  const login = useCallback(
    (email: string, password = ''): LoginResult => {
      const normalizedEmail = email.trim().toLowerCase();
      let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      // If user not found in in-memory users, check if a teacher exists in localStorage school database
      if (!user) {
        try {
          const rawDb = localStorage.getItem('golden_horizon_school_db_master_v2');
          if (rawDb) {
            const parsedDb = JSON.parse(rawDb);
            const foundTeacher: Teacher | undefined = parsedDb?.teachers?.find(
              (t: Teacher) => t.email && t.email.trim().toLowerCase() === normalizedEmail
            );
            if (foundTeacher) {
              const newTeacherUser: UserAccount = {
                id: `usr-tch-${foundTeacher.id}`,
                teacherId: foundTeacher.id,
                name: foundTeacher.name,
                email: foundTeacher.email.trim(),
                phone: foundTeacher.phone || '+234 800 000 0000',
                role: 'teacher',
                password: '',
                hasSetPassword: false,
                avatar: foundTeacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
                createdAt: new Date().toISOString()
              };
              setUsers((prev) => [newTeacherUser, ...prev]);
              user = newTeacherUser;
            }
          }
        } catch (e) {
          console.warn('Error querying fallback teacher in database:', e);
        }
      }

      if (!user) {
        return {
          success: false,
          message: 'No account registered with this email username. Please check your spelling or contact your administrator.'
        };
      }

      // Check if user has set a password yet
      if (!user.hasSetPassword) {
        // Default password is empty
        const updatedUser: UserAccount = {
          ...user,
          lastLoginAt: new Date().toISOString()
        };

        // Update user state
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
        setCurrentUser(updatedUser);
        setIsPasswordSetupOpen(true);

        return {
          success: true,
          requiresPasswordSetup: true,
          message: `Welcome ${user.name}! Your account has a default empty password. Please set your private password to proceed.`,
          user: updatedUser
        };
      }

      // User already set a password -> verify password
      if (user.password === password) {
        const updatedUser: UserAccount = {
          ...user,
          lastLoginAt: new Date().toISOString()
        };

        setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
        setCurrentUser(updatedUser);

        return {
          success: true,
          requiresPasswordSetup: false,
          message: `Welcome back, ${user.name}!`,
          user: updatedUser
        };
      } else {
        return {
          success: false,
          message: 'Incorrect password entered. If you have forgotten your password, click "Forgot Password" to receive a reset code.'
        };
      }
    },
    [users]
  );

  // Logout implementation
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsPasswordSetupOpen(false);
  }, []);

  // Setup / change password implementation
  const setupPassword = useCallback(
    async (userId: string, newPassword: string, newPhone?: string) => {
      if (!newPassword || newPassword.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters long.' };
      }

      let updatedTargetUser: UserAccount | null = null;

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const updated: UserAccount = {
              ...u,
              password: newPassword,
              hasSetPassword: true,
              phone: newPhone !== undefined && newPhone.trim() !== '' ? newPhone.trim() : u.phone
            };
            updatedTargetUser = updated;
            return updated;
          }
          return u;
        })
      );

      if (updatedTargetUser) {
        setCurrentUser(updatedTargetUser);
      }
      setIsPasswordSetupOpen(false);

      return {
        success: true,
        message: 'Your account password has been successfully established and saved!'
      };
    },
    []
  );

  // Forgot password implementation (dispatches reset code)
  const requestPasswordReset = useCallback(
    async (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return {
          success: false,
          message: 'No account was found with the specified email username.'
        };
      }

      // Generate a 6-digit security code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                resetToken: resetCode,
                resetTokenExpiry: expiry
              }
            : u
        )
      );

      return {
        success: true,
        message: `A password reset link and verification code have been dispatched to ${user.email}.`,
        resetCode
      };
    },
    [users]
  );

  // Reset password using the code
  const resetPasswordWithCode = useCallback(
    async (email: string, code: string, newPassword: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return { success: false, message: 'Account not found.' };
      }

      if (!user.resetToken || user.resetToken !== code.trim()) {
        return { success: false, message: 'Invalid or expired verification code. Please request a new one.' };
      }

      if (user.resetTokenExpiry && new Date(user.resetTokenExpiry).getTime() < Date.now()) {
        return { success: false, message: 'This reset code has expired. Please request a new reset code.' };
      }

      if (!newPassword || newPassword.length < 4) {
        return { success: false, message: 'New password must be at least 4 characters long.' };
      }

      const updatedUser: UserAccount = {
        ...user,
        password: newPassword,
        hasSetPassword: true,
        resetToken: undefined,
        resetTokenExpiry: undefined
      };

      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
      setCurrentUser(updatedUser);

      return {
        success: true,
        message: 'Password reset successful! You are now logged in with your new credentials.'
      };
    },
    [users]
  );

  // Update user profile
  const updateUserProfile = useCallback(async (userId: string, updates: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          return updated;
        }
        return u;
      })
    );

    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, ...updates } : prev));
  }, []);

  // Register or synchronize a teacher account when added/edited in Staff Management
  const registerOrSyncTeacherAccount = useCallback((teacher: Teacher): UserAccount => {
    const cleanEmail = (teacher.email || '').trim().toLowerCase();
    let accountToReturn: UserAccount | null = null;

    setUsers((prev) => {
      const existingIndex = prev.findIndex(
        (u) =>
          (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
          (u.teacherId && u.teacherId === teacher.id) ||
          u.id === `usr-tch-${teacher.id}`
      );

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updated: UserAccount = {
          ...existing,
          name: teacher.name,
          email: teacher.email.trim(),
          phone: teacher.phone || existing.phone,
          teacherId: teacher.id,
          avatar: teacher.avatar || existing.avatar,
          role: existing.role === 'head_teacher' || existing.role === 'principal' ? existing.role : 'teacher'
        };
        accountToReturn = updated;
        const next = [...prev];
        next[existingIndex] = updated;
        return next;
      } else {
        const newAccount: UserAccount = {
          id: `usr-tch-${teacher.id || Date.now()}`,
          teacherId: teacher.id,
          name: teacher.name,
          email: teacher.email.trim(),
          phone: teacher.phone || '+234 800 000 0000',
          role: 'teacher',
          password: '',
          hasSetPassword: false,
          avatar: teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toISOString()
        };
        accountToReturn = newAccount;
        return [newAccount, ...prev];
      }
    });

    return (
      accountToReturn || {
        id: `usr-tch-${teacher.id}`,
        teacherId: teacher.id,
        name: teacher.name,
        email: teacher.email.trim(),
        phone: teacher.phone || '+234 800 000 0000',
        role: 'teacher',
        password: '',
        hasSetPassword: false,
        createdAt: new Date().toISOString()
      }
    );
  }, []);

  // Delete associated user account when a staff member is deleted
  const deleteTeacherAccount = useCallback((teacherIdOrEmail: string) => {
    const target = (teacherIdOrEmail || '').toLowerCase().trim();
    setUsers((prev) =>
      prev.filter(
        (u) =>
          u.teacherId !== teacherIdOrEmail &&
          u.id !== `usr-tch-${teacherIdOrEmail}` &&
          u.email.toLowerCase() !== target
      )
    );
  }, []);

  // Synchronize entire teachers array with UserAccounts
  const syncTeachersWithUsers = useCallback((teachersList: Teacher[]) => {
    if (!teachersList || teachersList.length === 0) return;

    setUsers((prev) => {
      let changed = false;
      const nextUsers = [...prev];

      teachersList.forEach((teacher) => {
        if (!teacher.email) return;
        const cleanEmail = teacher.email.trim().toLowerCase();
        const existingIndex = nextUsers.findIndex(
          (u) =>
            u.email.toLowerCase() === cleanEmail ||
            (u.teacherId && u.teacherId === teacher.id) ||
            u.id === `usr-tch-${teacher.id}`
        );

        if (existingIndex >= 0) {
          const existing = nextUsers[existingIndex];
          if (
            existing.name !== teacher.name ||
            existing.email.toLowerCase() !== cleanEmail ||
            existing.teacherId !== teacher.id
          ) {
            nextUsers[existingIndex] = {
              ...existing,
              name: teacher.name,
              email: teacher.email.trim(),
              phone: teacher.phone || existing.phone,
              teacherId: teacher.id,
              role: existing.role === 'head_teacher' || existing.role === 'principal' ? existing.role : 'teacher'
            };
            changed = true;
          }
        } else {
          const newAccount: UserAccount = {
            id: `usr-tch-${teacher.id}`,
            teacherId: teacher.id,
            name: teacher.name,
            email: teacher.email.trim(),
            phone: teacher.phone || '+234 800 000 0000',
            role: 'teacher',
            password: '',
            hasSetPassword: false,
            avatar: teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
            createdAt: new Date().toISOString()
          };
          nextUsers.push(newAccount);
          changed = true;
        }
      });

      return changed ? nextUsers : prev;
    });
  }, []);

  // Add or update leadership/administrative account (Pioneer in Pioneer Portal)
  const addLeadershipUser = useCallback(
    (leader: {
      name: string;
      email: string;
      phone?: string;
      role: 'super_admin' | 'principal' | 'head_teacher' | 'finance';
      temporaryPassword?: string;
    }): { success: boolean; message: string; user?: UserAccount } => {
      const cleanEmail = (leader.email || '').trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, message: 'Please provide a valid official email address.' };
      }
      if (!leader.name || !leader.name.trim()) {
        return { success: false, message: 'Please enter the official full name.' };
      }

      const roleLabels: Record<string, string> = {
        super_admin: 'School Administrator',
        principal: 'School Principal',
        head_teacher: 'Head Teacher',
        finance: 'Bursar / Finance Officer'
      };
      const roleName = roleLabels[leader.role] || leader.role;

      const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
      if (existingIndex >= 0) {
        const existing = users[existingIndex];
        if (existing.role === 'pioneer') {
          return {
            success: false,
            message: 'The Pioneer (Master Authority) account cannot be reassigned.'
          };
        }
        // Update existing user with the new leadership role and information
        const updatedLeader: UserAccount = {
          ...existing,
          name: leader.name.trim(),
          phone: leader.phone?.trim() || existing.phone,
          role: leader.role,
          ...(leader.temporaryPassword
            ? { password: leader.temporaryPassword, hasSetPassword: true }
            : {})
        };
        setUsers((prev) => prev.map((u) => (u.id === existing.id ? updatedLeader : u)));
        return {
          success: true,
          message: `User account "${cleanEmail}" has been updated to ${roleName}.`,
          user: updatedLeader
        };
      }

      const prefix = leader.role === 'super_admin' ? 'adm' : leader.role === 'principal' ? 'pri' : leader.role === 'head_teacher' ? 'hdt' : 'fin';
      const newLeader: UserAccount = {
        id: `usr-${prefix}-${Date.now()}`,
        name: leader.name.trim(),
        email: leader.email.trim(),
        phone: leader.phone?.trim() || '+234 800 000 0000',
        role: leader.role,
        password: leader.temporaryPassword ? leader.temporaryPassword : '',
        hasSetPassword: Boolean(leader.temporaryPassword),
        createdAt: new Date().toISOString()
      };

      setUsers((prev) => [...prev, newLeader]);
      return {
        success: true,
        message: `${roleName} "${newLeader.name}" (${newLeader.email}) added successfully.`,
        user: newLeader
      };
    },
    [users]
  );

  // Add new administrator account (by Pioneer in Pioneer Portal - delegating to addLeadershipUser)
  const addAdminUser = useCallback(
    (admin: { name: string; email: string; phone?: string; temporaryPassword?: string }): { success: boolean; message: string; user?: UserAccount } => {
      return addLeadershipUser({
        ...admin,
        role: 'super_admin'
      });
    },
    [addLeadershipUser]
  );

  // Delete leadership/administrative account (Pioneer only, cannot delete Pioneer)
  const deleteLeadershipUser = useCallback(
    (userIdOrEmail: string): { success: boolean; message: string } => {
      const target = (userIdOrEmail || '').toLowerCase().trim();
      const found = users.find((u) => u.id === userIdOrEmail || u.email.toLowerCase() === target);
      if (!found) {
        return { success: false, message: 'Official leadership account not found.' };
      }
      if (found.role === 'pioneer' || found.email.toLowerCase() === 'tpapyconsults@gmail.com') {
        return { success: false, message: 'The Pioneer (Master Authority) account cannot be removed or deleted.' };
      }

      const roleLabels: Record<string, string> = {
        super_admin: 'School Administrator',
        principal: 'School Principal',
        head_teacher: 'Head Teacher',
        finance: 'Bursar / Finance Officer',
        teacher: 'Teacher'
      };
      const roleName = roleLabels[found.role] || found.role;

      setUsers((prev) =>
        prev.filter((u) => u.id !== found.id && u.email.toLowerCase() !== found.email.toLowerCase())
      );
      return {
        success: true,
        message: `${roleName} account for ${found.name} (${found.email}) has been removed.`
      };
    },
    [users]
  );

  // Remove administrator account (delegates to deleteLeadershipUser)
  const removeAdminUser = useCallback(
    (userIdOrEmail: string): { success: boolean; message: string } => {
      return deleteLeadershipUser(userIdOrEmail);
    },
    [deleteLeadershipUser]
  );

  // Update administrator profile / status
  const updateAdminUser = useCallback(
    (userId: string, updates: Partial<UserAccount>): { success: boolean; message: string } => {
      let updated = false;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            updated = true;
            return { ...u, ...updates };
          }
          return u;
        })
      );
      return updated
        ? { success: true, message: 'Administrator profile updated.' }
        : { success: false, message: 'Administrator not found.' };
    },
    []
  );

  // For testing / role preview switcher
  const setCurrentUserRole = useCallback((role: UserRole) => {
    setCurrentUser((prev) => (prev ? { ...prev, role } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        setupPassword,
        requestPasswordReset,
        resetPasswordWithCode,
        updateUserProfile,
        registerOrSyncTeacherAccount,
        deleteTeacherAccount,
        syncTeachersWithUsers,
        addAdminUser,
        addLeadershipUser,
        removeAdminUser,
        deleteLeadershipUser,
        updateAdminUser,
        isPasswordSetupOpen,
        setIsPasswordSetupOpen,
        setCurrentUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
