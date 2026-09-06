import { UserRole, SchoolSettings, SchoolSubject, SchoolClass, Teacher, UserAccount } from '../types';
import { DEFAULT_SCHOOL_LOGO_DATA_URI, DEFAULT_SCHOOL_STAMP_DATA_URI } from '../assets/schoolAssets';

export const SECONDARY_CLASSES = [
  'JSS 1 A',
  'JSS 1 B',
  'JSS 2 A',
  'JSS 2 B',
  'JSS 3 A',
  'JSS 3 B',
  'SSS 1 Science',
  'SSS 1 Arts',
  'SSS 1 Commercial',
  'SSS 2 Science',
  'SSS 2 Arts',
  'SSS 2 Commercial',
  'SSS 3 Science',
  'SSS 3 Arts',
  'SSS 3 Commercial',
  'Grade 10 A',
  'Grade 10 B',
  'Grade 11 Science',
  'Grade 12 Art'
];

export const JUNIOR_SECONDARY_CLASSES = [
  'JSS 1 A',
  'JSS 1 B',
  'JSS 2 A',
  'JSS 2 B',
  'JSS 3 A',
  'JSS 3 B'
];

export const SENIOR_SECONDARY_CLASSES = [
  'SSS 1 Science',
  'SSS 1 Arts',
  'SSS 1 Commercial',
  'SSS 2 Science',
  'SSS 2 Arts',
  'SSS 2 Commercial',
  'SSS 3 Science',
  'SSS 3 Arts',
  'SSS 3 Commercial',
  'Grade 10 A',
  'Grade 10 B',
  'Grade 11 Science',
  'Grade 12 Art'
];

export const PRIMARY_CLASSES = [
  'Nursery',
  'Reception',
  'Kindergarten',
  'Nursery 1',
  'Nursery 2',
  'Basic 1',
  'Basic 2',
  'Basic 3',
  'Basic 4',
  'Basic 5'
];

export const JUNIOR_SECONDARY_SUBJECTS = [
  { id: 'jss-sub-1', name: 'Mathematics (Junior)', code: 'MTH-JSS', category: 'Junior Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-2', name: 'English Studies', code: 'ENG-JSS', category: 'Junior Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-3', name: 'Basic Science & Technology', code: 'BST-JSS', category: 'Junior STEM', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-4', name: 'Business Studies', code: 'BUS-JSS', category: 'Junior Pre-Vocational', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-5', name: 'Civic Education (Junior)', code: 'CIV-JSS', category: 'Junior Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-6', name: 'Social Studies', code: 'SOS-JSS', category: 'Junior Humanities', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-7', name: 'Agricultural Science (Junior)', code: 'AGR-JSS', category: 'Junior Pre-Vocational', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-8', name: 'Computer Studies / ICT', code: 'ICT-JSS', category: 'Junior STEM', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-9', name: 'Physical & Health Education (PHE)', code: 'PHE-JSS', category: 'Junior Health', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-10', name: 'Christian Religious Studies (CRS)', code: 'CRS-JSS', category: 'Junior Moral', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-11', name: 'Islamic Religious Studies (IRS)', code: 'IRS-JSS', category: 'Junior Moral', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-12', name: 'Cultural & Creative Arts (CCA)', code: 'CCA-JSS', category: 'Junior Creative', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-13', name: 'French Language (Junior)', code: 'FRN-JSS', category: 'Junior Languages', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { id: 'jss-sub-14', name: 'Home Economics', code: 'HEC-JSS', category: 'Junior Pre-Vocational', classLevels: ['JSS 1', 'JSS 2', 'JSS 3'] }
];

export const SENIOR_SECONDARY_SUBJECTS = [
  { id: 'sss-sub-1', name: 'General Mathematics', code: 'MTH-SSS', category: 'Core', classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sss-sub-2', name: 'English Language', code: 'ENG-SSS', category: 'Core', classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sss-sub-3', name: 'Civic Education', code: 'CIV-SSS', category: 'Core', classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sss-sub-4', name: 'Physics', code: 'PHY-SSS', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sss-sub-5', name: 'Chemistry', code: 'CHM-SSS', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sss-sub-6', name: 'Biology', code: 'BIO-SSS', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sss-sub-7', name: 'Further Mathematics', code: 'FMTH-SSS', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 11 Science'] },
  { id: 'sss-sub-8', name: 'Computer Studies / Data Processing', code: 'ICT-SSS', category: 'STEM & ICT', classLevels: ['SSS 1', 'SSS 2', 'SSS 3', 'Grade 10 A', 'Grade 10 B'] },
  { id: 'sss-sub-9', name: 'Economics', code: 'ECO-SSS', category: 'Commercial & Arts', classLevels: ['SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial', 'Grade 11 Science', 'Grade 12 Art'] },
  { id: 'sss-sub-10', name: 'Literature in English', code: 'LIT-SSS', category: 'Arts & Humanities', classLevels: ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts', 'Grade 12 Art'] },
  { id: 'sss-sub-11', name: 'Government', code: 'GOV-SSS', category: 'Arts & Humanities', classLevels: ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts', 'Grade 12 Art'] },
  { id: 'sss-sub-12', name: 'Financial Accounting', code: 'ACC-SSS', category: 'Commercial', classLevels: ['SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial'] },
  { id: 'sss-sub-13', name: 'Commerce', code: 'COM-SSS', category: 'Commercial', classLevels: ['SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial'] },
  { id: 'sss-sub-14', name: 'Agricultural Science', code: 'AGR-SSS', category: 'Vocational & Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science'] },
  { id: 'sss-sub-15', name: 'Technical Drawing', code: 'TD-SSS', category: 'Technical', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'] },
  { id: 'sss-sub-16', name: 'Christian Religious Studies (CRS)', code: 'CRS-SSS', category: 'Arts & Humanities', classLevels: ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts'] },
  { id: 'sss-sub-17', name: 'Geography', code: 'GEO-SSS', category: 'Social Sciences', classLevels: ['SSS 1 Arts', 'SSS 1 Commercial', 'SSS 2 Arts'] },
  { id: 'sss-sub-18', name: 'French Language', code: 'FRN-SSS', category: 'Languages', classLevels: ['SSS 1 Arts', 'SSS 2 Arts'] }
];

export const SECONDARY_SUBJECTS = [
  { id: 'sec-sub-1', name: 'Mathematics', code: 'MTH-SEC', category: 'Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sec-sub-2', name: 'English Language', code: 'ENG-SEC', category: 'Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sec-sub-3', name: 'Civic Education', code: 'CIV-SEC', category: 'Core', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'sec-sub-4', name: 'Physics', code: 'PHY-SEC', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sec-sub-5', name: 'Chemistry', code: 'CHM-SEC', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sec-sub-6', name: 'Biology', code: 'BIO-SEC', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 10 A', 'Grade 11 Science'] },
  { id: 'sec-sub-7', name: 'Further Mathematics', code: 'FMTH-SEC', category: 'Sciences', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science', 'Grade 11 Science'] },
  { id: 'sec-sub-8', name: 'Computer Studies / ICT', code: 'ICT-SEC', category: 'STEM', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3', 'Grade 10 A', 'Grade 10 B'] },
  { id: 'sec-sub-9', name: 'Economics', code: 'ECO-SEC', category: 'Commercial & Arts', classLevels: ['SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial', 'Grade 11 Science', 'Grade 12 Art'] },
  { id: 'sec-sub-10', name: 'Literature in English', code: 'LIT-SEC', category: 'Arts & Humanities', classLevels: ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts', 'Grade 12 Art'] },
  { id: 'sec-sub-11', name: 'Government', code: 'GOV-SEC', category: 'Arts & Humanities', classLevels: ['SSS 1 Arts', 'SSS 2 Arts', 'SSS 3 Arts', 'Grade 12 Art'] },
  { id: 'sec-sub-12', name: 'Financial Accounting', code: 'ACC-SEC', category: 'Commercial', classLevels: ['SSS 1 Commercial', 'SSS 2 Commercial', 'SSS 3 Commercial'] },
  { id: 'sec-sub-13', name: 'Agricultural Science', code: 'AGR-SEC', category: 'Vocational', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2'] },
  { id: 'sec-sub-14', name: 'Technical Drawing', code: 'TD-SEC', category: 'Technical', classLevels: ['SSS 1 Science', 'SSS 2 Science', 'SSS 3 Science'] },
  { id: 'sec-sub-15', name: 'French Language', code: 'FRN-SEC', category: 'Languages', classLevels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1'] }
];

export const PRIMARY_SUBJECTS = [
  { id: 'pri-sub-1', name: 'Literacy / English Studies', code: 'LIT-PRI', category: 'Language Arts', classLevels: ['Nursery', 'Reception', 'Kindergarten', 'Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-2', name: 'Numeracy / Mathematics', code: 'NUM-PRI', category: 'Mathematics', classLevels: ['Nursery', 'Reception', 'Kindergarten', 'Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-3', name: 'Basic Science & Technology', code: 'BST-PRI', category: 'Science', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-4', name: 'Social Studies & Civic Habits', code: 'SOS-PRI', category: 'Social Sciences', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-5', name: 'Quantitative Reasoning', code: 'QR-PRI', category: 'Aptitude', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-6', name: 'Verbal Reasoning', code: 'VR-PRI', category: 'Aptitude', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-7', name: 'Creative & Cultural Arts (CCA)', code: 'CCA-PRI', category: 'Creative Arts', classLevels: ['Nursery', 'Reception', 'Kindergarten', 'Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-8', name: 'Phonics & Spelling', code: 'PHN-PRI', category: 'Early Literacy', classLevels: ['Nursery', 'Reception', 'Kindergarten', 'Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2'] },
  { id: 'pri-sub-9', name: 'Physical & Health Education (PHE)', code: 'PHE-PRI', category: 'Physical Health', classLevels: ['Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-10', name: 'ICT / Computer Fundamentals', code: 'ICT-PRI', category: 'Technology', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-11', name: 'Christian / Islamic Religious Knowledge', code: 'CRK-PRI', category: 'Moral Education', classLevels: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-12', name: 'Sensory Exploration & Rhymes', code: 'SNY-EY', category: 'Early Years', classLevels: ['Nursery', 'Reception', 'Kindergarten'] },
  { id: 'pri-sub-13', name: 'French for Beginners', code: 'FRN-PRI', category: 'Languages', classLevels: ['Basic 3', 'Basic 4', 'Basic 5'] },
  { id: 'pri-sub-14', name: 'Vocational Aptitude & Handcrafts', code: 'VOC-PRI', category: 'Vocational', classLevels: ['Basic 4', 'Basic 5'] }
];

export function isJuniorSecondaryClass(className: string): boolean {
  if (!className) return false;
  const upper = className.trim().toUpperCase();
  return (
    upper.startsWith('JSS') ||
    upper.startsWith('JS ') ||
    upper.startsWith('GRADE 7') ||
    upper.startsWith('GRADE 8') ||
    upper.startsWith('GRADE 9') ||
    upper.startsWith('YEAR 7') ||
    upper.startsWith('YEAR 8') ||
    upper.startsWith('YEAR 9')
  );
}

export function isSeniorSecondaryClass(className: string): boolean {
  if (!className) return false;
  const upper = className.trim().toUpperCase();
  return (
    upper.startsWith('SSS') ||
    upper.startsWith('SS ') ||
    upper.startsWith('GRADE 10') ||
    upper.startsWith('GRADE 11') ||
    upper.startsWith('GRADE 12') ||
    upper.startsWith('YEAR 10') ||
    upper.startsWith('YEAR 11') ||
    upper.startsWith('YEAR 12')
  );
}

export function isSecondaryClass(className: string): boolean {
  if (!className) return false;
  return isJuniorSecondaryClass(className) || isSeniorSecondaryClass(className);
}

export function isPrimaryClass(className: string): boolean {
  if (!className) return false;
  const upper = className.trim().toUpperCase();
  return (
    upper.includes('NURSERY') ||
    upper.includes('RECEPTION') ||
    upper.includes('KINDERGARTEN') ||
    upper.includes('CRECHE') ||
    upper.includes('BASIC 1') ||
    upper.includes('BASIC 2') ||
    upper.includes('BASIC 3') ||
    upper.includes('BASIC 4') ||
    upper.includes('BASIC 5') ||
    upper.includes('BASIC 6') ||
    upper.includes('PRIMARY 1') ||
    upper.includes('PRIMARY 2') ||
    upper.includes('PRIMARY 3') ||
    upper.includes('PRIMARY 4') ||
    upper.includes('PRIMARY 5') ||
    upper.includes('GRADE 1') ||
    upper.includes('GRADE 2') ||
    upper.includes('GRADE 3') ||
    upper.includes('GRADE 4') ||
    upper.includes('GRADE 5') ||
    upper.includes('YEAR 1') ||
    upper.includes('YEAR 2') ||
    upper.includes('YEAR 3') ||
    upper.includes('YEAR 4') ||
    upper.includes('YEAR 5')
  );
}

export function getSectionForRole(role: UserRole): 'secondary' | 'primary' | 'all' {
  if (role === 'principal') return 'secondary';
  if (role === 'head_teacher') return 'primary';
  return 'all';
}

export function filterStudentsByRole<T extends { classGroup: string }>(items: T[], role: UserRole): T[] {
  if (role === 'principal') {
    return items.filter((item) => isSecondaryClass(item.classGroup));
  }
  if (role === 'head_teacher') {
    return items.filter((item) => isPrimaryClass(item.classGroup));
  }
  return items;
}

export function filterTeachersByRole<T extends { formClass?: string; subjects: string[] }>(teachers: T[], role: UserRole): T[] {
  if (role === 'principal') {
    return teachers.filter((t) => {
      if (t.formClass && isSecondaryClass(t.formClass)) return true;
      if (t.subjects.some((s) => SECONDARY_SUBJECTS.some((sec) => sec.name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(sec.name.toLowerCase())))) return true;
      return !t.formClass || isSecondaryClass(t.formClass || '');
    });
  }
  if (role === 'head_teacher') {
    return teachers.filter((t) => {
      if (t.formClass && isPrimaryClass(t.formClass)) return true;
      if (t.subjects.some((s) => PRIMARY_SUBJECTS.some((pri) => pri.name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(pri.name.toLowerCase())))) return true;
      return t.formClass ? isPrimaryClass(t.formClass) : false;
    });
  }
  return teachers;
}

/**
 * Resolves all class names assigned to a teacher based on formClass, assignedClasses,
 * and classes in the school directory where this teacher is assigned as classTeacher.
 */
export function getAssignedClassesForTeacher(
  teacher: Teacher | null | undefined,
  allClasses: SchoolClass[] = []
): string[] {
  if (!teacher) return [];
  const assigned = new Set<string>();

  if (teacher.formClass && teacher.formClass.trim()) {
    assigned.add(teacher.formClass.trim());
  }

  if (Array.isArray(teacher.assignedClasses)) {
    teacher.assignedClasses.forEach((c) => {
      if (c && c.trim()) assigned.add(c.trim());
    });
  }

  if (allClasses && allClasses.length > 0) {
    allClasses.forEach((cls) => {
      if (
        (cls.classTeacherId && cls.classTeacherId === teacher.id) ||
        (cls.classTeacherName && cls.classTeacherName.trim().toLowerCase() === teacher.name.trim().toLowerCase())
      ) {
        assigned.add(cls.name.trim());
      }
    });
  }

  return Array.from(assigned);
}

/**
 * Resolves whether a subject belongs to Junior Secondary, Senior Secondary, or All Secondary
 */
export function getSubjectSecondaryTier(subject: SchoolSubject): 'Junior Secondary' | 'Senior Secondary' | 'All Secondary' {
  if (subject.secondaryTier) return subject.secondaryTier;
  const code = (subject.code || '').toUpperCase();
  const name = (subject.name || '').toLowerCase();
  const category = (subject.category || '').toLowerCase();

  if (code.includes('JSS') || category.includes('junior') || name.includes('(jss)') || name.includes('junior')) {
    return 'Junior Secondary';
  }
  if (code.includes('SSS') || category.includes('senior') || name.includes('(sss)') || name.includes('senior')) {
    return 'Senior Secondary';
  }

  // Check applicableClasses
  if (subject.applicableClasses && subject.applicableClasses.length > 0) {
    const hasJunior = subject.applicableClasses.some(isJuniorSecondaryClass);
    const hasSenior = subject.applicableClasses.some(isSeniorSecondaryClass);
    if (hasJunior && !hasSenior) return 'Junior Secondary';
    if (hasSenior && !hasJunior) return 'Senior Secondary';
  }

  // Specific subjects known to be senior-only in secondary:
  if (['physics', 'chemistry', 'biology', 'further mathematics', 'economics', 'financial accounting', 'commerce', 'government', 'literature in english', 'technical drawing'].some((s) => name.includes(s))) {
    return 'Senior Secondary';
  }
  // Specific subjects known to be junior-only in secondary:
  if (['basic science', 'basic technology', 'business studies', 'social studies'].some((s) => name.includes(s))) {
    return 'Junior Secondary';
  }

  return 'All Secondary';
}

/**
 * Resolves whether a teacher belongs to Junior Secondary, Senior Secondary, All Secondary, or Primary
 */
export function getTeacherSecondaryTier(teacher: Teacher): 'Junior Secondary' | 'Senior Secondary' | 'All Secondary' | 'Primary' {
  if (teacher.formClass && isPrimaryClass(teacher.formClass)) return 'Primary';
  if (teacher.secondaryTier) return teacher.secondaryTier;

  const formIsJunior = teacher.formClass ? isJuniorSecondaryClass(teacher.formClass) : false;
  const formIsSenior = teacher.formClass ? isSeniorSecondaryClass(teacher.formClass) : false;

  const assignedJunior = (teacher.assignedClasses || []).some(isJuniorSecondaryClass);
  const assignedSenior = (teacher.assignedClasses || []).some(isSeniorSecondaryClass);

  if ((formIsJunior || assignedJunior) && !(formIsSenior || assignedSenior)) {
    return 'Junior Secondary';
  }
  if ((formIsSenior || assignedSenior) && !(formIsJunior || assignedJunior)) {
    return 'Senior Secondary';
  }
  return 'All Secondary';
}

/**
 * Checks whether a specific class is assigned to a teacher (either as Form Teacher or Subject Teacher).
 */
export function isTeacherAssignedToClass(
  teacher: Teacher | null | undefined,
  cls: SchoolClass | string,
  currentUser?: UserAccount | null,
  allClasses: SchoolClass[] = []
): boolean {
  if (!cls) return false;
  const clsName = (typeof cls === 'string' ? cls : cls.name || '').trim().toLowerCase();
  const clsId = typeof cls === 'object' && cls ? cls.id : null;

  // Cross-portal administrative override:
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin') {
    return true;
  }
  if (currentUser?.role === 'principal') {
    return isSecondaryClass(clsName);
  }
  if (currentUser?.role === 'head_teacher') {
    return isPrimaryClass(clsName);
  }

  // 1. Direct classTeacherId match
  if (typeof cls === 'object' && cls?.classTeacherId) {
    if (teacher && cls.classTeacherId === teacher.id) return true;
    if (currentUser?.id && cls.classTeacherId === currentUser.id) return true;
    if (currentUser?.teacherId && cls.classTeacherId === currentUser.teacherId) return true;
  }

  // 2. Direct classTeacherName match
  if (typeof cls === 'object' && cls?.classTeacherName) {
    const teacherName = cls.classTeacherName.trim().toLowerCase();
    if (teacher?.name && teacher.name.trim().toLowerCase() === teacherName) return true;
    if (currentUser?.name && currentUser.name.trim().toLowerCase() === teacherName) return true;
  }

  // 3. Teacher's designated formClass
  if (teacher?.formClass && teacher.formClass.trim().toLowerCase() === clsName) {
    return true;
  }

  // 4. Teacher's assignedClasses list
  if (teacher && Array.isArray(teacher.assignedClasses)) {
    if (
      teacher.assignedClasses.some(
        (ac) => ac && (ac.trim().toLowerCase() === clsName || (clsId && ac === clsId))
      )
    ) {
      return true;
    }
  }

  // 5. Look up in allClasses if passed by string name
  if (allClasses && allClasses.length > 0) {
    const matchedClass = allClasses.find(
      (c) => (clsId && c.id === clsId) || (c.name && c.name.trim().toLowerCase() === clsName)
    );
    if (matchedClass) {
      if (matchedClass.classTeacherId) {
        if (teacher && matchedClass.classTeacherId === teacher.id) return true;
        if (currentUser?.id && matchedClass.classTeacherId === currentUser.id) return true;
        if (currentUser?.teacherId && matchedClass.classTeacherId === currentUser.teacherId) return true;
      }
      if (matchedClass.classTeacherName) {
        const ctn = matchedClass.classTeacherName.trim().toLowerCase();
        if (teacher?.name && teacher.name.trim().toLowerCase() === ctn) return true;
        if (currentUser?.name && currentUser.name.trim().toLowerCase() === ctn) return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether a teacher is specifically designated as the Class Teacher (Form Teacher)
 * for a specific class.
 */
export function isTeacherClassTeacher(
  teacher: Teacher | null | undefined,
  cls: SchoolClass | string | null | undefined,
  currentUser?: UserAccount | null,
  allClasses: SchoolClass[] = []
): boolean {
  if (!cls) return false;
  const clsName = (typeof cls === 'string' ? cls : cls.name || '').trim().toLowerCase();
  const clsId = typeof cls === 'object' && cls ? cls.id : null;

  // Cross-portal administrative override:
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin') {
    return true;
  }
  if (currentUser?.role === 'principal') {
    return isSecondaryClass(clsName);
  }
  if (currentUser?.role === 'head_teacher') {
    return isPrimaryClass(clsName);
  }

  // 1. Teacher designated formClass match
  if (teacher?.formClass && teacher.formClass.trim().toLowerCase() === clsName) {
    return true;
  }

  // 2. Class object explicit assignment
  if (typeof cls === 'object' && cls) {
    if (cls.classTeacherId) {
      if (teacher && cls.classTeacherId === teacher.id) return true;
      if (currentUser?.id && cls.classTeacherId === currentUser.id) return true;
      if (currentUser?.teacherId && cls.classTeacherId === currentUser.teacherId) return true;
    }
    if (cls.classTeacherName) {
      const ctn = cls.classTeacherName.trim().toLowerCase();
      if (teacher?.name && teacher.name.trim().toLowerCase() === ctn) return true;
      if (currentUser?.name && currentUser.name.trim().toLowerCase() === ctn) return true;
    }
  }

  // 3. Search in allClasses directory if class was passed as string
  if (allClasses && allClasses.length > 0) {
    const matchedClass = allClasses.find(
      (c) => (clsId && c.id === clsId) || (c.name && c.name.trim().toLowerCase() === clsName)
    );
    if (matchedClass) {
      if (matchedClass.classTeacherId) {
        if (teacher && matchedClass.classTeacherId === teacher.id) return true;
        if (currentUser?.id && matchedClass.classTeacherId === currentUser.id) return true;
        if (currentUser?.teacherId && matchedClass.classTeacherId === currentUser.teacherId) return true;
      }
      if (matchedClass.classTeacherName) {
        const ctn = matchedClass.classTeacherName.trim().toLowerCase();
        if (teacher?.name && teacher.name.trim().toLowerCase() === ctn) return true;
        if (currentUser?.name && currentUser.name.trim().toLowerCase() === ctn) return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether a specific subject is allocated to a teacher.
 */
export function isTeacherAllocatedToSubject(
  teacher: Teacher | null | undefined,
  subjectName: string | null | undefined,
  currentUser?: UserAccount | null
): boolean {
  if (!subjectName) return false;

  // Cross-portal administrative override:
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin') {
    return true;
  }
  if (currentUser?.role === 'principal' || currentUser?.role === 'head_teacher') {
    return true;
  }

  if (!teacher) return false;
  if (!Array.isArray(teacher.subjects) || teacher.subjects.length === 0) return false;

  const targetSub = subjectName.trim().toLowerCase();

  return teacher.subjects.some((s) => {
    if (!s) return false;
    const cleanS = s.trim().toLowerCase();
    if (cleanS === targetSub) return true;
    // Handle variations like "Mathematics" vs "Numeracy / Mathematics" or "English Language" vs "Literacy / English Studies"
    if (cleanS.includes(targetSub) || targetSub.includes(cleanS)) return true;
    return false;
  });
}

/**
 * Returns all assigned class names for a teacher (Form Class + Assigned Subject Classes).
 */
export function getTeacherAssignedClassNames(
  teacher: Teacher | null | undefined,
  allClasses: SchoolClass[] = [],
  currentUser?: UserAccount | null
): string[] {
  if (!teacher && !currentUser) return [];
  const classNames = new Set<string>();

  if (teacher?.formClass && teacher.formClass.trim()) {
    classNames.add(teacher.formClass.trim());
  }

  if (teacher && Array.isArray(teacher.assignedClasses)) {
    teacher.assignedClasses.forEach((c) => {
      if (c && c.trim()) classNames.add(c.trim());
    });
  }

  if (allClasses && allClasses.length > 0) {
    allClasses.forEach((cls) => {
      if (isTeacherAssignedToClass(teacher, cls, currentUser)) {
        if (cls.name) classNames.add(cls.name.trim());
      }
    });
  }

  return Array.from(classNames);
}

/**
 * Returns only the class names where a teacher is specifically designated as the Class Teacher (Form Teacher).
 */
export function getTeacherClassTeacherAssignedClasses(
  teacher: Teacher | null | undefined,
  allClasses: SchoolClass[] = [],
  currentUser?: UserAccount | null
): string[] {
  // Cross-portal administrative override:
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin') {
    return allClasses.map((c) => c.name);
  }
  if (currentUser?.role === 'principal') {
    return allClasses.filter((c) => isSecondaryClass(c.name)).map((c) => c.name);
  }
  if (currentUser?.role === 'head_teacher') {
    return allClasses.filter((c) => isPrimaryClass(c.name)).map((c) => c.name);
  }

  const assigned = new Set<string>();

  if (teacher?.formClass && teacher.formClass.trim()) {
    assigned.add(teacher.formClass.trim());
  }

  if (allClasses && allClasses.length > 0) {
    allClasses.forEach((cls) => {
      if (
        (cls.classTeacherId && teacher?.id && cls.classTeacherId === teacher.id) ||
        (cls.classTeacherId && currentUser?.id && cls.classTeacherId === currentUser.id) ||
        (cls.classTeacherId && currentUser?.teacherId && cls.classTeacherId === currentUser.teacherId) ||
        (cls.classTeacherName && teacher?.name && cls.classTeacherName.trim().toLowerCase() === teacher.name.trim().toLowerCase()) ||
        (cls.classTeacherName && currentUser?.name && cls.classTeacherName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
      ) {
        if (cls.name) assigned.add(cls.name.trim());
      }
    });
  }

  return Array.from(assigned);
}

/**
 * Checks whether a teacher is a designated Class Teacher for at least one class.
 */
export function isTeacherAClassTeacher(
  teacher: Teacher | null | undefined,
  allClasses: SchoolClass[] = [],
  currentUser?: UserAccount | null
): boolean {
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin' || currentUser?.role === 'principal' || currentUser?.role === 'head_teacher') {
    return true;
  }
  const classes = getTeacherClassTeacherAssignedClasses(teacher, allClasses, currentUser);
  return classes.length > 0;
}

/**
 * Checks whether a teacher is assigned subjects only (i.e. has NO class teacher assignment).
 */
export function isTeacherSubjectOnly(
  teacher: Teacher | null | undefined,
  allClasses: SchoolClass[] = [],
  currentUser?: UserAccount | null
): boolean {
  if (currentUser?.role === 'pioneer' || currentUser?.role === 'super_admin' || currentUser?.role === 'principal' || currentUser?.role === 'head_teacher') {
    return false;
  }
  return !isTeacherAClassTeacher(teacher, allClasses, currentUser);
}

/**
 * Finds the currently active Teacher profile for the authenticated user,
 * checking teacherId, registered email, or name.
 */
export function resolveCurrentTeacher(
  currentUser: UserAccount | null | undefined,
  teachers: Teacher[] = []
): Teacher | null {
  if (!currentUser) return teachers[0] || null;
  if (currentUser.teacherId) {
    const found = teachers.find((t) => t.id === currentUser.teacherId);
    if (found) return found;
  }
  const cleanEmail = (currentUser.email || '').trim().toLowerCase();
  if (cleanEmail) {
    const byEmail = teachers.find((t) => (t.email || '').trim().toLowerCase() === cleanEmail);
    if (byEmail) return byEmail;
  }
  const cleanName = (currentUser.name || '').trim().toLowerCase();
  if (cleanName) {
    const byName = teachers.find((t) => (t.name || '').trim().toLowerCase() === cleanName);
    if (byName) return byName;
  }

  // Fallback to first teacher if in teacher role
  if (currentUser.role === 'teacher' && teachers.length > 0) {
    return teachers[0];
  }

  return null;
}

export const SECONDARY_SCHOOL_NAME = 'Golden Horizon College';
export const PRIMARY_SCHOOL_NAME = 'Golden Horizon Nursery and Primary School';

export const SCHOOL_CONTACT_DETAILS = {
  website: 'goldenhorizoncollege.org.ng',
  emails: [
    'info@goldenhorizoncollege.org.ng',
    'admin@goldenhorizoncollege.org.ng'
  ],
  emailsDisplay: 'info@goldenhorizoncollege.org.ng or admin@goldenhorizoncollege.org.ng',
  phoneNumbers: [
    '+234 (814)-012-1575',
    '+234 815 025 1809',
    '+234 808 422 9418'
  ],
  phoneDisplay: '+234 (814)-012-1575, +234 815 025 1809, +234 808 422 9418'
};

export function getSchoolNameForClass(className?: string, settings?: Partial<SchoolSettings>): string {
  const secondary = settings?.secondarySchoolName || SECONDARY_SCHOOL_NAME;
  const primary = settings?.primarySchoolName || PRIMARY_SCHOOL_NAME;
  if (!className) return secondary;
  if (isPrimaryClass(className)) {
    return primary;
  }
  return secondary;
}

export const COMBINED_SCHOOL_NAME = 'Golden Horizon College/Primary';

export function getSchoolNameForRole(role?: UserRole, settings?: Partial<SchoolSettings>): string {
  if (role === 'head_teacher') {
    return settings?.primarySchoolName || PRIMARY_SCHOOL_NAME;
  }
  if (role === 'principal') {
    return settings?.secondarySchoolName || SECONDARY_SCHOOL_NAME;
  }
  return settings?.schoolName || COMBINED_SCHOOL_NAME;
}

export function getSchoolContactDetails(settings?: Partial<SchoolSettings>) {
  const website = settings?.website || SCHOOL_CONTACT_DETAILS.website;
  const emails = settings?.email
    ? [settings.email, ...(settings.altEmail ? [settings.altEmail] : [])]
    : SCHOOL_CONTACT_DETAILS.emails;
  const emailsDisplay = settings?.email
    ? (settings.altEmail ? `${settings.email} or ${settings.altEmail}` : settings.email)
    : SCHOOL_CONTACT_DETAILS.emailsDisplay;
  const phoneNumbers = (settings?.phoneNumbers && settings.phoneNumbers.length > 0)
    ? settings.phoneNumbers
    : (settings?.phone ? settings.phone.split(',').map((p) => p.trim()).filter(Boolean) : SCHOOL_CONTACT_DETAILS.phoneNumbers);
  const phoneDisplay = settings?.phone || SCHOOL_CONTACT_DETAILS.phoneDisplay;

  return {
    website,
    emails,
    emailsDisplay,
    phoneNumbers,
    phoneDisplay
  };
}

export function getAcademicSessionAndTerm(settings?: Partial<SchoolSettings>) {
  const academicSession = settings?.academicSession || '2026/2027 Academic Session';
  const currentTerm = settings?.currentTerm || '1st Term';
  return {
    academicSession,
    currentTerm,
    termSessionDisplay: `${academicSession} • ${currentTerm}`,
    overviewLabel: `${academicSession} • ${currentTerm} Overview`
  };
}

export function getSchoolLogo(settings?: Partial<SchoolSettings>): string {
  return settings?.logoUrl || DEFAULT_SCHOOL_LOGO_DATA_URI;
}

export function getSchoolStamp(settings?: Partial<SchoolSettings>): string {
  return settings?.stampUrl || DEFAULT_SCHOOL_STAMP_DATA_URI;
}

export function filterSubjectsByRole(subjects: SchoolSubject[], role: UserRole): SchoolSubject[] {
  if (role === 'principal') {
    return subjects.filter((s) => s.section === 'Secondary');
  }
  if (role === 'head_teacher') {
    return subjects.filter((s) => s.section === 'Primary');
  }
  return subjects;
}

export function getSubjectsForClass(subjects: SchoolSubject[], className: string): SchoolSubject[] {
  if (!className) return [];
  const normalizedClass = className.trim();
  return subjects.filter((s) => {
    return s.applicableClasses.some((c) => {
      if (c === normalizedClass) return true;
      // Match general level (e.g. "JSS 1" for "JSS 1 A", "Basic 1" for "Basic 1 Gold")
      if (normalizedClass.startsWith(c)) return true;
      return false;
    });
  });
}

export interface PortalDef {
  role: UserRole;
  title: string;
  subtitle: string;
  section: 'secondary' | 'primary' | 'all';
  badge: string;
  color: string;
  description: string;
}

export function getAllowedPortalsForUser(currentUserRole: UserRole): PortalDef[] {
  const allPortals: PortalDef[] = [
    {
      role: 'pioneer',
      title: 'Pioneer Master Portal',
      subtitle: 'Institution Founder & Supreme Authority',
      section: 'all',
      badge: 'Master',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      description: 'Institutional leadership, strategic governance, accounts & master policies'
    },
    {
      role: 'super_admin',
      title: 'Administrator Portal',
      subtitle: 'Operations & Directory Management',
      section: 'all',
      badge: 'Admin',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      description: 'System administration, user credentials, classes, audit logs'
    },
    {
      role: 'principal',
      title: 'School Principal Portal',
      subtitle: 'Secondary Section Executive Leadership',
      section: 'secondary',
      badge: 'Secondary',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      description: 'Executive management of College / Secondary section (JSS 1–3, SSS 1–3, Grade 10–12)'
    },
    {
      role: 'head_teacher',
      title: 'Head Teacher Portal',
      subtitle: 'Primary Section Executive Leadership',
      section: 'primary',
      badge: 'Primary',
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      description: 'Executive management of Primary section (Nursery, Reception, Basic 1–5)'
    },
    {
      role: 'teacher',
      title: currentUserRole === 'principal' ? 'Class / Subject Teacher (Secondary)' : currentUserRole === 'head_teacher' ? 'Class Teacher (Primary)' : 'Class / Subject Teacher Portal',
      subtitle: currentUserRole === 'principal' ? 'Secondary Section Academic Staff' : currentUserRole === 'head_teacher' ? 'Primary Section Academic Staff' : 'Academic Staff Portal',
      section: currentUserRole === 'principal' ? 'secondary' : currentUserRole === 'head_teacher' ? 'primary' : 'all',
      badge: currentUserRole === 'principal' ? 'Secondary' : currentUserRole === 'head_teacher' ? 'Primary' : 'Academic',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      description: 'Academic grades, continuous assessment, report card remarks, CBT tests, attendance, homework'
    },
    {
      role: 'finance',
      title: 'Bursar / Finance Portal',
      subtitle: 'Bursary & Financial Accounts',
      section: 'all',
      badge: 'Finance',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      description: 'Fee invoices, payment tracking, debtor management, revenue ledger'
    },
    {
      role: 'parent',
      title: currentUserRole === 'head_teacher' ? 'Primary Parent Portal' : currentUserRole === 'principal' ? 'Secondary Parent Portal' : 'Parent & Guardian Portal',
      subtitle: currentUserRole === 'principal' ? 'Secondary Section Guardians' : currentUserRole === 'head_teacher' ? 'Primary Section Guardians' : 'Parent / Guardian Access',
      section: currentUserRole === 'principal' ? 'secondary' : currentUserRole === 'head_teacher' ? 'primary' : 'all',
      badge: currentUserRole === 'principal' ? 'Secondary' : currentUserRole === 'head_teacher' ? 'Primary' : 'Family',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      description: 'Child report cards, attendance register, fee balance, guardian profile details'
    },
    {
      role: 'student',
      title: currentUserRole === 'head_teacher' ? "Pupil's Portal (Primary)" : currentUserRole === 'principal' ? "Student's Portal (Secondary)" : 'Student & Learner Portal',
      subtitle: currentUserRole === 'principal' ? 'Secondary Section Students' : currentUserRole === 'head_teacher' ? 'Primary Section Pupils' : 'Enrolled Student Access',
      section: currentUserRole === 'principal' ? 'secondary' : currentUserRole === 'head_teacher' ? 'primary' : 'all',
      badge: currentUserRole === 'principal' ? 'Secondary' : currentUserRole === 'head_teacher' ? 'Primary' : 'Learner',
      color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
      description: 'Take CBT exams, view terminal report cards, homework assignments, class timetable'
    }
  ];

  if (currentUserRole === 'pioneer') {
    return allPortals;
  }
  if (currentUserRole === 'super_admin') {
    // Admin has access into school principal, head teacher, class/subject teacher, bursar/finance, parent and student portals
    return allPortals;
  }
  if (currentUserRole === 'principal') {
    // School principal has access to class/subject teacher, parent and student's portals (in the secondary section)
    return allPortals.filter((p) => ['principal', 'teacher', 'parent', 'student'].includes(p.role));
  }
  if (currentUserRole === 'head_teacher') {
    // Head teacher has access to class teacher, parent and pupil's portal (in the primary section)
    return allPortals.filter((p) => ['head_teacher', 'teacher', 'parent', 'student'].includes(p.role));
  }
  return allPortals.filter((p) => p.role === currentUserRole);
}

export function canUserAccessRolePortal(userRole: UserRole, targetPortal: UserRole): boolean {
  const allowed = getAllowedPortalsForUser(userRole);
  return allowed.some((p) => p.role === targetPortal);
}


