import {
  Student,
  Teacher,
  StudentReportCard,
  CBTExam,
  Invoice,
  PaymentTransaction,
  Announcement,
  FeeItem,
  AttendanceRecord,
  TimetableSlot,
  HomeworkAssignment,
  BusRoute,
  HostelRoom,
  BroadcastLog
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-101',
    admissionNo: 'KS/2024/001',
    firstName: 'Amina',
    lastName: 'Bello',
    gender: 'Female',
    dob: '2008-04-14',
    classGroup: 'Grade 10 A',
    parentName: 'Alhaji Ibrahim Bello',
    parentPhone: '+234 803 123 4567',
    parentEmail: 'ibrahim.bello@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isBoarder: true,
    isBusEnrolled: false,
    boardingHouse: 'Queen Amina Hall - Room 12',
    status: 'Active',
    totalFeeDue: 1200,
    feePaid: 1200,
    attendanceRate: 98.2,
    gpa: 3.88
  },
  {
    id: 'std-102',
    admissionNo: 'KS/2024/002',
    firstName: 'David',
    lastName: 'Okonkwo',
    gender: 'Male',
    dob: '2008-09-21',
    classGroup: 'Grade 10 A',
    parentName: 'Dr. Grace Okonkwo',
    parentPhone: '+234 802 987 6543',
    parentEmail: 'grace.okonkwo@example.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: true,
    busRoute: 'Route 4 - Victoria Island & Lekki Phase 1',
    status: 'Active',
    totalFeeDue: 1450,
    feePaid: 950,
    attendanceRate: 94.0,
    gpa: 3.52
  },
  {
    id: 'std-103',
    admissionNo: 'KS/2024/003',
    firstName: 'Sophia',
    lastName: 'Adeyemi',
    gender: 'Female',
    dob: '2009-01-11',
    classGroup: 'Grade 10 B',
    parentName: 'Engr. Femi Adeyemi',
    parentPhone: '+234 805 444 3322',
    parentEmail: 'femi.adeyemi@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: true,
    busRoute: 'Route 2 - Ikeja Express',
    status: 'Active',
    totalFeeDue: 1100,
    feePaid: 1100,
    attendanceRate: 99.1,
    gpa: 3.95
  },
  {
    id: 'std-104',
    admissionNo: 'KS/2024/004',
    firstName: 'Emmanuel',
    lastName: 'Chukwu',
    gender: 'Male',
    dob: '2008-06-30',
    classGroup: 'Grade 11 Science',
    parentName: 'Mrs. Chinyere Chukwu',
    parentPhone: '+234 811 555 7788',
    parentEmail: 'c.chukwu@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    isBoarder: true,
    isBusEnrolled: false,
    boardingHouse: 'Nelson Mandela Hall - Room 08',
    status: 'Active',
    totalFeeDue: 1600,
    feePaid: 800,
    attendanceRate: 91.5,
    gpa: 3.20
  },
  {
    id: 'std-105',
    admissionNo: 'KS/2024/005',
    firstName: 'Zainab',
    lastName: 'Suleiman',
    gender: 'Female',
    dob: '2007-11-05',
    classGroup: 'Grade 11 Science',
    parentName: 'Mallam Kabir Suleiman',
    parentPhone: '+234 809 333 2211',
    parentEmail: 'kabir.suleiman@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: false,
    status: 'Active',
    totalFeeDue: 1000,
    feePaid: 1000,
    attendanceRate: 97.8,
    gpa: 3.75
  },
  {
    id: 'std-106',
    admissionNo: 'KS/2024/006',
    firstName: 'Tobi',
    lastName: 'Bakare',
    gender: 'Male',
    dob: '2007-03-18',
    classGroup: 'Grade 12 Art',
    parentName: 'Chief Segun Bakare',
    parentPhone: '+234 802 111 0099',
    parentEmail: 'segun.bakare@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    isBoarder: true,
    isBusEnrolled: false,
    boardingHouse: 'Nelson Mandela Hall - Room 02',
    status: 'Active',
    totalFeeDue: 1800,
    feePaid: 1800,
    attendanceRate: 96.0,
    gpa: 3.60
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-201',
    staffId: 'KS-STF-012',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@kwikschools.com',
    phone: '+234 803 999 1001',
    qualification: 'Ph.D. Mathematics Education',
    subjects: ['Further Mathematics', 'Mathematics Grade 10-12'],
    formClass: 'Grade 10 A',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    joinDate: '2021-09-01'
  },
  {
    id: 'tch-202',
    staffId: 'KS-STF-015',
    name: 'Mrs. Victoria Nwosu',
    email: 'v.nwosu@kwikschools.com',
    phone: '+234 805 888 2002',
    qualification: 'M.Ed. English Literature',
    subjects: ['English Language', 'Literature in English'],
    formClass: 'Grade 10 B',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    joinDate: '2020-01-15'
  },
  {
    id: 'tch-203',
    staffId: 'KS-STF-021',
    name: 'Mr. Gabriel Thorne',
    email: 'g.thorne@kwikschools.com',
    phone: '+234 802 777 3003',
    qualification: 'B.Sc. Physics & Robotics',
    subjects: ['Physics', 'Computer Science'],
    formClass: 'Grade 11 Science',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    joinDate: '2022-08-20'
  }
];

export const INITIAL_FEE_ITEMS: FeeItem[] = [
  {
    id: 'fee-1',
    category: 'Tuition',
    description: 'Standard Secondary Academic Tuition Fee',
    amount: 850,
    applicableClasses: ['Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art']
  },
  {
    id: 'fee-2',
    category: 'Books & Materials',
    description: 'E-Textbook Licensing & Printed Workbooks Package',
    amount: 150,
    applicableClasses: ['Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art']
  },
  {
    id: 'fee-3',
    category: 'Boarding Fee',
    description: 'Full Meal Plan & House Accommodation (Boarders)',
    amount: 600,
    applicableClasses: ['Grade 10 A', 'Grade 11 Science', 'Grade 12 Art']
  },
  {
    id: 'fee-4',
    category: 'Bus/Transport',
    description: 'School Bus Shuttle Service (Day Students)',
    amount: 250,
    applicableClasses: ['Grade 10 A', 'Grade 10 B']
  },
  {
    id: 'fee-5',
    category: 'Development Levy',
    description: 'ICT Infrastructure & Robotics Laboratory Upgrade Fee',
    amount: 100,
    applicableClasses: ['Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art']
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'INV-2025-001',
    studentId: 'std-101',
    studentName: 'Amina Bello',
    classGroup: 'Grade 10 A',
    totalAmount: 1200,
    amountPaid: 1200,
    balanceDue: 0,
    dueDate: '2025-09-15',
    status: 'Paid',
    items: [
      { description: 'Tuition Fee - 2nd Term', amount: 850 },
      { description: 'Books & Materials Package', amount: 150 },
      { description: 'Development & ICT Levy', amount: 100 },
      { description: 'Uniform & Sports Kit', amount: 100 }
    ],
    termSession: '2025/2026 Session - 2nd Term'
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-2025-002',
    studentId: 'std-102',
    studentName: 'David Okonkwo',
    classGroup: 'Grade 10 A',
    totalAmount: 1450,
    amountPaid: 950,
    balanceDue: 500,
    dueDate: '2025-09-15',
    status: 'Partial',
    items: [
      { description: 'Tuition Fee - 2nd Term', amount: 850 },
      { description: 'School Bus Shuttle (Route 4)', amount: 250 },
      { description: 'Books & Materials Package', amount: 150 },
      { description: 'Development Levy', amount: 200 }
    ],
    termSession: '2025/2026 Session - 2nd Term'
  },
  {
    id: 'inv-1004',
    invoiceNo: 'INV-2025-004',
    studentId: 'std-104',
    studentName: 'Emmanuel Chukwu',
    classGroup: 'Grade 11 Science',
    totalAmount: 1600,
    amountPaid: 800,
    balanceDue: 800,
    dueDate: '2025-09-15',
    status: 'Partial',
    items: [
      { description: 'Tuition Fee - 2nd Term', amount: 850 },
      { description: 'Boarding House Accommodation', amount: 600 },
      { description: 'Science Lab Practicals', amount: 150 }
    ],
    termSession: '2025/2026 Session - 2nd Term'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-501',
    receiptNo: 'RCT-88901',
    studentId: 'std-101',
    studentName: 'Amina Bello',
    amount: 1200,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-09-10',
    category: 'Full Tuition & Boarding',
    status: 'Completed'
  },
  {
    id: 'tx-502',
    receiptNo: 'RCT-88902',
    studentId: 'std-102',
    studentName: 'David Okonkwo',
    amount: 950,
    paymentMethod: 'Card / POS',
    paymentDate: '2025-09-12',
    category: 'Tuition Deposit',
    status: 'Completed'
  },
  {
    id: 'tx-503',
    receiptNo: 'RCT-88903',
    studentId: 'std-103',
    studentName: 'Sophia Adeyemi',
    amount: 1100,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-09-14',
    category: 'Full Tuition',
    status: 'Completed'
  }
];

export const INITIAL_REPORT_CARDS: StudentReportCard[] = [
  {
    id: 'rep-101',
    studentId: 'std-101',
    studentName: 'Amina Bello',
    admissionNo: 'KS/2024/001',
    classGroup: 'Grade 10 A',
    academicSession: '2025/2026',
    term: '2nd Term',
    totalScore: 472,
    averageScore: 94.4,
    classPosition: 1,
    totalStudentsInClass: 28,
    attendanceDaysPresent: 62,
    totalSchoolDays: 63,
    formTeacherRemark: 'Amina is an exceptional student who consistently displays academic excellence and leadership qualities. Keep up the high standard!',
    principalRemark: 'Outstanding performance. An exemplary ambassador for KwikSchools Academy.',
    isPublished: true,
    subjectScores: [
      { subjectName: 'Mathematics', ca1: 14, ca2: 15, exam: 68, total: 97, grade: 'A', remark: 'Distinction' },
      { subjectName: 'English Language', ca1: 13, ca2: 14, exam: 65, total: 92, grade: 'A', remark: 'Excellent' },
      { subjectName: 'Physics', ca1: 15, ca2: 14, exam: 67, total: 96, grade: 'A', remark: 'Outstanding' },
      { subjectName: 'Chemistry', ca1: 14, ca2: 13, exam: 66, total: 93, grade: 'A', remark: 'Excellent' },
      { subjectName: 'Computer Studies', ca1: 15, ca2: 15, exam: 64, total: 94, grade: 'A', remark: 'Excellent' }
    ],
    domainRatings: [
      { category: 'Cognitive', trait: 'Logical Thinking & Reasoning', score: 5 },
      { category: 'Affective', trait: 'Punctuality & Discipline', score: 5 },
      { category: 'Affective', trait: 'Leadership & Initiative', score: 5 },
      { category: 'Psychomotor', trait: 'Handwriting & Presentation', score: 4 },
      { category: 'Psychomotor', trait: 'Sports & Games Participation', score: 4 }
    ]
  },
  {
    id: 'rep-102',
    studentId: 'std-102',
    studentName: 'David Okonkwo',
    admissionNo: 'KS/2024/002',
    classGroup: 'Grade 10 A',
    academicSession: '2025/2026',
    term: '2nd Term',
    totalScore: 412,
    averageScore: 82.4,
    classPosition: 4,
    totalStudentsInClass: 28,
    attendanceDaysPresent: 59,
    totalSchoolDays: 63,
    formTeacherRemark: 'David demonstrates strong analytical skills. With a bit more attention to English composition, he will easily reach the top 2.',
    principalRemark: 'Very commendable term result. Encouraged to maintain focus.',
    isPublished: true,
    subjectScores: [
      { subjectName: 'Mathematics', ca1: 12, ca2: 13, exam: 60, total: 85, grade: 'A', remark: 'Very Good' },
      { subjectName: 'English Language', ca1: 11, ca2: 10, exam: 54, total: 75, grade: 'B', remark: 'Good' },
      { subjectName: 'Physics', ca1: 13, ca2: 14, exam: 61, total: 88, grade: 'A', remark: 'Very Good' },
      { subjectName: 'Chemistry', ca1: 12, ca2: 11, exam: 58, total: 81, grade: 'A', remark: 'Very Good' },
      { subjectName: 'Computer Studies', ca1: 12, ca2: 13, exam: 58, total: 83, grade: 'A', remark: 'Very Good' }
    ],
    domainRatings: [
      { category: 'Cognitive', trait: 'Logical Thinking & Reasoning', score: 4 },
      { category: 'Affective', trait: 'Punctuality & Discipline', score: 4 },
      { category: 'Affective', trait: 'Leadership & Initiative', score: 4 },
      { category: 'Psychomotor', trait: 'Handwriting & Presentation', score: 3 },
      { category: 'Psychomotor', trait: 'Sports & Games Participation', score: 5 }
    ]
  }
];

export const INITIAL_CBT_EXAMS: CBTExam[] = [
  {
    id: 'cbt-101',
    title: 'Grade 10 Mathematics Mid-Term Assessment',
    subject: 'Mathematics',
    classGroup: 'Grade 10 A',
    durationMinutes: 30,
    totalMarks: 50,
    scheduledDate: '2025-10-24',
    status: 'Active',
    questions: [
      {
        id: 'q1',
        question: 'Solve for x in the quadratic equation: x² - 5x + 6 = 0.',
        options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = 0 or x = 5'],
        correctIndex: 0,
        explanation: 'Factoring (x - 2)(x - 3) = 0 yields x = 2 and x = 3.'
      },
      {
        id: 'q2',
        question: 'What is the sum of interior angles of a regular hexagon (6 sides)?',
        options: ['540°', '720°', '360°', '900°'],
        correctIndex: 1,
        explanation: 'Formula (n-2) × 180° = (6-2) × 180° = 4 × 180° = 720°.'
      },
      {
        id: 'q3',
        question: 'If sin(θ) = 3/5 in a right-angled triangle, what is the value of cos(θ)?',
        options: ['4/5', '5/3', '3/4', '1/2'],
        correctIndex: 0,
        explanation: 'Using Pythagorean triplet 3-4-5, adjacent side is 4, so cos(θ) = 4/5.'
      },
      {
        id: 'q4',
        question: 'Simplify log₁₀(1000).',
        options: ['10', '100', '3', '1'],
        correctIndex: 2,
        explanation: '10³ = 1000, so log₁₀(1000) = 3.'
      },
      {
        id: 'q5',
        question: 'Find the standard derivative d/dx (3x⁴ - 2x + 7).',
        options: ['12x³ - 2', '3x³ - 2', '12x⁴ - 2x', '6x³ - 2'],
        correctIndex: 0,
        explanation: 'Applying power rule: d/dx(3x⁴) = 12x³ and d/dx(-2x) = -2.'
      }
    ]
  },
  {
    id: 'cbt-102',
    title: 'Grade 11 Physics Wave Mechanics CBT Test',
    subject: 'Physics',
    classGroup: 'Grade 11 Science',
    durationMinutes: 45,
    totalMarks: 40,
    scheduledDate: '2025-10-28',
    status: 'Active',
    questions: [
      {
        id: 'p1',
        question: 'Which of the following electromagnetic waves has the shortest wavelength?',
        options: ['Radio Waves', 'Visible Light', 'Gamma Rays', 'Microwaves'],
        correctIndex: 2,
        explanation: 'Gamma rays possess the highest frequency and shortest wavelength in the EM spectrum.'
      },
      {
        id: 'p2',
        question: 'Calculate the speed of a sound wave with frequency 500 Hz and wavelength 0.68 m.',
        options: ['340 m/s', '150 m/s', '735 m/s', '500 m/s'],
        correctIndex: 0,
        explanation: 'v = f × λ = 500 × 0.68 = 340 m/s.'
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Inter-House Sports Competition & Annual Cultural Day',
    content: 'All parents, guardians, and students are hereby invited to KwikSchools Academy Annual Cultural Day & Inter-House Sports competition scheduled for November 12th at the School Sports Complex.',
    author: 'Principal Office',
    date: '2025-10-18',
    targetAudience: 'All',
    priority: 'High'
  },
  {
    id: 'ann-2',
    title: 'Mid-Term Break & Fee Payment Deadline Notice',
    content: 'Please note that Mid-Term break commences on Friday. Parents with outstanding school fees are urged to clear all pending invoices before the resumption date.',
    author: 'Bursary Unit',
    date: '2025-10-15',
    targetAudience: 'Parents',
    priority: 'Urgent'
  },
  {
    id: 'ann-3',
    title: 'Staff Continuous Professional Development (CPD) Workshop',
    content: 'All academic teachers are required to attend the digital pedagogy and CBT tool workshop in ICT Lab 1 this Saturday from 9:00 AM.',
    author: 'Vice Principal Academic',
    date: '2025-10-12',
    targetAudience: 'Teachers',
    priority: 'Normal'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', day: 'Monday', periodTime: '08:00 AM - 08:45 AM', classGroup: 'Grade 10 A', subject: 'Mathematics', teacherName: 'Mr. Emmanuel Vance', roomNo: 'Room 101' },
  { id: 'tt-2', day: 'Monday', periodTime: '08:45 AM - 09:30 AM', classGroup: 'Grade 10 A', subject: 'Physics', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Physics Lab' },
  { id: 'tt-3', day: 'Monday', periodTime: '09:45 AM - 10:30 AM', classGroup: 'Grade 10 A', subject: 'English Language', teacherName: 'Mrs. Victoria Cole', roomNo: 'Room 101' },
  { id: 'tt-4', day: 'Monday', periodTime: '10:30 AM - 11:15 AM', classGroup: 'Grade 10 A', subject: 'Chemistry', teacherName: 'Mr. Marcus Thorne', roomNo: 'Chemistry Lab' },
  { id: 'tt-5', day: 'Tuesday', periodTime: '08:00 AM - 08:45 AM', classGroup: 'Grade 10 A', subject: 'Biology', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Bio Lab' },
  { id: 'tt-6', day: 'Tuesday', periodTime: '08:45 AM - 09:30 AM', classGroup: 'Grade 10 A', subject: 'ICT & Coding', teacherName: 'Engr. David Kalu', roomNo: 'ICT Room 1' },
  { id: 'tt-7', day: 'Wednesday', periodTime: '08:00 AM - 08:45 AM', classGroup: 'Grade 10 A', subject: 'Economics', teacherName: 'Mr. Emmanuel Vance', roomNo: 'Room 101' },
  { id: 'tt-8', day: 'Thursday', periodTime: '08:00 AM - 08:45 AM', classGroup: 'Grade 10 A', subject: 'Further Maths', teacherName: 'Mr. Emmanuel Vance', roomNo: 'Room 101' },
  { id: 'tt-9', day: 'Friday', periodTime: '08:00 AM - 08:45 AM', classGroup: 'Grade 10 A', subject: 'Civic Education', teacherName: 'Mrs. Victoria Cole', roomNo: 'Room 101' },
];

export const INITIAL_HOMEWORK: HomeworkAssignment[] = [
  {
    id: 'hw-101',
    title: 'Algebraic Equations & Quadratic Graphs Worksheet',
    subject: 'Mathematics',
    classGroup: 'Grade 10 A',
    teacherName: 'Mr. Emmanuel Vance',
    dueDate: '2025-10-25',
    assignedDate: '2025-10-20',
    maxPoints: 20,
    description: 'Solve questions 1 through 15 on Chapter 4 worksheet. Plot functions f(x) = x² - 4x + 3 on graph paper.',
    submissionsCount: 28,
    totalStudents: 32
  },
  {
    id: 'hw-102',
    title: 'Newton Laws of Motion & Momentum Lab Report',
    subject: 'Physics',
    classGroup: 'Grade 10 A',
    teacherName: 'Dr. Sarah Jenkins',
    dueDate: '2025-10-28',
    assignedDate: '2025-10-21',
    maxPoints: 30,
    description: 'Complete the written analysis for Experiment 3 (Conservation of Linear Momentum) and submit in PDF format.',
    submissionsCount: 19,
    totalStudents: 32
  },
  {
    id: 'hw-103',
    title: 'Essay: The Impact of Industrialization in West Africa',
    subject: 'History & Civics',
    classGroup: 'Grade 11 Science',
    teacherName: 'Mrs. Victoria Cole',
    dueDate: '2025-10-30',
    assignedDate: '2025-10-22',
    maxPoints: 50,
    description: 'Write a 750-word analytical essay discussing socioeconomic impacts from 1960 to 2000.',
    submissionsCount: 12,
    totalStudents: 28
  }
];

export const INITIAL_BUS_ROUTES: BusRoute[] = [
  {
    id: 'route-1',
    routeName: 'Route 1 - Lekki Phase 1 & Ikoyi',
    driverName: 'Mr. Patrick Nwosu',
    driverPhone: '+234 803 111 2233',
    vehicleNo: 'KS-BUS-01 (Toyota Coaster)',
    capacity: 30,
    assignedStudents: 26,
    stops: ['Ikoyi Bridge Junction', 'Admiralty Way', 'Agungi Bus Stop', 'Chevron Roundabout'],
    departureTime: '06:45 AM'
  },
  {
    id: 'route-2',
    routeName: 'Route 2 - Ikeja & Maryland Express',
    driverName: 'Mr. Sunday Alabi',
    driverPhone: '+234 802 444 5566',
    vehicleNo: 'KS-BUS-02 (Hyundai Hi-Ace)',
    capacity: 22,
    assignedStudents: 20,
    stops: ['Allen Avenue', 'Maryland Mall', 'Anthony Village', 'Opebi Road'],
    departureTime: '06:30 AM'
  },
  {
    id: 'route-3',
    routeName: 'Route 3 - Victoria Island & Oniru',
    driverName: 'Mr. Gabriel Thomas',
    driverPhone: '+234 805 777 8899',
    vehicleNo: 'KS-BUS-03 (Toyota Hi-Ace)',
    capacity: 22,
    assignedStudents: 18,
    stops: ['Adeola Odeku', 'Ahmadu Bello Way', 'Oniru Estate Gate'],
    departureTime: '07:00 AM'
  }
];

export const INITIAL_HOSTELS: HostelRoom[] = [
  {
    id: 'hst-1',
    blockName: 'Queen Amina Hall (Girls Senior)',
    roomNo: 'Block A - Rooms 01-12',
    capacity: 48,
    occupantsCount: 42,
    wardenName: 'Mrs. Abigail Mensah',
    gender: 'Girls',
    feePerTerm: 450
  },
  {
    id: 'hst-2',
    blockName: 'Nelson Mandela Hall (Boys Senior)',
    roomNo: 'Block B - Rooms 01-12',
    capacity: 48,
    occupantsCount: 45,
    wardenName: 'Mr. Johnathan Cole',
    gender: 'Boys',
    feePerTerm: 450
  },
  {
    id: 'hst-3',
    blockName: 'Moremi Hall (Girls Junior)',
    roomNo: 'Block C - Rooms 01-08',
    capacity: 32,
    occupantsCount: 28,
    wardenName: 'Mrs. Beatrice Danjuma',
    gender: 'Girls',
    feePerTerm: 400
  }
];

export const INITIAL_BROADCASTS: BroadcastLog[] = [
  {
    id: 'bc-1',
    channel: 'SMS',
    recipientGroup: 'Grade 10 A Parents',
    message: 'Dear Parent, Mid-Term report cards for Grade 10 A have been published on the KwikSchools Parent Portal. Login to review.',
    sentAt: '2025-10-20 14:30',
    status: 'Delivered',
    totalRecipients: 32
  },
  {
    id: 'bc-2',
    channel: 'WhatsApp',
    recipientGroup: 'All School Parents',
    message: 'Reminder: Inter-House Sports competition takes place this Friday at 9:00 AM. Refreshments provided for families.',
    sentAt: '2025-10-18 09:15',
    status: 'Delivered',
    totalRecipients: 1248
  },
  {
    id: 'bc-3',
    channel: 'Email',
    recipientGroup: 'Outstanding Fee Debtors',
    message: 'URGENT: Fee reminder notice for 2nd Term balance. Please visit the Bursary or pay online via Parent Portal.',
    sentAt: '2025-10-15 11:00',
    status: 'Delivered',
    totalRecipients: 84
  }
];

