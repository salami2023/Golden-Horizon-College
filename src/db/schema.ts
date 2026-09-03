import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('administrator'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Students table
export const studentsTable = pgTable('students', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  admissionNo: text('admission_no').notNull().unique(),
  gender: text('gender').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  classGroup: text('class_group').notNull(),
  section: text('section').notNull(),
  parentName: text('parent_name').notNull(),
  parentPhone: text('parent_phone').notNull(),
  parentEmail: text('parent_email').notNull(),
  status: text('status').notNull().default('Active'),
  feeBalance: integer('fee_balance').notNull().default(0),
  attendanceRate: integer('attendance_rate').notNull().default(100),
  address: text('address'),
  passportUrl: text('passport_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Staff / Teachers table
export const teachersTable = pgTable('teachers', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  staffId: text('staff_id').notNull().unique(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  role: text('role').notNull(),
  subjects: jsonb('subjects').$type<string[]>().default([]),
  assignedClasses: jsonb('assigned_classes').$type<string[]>().default([]),
  status: text('status').notNull().default('Active'),
  qualification: text('qualification'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Financial Invoices table
export const invoicesTable = pgTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  classGroup: text('class_group').notNull(),
  term: text('term').notNull(),
  session: text('session').notNull(),
  totalAmount: integer('total_amount').notNull(),
  paidAmount: integer('paid_amount').notNull().default(0),
  balance: integer('balance').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull().default('Pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Payment Transactions table
export const transactionsTable = pgTable('transactions', {
  id: text('id').primaryKey(),
  transactionRef: text('transaction_ref').notNull().unique(),
  invoiceId: text('invoice_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method').notNull(),
  channel: text('channel').notNull(),
  status: text('status').notNull().default('Successful'),
  receiptNumber: text('receipt_number').notNull(),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Report Cards & Academic grades table
export const reportCardsTable = pgTable('report_cards', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  admissionNo: text('admission_no').notNull(),
  classGroup: text('class_group').notNull(),
  term: text('term').notNull(),
  academicSession: text('academic_session').notNull(),
  subjects: jsonb('subjects').notNull(),
  overallTotalScore: integer('overall_total_score').notNull(),
  averageScore: integer('average_score').notNull(),
  classPosition: text('class_position').notNull(),
  classTotalStudents: integer('class_total_students').notNull(),
  principalRemarks: text('principal_remarks'),
  teacherRemarks: text('teacher_remarks'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// CBT Exams table
export const cbtExamsTable = pgTable('cbt_exams', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subject: text('subject').notNull(),
  classGroup: text('class_group').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  totalMarks: integer('total_marks').notNull(),
  passMarkPercentage: integer('pass_mark_percentage').notNull(),
  status: text('status').notNull().default('Scheduled'),
  scheduledDate: text('scheduled_date').notNull(),
  isLive: boolean('is_live').notNull().default(false),
  questions: jsonb('questions').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Log table
export const auditLogsTable = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogsTable),
}));

export const auditLogsRelations = relations(auditLogsTable, ({ one }) => ({
  user: one(users, {
    fields: [auditLogsTable.userId],
    references: [users.id],
  }),
}));
