import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
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
  INITIAL_BROADCASTS
} from "./src/data/mockSchoolData";
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
} from "./src/types";
import { getOrCreateUser } from "./src/db/users.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial Authoritative Server State
interface ServerState {
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
  auditLogs: RealTimeAuditEvent[];
}

const schoolState: ServerState = {
  students: [...INITIAL_STUDENTS],
  teachers: [...INITIAL_TEACHERS],
  invoices: [...INITIAL_INVOICES],
  transactions: [...INITIAL_TRANSACTIONS],
  reportCards: [...INITIAL_REPORT_CARDS],
  cbtExams: [...INITIAL_CBT_EXAMS],
  timetable: [...INITIAL_TIMETABLE],
  homeworkList: [...INITIAL_HOMEWORK],
  busRoutes: [...INITIAL_BUS_ROUTES],
  hostels: [...INITIAL_HOSTELS],
  broadcasts: [...INITIAL_BROADCASTS],
  attendance: {
    '2026-09-02': {
      'std-101': 'Present',
      'std-102': 'Present',
      'std-103': 'Present',
      'std-104': 'Present',
      'std-105': 'Present'
    }
  },
  schoolSettings: {
    schoolName: "KwikSchools International Academy",
    motto: "Excellence in Knowledge, Innovation & Character",
    academicSession: "2025/2026 Academic Session",
    currentTerm: "2nd Term",
    principalName: "Dr. Elizabeth Sterling",
    gradingSystem: "Grade A: 70-100%, Grade B: 60-69%, Grade C: 50-59%, Grade D: 40-49%, Grade F: <40%"
  },
  themeConfig: {
    mode: 'light',
    primaryColor: '#2563eb',
    headerColor: 'white',
    sidebarColor: '#0f172a',
    layoutMode: 'vertical',
    sidebarStyle: 'full',
    fontFamily: 'Inter',
    containerWidth: 'wide'
  },
  auditLogs: [
    {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'pioneer',
      actorName: 'Pioneer Master',
      action: 'SYSTEM_BOOT',
      entity: 'system',
      details: 'Real-time synchronization engine online with authoritative multi-user state.'
    }
  ]
};

// Connected client tracking
interface ClientInfo {
  id: string;
  ws: WebSocket;
  role: UserRole;
  userName: string;
  connectedAt: string;
}

const connectedClients = new Map<WebSocket, ClientInfo>();

function getConnectedPeers(): ConnectedPeer[] {
  const peers: ConnectedPeer[] = [];
  for (const info of connectedClients.values()) {
    peers.push({
      id: info.id,
      role: info.role,
      userName: info.userName,
      connectedAt: info.connectedAt
    });
  }
  return peers;
}

function broadcastMessage(msgObj: any, excludeWs?: WebSocket) {
  const jsonStr = JSON.stringify(msgObj);
  for (const [ws, info] of connectedClients.entries()) {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(jsonStr);
      } catch (e) {
        console.error("Failed to send WebSocket message to client:", info.id, e);
      }
    }
  }
}

function broadcastPresence() {
  const peers = getConnectedPeers();
  broadcastMessage({
    type: "PRESENCE_UPDATE",
    peers,
    totalOnline: peers.length
  });
}

function logAudit(actorRole: UserRole, actorName: string, action: string, entity: string, details: string) {
  const log: RealTimeAuditEvent = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorRole,
    actorName: actorName || actorRole.toUpperCase(),
    action,
    entity,
    details
  };
  schoolState.auditLogs.unshift(log);
  if (schoolState.auditLogs.length > 100) {
    schoolState.auditLogs.pop();
  }
  return log;
}

// AI Client helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(express.json());

  // WebSocket Server on /ws
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    const clientId = `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const clientInfo: ClientInfo = {
      id: clientId,
      ws,
      role: "super_admin",
      userName: "Administrator",
      connectedAt: new Date().toISOString()
    };
    connectedClients.set(ws, clientInfo);

    // Send full initial state to this newly connected client
    const initPayload = {
      type: "INIT_STATE",
      state: schoolState,
      peers: getConnectedPeers(),
      clientId
    };
    ws.send(JSON.stringify(initPayload));

    // Broadcast updated presence to other peers
    broadcastPresence();

    ws.on("message", (raw: string) => {
      try {
        const message = JSON.parse(raw.toString());
        const { type, entity, action, data, actor } = message;

        if (type === "CLIENT_HELLO") {
          clientInfo.role = actor?.role || message.role || "super_admin";
          clientInfo.userName = actor?.name || message.userName || clientInfo.role;
          broadcastPresence();
          return;
        }

        if (type === "PING") {
          ws.send(JSON.stringify({ type: "PONG" }));
          return;
        }

        if (type === "MUTATE") {
          const actorRole: UserRole = actor?.role || clientInfo.role || "super_admin";
          const actorName: string = actor?.name || clientInfo.userName || actorRole.toUpperCase();
          let auditMsg = "";

          // Role-Based Access Control Validation
          const isAdminOrHead = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(actorRole);
          const isFinance = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'finance'].includes(actorRole);
          const isTeacherOrAdmin = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(actorRole);
          const isPrincipalOrAdmin = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(actorRole);

          let isAuthorized = false;

          if (entity === "student") {
            isAuthorized = isAdminOrHead;
          } else if (entity === "staff") {
            isAuthorized = isAdminOrHead;
          } else if (entity === "report_card") {
            isAuthorized = isTeacherOrAdmin;
          } else if (entity === "attendance") {
            isAuthorized = isTeacherOrAdmin;
          } else if (entity === "payment" || entity === "invoice") {
            isAuthorized = isFinance;
          } else if (entity === "bus_route" || entity === "hostel") {
            isAuthorized = isFinance || isAdminOrHead;
          } else if (entity === "broadcast") {
            isAuthorized = isFinance || isAdminOrHead;
          } else if (entity === "cbt_exam" || entity === "homework") {
            isAuthorized = isTeacherOrAdmin;
          } else if (entity === "timetable") {
            isAuthorized = isPrincipalOrAdmin;
          } else if (entity === "settings" || entity === "theme") {
            isAuthorized = isAdminOrHead;
          }

          if (!isAuthorized) {
            logAudit(actorRole, actorName, `UNAUTHORIZED_${entity.toUpperCase()}`, entity, `Blocked unauthorized mutation attempt on ${entity} by ${actorRole}`);
            return;
          }

          if (entity === "student") {
            if (action === "create") {
              schoolState.students = [data, ...schoolState.students];
              auditMsg = `Enrolled new student: ${data.firstName} ${data.lastName} (${data.admissionNo})`;
            } else if (action === "update") {
              schoolState.students = schoolState.students.map((s) => (s.id === data.id ? { ...s, ...data } : s));
              auditMsg = `Updated profile for student ${data.firstName} ${data.lastName}`;
            } else if (action === "delete") {
              schoolState.students = schoolState.students.filter((s) => s.id !== data.id);
              auditMsg = `Removed student record (${data.admissionNo || data.id})`;
            }
          } else if (entity === "staff") {
            if (action === "create") {
              schoolState.teachers = [data, ...schoolState.teachers];
              auditMsg = `Added teaching staff: ${data.name} (${data.staffId})`;
            } else if (action === "update") {
              schoolState.teachers = schoolState.teachers.map((t) => (t.id === data.id ? { ...t, ...data } : t));
              auditMsg = `Updated teaching staff record for ${data.name}`;
            } else if (action === "delete") {
              schoolState.teachers = schoolState.teachers.filter((t) => t.id !== data.id);
              auditMsg = `Removed teaching staff member: ${data.name || data.id}`;
            }
          } else if (entity === "report_card") {
            if (action === "create") {
              schoolState.reportCards = [data, ...schoolState.reportCards];
              auditMsg = `Issued report card for ${data.studentName} (${data.classGroup})`;
            } else if (action === "update") {
              schoolState.reportCards = schoolState.reportCards.map((rc) => (rc.id === data.id ? { ...rc, ...data } : rc));
              auditMsg = `Updated term report card for ${data.studentName} (Average: ${data.averageScore}%)`;
            } else if (action === "delete") {
              schoolState.reportCards = schoolState.reportCards.filter((rc) => rc.id !== data.id);
              auditMsg = `Deleted report card for ${data.studentName || data.id}`;
            }
          } else if (entity === "attendance") {
            const { date, studentId, status, batch } = data;
            if (!schoolState.attendance[date]) {
              schoolState.attendance[date] = {};
            }
            if (batch && Array.isArray(batch)) {
              batch.forEach((item: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }) => {
                schoolState.attendance[date][item.studentId] = item.status;
              });
              auditMsg = `Marked batch attendance for ${batch.length} students on ${date}`;
            } else if (studentId && status) {
              schoolState.attendance[date][studentId] = status;
              auditMsg = `Marked attendance for student ${studentId} as ${status} on ${date}`;
            }
          } else if (entity === "payment") {
            if (action === "create") {
              schoolState.transactions = [data, ...schoolState.transactions];
              // Also update corresponding invoice if exists
              const targetInv = schoolState.invoices.find((i) => i.studentId === data.studentId);
              if (targetInv) {
                targetInv.amountPaid += data.amount;
                targetInv.balanceDue = Math.max(0, targetInv.totalAmount - targetInv.amountPaid);
                targetInv.status = targetInv.balanceDue === 0 ? "Paid" : "Partial";
              }
              // Also update student's feePaid
              const targetStd = schoolState.students.find((s) => s.id === data.studentId);
              if (targetStd) {
                targetStd.feePaid += data.amount;
              }
              auditMsg = `Recorded payment of $${data.amount.toLocaleString()} for ${data.studentName} (Receipt: ${data.receiptNo})`;
            } else if (action === "delete") {
              schoolState.transactions = schoolState.transactions.filter((tx) => tx.id !== data.id);
              auditMsg = `Reversed payment transaction ${data.receiptNo || data.id}`;
            }
          } else if (entity === "invoice") {
            if (action === "create") {
              schoolState.invoices = [data, ...schoolState.invoices];
              auditMsg = `Generated fee invoice ${data.invoiceNo} for ${data.studentName}`;
            } else if (action === "update") {
              schoolState.invoices = schoolState.invoices.map((inv) => (inv.id === data.id ? { ...inv, ...data } : inv));
              auditMsg = `Updated invoice ${data.invoiceNo}`;
            } else if (action === "delete") {
              schoolState.invoices = schoolState.invoices.filter((inv) => inv.id !== data.id);
              auditMsg = `Cancelled invoice ${data.invoiceNo || data.id}`;
            }
          } else if (entity === "bus_route") {
            if (action === "create") {
              schoolState.busRoutes = [data, ...schoolState.busRoutes];
              auditMsg = `Added school bus route: ${data.routeName} (${data.vehicleNo})`;
            } else if (action === "update") {
              schoolState.busRoutes = schoolState.busRoutes.map((br) => (br.id === data.id ? { ...br, ...data } : br));
              auditMsg = `Updated bus route ${data.routeName}`;
            } else if (action === "delete") {
              schoolState.busRoutes = schoolState.busRoutes.filter((br) => br.id !== data.id);
              auditMsg = `Removed bus route ${data.routeName || data.id}`;
            }
          } else if (entity === "hostel") {
            if (action === "create") {
              schoolState.hostels = [data, ...schoolState.hostels];
              auditMsg = `Added hostel accommodation block: ${data.blockName} (${data.roomNo})`;
            } else if (action === "update") {
              schoolState.hostels = schoolState.hostels.map((h) => (h.id === data.id ? { ...h, ...data } : h));
              auditMsg = `Updated hostel block ${data.blockName}`;
            } else if (action === "delete") {
              schoolState.hostels = schoolState.hostels.filter((h) => h.id !== data.id);
              auditMsg = `Removed hostel room record ${data.blockName || data.id}`;
            }
          } else if (entity === "cbt_exam") {
            if (action === "create") {
              schoolState.cbtExams = [data, ...schoolState.cbtExams];
              auditMsg = `Created CBT Exam: "${data.title}" for ${data.classGroup}`;
            } else if (action === "update") {
              schoolState.cbtExams = schoolState.cbtExams.map((ex) => (ex.id === data.id ? { ...ex, ...data } : ex));
              auditMsg = `Updated CBT Exam "${data.title}"`;
            } else if (action === "delete") {
              schoolState.cbtExams = schoolState.cbtExams.filter((ex) => ex.id !== data.id);
              auditMsg = `Deleted CBT Exam: ${data.title || data.id}`;
            }
          } else if (entity === "timetable") {
            if (action === "create") {
              schoolState.timetable = [data, ...schoolState.timetable];
              auditMsg = `Scheduled timetable period: ${data.subject} (${data.day} ${data.periodTime})`;
            } else if (action === "update") {
              schoolState.timetable = schoolState.timetable.map((tt) => (tt.id === data.id ? { ...tt, ...data } : tt));
              auditMsg = `Updated timetable period ${data.subject}`;
            } else if (action === "delete") {
              schoolState.timetable = schoolState.timetable.filter((tt) => tt.id !== data.id);
              auditMsg = `Removed timetable period: ${data.subject || data.id}`;
            }
          } else if (entity === "homework") {
            if (action === "create") {
              schoolState.homeworkList = [data, ...schoolState.homeworkList];
              auditMsg = `Published homework assignment: "${data.title}" for ${data.classGroup}`;
            } else if (action === "update") {
              schoolState.homeworkList = schoolState.homeworkList.map((hw) => (hw.id === data.id ? { ...hw, ...data } : hw));
              auditMsg = `Updated homework assignment "${data.title}"`;
            } else if (action === "delete") {
              schoolState.homeworkList = schoolState.homeworkList.filter((hw) => hw.id !== data.id);
              auditMsg = `Deleted homework assignment: ${data.title || data.id}`;
            }
          } else if (entity === "broadcast") {
            if (action === "create") {
              schoolState.broadcasts = [data, ...schoolState.broadcasts];
              auditMsg = `Dispatched ${data.channel} broadcast to ${data.recipientGroup} (${data.totalRecipients} recipients)`;
            } else if (action === "delete") {
              schoolState.broadcasts = schoolState.broadcasts.filter((bc) => bc.id !== data.id);
              auditMsg = `Removed broadcast dispatch log (${data.channel})`;
            }
          } else if (entity === "settings") {
            schoolState.schoolSettings = { ...schoolState.schoolSettings, ...data };
            auditMsg = `Updated school system settings & term configuration`;
          } else if (entity === "theme") {
            schoolState.themeConfig = { ...schoolState.themeConfig, ...data };
            auditMsg = `Updated school theme and layout mode to ${data.mode || 'custom'}`;
          }

          const auditLog = logAudit(actorRole, actorName, `${entity.toUpperCase()}_${action.toUpperCase()}`, entity, auditMsg);

          // Broadcast DELTA to all connected clients including sender confirmation
          const deltaPayload = {
            type: "SYNC_DELTA",
            entity,
            action,
            data,
            auditLog,
            fullState: schoolState,
            actor: { role: actorRole, name: actorName }
          };

          broadcastMessage(deltaPayload);
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      connectedClients.delete(ws);
      broadcastPresence();
    });

    ws.on("error", () => {
      connectedClients.delete(ws);
      broadcastPresence();
    });
  });

  // REST API Routes for Health, State Sync, and AI

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      app: "KwikSchools Management System",
      realTimeSync: "active",
      connectedUsers: connectedClients.size,
      timestamp: new Date().toISOString()
    });
  });

  // Get full synchronized state
  app.get("/api/sync/state", (req, res) => {
    res.json({
      state: schoolState,
      peers: getConnectedPeers(),
      timestamp: new Date().toISOString()
    });
  });

  // REST Fallback for mutations (ensures reliability)
  app.post("/api/sync/mutate", (req, res) => {
    try {
      const { entity, action, data, actor } = req.body;
      const actorRole: UserRole = actor?.role || "super_admin";
      const actorName: string = actor?.name || actorRole.toUpperCase();
      let auditMsg = "";

      // Role-Based Access Control Validation
      const isAdminOrHead = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(actorRole);
      const isFinance = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'finance'].includes(actorRole);
      const isTeacherOrAdmin = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(actorRole);
      const isPrincipalOrAdmin = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(actorRole);

      let isAuthorized = false;

      if (entity === "student" || entity === "staff") {
        isAuthorized = isAdminOrHead;
      } else if (entity === "report_card" || entity === "attendance") {
        isAuthorized = isTeacherOrAdmin;
      } else if (entity === "payment" || entity === "invoice") {
        isAuthorized = isFinance;
      } else if (entity === "bus_route" || entity === "hostel" || entity === "broadcast") {
        isAuthorized = isFinance || isAdminOrHead;
      } else if (entity === "cbt_exam" || entity === "homework") {
        isAuthorized = isTeacherOrAdmin;
      } else if (entity === "timetable") {
        isAuthorized = isPrincipalOrAdmin;
      } else if (entity === "settings" || entity === "theme") {
        isAuthorized = isAdminOrHead;
      }

      if (!isAuthorized) {
        logAudit(actorRole, actorName, `UNAUTHORIZED_${entity.toUpperCase()}`, entity, `Blocked unauthorized mutation attempt on ${entity} by ${actorRole}`);
        return res.status(403).json({ error: `Unauthorized action on ${entity} for role ${actorRole}` });
      }

      if (entity === "student") {
        if (action === "create") {
          schoolState.students = [data, ...schoolState.students];
          auditMsg = `Enrolled new student: ${data.firstName} ${data.lastName} (${data.admissionNo})`;
        } else if (action === "update") {
          schoolState.students = schoolState.students.map((s) => (s.id === data.id ? { ...s, ...data } : s));
          auditMsg = `Updated profile for student ${data.firstName} ${data.lastName}`;
        } else if (action === "delete") {
          schoolState.students = schoolState.students.filter((s) => s.id !== data.id);
          auditMsg = `Removed student record (${data.admissionNo || data.id})`;
        }
      } else if (entity === "staff") {
        if (action === "create") {
          schoolState.teachers = [data, ...schoolState.teachers];
          auditMsg = `Added teaching staff: ${data.name} (${data.staffId})`;
        } else if (action === "update") {
          schoolState.teachers = schoolState.teachers.map((t) => (t.id === data.id ? { ...t, ...data } : t));
          auditMsg = `Updated teaching staff record for ${data.name}`;
        } else if (action === "delete") {
          schoolState.teachers = schoolState.teachers.filter((t) => t.id !== data.id);
          auditMsg = `Removed teaching staff member: ${data.name || data.id}`;
        }
      } else if (entity === "report_card") {
        if (action === "create") {
          schoolState.reportCards = [data, ...schoolState.reportCards];
          auditMsg = `Issued report card for ${data.studentName} (${data.classGroup})`;
        } else if (action === "update") {
          schoolState.reportCards = schoolState.reportCards.map((rc) => (rc.id === data.id ? { ...rc, ...data } : rc));
          auditMsg = `Updated term report card for ${data.studentName}`;
        } else if (action === "delete") {
          schoolState.reportCards = schoolState.reportCards.filter((rc) => rc.id !== data.id);
          auditMsg = `Deleted report card for ${data.studentName || data.id}`;
        }
      } else if (entity === "attendance") {
        const { date, studentId, status, batch } = data;
        if (!schoolState.attendance[date]) {
          schoolState.attendance[date] = {};
        }
        if (batch && Array.isArray(batch)) {
          batch.forEach((item: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }) => {
            schoolState.attendance[date][item.studentId] = item.status;
          });
          auditMsg = `Marked batch attendance for ${batch.length} students on ${date}`;
        } else if (studentId && status) {
          schoolState.attendance[date][studentId] = status;
          auditMsg = `Marked attendance for student ${studentId} as ${status} on ${date}`;
        }
      } else if (entity === "payment") {
        if (action === "create") {
          schoolState.transactions = [data, ...schoolState.transactions];
          const targetInv = schoolState.invoices.find((i) => i.studentId === data.studentId);
          if (targetInv) {
            targetInv.amountPaid += data.amount;
            targetInv.balanceDue = Math.max(0, targetInv.totalAmount - targetInv.amountPaid);
            targetInv.status = targetInv.balanceDue === 0 ? "Paid" : "Partial";
          }
          const targetStd = schoolState.students.find((s) => s.id === data.studentId);
          if (targetStd) {
            targetStd.feePaid += data.amount;
          }
          auditMsg = `Recorded payment of $${data.amount.toLocaleString()} for ${data.studentName}`;
        } else if (action === "delete") {
          schoolState.transactions = schoolState.transactions.filter((tx) => tx.id !== data.id);
          auditMsg = `Reversed payment transaction ${data.receiptNo || data.id}`;
        }
      } else if (entity === "invoice") {
        if (action === "create") {
          schoolState.invoices = [data, ...schoolState.invoices];
          auditMsg = `Generated fee invoice ${data.invoiceNo} for ${data.studentName}`;
        } else if (action === "update") {
          schoolState.invoices = schoolState.invoices.map((inv) => (inv.id === data.id ? { ...inv, ...data } : inv));
          auditMsg = `Updated invoice ${data.invoiceNo}`;
        } else if (action === "delete") {
          schoolState.invoices = schoolState.invoices.filter((inv) => inv.id !== data.id);
          auditMsg = `Cancelled invoice ${data.invoiceNo || data.id}`;
        }
      } else if (entity === "bus_route") {
        if (action === "create") {
          schoolState.busRoutes = [data, ...schoolState.busRoutes];
          auditMsg = `Added bus route ${data.routeName}`;
        } else if (action === "update") {
          schoolState.busRoutes = schoolState.busRoutes.map((br) => (br.id === data.id ? { ...br, ...data } : br));
          auditMsg = `Updated bus route ${data.routeName}`;
        } else if (action === "delete") {
          schoolState.busRoutes = schoolState.busRoutes.filter((br) => br.id !== data.id);
          auditMsg = `Removed bus route ${data.routeName || data.id}`;
        }
      } else if (entity === "hostel") {
        if (action === "create") {
          schoolState.hostels = [data, ...schoolState.hostels];
          auditMsg = `Added hostel block ${data.blockName}`;
        } else if (action === "update") {
          schoolState.hostels = schoolState.hostels.map((h) => (h.id === data.id ? { ...h, ...data } : h));
          auditMsg = `Updated hostel block ${data.blockName}`;
        } else if (action === "delete") {
          schoolState.hostels = schoolState.hostels.filter((h) => h.id !== data.id);
          auditMsg = `Removed hostel room record ${data.blockName || data.id}`;
        }
      } else if (entity === "cbt_exam") {
        if (action === "create") {
          schoolState.cbtExams = [data, ...schoolState.cbtExams];
          auditMsg = `Created CBT Exam: "${data.title}"`;
        } else if (action === "update") {
          schoolState.cbtExams = schoolState.cbtExams.map((ex) => (ex.id === data.id ? { ...ex, ...data } : ex));
          auditMsg = `Updated CBT Exam "${data.title}"`;
        } else if (action === "delete") {
          schoolState.cbtExams = schoolState.cbtExams.filter((ex) => ex.id !== data.id);
          auditMsg = `Deleted CBT Exam: ${data.title || data.id}`;
        }
      } else if (entity === "timetable") {
        if (action === "create") {
          schoolState.timetable = [data, ...schoolState.timetable];
          auditMsg = `Scheduled timetable period: ${data.subject}`;
        } else if (action === "update") {
          schoolState.timetable = schoolState.timetable.map((tt) => (tt.id === data.id ? { ...tt, ...data } : tt));
          auditMsg = `Updated timetable period ${data.subject}`;
        } else if (action === "delete") {
          schoolState.timetable = schoolState.timetable.filter((tt) => tt.id !== data.id);
          auditMsg = `Removed timetable period: ${data.subject || data.id}`;
        }
      } else if (entity === "homework") {
        if (action === "create") {
          schoolState.homeworkList = [data, ...schoolState.homeworkList];
          auditMsg = `Published homework assignment: "${data.title}"`;
        } else if (action === "update") {
          schoolState.homeworkList = schoolState.homeworkList.map((hw) => (hw.id === data.id ? { ...hw, ...data } : hw));
          auditMsg = `Updated homework assignment "${data.title}"`;
        } else if (action === "delete") {
          schoolState.homeworkList = schoolState.homeworkList.filter((hw) => hw.id !== data.id);
          auditMsg = `Deleted homework assignment: ${data.title || data.id}`;
        }
      } else if (entity === "broadcast") {
        if (action === "create") {
          schoolState.broadcasts = [data, ...schoolState.broadcasts];
          auditMsg = `Dispatched ${data.channel} broadcast`;
        } else if (action === "delete") {
          schoolState.broadcasts = schoolState.broadcasts.filter((bc) => bc.id !== data.id);
          auditMsg = `Removed broadcast dispatch log`;
        }
      } else if (entity === "settings") {
        schoolState.schoolSettings = { ...schoolState.schoolSettings, ...data };
        auditMsg = `Updated school system settings`;
      } else if (entity === "theme") {
        schoolState.themeConfig = { ...schoolState.themeConfig, ...data };
        auditMsg = `Updated school theme configuration`;
      }

      const auditLog = logAudit(actorRole, actorName, `${entity.toUpperCase()}_${action.toUpperCase()}`, entity, auditMsg);

      // Broadcast delta to all WebSockets
      broadcastMessage({
        type: "SYNC_DELTA",
        entity,
        action,
        data,
        auditLog,
        fullState: schoolState,
        actor: { role: actorRole, name: actorName }
      });

      return res.json({ success: true, auditLog, state: schoolState });
    } catch (err: any) {
      console.error("Mutation error:", err);
      return res.status(500).json({ error: "Failed to apply mutation", details: err.message });
    }
  });

  // Get live audit logs
  app.get("/api/sync/audit-logs", (req, res) => {
    res.json({ auditLogs: schoolState.auditLogs });
  });

  // User Profile Sync & Cloud SQL authentication
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || "";
      const { displayName, role } = req.body;

      if (!uid) {
        return res.status(401).json({ error: "Missing authenticated user ID" });
      }

      const userRecord = await getOrCreateUser(uid, email, displayName, role);
      return res.json({ success: true, user: userRecord });
    } catch (err: any) {
      console.error("Failed to sync user with Cloud SQL:", err);
      return res.status(500).json({ error: "Failed to synchronize user record with database" });
    }
  });

  // AI Report Remarks Generator
  app.post("/api/ai/report-remarks", async (req, res) => {
    try {
      const { studentName, gradeLevel, overallScore, attendancePercentage, topSubjects, weakSubjects } = req.body;
      const ai = getAIClient();

      if (!ai) {
        const remark = `${studentName} has demonstrated a good commitment this term with an overall average of ${overallScore}% and an attendance record of ${attendancePercentage}%. Performance in ${topSubjects?.join(', ') || 'core subjects'} is commendable. Focus should be placed on ${weakSubjects?.join(', ') || 'consistent revision'} next term to reach full academic potential.`;
        return res.json({ remark, fallback: true });
      }

      const prompt = `You are a school principal / class teacher providing official report card comments for a student.
Student Name: ${studentName}
Class / Grade: ${gradeLevel}
Overall Score: ${overallScore}%
Attendance Rate: ${attendancePercentage}%
Top Performing Subjects: ${topSubjects?.join(', ') || 'None specified'}
Subjects Needing Improvement: ${weakSubjects?.join(', ') || 'None specified'}

Provide a 3-4 sentence constructive, encouraging, and authoritative teacher's remark suitable for an official school terminal result card. Do not use quotes or markdown heading markup.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({ remark: response.text?.trim() || "Satisfactory academic progress shown this term.", fallback: false });
    } catch (err: any) {
      console.error("Gemini API Error (Report Remarks):", err);
      return res.status(500).json({ error: "Failed to generate report card remark", details: err.message });
    }
  });

  // AI CBT Exam Generator
  app.post("/api/ai/generate-cbt-questions", async (req, res) => {
    try {
      const { subject, topic, numQuestions = 5, gradeLevel = "Senior High" } = req.body;
      const ai = getAIClient();

      if (!ai) {
        const fallbackQuestions = [
          {
            id: "q1",
            question: `Which of the following is a fundamental concept in ${subject || 'Science'} related to ${topic || 'General Studies'}?`,
            options: ["Option A: Core Principle", "Option B: Secondary Function", "Option C: Alternate Variable", "Option D: Standard Metric"],
            correctIndex: 0,
            explanation: "Option A represents the primary foundational definition."
          },
          {
            id: "q2",
            question: `In ${topic || 'the curriculum'}, what is the primary objective of systematic analysis?`,
            options: ["To reduce speed", "To verify accuracy and consistency", "To eliminate variables", "To bypass guidelines"],
            correctIndex: 1,
            explanation: "Systematic analysis ensures accuracy and consistency across measurements."
          }
        ];
        return res.json({ questions: fallbackQuestions, fallback: true });
      }

      const prompt = `Generate ${numQuestions} multiple-choice exam questions suitable for a Computer-Based Test (CBT) in a secondary school.
Subject: ${subject}
Topic: ${topic}
Target Class: ${gradeLevel}

Respond strictly in valid JSON format without markdown code blocks. The JSON must be an array of objects with the following structure:
[
  {
    "id": "q1",
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this answer is correct"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "[]";
      const questions = JSON.parse(text.replace(/```json|```/g, "").trim());
      return res.json({ questions, fallback: false });
    } catch (err: any) {
      console.error("Gemini API Error (CBT Generation):", err);
      return res.status(500).json({ error: "Failed to generate CBT questions", details: err.message });
    }
  });

  // Vite Middleware handling for dev vs prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`KwikSchools Server with Real-Time WebSockets running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
