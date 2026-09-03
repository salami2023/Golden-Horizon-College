import { UserRole } from '../types';

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

export function isSecondaryClass(className: string): boolean {
  if (!className) return false;
  const upper = className.trim().toUpperCase();
  return (
    upper.startsWith('JSS') ||
    upper.startsWith('SSS') ||
    upper.startsWith('SS ') ||
    upper.startsWith('JS ') ||
    upper.startsWith('GRADE 7') ||
    upper.startsWith('GRADE 8') ||
    upper.startsWith('GRADE 9') ||
    upper.startsWith('GRADE 10') ||
    upper.startsWith('GRADE 11') ||
    upper.startsWith('GRADE 12') ||
    upper.startsWith('YEAR 7') ||
    upper.startsWith('YEAR 8') ||
    upper.startsWith('YEAR 9') ||
    upper.startsWith('YEAR 10') ||
    upper.startsWith('YEAR 11') ||
    upper.startsWith('YEAR 12')
  );
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
