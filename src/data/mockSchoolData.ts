import {
  Student,
  Teacher,
  SchoolClass,
  SchoolSubject,
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
  BroadcastLog,
  SchoolSettings
} from '../types';
import { DEFAULT_SCHOOL_LOGO_DATA_URI, DEFAULT_SCHOOL_STAMP_DATA_URI } from '../assets/schoolAssets';

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
  },
  {
    id: 'std-107',
    admissionNo: 'KS/2024/007',
    firstName: 'Chidera',
    lastName: 'Obi',
    gender: 'Male',
    dob: '2014-07-19',
    classGroup: 'Basic 5',
    parentName: 'Mr. & Mrs. Obi',
    parentPhone: '+234 803 555 1212',
    parentEmail: 'obi.family@example.com',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: true,
    busRoute: 'Route 1 - Lekki Phase 1 & Ikoyi',
    status: 'Active',
    totalFeeDue: 850,
    feePaid: 850,
    attendanceRate: 99.0,
    gpa: 4.0
  },
  {
    id: 'std-108',
    admissionNo: 'KS/2024/008',
    firstName: 'Kamsi',
    lastName: 'Adeleke',
    gender: 'Female',
    dob: '2016-02-14',
    classGroup: 'Basic 3',
    parentName: 'Mrs. Folake Adeleke',
    parentPhone: '+234 802 777 8899',
    parentEmail: 'folake.adeleke@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: true,
    busRoute: 'Route 2 - Ikeja & Maryland Express',
    status: 'Active',
    totalFeeDue: 800,
    feePaid: 800,
    attendanceRate: 97.5,
    gpa: 3.9
  },
  {
    id: 'std-109',
    admissionNo: 'KS/2024/009',
    firstName: 'Tiwa',
    lastName: 'Johnson',
    gender: 'Female',
    dob: '2018-09-03',
    classGroup: 'Basic 1',
    parentName: 'Barrister Tunde Johnson',
    parentPhone: '+234 809 222 3344',
    parentEmail: 'tunde.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: false,
    status: 'Active',
    totalFeeDue: 750,
    feePaid: 400,
    attendanceRate: 98.0,
    gpa: 3.85
  },
  {
    id: 'std-110',
    admissionNo: 'KS/2024/010',
    firstName: 'Favour',
    lastName: 'Daniel',
    gender: 'Female',
    dob: '2019-11-20',
    classGroup: 'Nursery 2',
    parentName: 'Pastor Daniel Emmanuel',
    parentPhone: '+234 805 111 9988',
    parentEmail: 'daniel.e@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: true,
    busRoute: 'Route 1 - Lekki Phase 1 & Ikoyi',
    status: 'Active',
    totalFeeDue: 700,
    feePaid: 700,
    attendanceRate: 100.0,
    gpa: 4.0
  },
  {
    id: 'std-111',
    admissionNo: 'KS/2024/011',
    firstName: 'Joshua',
    lastName: 'Eze',
    gender: 'Male',
    dob: '2020-04-10',
    classGroup: 'Kindergarten',
    parentName: 'Dr. Chika Eze',
    parentPhone: '+234 803 888 7766',
    parentEmail: 'chika.eze@example.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    isBoarder: false,
    isBusEnrolled: false,
    status: 'Active',
    totalFeeDue: 650,
    feePaid: 650,
    attendanceRate: 96.5,
    gpa: 3.9
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
    subjects: ['Further Mathematics', 'Mathematics'],
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
  },
  {
    id: 'tch-204',
    staffId: 'KS-STF-030',
    name: 'Mrs. Blessing Okafor',
    email: 'b.okafor@kwikschools.com',
    phone: '+234 806 444 5511',
    qualification: 'B.Ed. Early Childhood Education (Montessori Certified)',
    subjects: ['Literacy / English Studies', 'Phonics & Spelling', 'Sensory Exploration & Rhymes'],
    formClass: 'Nursery 1',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    joinDate: '2019-09-10'
  },
  {
    id: 'tch-205',
    staffId: 'KS-STF-035',
    name: 'Mr. Samuel Adeleke',
    email: 's.adeleke@kwikschools.com',
    phone: '+234 803 222 9944',
    qualification: 'B.Sc. Primary Education & Quantitative Methods',
    subjects: ['Numeracy / Mathematics', 'Basic Science & Technology', 'Quantitative Reasoning'],
    formClass: 'Basic 5',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinDate: '2020-04-01'
  },
  {
    id: 'tch-206',
    staffId: 'KS-STF-042',
    name: 'Mrs. Joy Danladi',
    email: 'j.danladi@kwikschools.com',
    phone: '+234 808 666 3322',
    qualification: 'NCE & B.Ed. Elementary Curriculum',
    subjects: ['Social Studies & Civic Habits', 'Verbal Reasoning', 'Creative & Cultural Arts (CCA)'],
    formClass: 'Basic 3',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    joinDate: '2021-01-12'
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
    dueDate: '2026-10-15',
    status: 'Paid',
    items: [
      { description: 'Tuition Fee - 1st Term', amount: 850 },
      { description: 'Books & Materials Package', amount: 150 },
      { description: 'Development & ICT Levy', amount: 100 },
      { description: 'Uniform & Sports Kit', amount: 100 }
    ],
    termSession: '2026/2027 Session - 1st Term'
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-2026-002',
    studentId: 'std-102',
    studentName: 'David Okonkwo',
    classGroup: 'Grade 10 A',
    totalAmount: 1450,
    amountPaid: 950,
    balanceDue: 500,
    dueDate: '2026-10-15',
    status: 'Partial',
    items: [
      { description: 'Tuition Fee - 1st Term', amount: 850 },
      { description: 'School Bus Shuttle (Route 4)', amount: 250 },
      { description: 'Books & Materials Package', amount: 150 },
      { description: 'Development Levy', amount: 200 }
    ],
    termSession: '2026/2027 Session - 1st Term'
  },
  {
    id: 'inv-1004',
    invoiceNo: 'INV-2026-004',
    studentId: 'std-104',
    studentName: 'Emmanuel Chukwu',
    classGroup: 'Grade 11 Science',
    totalAmount: 1600,
    amountPaid: 800,
    balanceDue: 800,
    dueDate: '2026-10-15',
    status: 'Partial',
    items: [
      { description: 'Tuition Fee - 1st Term', amount: 850 },
      { description: 'Boarding House Accommodation', amount: 600 },
      { description: 'Science Lab Practicals', amount: 150 }
    ],
    termSession: '2026/2027 Session - 1st Term'
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
    academicSession: '2026/2027',
    term: '1st Term',
    totalScore: 472,
    averageScore: 94.4,
    classPosition: 1,
    totalStudentsInClass: 28,
    attendanceDaysPresent: 62,
    totalSchoolDays: 63,
    formTeacherRemark: 'Amina is an exceptional student who consistently displays academic excellence and leadership qualities. Keep up the high standard!',
    principalRemark: 'Outstanding performance. An exemplary ambassador for Golden Horizon College.',
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
    academicSession: '2026/2027',
    term: '1st Term',
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
  },
  {
    id: 'rep-103',
    studentId: 'std-107',
    studentName: 'Chidera Obi',
    admissionNo: 'KS/2024/007',
    classGroup: 'Basic 5',
    academicSession: '2026/2027',
    term: '1st Term',
    totalScore: 485,
    averageScore: 97.0,
    classPosition: 1,
    totalStudentsInClass: 24,
    attendanceDaysPresent: 63,
    totalSchoolDays: 63,
    formTeacherRemark: 'Chidera is exceptionally diligent, polite, and top in Mathematics and Science. Well prepared for National Common Entrance!',
    principalRemark: 'A star pupil of our primary section. Bravo!',
    isPublished: true,
    subjectScores: [
      { subjectName: 'Numeracy / Mathematics', ca1: 15, ca2: 15, exam: 69, total: 99, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Literacy / English Studies', ca1: 14, ca2: 15, exam: 66, total: 95, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Basic Science & Technology', ca1: 15, ca2: 14, exam: 68, total: 97, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Social Studies & Civic Habits', ca1: 15, ca2: 15, exam: 66, total: 96, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Quantitative Reasoning', ca1: 15, ca2: 15, exam: 68, total: 98, grade: 'A', remark: 'Distinction' }
    ],
    domainRatings: [
      { category: 'Cognitive', trait: 'Attentiveness & Problem Solving', score: 5 },
      { category: 'Affective', trait: 'Honesty & Neatness', score: 5 },
      { category: 'Affective', trait: 'Politeness & Cooperation', score: 5 },
      { category: 'Psychomotor', trait: 'Handwriting & Drawing', score: 5 },
      { category: 'Psychomotor', trait: 'Physical Coordination', score: 5 }
    ]
  },
  {
    id: 'rep-104',
    studentId: 'std-110',
    studentName: 'Favour Daniel',
    admissionNo: 'KS/2024/010',
    classGroup: 'Nursery 2',
    academicSession: '2026/2027',
    term: '1st Term',
    totalScore: 390,
    averageScore: 97.5,
    classPosition: 1,
    totalStudentsInClass: 18,
    attendanceDaysPresent: 63,
    totalSchoolDays: 63,
    formTeacherRemark: 'Favour reads three-letter words effortlessly and counts up to 100 accurately. Very joyful child.',
    principalRemark: 'Excellent progress in early years foundation.',
    isPublished: true,
    subjectScores: [
      { subjectName: 'Phonics & Spelling', ca1: 20, ca2: 20, exam: 60, total: 100, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Pre-Maths & Numbers', ca1: 19, ca2: 20, exam: 58, total: 97, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Letter Work & Writing', ca1: 18, ca2: 19, exam: 58, total: 95, grade: 'A', remark: 'Distinction' },
      { subjectName: 'Sensory Exploration & Rhymes', ca1: 20, ca2: 20, exam: 58, total: 98, grade: 'A', remark: 'Distinction' }
    ],
    domainRatings: [
      { category: 'Affective', trait: 'Sharing & Empathy', score: 5 },
      { category: 'Affective', trait: 'Class Participation', score: 5 },
      { category: 'Psychomotor', trait: 'Pencil Grip & Colouring', score: 5 },
      { category: 'Psychomotor', trait: 'Outdoor Play & Balance', score: 5 }
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
  },
  {
    id: 'cbt-103',
    title: 'Basic 5 National Common Entrance Mathematics Mock',
    subject: 'Numeracy / Mathematics',
    classGroup: 'Basic 5',
    durationMinutes: 25,
    totalMarks: 30,
    scheduledDate: '2025-10-29',
    status: 'Active',
    questions: [
      {
        id: 'bp1',
        question: 'What is the place value of 7 in the number 478,219?',
        options: ['Ten Thousands (70,000)', 'Thousands (7,000)', 'Hundreds (700)', 'Millions (7,000,000)'],
        correctIndex: 0,
        explanation: '7 is in the ten-thousands column: 7 × 10,000 = 70,000.'
      },
      {
        id: 'bp2',
        question: 'Find the Lowest Common Multiple (L.C.M) of 6, 8, and 12.',
        options: ['24', '48', '12', '36'],
        correctIndex: 0,
        explanation: 'Multiples of 12: 12, 24, 36... 24 is divisible by 6, 8, and 12.'
      },
      {
        id: 'bp3',
        question: 'Express 3/5 as a percentage.',
        options: ['60%', '35%', '50%', '75%'],
        correctIndex: 0,
        explanation: '(3 / 5) × 100% = 60%.'
      }
    ]
  },
  {
    id: 'cbt-104',
    title: 'Basic 3 Science Living Things & Habitats Quiz',
    subject: 'Basic Science & Technology',
    classGroup: 'Basic 3',
    durationMinutes: 20,
    totalMarks: 20,
    scheduledDate: '2025-10-30',
    status: 'Active',
    questions: [
      {
        id: 'b3s1',
        question: 'Which of these is a characteristic of all living things?',
        options: ['They can grow and reproduce', 'They never need water', 'They are made of plastic', 'They do not breathe'],
        correctIndex: 0,
        explanation: 'Living things exhibit MRS GREN characteristics including growth and reproduction.'
      },
      {
        id: 'b3s2',
        question: 'Which habitat does a fish live in?',
        options: ['Aquatic (Water)', 'Terrestrial (Land)', 'Desert', 'Arboreal (Trees)'],
        correctIndex: 0,
        explanation: 'Fish possess gills suited for breathing in aquatic environments.'
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Inter-House Sports Competition & Annual Cultural Day',
    content: 'All parents, guardians, and students are hereby invited to Golden Horizon Schools Annual Cultural Day & Inter-House Sports competition scheduled for November 12th at the School Sports Complex.',
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
  },
  {
    id: 'hw-104',
    title: 'Basic 5 Fraction Addition & Word Problems Practice',
    subject: 'Numeracy / Mathematics',
    classGroup: 'Basic 5',
    teacherName: 'Mr. Samuel Adeleke',
    dueDate: '2025-10-27',
    assignedDate: '2025-10-21',
    maxPoints: 20,
    description: 'Solve questions 1-10 in Primary Math Workbook page 42. Show all workings clearly.',
    submissionsCount: 22,
    totalStudents: 24
  },
  {
    id: 'hw-105',
    title: 'Basic 3 Plant Life Cycle & Parts of a Flower Drawing',
    subject: 'Basic Science & Technology',
    classGroup: 'Basic 3',
    teacherName: 'Mrs. Joy Danladi',
    dueDate: '2025-10-29',
    assignedDate: '2025-10-22',
    maxPoints: 15,
    description: 'Draw and neatly label the 4 main parts of a flowering plant in your science drawing book.',
    submissionsCount: 18,
    totalStudents: 20
  },
  {
    id: 'hw-106',
    title: 'Nursery 2 Rhymes & Phonics 3-Letter Word Formation',
    subject: 'Phonics & Spelling',
    classGroup: 'Nursery 2',
    teacherName: 'Mrs. Blessing Okafor',
    dueDate: '2025-10-26',
    assignedDate: '2025-10-20',
    maxPoints: 10,
    description: 'Practice sounding out "cat", "bat", "mat", "hat", "rat" and write each word 3 times with parent guidance.',
    submissionsCount: 16,
    totalStudents: 18
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
    message: 'Dear Parent, Mid-Term report cards for Grade 10 A have been published on the Golden Horizon Parent Portal. Login to review.',
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
    message: 'URGENT: Fee reminder notice for 1st Term balance. Please visit the Bursary or pay online via Parent Portal.',
    sentAt: '2026-09-15 11:00',
    status: 'Delivered',
    totalRecipients: 84
  },
  {
    id: 'bc-4',
    channel: 'SMS',
    recipientGroup: 'Primary & Nursery Parents',
    message: 'Notice from Head Teacher Office: Early Years and Primary pupils will participate in World Book Day celebration on Thursday. Please dress up in character costumes!',
    sentAt: '2026-09-21 08:30',
    status: 'Delivered',
    totalRecipients: 140
  },
  {
    id: 'bc-5',
    channel: 'SMS',
    recipientGroup: 'Basic 5 Common Entrance Parents',
    message: 'Dear Basic 5 Parents, National Common Entrance Examination intensive coaching starts next Monday at 3:00 PM.',
    sentAt: '2026-09-22 10:00',
    status: 'Delivered',
    totalRecipients: 24
  }
];

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'Golden Horizon College/Primary',
  secondarySchoolName: 'Golden Horizon College',
  primarySchoolName: 'Golden Horizon Nursery and Primary School',
  website: 'goldenhorizoncollege.org.ng',
  email: 'info@goldenhorizoncollege.org.ng',
  altEmail: 'admin@goldenhorizoncollege.org.ng',
  phone: '+234 (814)-012-1575, +234 815 025 1809, +234 808 422 9418',
  phoneNumbers: [
    '+234 (814)-012-1575',
    '+234 815 025 1809',
    '+234 808 422 9418'
  ],
  motto: 'Excellence in Knowledge, Innovation & Character',
  academicSession: '2026/2027 Academic Session',
  currentTerm: '1st Term',
  principalName: 'Dr. Elizabeth Sterling',
  headTeacherName: 'Mrs. Folashade Adeleke',
  gradingSystem: 'Grade A: 70-100%, Grade B: 60-69%, Grade C: 50-59%, Grade D: 40-49%, Grade F: <40%',
  logoUrl: DEFAULT_SCHOOL_LOGO_DATA_URI,
  stampUrl: DEFAULT_SCHOOL_STAMP_DATA_URI
};

export const INITIAL_CLASSES: SchoolClass[] = [
  // Secondary Section
  {
    id: 'cls-sec-101',
    name: 'Grade 10 A',
    section: 'Secondary',
    level: 'Grade 10',
    arm: 'A',
    category: 'Senior Secondary',
    classTeacherId: 'tch-201',
    classTeacherName: 'Dr. Marcus Vance',
    capacity: 35,
    room: 'College Block A - Room 101',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary Grade 10 Alpha Stream'
  },
  {
    id: 'cls-sec-102',
    name: 'Grade 10 B',
    section: 'Secondary',
    level: 'Grade 10',
    arm: 'B',
    category: 'Senior Secondary',
    classTeacherId: 'tch-202',
    classTeacherName: 'Mrs. Victoria Nwosu',
    capacity: 35,
    room: 'College Block A - Room 102',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary Grade 10 Beta Stream'
  },
  {
    id: 'cls-sec-103',
    name: 'Grade 11 Science',
    section: 'Secondary',
    level: 'Grade 11',
    arm: 'Science',
    category: 'Senior Secondary',
    classTeacherId: 'tch-203',
    classTeacherName: 'Mr. Gabriel Thorne',
    capacity: 30,
    room: 'Advanced STEM & Robotics Wing',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Grade 11 Specialized Natural Sciences & Engineering stream'
  },
  {
    id: 'cls-sec-104',
    name: 'Grade 12 Art',
    section: 'Secondary',
    level: 'Grade 12',
    arm: 'Art',
    category: 'Senior Secondary',
    capacity: 30,
    room: 'Humanities Studio Room 3',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Grade 12 Humanities, Languages & Social Arts class'
  },
  {
    id: 'cls-sec-105',
    name: 'JSS 1 A',
    section: 'Secondary',
    level: 'JSS 1',
    arm: 'A',
    category: 'Junior Secondary',
    capacity: 35,
    room: 'Junior College Block - Rm 1',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Junior Secondary School 1 Alpha'
  },
  {
    id: 'cls-sec-106',
    name: 'JSS 1 B',
    section: 'Secondary',
    level: 'JSS 1',
    arm: 'B',
    category: 'Junior Secondary',
    capacity: 35,
    room: 'Junior College Block - Rm 2',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Junior Secondary School 1 Beta'
  },
  {
    id: 'cls-sec-107',
    name: 'JSS 2 A',
    section: 'Secondary',
    level: 'JSS 2',
    arm: 'A',
    category: 'Junior Secondary',
    capacity: 35,
    room: 'Junior College Block - Rm 3',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Junior Secondary School 2 Alpha'
  },
  {
    id: 'cls-sec-108',
    name: 'JSS 2 B',
    section: 'Secondary',
    level: 'JSS 2',
    arm: 'B',
    category: 'Junior Secondary',
    capacity: 35,
    room: 'Junior College Block - Rm 4',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Junior Secondary School 2 Beta'
  },
  {
    id: 'cls-sec-109',
    name: 'JSS 3 A',
    section: 'Secondary',
    level: 'JSS 3',
    arm: 'A',
    category: 'Junior Secondary',
    capacity: 35,
    room: 'Junior College Block - Rm 5',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Junior Secondary School 3 Basic Certificate Exam Class'
  },
  {
    id: 'cls-sec-110',
    name: 'SSS 1 Science',
    section: 'Secondary',
    level: 'SSS 1',
    arm: 'Science',
    category: 'Senior Secondary',
    capacity: 35,
    room: 'Senior College - Lab 1',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary 1 Sciences'
  },
  {
    id: 'cls-sec-111',
    name: 'SSS 1 Arts',
    section: 'Secondary',
    level: 'SSS 1',
    arm: 'Arts',
    category: 'Senior Secondary',
    capacity: 35,
    room: 'Senior College - Arts Wing',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary 1 Arts & Humanities'
  },
  {
    id: 'cls-sec-112',
    name: 'SSS 2 Science',
    section: 'Secondary',
    level: 'SSS 2',
    arm: 'Science',
    category: 'Senior Secondary',
    capacity: 35,
    room: 'Senior College - Lab 2',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary 2 Sciences & Math'
  },
  {
    id: 'cls-sec-113',
    name: 'SSS 3 Science',
    section: 'Secondary',
    level: 'SSS 3',
    arm: 'Science',
    category: 'Senior Secondary',
    capacity: 35,
    room: 'Senior College - Honors Room',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Senior Secondary 3 WAEC/NECO Examination Class'
  },

  // Nursery & Primary Section
  {
    id: 'cls-pri-201',
    name: 'Kindergarten',
    section: 'Primary',
    level: 'Kindergarten',
    arm: 'Main',
    category: 'Early Years',
    capacity: 25,
    room: 'Early Years Activity Center A',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Early childhood sensory and foundation learning'
  },
  {
    id: 'cls-pri-202',
    name: 'Nursery 1',
    section: 'Primary',
    level: 'Nursery 1',
    arm: 'Main',
    category: 'Early Years',
    classTeacherId: 'tch-204',
    classTeacherName: 'Mrs. Blessing Okafor',
    capacity: 25,
    room: 'Early Years Nursery Block - Rm 1',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Montessori early literacy & phonics foundation'
  },
  {
    id: 'cls-pri-203',
    name: 'Nursery 2',
    section: 'Primary',
    level: 'Nursery 2',
    arm: 'Main',
    category: 'Early Years',
    capacity: 25,
    room: 'Early Years Nursery Block - Rm 2',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Pre-primary numeracy and motor-skills development'
  },
  {
    id: 'cls-pri-204',
    name: 'Basic 1',
    section: 'Primary',
    level: 'Basic 1',
    arm: 'Main',
    category: 'Primary',
    capacity: 30,
    room: 'Primary Block 1 - Room 101',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Elementary Grade 1 fundamental curriculum'
  },
  {
    id: 'cls-pri-205',
    name: 'Basic 2',
    section: 'Primary',
    level: 'Basic 2',
    arm: 'Main',
    category: 'Primary',
    capacity: 30,
    room: 'Primary Block 1 - Room 102',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Elementary Grade 2 core curriculum'
  },
  {
    id: 'cls-pri-206',
    name: 'Basic 3',
    section: 'Primary',
    level: 'Basic 3',
    arm: 'Main',
    category: 'Primary',
    classTeacherId: 'tch-206',
    classTeacherName: 'Mrs. Joy Danladi',
    capacity: 30,
    room: 'Primary Block 2 - Room 201',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Elementary Grade 3 integrated science and quantitative skills'
  },
  {
    id: 'cls-pri-207',
    name: 'Basic 4',
    section: 'Primary',
    level: 'Basic 4',
    arm: 'Main',
    category: 'Primary',
    capacity: 30,
    room: 'Primary Block 2 - Room 202',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Elementary Grade 4 intermediate curriculum'
  },
  {
    id: 'cls-pri-208',
    name: 'Basic 5',
    section: 'Primary',
    level: 'Basic 5',
    arm: 'Main',
    category: 'Primary',
    classTeacherId: 'tch-205',
    classTeacherName: 'Mr. Samuel Adeleke',
    capacity: 30,
    room: 'Primary Block 3 - Rm 301',
    status: 'Active',
    academicSession: '2026/2027',
    description: 'Elementary graduating class - National Common Entrance Exam Prep'
  }
];

export const INITIAL_SUBJECTS: SchoolSubject[] = [
  // ==========================================
  // SECONDARY SCHOOL SUBJECTS (Principal)
  // ==========================================
  {
    id: 'sub-sec-001',
    name: 'Mathematics',
    code: 'MTH-SEC',
    section: 'Secondary',
    category: 'Core',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'],
    applicableClasses: [
      'Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art',
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B',
      'SSS 1 Science', 'SSS 1 Arts', 'SSS 1 Commercial',
      'SSS 2 Science', 'SSS 2 Arts', 'SSS 2 Commercial',
      'SSS 3 Science', 'SSS 3 Arts', 'SSS 3 Commercial'
    ],
    isCompulsory: true,
    weeklyPeriods: 5,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Foundational secondary algebra, geometry, trigonometry, and general mathematics curriculum aligned to WAEC/NECO.',
    status: 'Active'
  },
  {
    id: 'sub-sec-002',
    name: 'English Language',
    code: 'ENG-SEC',
    section: 'Secondary',
    category: 'Core',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'],
    applicableClasses: [
      'Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art',
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B',
      'SSS 1 Science', 'SSS 1 Arts', 'SSS 1 Commercial',
      'SSS 2 Science', 'SSS 2 Arts', 'SSS 2 Commercial',
      'SSS 3 Science', 'SSS 3 Arts', 'SSS 3 Commercial'
    ],
    isCompulsory: true,
    weeklyPeriods: 5,
    passMark: 50,
    teacherName: 'Mrs. Victoria Nwosu',
    teacherId: 'tch-202',
    description: 'Grammar, comprehension, continuous writing, summary skills, and oral English for senior secondary certifications.',
    status: 'Active'
  },
  {
    id: 'sub-sec-003',
    name: 'Civic Education',
    code: 'CIV-SEC',
    section: 'Secondary',
    category: 'Core',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'],
    applicableClasses: [
      'Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art',
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B',
      'SSS 1 Science', 'SSS 1 Arts', 'SSS 1 Commercial',
      'SSS 2 Science', 'SSS 2 Arts', 'SSS 2 Commercial',
      'SSS 3 Science', 'SSS 3 Arts', 'SSS 3 Commercial'
    ],
    isCompulsory: true,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Democratic governance, human rights, civic responsibilities, and ethical national development.',
    status: 'Active'
  },
  {
    id: 'sub-sec-004',
    name: 'Physics',
    code: 'PHY-SEC',
    section: 'Secondary',
    category: 'Sciences',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11'],
    applicableClasses: [
      'Grade 10 A', 'Grade 11 Science',
      'SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Classical mechanics, optics, wave motion, electricity, thermodynamics, and modern physics practicals.',
    status: 'Active'
  },
  {
    id: 'sub-sec-005',
    name: 'Chemistry',
    code: 'CHM-SEC',
    section: 'Secondary',
    category: 'Sciences',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11'],
    applicableClasses: [
      'Grade 10 A', 'Grade 11 Science',
      'SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'General, organic, physical, and qualitative/quantitative chemical laboratory analysis.',
    status: 'Active'
  },
  {
    id: 'sub-sec-006',
    name: 'Biology',
    code: 'BIO-SEC',
    section: 'Secondary',
    category: 'Sciences',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'],
    applicableClasses: [
      'Grade 10 A', 'Grade 10 B', 'Grade 11 Science', 'Grade 12 Art',
      'SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mrs. Victoria Nwosu',
    teacherId: 'tch-202',
    description: 'Physiology, genetics, ecology, morphology, and botanical/zoological investigations.',
    status: 'Active'
  },
  {
    id: 'sub-sec-007',
    name: 'Further Mathematics',
    code: 'FMTH-SEC',
    section: 'Secondary',
    category: 'Sciences',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 11'],
    applicableClasses: [
      'Grade 11 Science', 'SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Advanced calculus, vector algebra, complex numbers, mechanics, and probability statistics.',
    status: 'Active'
  },
  {
    id: 'sub-sec-008',
    name: 'Computer Studies / ICT',
    code: 'ICT-SEC',
    section: 'Secondary',
    category: 'STEM & ICT',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10'],
    applicableClasses: [
      'Grade 10 A', 'Grade 10 B',
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B',
      'SSS 1 Science', 'SSS 1 Commercial'
    ],
    isCompulsory: true,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Data structures, algorithm design, digital literacy, networking fundamentals, and web concepts.',
    status: 'Active'
  },
  {
    id: 'sub-sec-009',
    name: 'Economics',
    code: 'ECO-SEC',
    section: 'Secondary',
    category: 'Commercial & Social Sciences',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 11', 'Grade 12'],
    applicableClasses: [
      'Grade 11 Science', 'Grade 12 Art',
      'SSS 1 Commercial', 'SSS 1 Arts',
      'SSS 2 Commercial', 'SSS 2 Arts',
      'SSS 3 Commercial', 'SSS 3 Arts'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Microeconomics, macroeconomics, monetary systems, public finance, and international trade.',
    status: 'Active'
  },
  {
    id: 'sub-sec-010',
    name: 'Literature in English',
    code: 'LIT-SEC',
    section: 'Secondary',
    category: 'Arts & Humanities',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 12'],
    applicableClasses: [
      'Grade 12 Art', 'SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts'
    ],
    isCompulsory: false,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mrs. Victoria Nwosu',
    teacherId: 'tch-202',
    description: 'African & non-African prose, drama, poetry analysis, and literary critical appreciation.',
    status: 'Active'
  },
  {
    id: 'sub-sec-011',
    name: 'Government',
    code: 'GOV-SEC',
    section: 'Secondary',
    category: 'Arts & Humanities',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 12'],
    applicableClasses: [
      'Grade 12 Art', 'SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Political institutions, Nigerian constitutional development, political philosophies, and foreign policy.',
    status: 'Active'
  },
  {
    id: 'sub-sec-012',
    name: 'Financial Accounting',
    code: 'ACC-SEC',
    section: 'Secondary',
    category: 'Commercial & Business',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3'],
    applicableClasses: [
      'SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial'
    ],
    isCompulsory: false,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Double-entry bookkeeping, ledger reconciliation, company accounts, and financial statement reporting.',
    status: 'Active'
  },
  {
    id: 'sub-sec-013',
    name: 'Commerce',
    code: 'COM-SEC',
    section: 'Secondary',
    category: 'Commercial & Business',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3'],
    applicableClasses: [
      'SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Wholesale, retail, banking services, insurance, transportation, and business advertising.',
    status: 'Active'
  },
  {
    id: 'sub-sec-014',
    name: 'Agricultural Science',
    code: 'AGR-SEC',
    section: 'Secondary',
    category: 'Technical & Vocational',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2'],
    applicableClasses: [
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B',
      'SSS 1 Science', 'SSS 2 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Crop production, animal husbandry, soil science, farm mechanization, and agricultural economics.',
    status: 'Active'
  },
  {
    id: 'sub-sec-015',
    name: 'Technical Drawing',
    code: 'TD-SEC',
    section: 'Secondary',
    category: 'Technical & Engineering',
    classLevels: ['SSS 1', 'SSS 2', 'SSS 3'],
    applicableClasses: [
      'SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'
    ],
    isCompulsory: false,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Dr. Marcus Vance',
    teacherId: 'tch-201',
    description: 'Isometric and orthographic projections, geometrical constructions, and architectural drafts.',
    status: 'Active'
  },
  {
    id: 'sub-sec-016',
    name: 'Basic Science & Technology',
    code: 'BST-JSS',
    section: 'Secondary',
    category: 'Junior Secondary Core',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3'],
    applicableClasses: [
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B'
    ],
    isCompulsory: true,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Integrated introductory science, basic technology concepts, and foundational technical workshops for BECE.',
    status: 'Active'
  },
  {
    id: 'sub-sec-017',
    name: 'Business Studies',
    code: 'BUS-JSS',
    section: 'Secondary',
    category: 'Junior Secondary Commercial',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3'],
    applicableClasses: [
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B'
    ],
    isCompulsory: true,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mr. Gabriel Thorne',
    teacherId: 'tch-203',
    description: 'Introductory bookkeeping, office practices, keyboarding skills, and entrepreneurial habits.',
    status: 'Active'
  },
  {
    id: 'sub-sec-018',
    name: 'French Language',
    code: 'FRN-SEC',
    section: 'Secondary',
    category: 'Modern Languages',
    classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1'],
    applicableClasses: [
      'JSS 1 A', 'JSS 1 B', 'JSS 2 A', 'JSS 2 B', 'JSS 3 A', 'JSS 3 B'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mrs. Victoria Nwosu',
    teacherId: 'tch-202',
    description: 'Grammaire, vocabulaire, expression orale et écrite, et civilisation francophone.',
    status: 'Active'
  },

  // ==========================================
  // PRIMARY & EARLY YEARS SUBJECTS (Head Teacher)
  // ==========================================
  {
    id: 'sub-pri-101',
    name: 'Literacy & English Studies',
    code: 'LIT-PRI',
    section: 'Primary',
    category: 'Language Arts & Phonics',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten',
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 5,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Foundational English reading, guided comprehension, vocabulary building, grammar, and essay writing.',
    status: 'Active'
  },
  {
    id: 'sub-pri-102',
    name: 'Numeracy & Mathematics',
    code: 'NUM-PRI',
    section: 'Primary',
    category: 'Mathematics & Numeracy',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten',
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 5,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Number work, place value, operations, fractions, shapes, measurement, and elementary problem solving.',
    status: 'Active'
  },
  {
    id: 'sub-pri-103',
    name: 'Phonics, Diction & Spelling',
    code: 'PHN-PRI',
    section: 'Primary',
    category: 'Language Arts & Phonics',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2', 'Basic 3'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten',
      'Basic 1', 'Basic 2', 'Basic 3'
    ],
    isCompulsory: true,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Jolly Phonics letter blends, vowel digraphs, phonetic transcription, elocution, and spelling bees.',
    status: 'Active'
  },
  {
    id: 'sub-pri-104',
    name: 'Basic Science & Technology',
    code: 'BST-PRI',
    section: 'Primary',
    category: 'Science & Discovery',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Living and non-living things, plants, animals, weather, simple machines, and technology explorations.',
    status: 'Active'
  },
  {
    id: 'sub-pri-105',
    name: 'Social Studies & Civic Habits',
    code: 'SOS-PRI',
    section: 'Primary',
    category: 'Social Sciences & Citizenship',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Family life, cultural heritage, national symbols, road safety, and civic moral habits.',
    status: 'Active'
  },
  {
    id: 'sub-pri-106',
    name: 'Quantitative Reasoning',
    code: 'QR-PRI',
    section: 'Primary',
    category: 'Aptitude & Reasoning',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Numerical patterns, logic puzzles, spatial math thinking, and Common Entrance aptitude training.',
    status: 'Active'
  },
  {
    id: 'sub-pri-107',
    name: 'Verbal Reasoning',
    code: 'VR-PRI',
    section: 'Primary',
    category: 'Aptitude & Reasoning',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 3,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Word codes, anagrams, antonyms/synonyms, analogy sequences, and critical English verbal aptitude.',
    status: 'Active'
  },
  {
    id: 'sub-pri-108',
    name: 'Creative & Cultural Arts (CCA)',
    code: 'CCA-PRI',
    section: 'Primary',
    category: 'Creative & Expressive Arts',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten',
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Color theory, sketching, local handicrafts, music rhythm, and cultural drama performance.',
    status: 'Active'
  },
  {
    id: 'sub-pri-109',
    name: 'Physical & Health Education (PHE)',
    code: 'PHE-PRI',
    section: 'Primary',
    category: 'Physical & Health Education',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Athletics, calisthenics, team sportsmanship, personal hygiene, and clean environmental health habits.',
    status: 'Active'
  },
  {
    id: 'sub-pri-110',
    name: 'ICT / Computer Fundamentals',
    code: 'ICT-PRI',
    section: 'Primary',
    category: 'Technology & Digital Skills',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: true,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Computer parts, mouse control, keyboarding, kid-friendly drawing apps, and digital safety habits.',
    status: 'Active'
  },
  {
    id: 'sub-pri-111',
    name: 'Christian / Islamic Religious Knowledge',
    code: 'CRK-PRI',
    section: 'Primary',
    category: 'Moral & Religious Studies',
    classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Moral values, spiritual teachings, respect for elders, honesty, and peaceful communal coexistence.',
    status: 'Active'
  },
  {
    id: 'sub-pri-112',
    name: 'Handwriting & Penmanship',
    code: 'HW-PRI',
    section: 'Primary',
    category: 'Language Arts & Phonics',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten', 'Basic 1', 'Basic 2'
    ],
    isCompulsory: true,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Fine motor control, cursive lettering, neat margins, pencil grip, and penmanship alignment.',
    status: 'Active'
  },
  {
    id: 'sub-pri-113',
    name: 'Sensory Exploration & Nursery Rhymes',
    code: 'SNY-EY',
    section: 'Primary',
    category: 'Early Years & Sensory Play',
    classLevels: ['Nursery 1', 'Nursery 2', 'Kindergarten'],
    applicableClasses: [
      'Nursery 1', 'Nursery 2', 'Kindergarten'
    ],
    isCompulsory: true,
    weeklyPeriods: 4,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Tactile sensory play, musical sing-alongs, nursery rhymes, motor coordination, and color recognition.',
    status: 'Active'
  },
  {
    id: 'sub-pri-114',
    name: 'French for Beginners',
    code: 'FRN-PRI',
    section: 'Primary',
    category: 'Languages & Communication',
    classLevels: ['Basic 3', 'Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 3', 'Basic 4', 'Basic 5'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mrs. Folashade Adeleke',
    teacherId: 'tch-204',
    description: 'Salutations simples, chiffres, couleurs, chansons françaises et vocabulaire quotidien pour enfants.',
    status: 'Active'
  },
  {
    id: 'sub-pri-115',
    name: 'Pre-Vocational Studies & Handcrafts',
    code: 'VOC-PRI',
    section: 'Primary',
    category: 'Vocational Aptitude',
    classLevels: ['Basic 4', 'Basic 5'],
    applicableClasses: [
      'Basic 4', 'Basic 5'
    ],
    isCompulsory: false,
    weeklyPeriods: 2,
    passMark: 50,
    teacherName: 'Mr. Samuel Adeleke',
    teacherId: 'tch-205',
    description: 'Introductory domestic skills, simple agriculture, sewing basics, and practical workshop aptitude.',
    status: 'Active'
  }
];


