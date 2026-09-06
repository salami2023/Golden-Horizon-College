import React, { useState, useEffect, useMemo } from 'react';
import {
  Laptop,
  Play,
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Bot,
  ListOrdered,
  ShieldCheck,
  Lock,
  Trash2,
  Edit2,
  Save,
  X,
  GraduationCap,
  Baby,
  BookOpen
} from 'lucide-react';
import { CBTExam, CBTQuestion, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';
import { useRealTime } from '../../context/RealTimeContext';
import { useAuth } from '../../context/AuthContext';
import {
  SECONDARY_CLASSES,
  PRIMARY_CLASSES,
  SECONDARY_SUBJECTS,
  PRIMARY_SUBJECTS,
  isSecondaryClass,
  isPrimaryClass,
  resolveCurrentTeacher,
  isTeacherAssignedToClass,
  isTeacherClassTeacher,
  isTeacherAllocatedToSubject,
  getTeacherAssignedClassNames
} from '../../utils/sectionHelpers';

interface CBTExamManagerProps {
  exams: CBTExam[];
  onAddExam: (exam: CBTExam) => void;
  onUpdateExam?: (exam: CBTExam) => void;
  onDeleteExam?: (examId: string) => void;
  currentRole?: UserRole;
}

export const CBTExamManager: React.FC<CBTExamManagerProps> = ({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  currentRole = 'teacher'
}) => {
  const { classes, teachers } = useRealTime();
  const { currentUser } = useAuth();
  const isTeacher = currentRole === 'teacher';
  const isPrincipal = currentRole === 'principal';
  const isHeadTeacher = currentRole === 'head_teacher';

  // Resolved teacher profile for authenticated user
  const currentTeacher = useMemo(() => {
    return resolveCurrentTeacher(currentUser, teachers);
  }, [currentUser, teachers]);

  // Classes assigned to this teacher (Form class + subject classes)
  const teacherAssignedClassNames = useMemo(() => {
    if (!isTeacher) return [];
    return getTeacherAssignedClassNames(currentTeacher, classes, currentUser);
  }, [isTeacher, currentTeacher, classes, currentUser]);

  const [activeTestExam, setActiveTestExam] = useState<CBTExam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const allCurriculumSubjects = useMemo(() => {
    if (isPrincipal) return SECONDARY_SUBJECTS.map((s) => s.name);
    if (isHeadTeacher) return PRIMARY_SUBJECTS.map((s) => s.name);
    return [...SECONDARY_SUBJECTS.map((s) => s.name), ...PRIMARY_SUBJECTS.map((s) => s.name)];
  }, [isPrincipal, isHeadTeacher]);

  const availableSubjects = useMemo(() => {
    if (isTeacher) {
      if (currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
        return currentTeacher.subjects;
      }
      return allCurriculumSubjects;
    }
    return allCurriculumSubjects;
  }, [isTeacher, currentTeacher, allCurriculumSubjects]);

  const availableClasses = useMemo(() => {
    if (isTeacher) {
      return teacherAssignedClassNames;
    }
    if (isPrincipal) return SECONDARY_CLASSES;
    if (isHeadTeacher) return PRIMARY_CLASSES;
    return [...SECONDARY_CLASSES, ...PRIMARY_CLASSES];
  }, [isTeacher, teacherAssignedClassNames, isPrincipal, isHeadTeacher]);

  // AI Exam Generator Form Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [editingExam, setEditingExam] = useState<CBTExam | null>(null);
  const [subject, setSubject] = useState(availableSubjects[0] || 'Computer Studies');
  const [targetClass, setTargetClass] = useState(availableClasses[0] || 'Grade 10 A');
  const [topic, setTopic] = useState(
    isHeadTeacher ? 'Basic Addition & Subtraction' : 'Data Structures & Algorithms'
  );
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Keep targetClass & subject in sync when available lists change
  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(targetClass)) {
      setTargetClass(availableClasses[0]);
    }
  }, [availableClasses, targetClass]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [availableSubjects, subject]);

  // RBAC Permission Check: Teachers, Principal, Head Teacher, Admin have permission to create/update/edit CBT exams
  const canManageCBT = ['super_admin', 'pioneer', 'principal', 'head_teacher', 'teacher'].includes(currentRole);
  const [selectedExamFilter, setSelectedExamFilter] = useState('All');

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      if (isPrincipal && !isSecondaryClass(exam.classGroup)) return false;
      if (isHeadTeacher && !isPrimaryClass(exam.classGroup)) return false;

      if (isTeacher) {
        const isClassAssigned = isTeacherAssignedToClass(currentTeacher, exam.classGroup, currentUser, classes);
        if (!isClassAssigned) return false;

        const isFormTeacher = isTeacherClassTeacher(currentTeacher, exam.classGroup, currentUser, classes);
        const isSubjectAllocated = isTeacherAllocatedToSubject(currentTeacher, exam.subject);
        if (!isFormTeacher && !isSubjectAllocated && currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
          return false;
        }
      }

      if (selectedExamFilter === 'All') return true;
      return exam.id === selectedExamFilter;
    });
  }, [exams, isPrincipal, isHeadTeacher, isTeacher, currentTeacher, currentUser, classes, selectedExamFilter]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!activeTestExam || testSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTestExam, testSubmitted, timeLeft]);

  const handleStartExam = (exam: CBTExam) => {
    setActiveTestExam(exam);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTestSubmitted(false);
    setTimeLeft(exam.durationMinutes * 60);
  };

  const handleOptionSelect = (qId: string, optionIdx: number) => {
    if (testSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitTest = () => {
    if (!activeTestExam) return;
    let score = 0;
    activeTestExam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 10;
      }
    });
    setTestScore(score);
    setTestSubmitted(true);
  };

  const handleGenerateAIExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageCBT) {
      alert('Access Denied: Only teachers and administrators can create or generate CBT exams.');
      return;
    }

    if (isTeacher) {
      if (!teacherAssignedClassNames.includes(targetClass)) {
        alert(`Access Denied: You can only set CBT questions for classes assigned to you (${teacherAssignedClassNames.join(', ') || 'None assigned'}).`);
        return;
      }
      const isFormT = isTeacherClassTeacher(currentTeacher, targetClass, currentUser, classes);
      const isAllocatedSub = isTeacherAllocatedToSubject(currentTeacher, subject);
      if (!isFormT && !isAllocatedSub && currentTeacher?.subjects && currentTeacher.subjects.length > 0) {
        alert(`Access Denied: You can only set CBT assessments for subjects allocated to you (${currentTeacher.subjects.join(', ')}).`);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-cbt-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          numQuestions,
          gradeLevel: isHeadTeacher ? 'Primary Basic 1-5' : 'Senior Secondary SSS'
        })
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        const generatedQuestions: CBTQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: `q-ai-${Date.now()}-${idx}`,
          question: q.questionText || q.question || 'Question prompt',
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: q.correctIndex ?? 0,
          explanation: q.explanation || 'Refer to classroom syllabus notes.'
        }));

        const newExam: CBTExam = {
          id: `exam-${Date.now()}`,
          title: `${subject}: ${topic}`,
          subject,
          classGroup: targetClass,
          durationMinutes: Math.max(10, numQuestions * 2),
          totalMarks: generatedQuestions.length * 10,
          questions: generatedQuestions,
          status: 'Active',
          scheduledDate: new Date().toISOString().split('T')[0]
        };

        onAddExam(newExam);
        setShowGenModal(false);
      }
    } catch (err) {
      console.error('Failed to generate AI CBT questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteExam = (examId: string) => {
    if (!canManageCBT) return;
    if (window.confirm('Are you sure you want to delete this CBT Exam?')) {
      if (onDeleteExam) onDeleteExam(examId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        canManageCBT
          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {canManageCBT ? (
            <>
              <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                {isTeacher ? (
                  <>
                    <strong>Teacher CBT & E-Learning Portal:</strong> Authorized to create, set, and AI-generate questions for your assigned classes (<strong>{teacherAssignedClassNames.join(', ') || 'No classes currently assigned'}</strong>){' '}
                    {currentTeacher?.subjects?.length ? <>and allocated subjects (<strong>{currentTeacher.subjects.join(', ')}</strong>)</> : null}.
                  </>
                ) : isPrincipal ? (
                  <strong>Secondary Principal CBT Portal:</strong>
                ) : isHeadTeacher ? (
                  <strong>Primary Head Teacher CBT & Quiz Portal:</strong>
                ) : (
                  <strong>CBT & E-Learning Authorization Active:</strong>
                )}{' '}
                {!isTeacher && (
                  <>
                    Authorized to create, AI-generate questions, and update online CBT assessments for{' '}
                    {isPrincipal ? 'Secondary School classes' : isHeadTeacher ? 'Primary & Nursery classes' : 'all classes'}.
                  </>
                )}
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Student Testing Mode:</strong> CBT exam creation and question editing is permitted for <strong>Teachers, Head Teacher, Principal, and Administrators</strong>.
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
              {teacherAssignedClassNames.length} Assigned {teacherAssignedClassNames.length === 1 ? 'Class' : 'Classes'}
            </span>
          )}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
            {isPrincipal ? 'Secondary Principal' : isHeadTeacher ? 'Primary Head Teacher' : `Role: ${currentRole}`}
          </span>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {isPrincipal ? (
              <>
                <GraduationCap className="h-5 w-5 text-indigo-600" /> Secondary School CBT Examination Portal
              </>
            ) : isHeadTeacher ? (
              <>
                <Baby className="h-5 w-5 text-amber-600" /> Primary & Nursery E-Learning & Quiz Center
              </>
            ) : (
              <>
                <Laptop className="h-5 w-5 text-purple-600" /> Computer-Based Testing (CBT) Center
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isTeacher
              ? 'Create online assessments and AI-assisted syllabus question generation for your assigned classes.'
              : isPrincipal
              ? 'Create WAEC/NECO/JAMB standard timed mock exams and secondary CBT assessments.'
              : isHeadTeacher
              ? 'Create fun interactive quizzes, basic arithmetic drills, and primary school assessments.'
              : 'Create online assessments, timed simulations, and AI-assisted syllabus question generation.'}
          </p>
        </div>

        {canManageCBT && (
          <button
            onClick={() => {
              if (availableClasses.length === 0) {
                alert('You do not have any assigned classes. Please contact administration.');
                return;
              }
              setSubject(availableSubjects[0] || 'Computer Studies');
              setTargetClass(availableClasses[0] || 'Grade 10 A');
              setShowGenModal(true);
            }}
            disabled={isTeacher && availableClasses.length === 0}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" /> AI Generate CBT Assessment
          </button>
        )}
      </div>

      {/* CBT Assessments Filter Bar with Dropdown & Search Button */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter CBT Exam:</span>
          <DropdownWithSearch
            options={[
              { value: 'All', label: 'All CBT Assessments' },
              ...filteredExams.map((ex) => ({
                value: ex.id,
                label: ex.title,
                sublabel: `Class: ${ex.classGroup} • Subject: ${ex.subject} • ${ex.questions.length} Questions`,
                badge: ex.status
              }))
            ]}
            value={selectedExamFilter}
            onChange={(val) => setSelectedExamFilter(val)}
            placeholder="Select assessment..."
            searchPlaceholder="Search CBT exam by title, subject..."
            colorScheme="purple"
            buttonLabel="Search Exam"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <strong>{filteredExams.length}</strong> {filteredExams.length === 1 ? 'exam' : 'exams'}
        </div>
      </div>

      {/* Empty State when no exams */}
      {filteredExams.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Laptop className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No CBT Assessments Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isTeacher
              ? `No assessments found for your assigned classes (${teacherAssignedClassNames.join(', ') || 'None assigned'}). Click "AI Generate CBT Assessment" to set questions for your students.`
              : 'No CBT exams currently match this selection.'}
          </p>
        </div>
      )}

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {exam.subject}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5 text-purple-600" /> {exam.durationMinutes} mins
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {exam.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Target: <strong>{exam.classGroup}</strong> • {exam.questions.length} Questions
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Launch Test Session
              </button>
              
              {canManageCBT && (
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition shrink-0"
                  title="Delete Exam"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active CBT Exam Simulation Modal */}
      {activeTestExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col max-h-[90vh]">
            
            {/* Header with Countdown */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {activeTestExam.title}
                </h3>
                <span className="text-xs text-slate-500">
                  Question {currentQuestionIdx + 1} of {activeTestExam.questions.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 ${
                  timeLeft <= 120
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  <Clock className="h-4 w-4" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => setActiveTestExam(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Test Content or Submitted Score View */}
            {!testSubmitted ? (
              <div className="py-6 overflow-y-auto space-y-6 flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {activeTestExam.questions[currentQuestionIdx]?.question}
                </div>

                <div className="space-y-2.5">
                  {activeTestExam.questions[currentQuestionIdx]?.options.map((opt, oIdx) => {
                    const qId = activeTestExam.questions[currentQuestionIdx].id;
                    const isSelected = selectedAnswers[qId] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(qId, oIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center gap-3 ${
                          isSelected
                            ? 'bg-purple-50 border-purple-600 text-purple-900 dark:bg-purple-950/60 dark:border-purple-400 dark:text-purple-100 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4 flex-1">
                <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Assessment Completed!
                </h4>
                <p className="text-xs text-slate-500">
                  Your responses have been graded automatically by the CBT engine.
                </p>
                <div className="text-3xl font-black text-emerald-600">
                  {testScore} / {activeTestExam.questions.length * 10} Points
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
              {!testSubmitted ? (
                <>
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentQuestionIdx < activeTestExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                      className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
                    >
                      Submit Exam
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveTestExam(null)}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs"
                >
                  Exit Session
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" /> AI Syllabus Question Generator
              </h3>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAIExam} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <DropdownWithSearch
                  options={availableSubjects.map((s) => ({ value: s, label: s }))}
                  value={subject}
                  onChange={(val) => setSubject(val)}
                  placeholder="Select or search subject..."
                  searchPlaceholder="Search academic subject..."
                  colorScheme="purple"
                  buttonLabel="Subject"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Class</label>
                <DropdownWithSearch
                  options={availableClasses.map((c) => ({ value: c, label: c }))}
                  value={targetClass}
                  onChange={(val) => setTargetClass(val)}
                  placeholder="Select target class..."
                  searchPlaceholder="Search class..."
                  colorScheme="purple"
                  buttonLabel="Class"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic / Curriculum Theme</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    isPrincipal
                      ? 'e.g. Organic Chemistry / Calculus'
                      : isHeadTeacher
                      ? 'e.g. Phonics & Letter Blends / Basic Arithmetic'
                      : 'e.g. Curriculum Topic'
                  }
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Number of Questions</label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? 'Generating with Gemini...' : 'Generate Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
