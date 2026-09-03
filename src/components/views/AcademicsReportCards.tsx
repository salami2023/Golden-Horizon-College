import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Award,
  Sparkles,
  Printer,
  GraduationCap,
  CheckCircle2,
  Edit3,
  Bot,
  User,
  Calendar,
  Layers,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { StudentReportCard, SubjectScore, Student, UserRole } from '../../types';
import { useRealTime } from '../../context/RealTimeContext';
import { DropdownWithSearch } from '../DropdownWithSearch';
import {
  filterStudentsByRole,
  getSectionForRole,
  isPrimaryClass,
  isSecondaryClass,
  getSchoolNameForClass,
  SECONDARY_SCHOOL_NAME,
  PRIMARY_SCHOOL_NAME,
  SCHOOL_CONTACT_DETAILS
} from '../../utils/sectionHelpers';

interface AcademicsReportCardsProps {
  reportCards: StudentReportCard[];
  students: Student[];
  onUpdateReportCard: (card: StudentReportCard) => void;
  onAddReportCard?: (card: StudentReportCard) => void;
  onDeleteReportCard?: (cardId: string) => void;
  currentRole?: UserRole;
}

export const AcademicsReportCards: React.FC<AcademicsReportCardsProps> = ({
  reportCards,
  students,
  onUpdateReportCard,
  onAddReportCard,
  onDeleteReportCard,
  currentRole = 'super_admin'
}) => {
  const { schoolSettings } = useRealTime();
  const roleSection = getSectionForRole(currentRole as UserRole);
  const visibleReportCards: StudentReportCard[] = filterStudentsByRole<StudentReportCard>(reportCards, currentRole as UserRole);
  const visibleStudents: Student[] = filterStudentsByRole<Student>(students, currentRole as UserRole);

  const [selectedCardId, setSelectedCardId] = useState<string>(visibleReportCards[0]?.id || '');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForNewCard, setSelectedStudentForNewCard] = useState<string>(visibleStudents[0]?.id || '');

  // Permission Check:
  // Admin, Principal, Head Teacher have full edit/delete/update access.
  // Teachers are allowed to edit/update academic grades (CA1, CA2, Exam).
  const canEditGrades = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(currentRole);
  const canDeleteOrAddCard = ['super_admin', 'pioneer', 'principal', 'head_teacher'].includes(currentRole);

  const activeCard = visibleReportCards.find((r) => r.id === selectedCardId) || visibleReportCards[0];

  // Grade calculation helper
  const calculateGrade = (total: number): SubjectScore['grade'] => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'D';
    return 'F';
  };

  const calculateRemark = (grade: SubjectScore['grade']): string => {
    switch (grade) {
      case 'A': return 'Excellent Mastery';
      case 'B': return 'Very Good Performance';
      case 'C': return 'Good Effort';
      case 'D': return 'Fair, Needs Improvement';
      default: return 'Needs Remedial Attention';
    }
  };

  const handleScoreChange = (
    subjectIdx: number,
    field: 'ca1' | 'ca2' | 'exam',
    val: number
  ) => {
    if (!canEditGrades) {
      alert('Access Denied: Only Teachers, Principal, Head Teacher, and Administrators can enter or update grades.');
      return;
    }
    if (!activeCard) return;

    const updatedScores = [...activeCard.subjectScores];
    const item = { ...updatedScores[subjectIdx] };

    if (field === 'ca1') item.ca1 = Math.min(15, Math.max(0, val));
    if (field === 'ca2') item.ca2 = Math.min(15, Math.max(0, val));
    if (field === 'exam') item.exam = Math.min(70, Math.max(0, val));

    item.total = item.ca1 + item.ca2 + item.exam;
    item.grade = calculateGrade(item.total);
    item.remark = calculateRemark(item.grade);

    updatedScores[subjectIdx] = item;

    const newTotal = updatedScores.reduce((acc, s) => acc + s.total, 0);
    const newAverage = Number((newTotal / updatedScores.length).toFixed(1));

    const updatedCard: StudentReportCard = {
      ...activeCard,
      subjectScores: updatedScores,
      totalScore: newTotal,
      averageScore: newAverage
    };

    onUpdateReportCard(updatedCard);
  };

  const handleCreateReportCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDeleteOrAddCard) {
      alert('Access Denied: Only Administrator, Principal, and Head Teacher can initialize report cards.');
      return;
    }
    const student = visibleStudents.find((s) => s.id === selectedStudentForNewCard) || students.find((s) => s.id === selectedStudentForNewCard);
    if (!student) return;

    const defaultSubjects = isPrimaryClass(student.classGroup)
      ? [
          'Numeracy / Mathematics',
          'Literacy / English Studies',
          'Basic Science & Technology',
          'Social Studies & Civic Habits',
          'Quantitative Reasoning',
          'Verbal Reasoning',
          'Creative & Cultural Arts (CCA)'
        ]
      : [
          'Mathematics',
          'English Language',
          'Physics',
          'Chemistry',
          'Biology',
          'Civic Education',
          'Economics'
        ];

    const newCard: StudentReportCard = {
      id: `rc-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      classGroup: student.classGroup,
      academicSession: '2024/2025',
      term: '2nd Term',
      classPosition: Math.floor(1 + Math.random() * 5),
      totalStudentsInClass: 32,
      attendanceDaysPresent: 58,
      totalSchoolDays: 60,
      subjectScores: defaultSubjects.map((sub) => ({
        subjectName: sub,
        ca1: 12,
        ca2: 13,
        exam: 55,
        total: 80,
        grade: 'A',
        classAverage: 65,
        remark: 'Excellent Mastery'
      })),
      domainRatings: [
        { trait: 'Punctuality', score: 5, category: 'Affective' },
        { trait: 'Creativity & Initiative', score: 4, category: 'Psychomotor' },
        { trait: 'Class Participation', score: 5, category: 'Affective' },
        { trait: 'Politeness & Discipline', score: 5, category: 'Affective' }
      ],
      formTeacherRemark: 'An exceptional and conscientious scholar who demonstrates high academic aptitude.',
      principalRemark: 'Excellent terminal result. Approved for commendation and advancement.',
      averageScore: 80.0,
      totalScore: 560,
      isPublished: true
    };

    if (onAddReportCard) {
      onAddReportCard(newCard);
    }
    setSelectedCardId(newCard.id);
    setShowAddModal(false);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!canDeleteOrAddCard) {
      alert('Access Denied: Only Administrator, School Principal, and Head Teacher can delete report cards.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this report card?')) {
      if (onDeleteReportCard) {
        onDeleteReportCard(cardId);
      }
      const remaining = reportCards.filter((r) => r.id !== cardId);
      if (remaining.length > 0) {
        setSelectedCardId(remaining[0].id);
      }
    }
  };

  // AI Report Card Remarks Generator
  const handleGenerateAIRemark = async () => {
    if (!canEditGrades) {
      alert('Access Denied: You do not have permission to modify remarks.');
      return;
    }
    if (!activeCard) return;
    setIsGeneratingAI(true);
    setAiSuccessMessage(null);

    const topSubjects = activeCard.subjectScores
      .filter((s) => s.grade === 'A')
      .map((s) => s.subjectName);

    const weakSubjects = activeCard.subjectScores
      .filter((s) => s.grade === 'C' || s.grade === 'D' || s.grade === 'F')
      .map((s) => s.subjectName);

    try {
      const res = await fetch('/api/ai/report-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: activeCard.studentName,
          gradeLevel: activeCard.classGroup,
          overallScore: activeCard.averageScore,
          attendancePercentage: Math.round(
            (activeCard.attendanceDaysPresent / activeCard.totalSchoolDays) * 100
          ),
          topSubjects,
          weakSubjects
        })
      });

      const data = await res.json();
      if (data.remark) {
        const updatedCard: StudentReportCard = {
          ...activeCard,
          formTeacherRemark: data.remark,
          principalRemark: `Satisfactory terminal performance (${activeCard.averageScore}%). Approved for promotion.`
        };
        onUpdateReportCard(updatedCard);
        setAiSuccessMessage('AI Teacher Remark generated and saved successfully!');
      }
    } catch (err) {
      console.error('Failed to generate AI remark:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        canEditGrades
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canEditGrades ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Academic Grading Permissions Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> to enter CA scores, edit exam marks, and generate automated remarks.
                {roleSection === 'secondary' && ' (Restricted to Secondary School: JSS 1 - SSS 3)'}
                {roleSection === 'primary' && ' (Restricted to Primary & Nursery: Basic 1 - 5, Nursery)'}
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only View:</strong> Academic grade editing is permitted for <strong>Teachers, Principal, Head Teacher, and Administrators</strong>.
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {roleSection !== 'all' && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 uppercase tracking-wider">
              {roleSection === 'secondary' ? 'Secondary Section' : 'Primary Section'}
            </span>
          )}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
            Role: {currentRole}
          </span>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> Academic Results & Report Card Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous Assessment (CA) score entry, automated GPA ranking, and official printable report cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canDeleteOrAddCard && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Issue Report Card
            </button>
          )}
          {canEditGrades && (
            <button
              onClick={handleGenerateAIRemark}
              disabled={isGeneratingAI}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Bot className="h-4 w-4 animate-bounce" />
              {isGeneratingAI ? 'Generating Remark...' : 'AI Generate Remark'}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print Result Sheet
          </button>
        </div>
      </div>

      {aiSuccessMessage && (
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="h-4 w-4 text-purple-600" />
          {aiSuccessMessage}
        </div>
      )}

      {/* Student Result Card Selector Dropdown with Search Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Selected Student Report:</span>
          <DropdownWithSearch
            options={visibleReportCards.map((card) => ({
              value: card.id,
              label: card.studentName,
              sublabel: `Admission: ${card.admissionNo} • Position: #${card.classPosition || 1}`,
              badge: card.classGroup
            }))}
            value={selectedCardId}
            onChange={(val) => setSelectedCardId(val)}
            placeholder="Select student report card..."
            searchPlaceholder="Search student by name, admission no, or class..."
            colorScheme="emerald"
            buttonLabel="Search Card"
          />
        </div>

        {activeCard && (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">{activeCard.studentName}</span>
            <span>•</span>
            <span className="font-mono">{activeCard.classGroup}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Avg: {activeCard.averageScore}%
            </span>
          </div>
        )}
      </div>

      {/* Main Printable Result Sheet Container */}
      {activeCard && (
        <div className="printable-report border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* School Letterhead Header */}
          <div className="border-b-2 border-emerald-600 pb-5 text-center space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <div className={`h-10 w-10 rounded-xl text-white flex items-center justify-center font-black text-base shadow-sm ${
                isPrimaryClass(activeCard.classGroup) ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {isPrimaryClass(activeCard.classGroup) ? 'GHPS' : 'GHC'}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {isPrimaryClass(activeCard.classGroup)
                  ? (schoolSettings?.primarySchoolName || PRIMARY_SCHOOL_NAME)
                  : (schoolSettings?.secondarySchoolName || SECONDARY_SCHOOL_NAME)}
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {isPrimaryClass(activeCard.classGroup)
                ? 'Nurturing Young Minds for Global Impact • Early Years & Primary Education'
                : 'Excellence in Knowledge, Innovation & Character • High School & Advanced Studies'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span><strong>Web:</strong> {schoolSettings?.website || SCHOOL_CONTACT_DETAILS.website}</span>
              <span>•</span>
              <span><strong>Email:</strong> {schoolSettings?.email || SCHOOL_CONTACT_DETAILS.emailsDisplay}</span>
              <span>•</span>
              <span><strong>Tel:</strong> {schoolSettings?.phone || SCHOOL_CONTACT_DETAILS.phoneDisplay}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 pt-1">
              Official Terminal Student Assessment Progress Sheet • {activeCard.academicSession} {activeCard.term}
            </p>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Name</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{activeCard.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Admission No</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{activeCard.admissionNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Class & Position</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {activeCard.classGroup} • Position: {activeCard.classPosition} of {activeCard.totalStudentsInClass}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Average Score</span>
              <span className="font-black text-slate-900 dark:text-white text-sm">{activeCard.averageScore}%</span>
            </div>
          </div>

          {/* Continuous Assessment & Exam Matrix Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5 text-emerald-600" /> Subject Assessment & Examination Scores
              </h3>
              <span className="text-[10px] text-slate-400">
                CA1 (Max 15) + CA2 (Max 15) + Exam (Max 70) = Total (100)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Subject Name</th>
                    <th className="p-3 text-center">CA 1 (15)</th>
                    <th className="p-3 text-center">CA 2 (15)</th>
                    <th className="p-3 text-center">Exam (70)</th>
                    <th className="p-3 text-center">Total (100)</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3">Teacher Performance Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeCard.subjectScores.map((score, idx) => (
                    <tr key={score.subjectName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {score.subjectName}
                      </td>

                      {/* Interactive Edit Inputs */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          max={15}
                          min={0}
                          disabled={!canEditGrades}
                          value={score.ca1}
                          onChange={(e) => handleScoreChange(idx, 'ca1', parseInt(e.target.value) || 0)}
                          className="w-12 text-center p-1 rounded border border-slate-200 dark:border-slate-700 font-mono font-bold bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="number"
                          max={15}
                          min={0}
                          disabled={!canEditGrades}
                          value={score.ca2}
                          onChange={(e) => handleScoreChange(idx, 'ca2', parseInt(e.target.value) || 0)}
                          className="w-12 text-center p-1 rounded border border-slate-200 dark:border-slate-700 font-mono font-bold bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="number"
                          max={70}
                          min={0}
                          disabled={!canEditGrades}
                          value={score.exam}
                          onChange={(e) => handleScoreChange(idx, 'exam', parseInt(e.target.value) || 0)}
                          className="w-16 text-center p-1 rounded border border-slate-200 dark:border-slate-700 font-mono font-bold bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
                        />
                      </td>

                      <td className="p-3 text-center font-black text-slate-900 dark:text-white">
                        {score.total}
                      </td>

                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-extrabold text-xs ${
                            score.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : score.grade === 'B'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {score.grade}
                        </span>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium italic">
                        {score.remark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Domain & Behavioral Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" /> Affective & Behavioral Traits (1 to 5)
              </h4>
              <div className="space-y-1.5">
                {activeCard.domainRatings.map((rating) => (
                  <div key={rating.trait} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{rating.trait}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`h-2.5 w-2.5 rounded-full ${
                            star <= rating.score ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Remarks */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5 text-purple-600" /> Form Teacher Remarks
                </h4>
                <p className="text-slate-700 dark:text-slate-300 italic mt-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                  "{activeCard.formTeacherRemark}"
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  {isPrimaryClass(activeCard.classGroup)
                    ? (schoolSettings?.headTeacherName ? `Head Teacher's Decision & Signature (${schoolSettings.headTeacherName})` : "Head Teacher's Decision & Signature")
                    : (schoolSettings?.principalName ? `Principal's Decision & Signature (${schoolSettings.principalName})` : "Principal's Decision & Signature")}
                </h4>
                <p className="text-slate-700 dark:text-slate-300 italic mt-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{activeCard.principalRemark}"
                </p>
              </div>
            </div>
          </div>

          {canDeleteOrAddCard && (
            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleDeleteCard(activeCard.id)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Report Card
              </button>
            </div>
          )}

        </div>
      )}

      {/* Add Report Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" /> Issue Terminal Report Card
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReportCard} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Student</label>
                <select
                  value={selectedStudentForNewCard}
                  onChange={(e) => setSelectedStudentForNewCard(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {visibleStudents.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.firstName} {std.lastName} ({std.admissionNo} - {std.classGroup})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-[11px]">
                Report card will be initialized with curriculum subjects for <strong>{roleSection === 'primary' ? 'Primary / Early Years' : 'Secondary'}</strong> curriculum.
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Create Report Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
