import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
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
  SchoolSettings,
  SchoolThemeConfig,
  RealTimeAuditEvent,
  ConnectedPeer,
  UserRole
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_REPORT_CARDS,
  INITIAL_CBT_EXAMS,
  INITIAL_TIMETABLE,
  INITIAL_HOMEWORK,
  INITIAL_BUS_ROUTES,
  INITIAL_HOSTELS,
  INITIAL_BROADCASTS,
  INITIAL_SCHOOL_SETTINGS
} from '../data/mockSchoolData';

interface SyncActor {
  role: UserRole;
  name: string;
}

export interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  actorRole: UserRole;
  timestamp: string;
}

interface RealTimeContextType {
  // Sync Status
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  connectedPeers: ConnectedPeer[];
  auditLogs: RealTimeAuditEvent[];
  notifications: RealTimeNotification[];
  dismissNotification: (id: string) => void;

  // Authoritative State
  students: Student[];
  teachers: Teacher[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  reportCards: StudentReportCard[];
  cbtExams: CBTExam[];
  timetable: TimetableSlot[];
  homeworkList: HomeworkAssignment[];
  busRoutes: BusRoute[];
  hostels: HostelRoom[];
  broadcasts: BroadcastLog[];
  attendance: Record<string, Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>;
  schoolSettings: SchoolSettings;
  themeConfig: SchoolThemeConfig;

  // Mutators
  addStudent: (student: Student, actor?: SyncActor) => Promise<void>;
  updateStudent: (student: Student, actor?: SyncActor) => Promise<void>;
  deleteStudent: (studentId: string, actor?: SyncActor) => Promise<void>;
  addTeacher: (teacher: Teacher, actor?: SyncActor) => Promise<void>;
  updateTeacher: (teacher: Teacher, actor?: SyncActor) => Promise<void>;
  deleteTeacher: (teacherId: string, actor?: SyncActor) => Promise<void>;
  addReportCard: (card: StudentReportCard, actor?: SyncActor) => Promise<void>;
  updateReportCard: (card: StudentReportCard, actor?: SyncActor) => Promise<void>;
  deleteReportCard: (cardId: string, actor?: SyncActor) => Promise<void>;
  markAttendance: (date: string, studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused', actor?: SyncActor) => Promise<void>;
  markBatchAttendance: (date: string, classGroup: string, batch: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }[], actor?: SyncActor) => Promise<void>;
  addTransaction: (tx: PaymentTransaction, actor?: SyncActor) => Promise<void>;
  deleteTransaction: (txId: string, actor?: SyncActor) => Promise<void>;
  addInvoice: (inv: Invoice, actor?: SyncActor) => Promise<void>;
  updateInvoice: (inv: Invoice, actor?: SyncActor) => Promise<void>;
  deleteInvoice: (invId: string, actor?: SyncActor) => Promise<void>;
  addBusRoute: (route: BusRoute, actor?: SyncActor) => Promise<void>;
  updateBusRoute: (route: BusRoute, actor?: SyncActor) => Promise<void>;
  deleteBusRoute: (routeId: string, actor?: SyncActor) => Promise<void>;
  addHostel: (hostel: HostelRoom, actor?: SyncActor) => Promise<void>;
  updateHostel: (hostel: HostelRoom, actor?: SyncActor) => Promise<void>;
  deleteHostel: (hostelId: string, actor?: SyncActor) => Promise<void>;
  addCBTExam: (exam: CBTExam, actor?: SyncActor) => Promise<void>;
  updateCBTExam: (exam: CBTExam, actor?: SyncActor) => Promise<void>;
  deleteCBTExam: (examId: string, actor?: SyncActor) => Promise<void>;
  addTimetableSlot: (slot: TimetableSlot, actor?: SyncActor) => Promise<void>;
  updateTimetableSlot: (slot: TimetableSlot, actor?: SyncActor) => Promise<void>;
  deleteTimetableSlot: (slotId: string, actor?: SyncActor) => Promise<void>;
  addHomework: (hw: HomeworkAssignment, actor?: SyncActor) => Promise<void>;
  updateHomework: (hw: HomeworkAssignment, actor?: SyncActor) => Promise<void>;
  deleteHomework: (hwId: string, actor?: SyncActor) => Promise<void>;
  sendBroadcast: (bc: BroadcastLog, actor?: SyncActor) => Promise<void>;
  deleteBroadcast: (bcId: string, actor?: SyncActor) => Promise<void>;
  updateSchoolSettings: (settings: Partial<SchoolSettings>, actor?: SyncActor) => Promise<void>;
  updateThemeConfig: (config: Partial<SchoolThemeConfig>, actor?: SyncActor) => Promise<void>;
  refreshState: () => Promise<void>;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [connectedPeers, setConnectedPeers] = useState<ConnectedPeer[]>([]);
  const [auditLogs, setAuditLogs] = useState<RealTimeAuditEvent[]>([]);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);

  const dedupeAuditLogs = useCallback((logs: RealTimeAuditEvent[]): RealTimeAuditEvent[] => {
    const seen = new Set<string>();
    return logs.filter((log) => {
      if (!log || !log.id || seen.has(log.id)) return false;
      seen.add(log.id);
      return true;
    });
  }, []);

  // Persistent Client Database Snapshot Key
  const CLIENT_DB_STORAGE_KEY = 'golden_horizon_school_db_master_v2';

  const readLocalDatabaseSnapshot = useCallback((): any | null => {
    try {
      const raw = localStorage.getItem(CLIENT_DB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed reading localStorage database snapshot:', err);
    }
    return null;
  }, []);

  const cachedSnapshot = useRef<any>(readLocalDatabaseSnapshot()).current;

  // State initialized from local database snapshot first to prevent wiping across hot-reloads and feature updates
  const [students, setStudents] = useState<Student[]>(() => cachedSnapshot?.students || INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(() => cachedSnapshot?.teachers || INITIAL_TEACHERS);
  const [invoices, setInvoices] = useState<Invoice[]>(() => cachedSnapshot?.invoices || INITIAL_INVOICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => cachedSnapshot?.transactions || INITIAL_TRANSACTIONS);
  const [reportCards, setReportCards] = useState<StudentReportCard[]>(() => cachedSnapshot?.reportCards || INITIAL_REPORT_CARDS);
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(() => cachedSnapshot?.cbtExams || INITIAL_CBT_EXAMS);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => cachedSnapshot?.timetable || INITIAL_TIMETABLE);
  const [homeworkList, setHomeworkList] = useState<HomeworkAssignment[]>(() => cachedSnapshot?.homeworkList || INITIAL_HOMEWORK);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(() => cachedSnapshot?.busRoutes || INITIAL_BUS_ROUTES);
  const [hostels, setHostels] = useState<HostelRoom[]>(() => cachedSnapshot?.hostels || INITIAL_HOSTELS);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>(() => cachedSnapshot?.broadcasts || INITIAL_BROADCASTS);
  const [attendance, setAttendance] = useState<Record<string, Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>>(() => cachedSnapshot?.attendance || {
    '2026-09-02': {
      'std-101': 'Present',
      'std-102': 'Present',
      'std-103': 'Present',
      'std-104': 'Present',
      'std-105': 'Present'
    }
  });
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    if (cachedSnapshot?.schoolSettings) {
      return { ...INITIAL_SCHOOL_SETTINGS, ...cachedSnapshot.schoolSettings };
    }
    try {
      const legacyCached = localStorage.getItem('golden_horizon_school_settings');
      if (legacyCached) {
        return { ...INITIAL_SCHOOL_SETTINGS, ...JSON.parse(legacyCached) };
      }
    } catch (e) {
      console.warn('Could not read schoolSettings cache', e);
    }
    return INITIAL_SCHOOL_SETTINGS;
  });
  const [themeConfig, setThemeConfig] = useState<SchoolThemeConfig>(() => cachedSnapshot?.themeConfig || {
    mode: 'light',
    primaryColor: '#2563eb',
    headerColor: 'white',
    sidebarColor: '#0f172a',
    layoutMode: 'vertical',
    sidebarStyle: 'full',
    fontFamily: 'Inter',
    containerWidth: 'wide'
  });

  // Keep localStorage database snapshot updated on every state change
  useEffect(() => {
    try {
      localStorage.setItem(CLIENT_DB_STORAGE_KEY, JSON.stringify({
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
        themeConfig
      }));
    } catch (err) {
      console.warn('Failed writing localStorage database snapshot:', err);
    }
  }, [
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
    themeConfig
  ]);

  // Synchronize any locally saved user data to the server if the server has fewer records
  const checkAndHydrateServer = useCallback(async (serverState: any) => {
    if (!serverState) return;
    const local = readLocalDatabaseSnapshot();
    if (!local) return;

    const hasNewStudents = Array.isArray(local.students) && local.students.length > (serverState.students?.length || 0);
    const hasNewTeachers = Array.isArray(local.teachers) && local.teachers.length > (serverState.teachers?.length || 0);
    const hasNewInvoices = Array.isArray(local.invoices) && local.invoices.length > (serverState.invoices?.length || 0);
    const hasNewTransactions = Array.isArray(local.transactions) && local.transactions.length > (serverState.transactions?.length || 0);

    if (hasNewStudents || hasNewTeachers || hasNewInvoices || hasNewTransactions) {
      try {
        await fetch('/api/sync/hydrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: local })
        });
      } catch (err) {
        console.warn('Background state hydration error:', err);
      }
    }
  }, [readLocalDatabaseSnapshot]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((title: string, message: string, actorRole: UserRole) => {
    const notif: RealTimeNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      message,
      actorRole,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications((prev) => [notif, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 6000);
  }, []);

  // Fetch full state via REST
  const refreshState = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/sync/state');
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          if (data.state.students) setStudents(data.state.students);
          if (data.state.teachers) setTeachers(data.state.teachers);
          if (data.state.invoices) setInvoices(data.state.invoices);
          if (data.state.transactions) setTransactions(data.state.transactions);
          if (data.state.reportCards) setReportCards(data.state.reportCards);
          if (data.state.cbtExams) setCbtExams(data.state.cbtExams);
          if (data.state.timetable) setTimetable(data.state.timetable);
          if (data.state.homeworkList) setHomeworkList(data.state.homeworkList);
          if (data.state.busRoutes) setBusRoutes(data.state.busRoutes);
          if (data.state.hostels) setHostels(data.state.hostels);
          if (data.state.broadcasts) setBroadcasts(data.state.broadcasts);
          if (data.state.attendance) setAttendance(data.state.attendance);
          if (data.state.schoolSettings) setSchoolSettings(data.state.schoolSettings);
          if (data.state.themeConfig) setThemeConfig(data.state.themeConfig);
          if (data.state.auditLogs) setAuditLogs(dedupeAuditLogs(data.state.auditLogs));
        }
        if (data.peers) setConnectedPeers(data.peers);
        setLastSyncedAt(new Date());
        checkAndHydrateServer(data.state);
      }
    } catch (err) {
      console.error('Failed to fetch synchronized school state:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [dedupeAuditLogs, checkAndHydrateServer]);

  // WebSocket Connection
  useEffect(() => {
    let isMounted = true;

    const connectWS = () => {
      if (!isMounted) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          setLastSyncedAt(new Date());

          // Send current role to presence tracker
          ws.send(JSON.stringify({
            type: 'CLIENT_HELLO',
            role: currentRole,
            userName: `${currentRole.toUpperCase()}`
          }));
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'INIT_STATE') {
              const s = msg.state;
              if (s) {
                if (s.students) setStudents(s.students);
                if (s.teachers) setTeachers(s.teachers);
                if (s.invoices) setInvoices(s.invoices);
                if (s.transactions) setTransactions(s.transactions);
                if (s.reportCards) setReportCards(s.reportCards);
                if (s.cbtExams) setCbtExams(s.cbtExams);
                if (s.timetable) setTimetable(s.timetable);
                if (s.homeworkList) setHomeworkList(s.homeworkList);
                if (s.busRoutes) setBusRoutes(s.busRoutes);
                if (s.hostels) setHostels(s.hostels);
                if (s.broadcasts) setBroadcasts(s.broadcasts);
                if (s.attendance) setAttendance(s.attendance);
                if (s.schoolSettings) setSchoolSettings(s.schoolSettings);
                if (s.themeConfig) setThemeConfig(s.themeConfig);
                if (s.auditLogs) setAuditLogs(dedupeAuditLogs(s.auditLogs));
              }
              if (msg.peers) setConnectedPeers(msg.peers);
              setLastSyncedAt(new Date());
              if (s) checkAndHydrateServer(s);
            } else if (msg.type === 'SYNC_DELTA') {
              const { entity, action, data, auditLog, fullState, actor } = msg;

              if (fullState) {
                if (fullState.students) setStudents(fullState.students);
                if (fullState.teachers) setTeachers(fullState.teachers);
                if (fullState.invoices) setInvoices(fullState.invoices);
                if (fullState.transactions) setTransactions(fullState.transactions);
                if (fullState.reportCards) setReportCards(fullState.reportCards);
                if (fullState.cbtExams) setCbtExams(fullState.cbtExams);
                if (fullState.timetable) setTimetable(fullState.timetable);
                if (fullState.homeworkList) setHomeworkList(fullState.homeworkList);
                if (fullState.busRoutes) setBusRoutes(fullState.busRoutes);
                if (fullState.hostels) setHostels(fullState.hostels);
                if (fullState.broadcasts) setBroadcasts(fullState.broadcasts);
                if (fullState.attendance) setAttendance(fullState.attendance);
                if (fullState.schoolSettings) setSchoolSettings(fullState.schoolSettings);
                if (fullState.themeConfig) setThemeConfig(fullState.themeConfig);
                if (fullState.auditLogs) setAuditLogs(dedupeAuditLogs(fullState.auditLogs));
              }

              if (auditLog) {
                if (!fullState || !fullState.auditLogs) {
                  setAuditLogs((prev) => dedupeAuditLogs([auditLog, ...prev.slice(0, 99)]));
                }
                addNotification(
                  `Real-Time Sync: ${auditLog.action.replace('_', ' ')}`,
                  auditLog.details,
                  auditLog.actorRole
                );
              }

              setLastSyncedAt(new Date());
            } else if (msg.type === 'PRESENCE_UPDATE') {
              if (msg.peers) setConnectedPeers(msg.peers);
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          // Auto reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(connectWS, 3000);
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setIsConnected(false);
          ws.close();
        };
      } catch (e) {
        console.error('Failed to open WebSocket:', e);
        reconnectTimeoutRef.current = setTimeout(connectWS, 3000);
      }
    };

    connectWS();
    refreshState();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [refreshState, addNotification, checkAndHydrateServer]);

  // Keep presence updated when currentRole changes
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CLIENT_HELLO',
        role: currentRole,
        userName: `${currentRole.toUpperCase()}`
      }));
    }
  }, [currentRole]);

  // Unified Mutator: sends over WebSocket if open, and posts to REST API
  const sendMutation = useCallback(async (entity: string, action: 'create' | 'update' | 'delete', data: any, actorOverride?: SyncActor) => {
    const actor: SyncActor = actorOverride || {
      role: currentRole,
      name: `${currentRole.toUpperCase()}`
    };

    const payload = {
      type: 'MUTATE',
      entity,
      action,
      data,
      actor
    };

    // If WebSocket is active, send via WS
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      // Fallback to REST mutation endpoint
      try {
        const res = await fetch('/api/sync/mutate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity, action, data, actor })
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.state) {
            if (resData.state.students) setStudents(resData.state.students);
            if (resData.state.teachers) setTeachers(resData.state.teachers);
            if (resData.state.invoices) setInvoices(resData.state.invoices);
            if (resData.state.transactions) setTransactions(resData.state.transactions);
            if (resData.state.reportCards) setReportCards(resData.state.reportCards);
            if (resData.state.cbtExams) setCbtExams(resData.state.cbtExams);
            if (resData.state.timetable) setTimetable(resData.state.timetable);
            if (resData.state.homeworkList) setHomeworkList(resData.state.homeworkList);
            if (resData.state.busRoutes) setBusRoutes(resData.state.busRoutes);
            if (resData.state.hostels) setHostels(resData.state.hostels);
            if (resData.state.broadcasts) setBroadcasts(resData.state.broadcasts);
            if (resData.state.attendance) setAttendance(resData.state.attendance);
            if (resData.state.schoolSettings) setSchoolSettings(resData.state.schoolSettings);
            if (resData.state.themeConfig) setThemeConfig(resData.state.themeConfig);
            if (resData.state.auditLogs) setAuditLogs(dedupeAuditLogs(resData.state.auditLogs));
          }
        }
      } catch (err) {
        console.error('REST mutation fallback error:', err);
      }
    }
  }, [currentRole, dedupeAuditLogs]);

  // Concrete mutators
  const addStudent = useCallback(async (std: Student, actor?: SyncActor) => {
    setStudents((prev) => [std, ...prev]);
    await sendMutation('student', 'create', std, actor);
  }, [sendMutation]);

  const updateStudent = useCallback(async (std: Student, actor?: SyncActor) => {
    setStudents((prev) => prev.map((s) => (s.id === std.id ? std : s)));
    await sendMutation('student', 'update', std, actor);
  }, [sendMutation]);

  const deleteStudent = useCallback(async (studentId: string, actor?: SyncActor) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    await sendMutation('student', 'delete', { id: studentId }, actor);
  }, [sendMutation]);

  const addTeacher = useCallback(async (tch: Teacher, actor?: SyncActor) => {
    setTeachers((prev) => [tch, ...prev]);
    await sendMutation('staff', 'create', tch, actor);
  }, [sendMutation]);

  const updateTeacher = useCallback(async (tch: Teacher, actor?: SyncActor) => {
    setTeachers((prev) => prev.map((t) => (t.id === tch.id ? tch : t)));
    await sendMutation('staff', 'update', tch, actor);
  }, [sendMutation]);

  const deleteTeacher = useCallback(async (teacherId: string, actor?: SyncActor) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    await sendMutation('staff', 'delete', { id: teacherId }, actor);
  }, [sendMutation]);

  const addReportCard = useCallback(async (card: StudentReportCard, actor?: SyncActor) => {
    setReportCards((prev) => [card, ...prev]);
    await sendMutation('report_card', 'create', card, actor);
  }, [sendMutation]);

  const updateReportCard = useCallback(async (card: StudentReportCard, actor?: SyncActor) => {
    setReportCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
    await sendMutation('report_card', 'update', card, actor);
  }, [sendMutation]);

  const deleteReportCard = useCallback(async (cardId: string, actor?: SyncActor) => {
    setReportCards((prev) => prev.filter((c) => c.id !== cardId));
    await sendMutation('report_card', 'delete', { id: cardId }, actor);
  }, [sendMutation]);

  const markAttendance = useCallback(async (date: string, studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused', actor?: SyncActor) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [studentId]: status
      }
    }));
    await sendMutation('attendance', 'update', { date, studentId, status }, actor);
  }, [sendMutation]);

  const markBatchAttendance = useCallback(async (date: string, classGroup: string, batch: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }[], actor?: SyncActor) => {
    setAttendance((prev) => {
      const currentDay = { ...(prev[date] || {}) };
      batch.forEach((item) => {
        currentDay[item.studentId] = item.status;
      });
      return {
        ...prev,
        [date]: currentDay
      };
    });
    await sendMutation('attendance', 'update', { date, classGroup, batch }, actor);
  }, [sendMutation]);

  const addTransaction = useCallback(async (tx: PaymentTransaction, actor?: SyncActor) => {
    setTransactions((prev) => [tx, ...prev]);
    // Optimistically update invoice and student
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.studentId === tx.studentId) {
          const newPaid = inv.amountPaid + tx.amount;
          const newBal = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            amountPaid: newPaid,
            balanceDue: newBal,
            status: newBal === 0 ? 'Paid' : 'Partial'
          };
        }
        return inv;
      })
    );
    setStudents((prev) =>
      prev.map((std) => {
        if (std.id === tx.studentId) {
          return { ...std, feePaid: std.feePaid + tx.amount };
        }
        return std;
      })
    );
    await sendMutation('payment', 'create', tx, actor);
  }, [sendMutation]);

  const deleteTransaction = useCallback(async (txId: string, actor?: SyncActor) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    await sendMutation('payment', 'delete', { id: txId }, actor);
  }, [sendMutation]);

  const addInvoice = useCallback(async (inv: Invoice, actor?: SyncActor) => {
    setInvoices((prev) => [inv, ...prev]);
    await sendMutation('invoice', 'create', inv, actor);
  }, [sendMutation]);

  const updateInvoice = useCallback(async (inv: Invoice, actor?: SyncActor) => {
    setInvoices((prev) => prev.map((i) => (i.id === inv.id ? inv : i)));
    await sendMutation('invoice', 'update', inv, actor);
  }, [sendMutation]);

  const deleteInvoice = useCallback(async (invId: string, actor?: SyncActor) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invId));
    await sendMutation('invoice', 'delete', { id: invId }, actor);
  }, [sendMutation]);

  const addBusRoute = useCallback(async (route: BusRoute, actor?: SyncActor) => {
    setBusRoutes((prev) => [route, ...prev]);
    await sendMutation('bus_route', 'create', route, actor);
  }, [sendMutation]);

  const updateBusRoute = useCallback(async (route: BusRoute, actor?: SyncActor) => {
    setBusRoutes((prev) => prev.map((r) => (r.id === route.id ? route : r)));
    await sendMutation('bus_route', 'update', route, actor);
  }, [sendMutation]);

  const deleteBusRoute = useCallback(async (routeId: string, actor?: SyncActor) => {
    setBusRoutes((prev) => prev.filter((r) => r.id !== routeId));
    await sendMutation('bus_route', 'delete', { id: routeId }, actor);
  }, [sendMutation]);

  const addHostel = useCallback(async (hostel: HostelRoom, actor?: SyncActor) => {
    setHostels((prev) => [hostel, ...prev]);
    await sendMutation('hostel', 'create', hostel, actor);
  }, [sendMutation]);

  const updateHostel = useCallback(async (hostel: HostelRoom, actor?: SyncActor) => {
    setHostels((prev) => prev.map((h) => (h.id === hostel.id ? hostel : h)));
    await sendMutation('hostel', 'update', hostel, actor);
  }, [sendMutation]);

  const deleteHostel = useCallback(async (hostelId: string, actor?: SyncActor) => {
    setHostels((prev) => prev.filter((h) => h.id !== hostelId));
    await sendMutation('hostel', 'delete', { id: hostelId }, actor);
  }, [sendMutation]);

  const addCBTExam = useCallback(async (exam: CBTExam, actor?: SyncActor) => {
    setCbtExams((prev) => [exam, ...prev]);
    await sendMutation('cbt_exam', 'create', exam, actor);
  }, [sendMutation]);

  const updateCBTExam = useCallback(async (exam: CBTExam, actor?: SyncActor) => {
    setCbtExams((prev) => prev.map((e) => (e.id === exam.id ? exam : e)));
    await sendMutation('cbt_exam', 'update', exam, actor);
  }, [sendMutation]);

  const deleteCBTExam = useCallback(async (examId: string, actor?: SyncActor) => {
    setCbtExams((prev) => prev.filter((e) => e.id !== examId));
    await sendMutation('cbt_exam', 'delete', { id: examId }, actor);
  }, [sendMutation]);

  const addTimetableSlot = useCallback(async (slot: TimetableSlot, actor?: SyncActor) => {
    setTimetable((prev) => [slot, ...prev]);
    await sendMutation('timetable', 'create', slot, actor);
  }, [sendMutation]);

  const updateTimetableSlot = useCallback(async (slot: TimetableSlot, actor?: SyncActor) => {
    setTimetable((prev) => prev.map((s) => (s.id === slot.id ? slot : s)));
    await sendMutation('timetable', 'update', slot, actor);
  }, [sendMutation]);

  const deleteTimetableSlot = useCallback(async (slotId: string, actor?: SyncActor) => {
    setTimetable((prev) => prev.filter((s) => s.id !== slotId));
    await sendMutation('timetable', 'delete', { id: slotId }, actor);
  }, [sendMutation]);

  const addHomework = useCallback(async (hw: HomeworkAssignment, actor?: SyncActor) => {
    setHomeworkList((prev) => [hw, ...prev]);
    await sendMutation('homework', 'create', hw, actor);
  }, [sendMutation]);

  const updateHomework = useCallback(async (hw: HomeworkAssignment, actor?: SyncActor) => {
    setHomeworkList((prev) => prev.map((h) => (h.id === hw.id ? hw : h)));
    await sendMutation('homework', 'update', hw, actor);
  }, [sendMutation]);

  const deleteHomework = useCallback(async (hwId: string, actor?: SyncActor) => {
    setHomeworkList((prev) => prev.filter((h) => h.id !== hwId));
    await sendMutation('homework', 'delete', { id: hwId }, actor);
  }, [sendMutation]);

  const sendBroadcast = useCallback(async (bc: BroadcastLog, actor?: SyncActor) => {
    setBroadcasts((prev) => [bc, ...prev]);
    await sendMutation('broadcast', 'create', bc, actor);
  }, [sendMutation]);

  const deleteBroadcast = useCallback(async (bcId: string, actor?: SyncActor) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== bcId));
    await sendMutation('broadcast', 'delete', { id: bcId }, actor);
  }, [sendMutation]);

  const updateSchoolSettings = useCallback(async (settings: Partial<SchoolSettings>, actor?: SyncActor) => {
    setSchoolSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem('golden_horizon_school_settings', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to cache schoolSettings in localStorage', e);
      }
      return updated;
    });
    await sendMutation('settings', 'update', settings, actor);
  }, [sendMutation]);

  const updateThemeConfig = useCallback(async (config: Partial<SchoolThemeConfig>, actor?: SyncActor) => {
    setThemeConfig((prev) => ({ ...prev, ...config }));
    await sendMutation('theme', 'update', config, actor);
  }, [sendMutation]);

  return (
    <RealTimeContext.Provider
      value={{
        isConnected,
        isSyncing,
        lastSyncedAt,
        connectedPeers,
        auditLogs,
        notifications,
        dismissNotification,
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
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};
