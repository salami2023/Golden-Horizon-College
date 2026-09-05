/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  SchoolThemeConfig,
  Student,
  Teacher,
  Invoice,
  PaymentTransaction,
  StudentReportCard,
  CBTExam,
  TimetableSlot,
  HomeworkAssignment,
  BusRoute,
  HostelRoom,
  BroadcastLog,
  SchoolSettings
} from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_FEE_ITEMS } from './data/mockSchoolData';

import { RealTimeProvider, useRealTime } from './context/RealTimeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { PasswordSetupModal } from './components/modals/PasswordSetupModal';

import { LoginView } from './components/views/LoginView';
import { AccountSetupView } from './components/views/AccountSetupView';
import { DashboardOverview } from './components/views/DashboardOverview';
import { ClassesView } from './components/views/ClassesView';
import { SubjectManagementView } from './components/views/SubjectManagementView';
import { StudentManagement } from './components/views/StudentManagement';
import { StaffManagement } from './components/views/StaffManagement';
import { AcademicsReportCards } from './components/views/AcademicsReportCards';
import { CBTExamManager } from './components/views/CBTExamManager';
import { FinanceDashboard } from './components/views/FinanceDashboard';
import { AttendanceTracker } from './components/views/AttendanceTracker';
import { ParentPortalView } from './components/views/ParentPortalView';
import { SchoolSettingsView } from './components/views/SchoolSettingsView';
import { TimetableScheduleView } from './components/views/TimetableScheduleView';
import { HomeworkAssignmentsView } from './components/views/HomeworkAssignmentsView';
import { TransportHostelView } from './components/views/TransportHostelView';
import { CommunicationCenterView } from './components/views/CommunicationCenterView';
import { AuditLogsView } from './components/views/AuditLogsView';

function AppContent() {
  const {
    students,
    teachers,
    invoices,
    transactions,
    reportCards,
    cbtExams,
    timetable,
    homeworkList,
    busRoutes,
    hostels,
    broadcasts,
    attendance,
    schoolSettings,
    themeConfig,
    auditLogs,
    connectedPeers,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addReportCard,
    updateReportCard,
    deleteReportCard,
    markAttendance,
    markBatchAttendance,
    addTransaction,
    deleteTransaction,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addBusRoute,
    updateBusRoute,
    deleteBusRoute,
    addHostel,
    updateHostel,
    deleteHostel,
    addCBTExam,
    updateCBTExam,
    deleteCBTExam,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    addHomework,
    updateHomework,
    deleteHomework,
    sendBroadcast,
    deleteBroadcast,
    updateSchoolSettings,
    updateThemeConfig,
    refreshState,
    currentRole,
    setCurrentRole
  } = useRealTime();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // If head_teacher tries to view timetable, redirect to dashboard
  useEffect(() => {
    if (currentRole === 'head_teacher' && activeTab === 'timetable') {
      setActiveTab('dashboard');
    }
  }, [currentRole, activeTab]);

  // If role is not authorized for classes management, redirect to dashboard
  useEffect(() => {
    const isClassesAuthorized = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);
    if (!isClassesAuthorized && activeTab === 'classes') {
      setActiveTab('dashboard');
    }
  }, [currentRole, activeTab]);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (themeConfig.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeConfig.mode]);

  // Real-time mutator proxies attaching active role
  const actor = { role: currentRole, name: currentRole.toUpperCase() };

  const {
    currentUser,
    isPasswordSetupOpen,
    setIsPasswordSetupOpen,
    registerOrSyncTeacherAccount,
    deleteTeacherAccount,
    syncTeachersWithUsers
  } = useAuth();

  // Automatically keep all registered teachers synchronized with the authentication directory
  useEffect(() => {
    if (teachers && teachers.length > 0) {
      syncTeachersWithUsers(teachers);
    }
  }, [teachers, syncTeachersWithUsers]);

  // Synchronize currentRole with logged-in user role
  useEffect(() => {
    if (currentUser?.role && currentUser.role !== currentRole) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser?.role, setCurrentRole, currentRole]);

  // If no user is authenticated, render the dedicated Login Page
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['${themeConfig.fontFamily}'] transition-colors duration-200`}
    >
      {/* Top Header Navbar with Live Real-Time Synced Badge & Role Switcher */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        themeConfig={themeConfig}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onSearch={setGlobalSearch}
        onSelectTab={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible KwikSchools Sidebar with RBAC for Pioneer, Administrator, Principal, Head Teacher, etc. */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          themeConfig={themeConfig}
        />

        {/* Main Content Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div
            className={`mx-auto transition-all duration-200 ${
              themeConfig.containerWidth === 'boxed' ? 'max-w-7xl' : 'w-full'
            }`}
          >
            {activeTab === 'dashboard' && (
              <DashboardOverview
                students={students}
                teachers={teachers}
                invoices={invoices}
                cbtExams={cbtExams}
                announcements={INITIAL_ANNOUNCEMENTS}
                onNavigate={setActiveTab}
                currentRole={currentRole}
                schoolSettings={schoolSettings}
              />
            )}

            {activeTab === 'classes' && (
              <ClassesView
                currentRole={currentRole}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectManagementView
                currentRole={currentRole}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagement
                students={students}
                onAddStudent={(s) => addStudent(s, actor)}
                onUpdateStudent={(s) => updateStudent(s, actor)}
                onDeleteStudent={(id) => deleteStudent(id, actor)}
                currentRole={currentRole}
                searchQuery={globalSearch}
              />
            )}

            {activeTab === 'staff' && (
              <StaffManagement
                teachers={teachers}
                onAddTeacher={(t) => {
                  addTeacher(t, actor);
                  registerOrSyncTeacherAccount(t);
                }}
                onUpdateTeacher={(t) => {
                  updateTeacher(t, actor);
                  registerOrSyncTeacherAccount(t);
                }}
                onDeleteTeacher={(id) => {
                  deleteTeacher(id, actor);
                  deleteTeacherAccount(id);
                }}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'academics' && (
              <AcademicsReportCards
                reportCards={reportCards}
                students={students}
                onAddReportCard={(rc) => addReportCard(rc, actor)}
                onUpdateReportCard={(rc) => updateReportCard(rc, actor)}
                onDeleteReportCard={(id) => deleteReportCard(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'cbt' && (
              <CBTExamManager
                exams={cbtExams}
                onAddExam={(e) => addCBTExam(e, actor)}
                onUpdateExam={(e) => updateCBTExam(e, actor)}
                onDeleteExam={(id) => deleteCBTExam(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableScheduleView
                timetable={timetable}
                onAddSlot={(s) => addTimetableSlot(s, actor)}
                onUpdateSlot={(s) => updateTimetableSlot(s, actor)}
                onDeleteSlot={(id) => deleteTimetableSlot(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'homework' && (
              <HomeworkAssignmentsView
                homeworkList={homeworkList}
                onAddHomework={(hw) => addHomework(hw, actor)}
                onUpdateHomework={(hw) => updateHomework(hw, actor)}
                onDeleteHomework={(id) => deleteHomework(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'transport_hostel' && (
              <TransportHostelView
                busRoutes={busRoutes}
                hostels={hostels}
                onAddBusRoute={(r) => addBusRoute(r, actor)}
                onUpdateBusRoute={(r) => updateBusRoute(r, actor)}
                onDeleteBusRoute={(id) => deleteBusRoute(id, actor)}
                onAddHostel={(h) => addHostel(h, actor)}
                onUpdateHostel={(h) => updateHostel(h, actor)}
                onDeleteHostel={(id) => deleteHostel(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'communication' && (
              <CommunicationCenterView
                broadcasts={broadcasts}
                onSendBroadcast={(bc) => sendBroadcast(bc, actor)}
                onDeleteBroadcast={(id) => deleteBroadcast(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceDashboard
                invoices={invoices}
                transactions={transactions}
                feeItems={INITIAL_FEE_ITEMS}
                students={students}
                onAddTransaction={(tx) => addTransaction(tx, actor)}
                onDeleteTransaction={(id) => deleteTransaction(id, actor)}
                onAddInvoice={(inv) => addInvoice(inv, actor)}
                onDeleteInvoice={(id) => deleteInvoice(id, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceTracker
                students={students}
                attendanceState={attendance}
                onMarkAttendance={(date, sId, st) => markAttendance(date, sId, st, actor)}
                onBatchMarkAttendance={(date, cls, batch) => markBatchAttendance(date, cls, batch, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'parent_portal' && (
              <ParentPortalView
                students={students}
                reportCards={reportCards}
                invoices={invoices}
                onUpdateStudent={(s) => updateStudent(s, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'audit_logs' && (
              <AuditLogsView
                auditLogs={auditLogs}
                connectedPeers={connectedPeers}
                currentRole={currentRole}
                onRefresh={refreshState}
              />
            )}

            {activeTab === 'settings' && (
              <SchoolSettingsView
                settings={schoolSettings}
                onUpdateSettings={(s) => updateSchoolSettings(s, actor)}
                currentRole={currentRole}
              />
            )}

            {activeTab === 'account_setup' && (
              <AccountSetupView />
            )}
          </div>
        </main>
      </div>

      {/* Theme & Layout Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={themeConfig}
        onChangeConfig={(cfg) => updateThemeConfig(cfg, actor)}
      />

      {/* Mandatory / On-Demand Password Setup Modal */}
      <PasswordSetupModal
        isOpen={isPasswordSetupOpen}
        onClose={() => setIsPasswordSetupOpen(false)}
        isMandatory={currentUser ? !currentUser.hasSetPassword : false}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RealTimeProvider>
        <AppContent />
      </RealTimeProvider>
    </AuthProvider>
  );
}
