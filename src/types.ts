export type UserRole = 
  | 'pioneer'
  | 'super_admin' 
  | 'principal' 
  | 'head_teacher'
  | 'teacher' 
  | 'finance'
  | 'parent' 
  | 'student';

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string;
  classGroup: string; // e.g. "Grade 10 A" or "SS 2 Gold"
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  avatar: string;
  isBoarder: boolean;
  isBusEnrolled: boolean;
  busRoute?: string;
  boardingHouse?: string;
  status: 'Active' | 'Graduated' | 'Suspended';
  totalFeeDue: number;
  feePaid: number;
  attendanceRate: number; // percentage
  gpa: number;
}

export interface Teacher {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  formClass?: string; // Class they manage as Form Teacher
  avatar: string;
  joinDate: string;
}

export interface SubjectScore {
  subjectName: string;
  ca1: number; // Max 15
  ca2: number; // Max 15
  exam: number; // Max 70
  total: number; // 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  remark: string;
}

export interface DomainRating {
  category: 'Cognitive' | 'Affective' | 'Psychomotor';
  trait: string;
  score: 1 | 2 | 3 | 4 | 5; // 5 = Excellent, 1 = Poor
}

export interface StudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classGroup: string;
  academicSession: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  subjectScores: SubjectScore[];
  totalScore: number;
  averageScore: number;
  classPosition: number;
  totalStudentsInClass: number;
  attendanceDaysPresent: number;
  totalSchoolDays: number;
  formTeacherRemark: string;
  principalRemark: string;
  domainRatings: DomainRating[];
  isPublished: boolean;
}

export interface CBTQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  classGroup: string;
  durationMinutes: number;
  totalMarks: number;
  questions: CBTQuestion[];
  status: 'Draft' | 'Active' | 'Closed';
  scheduledDate: string;
}

export interface CBTSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPossible: number;
  percentage: number;
  submittedAt: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

export interface FeeItem {
  id: string;
  category: 'Tuition' | 'Books & Materials' | 'Uniform' | 'Bus/Transport' | 'Boarding Fee' | 'Development Levy';
  description: string;
  amount: number;
  applicableClasses: string[];
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
  items: { description: string; amount: number }[];
  termSession: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Card / POS' | 'Cheque';
  paymentDate: string;
  category: string;
  status: 'Completed' | 'Pending';
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classGroup: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    note?: string;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  targetAudience: 'All' | 'Teachers' | 'Parents' | 'Students';
  priority: 'Normal' | 'High' | 'Urgent';
}

export interface SchoolThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string; // hex or tailwind class set
  headerColor: string;
  sidebarColor: string;
  layoutMode: 'vertical' | 'horizontal';
  sidebarStyle: 'full' | 'mini' | 'compact' | 'modern';
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Poppins' | 'Roboto';
  containerWidth: 'wide' | 'boxed';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periodTime: string; // e.g., "08:00 AM - 08:45 AM"
  classGroup: string;
  subject: string;
  teacherName: string;
  roomNo: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  classGroup: string;
  teacherName: string;
  dueDate: string;
  assignedDate: string;
  maxPoints: number;
  description: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface BusRoute {
  id: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  capacity: number;
  assignedStudents: number;
  stops: string[];
  departureTime: string;
}

export interface HostelRoom {
  id: string;
  blockName: string;
  roomNo: string;
  capacity: number;
  occupantsCount: number;
  wardenName: string;
  gender: 'Boys' | 'Girls';
  feePerTerm: number;
}

export interface BroadcastLog {
  id: string;
  channel: 'SMS' | 'Email' | 'Push Notification' | 'WhatsApp';
  recipientGroup: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed';
  totalRecipients: number;
}

export interface SchoolSettings {
  schoolName: string;
  secondarySchoolName?: string;
  primarySchoolName?: string;
  website?: string;
  email?: string;
  altEmail?: string;
  phone?: string;
  phoneNumbers?: string[];
  motto: string;
  academicSession: string;
  currentTerm: string;
  principalName: string;
  headTeacherName?: string;
  gradingSystem: string;
  logoUrl?: string;
  stampUrl?: string;
}

export interface ConnectedPeer {
  id: string;
  role: UserRole;
  userName: string;
  connectedAt: string;
}

export interface RealTimeAuditEvent {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  entity: string;
  details: string;
}

export interface RealTimeSyncState {
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
  peers: ConnectedPeer[];
}
