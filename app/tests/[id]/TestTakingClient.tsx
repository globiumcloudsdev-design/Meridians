"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { TestItem } from "@/lib/types/test";
import { TestTakingClientProps, TestStudentInfo } from "@/lib/types/testTaking";
import { API_TEST_BY_ID, API_TEST_SUBMIT, API_ADMISSION, API_ADMISSION_BY_ID, API_ADMISSION_GO_TO_TEST } from "@/lib/api/endpoints";
import Link from "next/link";
import TestStartScreen from "@/components/test-taking/TestStartScreen";
import TestActiveScreen from "@/components/test-taking/TestActiveScreen";
import TestResultScreen from "@/components/test-taking/TestResultScreen";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TestTakingClient({ testId, admissionId, classId, studentName, studentClass, isNewStudent = false }: TestTakingClientProps) {
  const [test, setTest] = useState<TestItem | null>(null);
  const [studentInfo, setStudentInfo] = useState<TestStudentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentQuestionRef = useRef(currentQuestion);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [voucher, setVoucher] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlreadyPassedDialog, setShowAlreadyPassedDialog] = useState(false);
  const timeUpWarningShown = useRef(false);
  const router = useRouter();
  // Keep ref in sync with state
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Fetch test and student info
  useEffect(() => {
    const loadData = async () => {
      // For existing students with real testId
      if (testId && testId !== 'new' && testId !== 'pending') {
        await fetchTest();
      }
      // For new students - fetch test via API immediately
      else if (isNewStudent || testId === 'new' || testId === 'pending') {
        try {
          setIsLoading(true);
          
          // Get class from props or localStorage
          const formData = localStorage.getItem('admissionFormData');
          const className = studentClass || (formData ? JSON.parse(formData).class : '');
          
          if (className) {
            // Call API to get test for this class
            const response = await fetch(API_ADMISSION_GO_TO_TEST(className));
            if (response.ok) {
              const testData = await response.json();
              setTest(testData.test);
            }
          }
          
          // Set student info
          if (studentName && studentClass) {
            setStudentInfo({
              studentName: studentName,
              studentClass: studentClass,
            });
          } else if (formData) {
            const parsed = JSON.parse(formData);
            setStudentInfo({
              studentName: parsed.studentName || '',
              studentClass: parsed.class || '',
              fatherCnic: parsed.fatherCnic || '',
            });
          } else {
            setStudentInfo({
              studentName: 'Guest Student',
              studentClass: '',
            });
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading test:', error);
          setIsLoading(false);
        }
      }
      
      // Fetch student info for existing students
      if (admissionId) {
        await fetchStudentInfo();
      }
    };
    
    loadData();
  }, [testId, admissionId, isNewStudent, studentName, studentClass]);

  // Per-question timer with auto-advance (but no auto-submit on last question)
  useEffect(() => {
    if (!isTestStarted || isTestSubmitted) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          // Time up - auto advance to next question
          const qIndex = currentQuestionRef.current;
          if (qIndex < test!.mcqs.length - 1) {
            // Small delay to prevent race condition
            setTimeout(() => {
              setCurrentQuestion(qIndex + 1);
              setQuestionTimeLeft(test!.timeLimit || 30);
            }, 100);
            return 0; // Stop timer temporarily
          } else {
            // Last question - stop timer and show warning once only
            if (!timeUpWarningShown.current) {
              toast.warning("Time's up! Please click Submit Test to finish.");
              timeUpWarningShown.current = true;
            }
            return 0; // Stop at 0, don't auto-submit
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestSubmitted, test]);

  const fetchTest = async () => {
    try {
      const response = await fetch(API_TEST_BY_ID(testId));
      if (response.ok) {
        const data = await response.json();
        setTest(data);
      } else {
        toast.error("Failed to load test");
      }
    } catch (error) {
      toast.error("Error loading test");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentInfo = async () => {
    if (!admissionId) return;
    
    try {
      const response = await fetch(API_ADMISSION_BY_ID(admissionId));
      if (response.ok) {
        const data = await response.json();
        setStudentInfo({
          studentName: data.studentName,
          studentClass: data.studentClass,
          fatherCnic: data.fatherCnic,
        });
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const startTest = () => {
    // Test already loaded, just start the test
    setIsTestStarted(true);
    setQuestionTimeLeft(test?.timeLimit || 30);
    setTimeout(() => {
      toast.success("Test started! Good luck!");
    }, 100);
  };

  const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  }, []);

  const submitTest = useCallback(async () => {
    if (!test) return;

    setIsSubmitting(true);
    let effectiveAdmissionId = admissionId;

    try {
      // Step 1: Calculate score locally first to check pass/fail
      let calculatedScore = 0;
      test.mcqs.forEach((mcq, idx) => {
        if (answers[idx] === mcq.correctAnswer) {
          calculatedScore += mcq.marks || 1;
        }
      });
      
      const percentage = Math.round((calculatedScore / test.totalMarks) * 100);
      const isPassed = percentage >= ((test.passingMarks / test.totalMarks) * 100);
      
      // Step 2: For new students who FAILED - just show result, no DB save
      if (isNewStudent && !isPassed) {
        setScore(calculatedScore);
        setIsTestSubmitted(true);
        toast.error(`Test failed. You scored ${percentage}%. You need ${Math.ceil((test.passingMarks / test.totalMarks) * 100)}% to pass.`);
        setIsSubmitting(false);
        return;
      }
      
      // Step 3: For new students who PASSED - create admission first
      if (isNewStudent && isPassed) {
        const formDataStr = localStorage.getItem('admissionFormData');
        if (!formDataStr) {
          throw new Error('Form data not found. Please fill the admission form again.');
        }

        const formData = JSON.parse(formDataStr);
        
        // Create admission
        const admissionFormData = new FormData();
        admissionFormData.append('name', formData.studentName || '');
        admissionFormData.append('class', formData.class || '');
        admissionFormData.append('fatherName', formData.fatherName || '');
        admissionFormData.append('fatherCnic', formData.fatherCnic || '');
        admissionFormData.append('homeAddress', formData.homeAddress || '');
        admissionFormData.append('dob', formData.dob || '');
        admissionFormData.append('contact1', `03${formData.fatherContact || ''}`);
        admissionFormData.append('parentEmail', formData.fatherEmail || '');
        admissionFormData.append('program', formData.program || '');
        admissionFormData.append('shift', formData.shift || '');
        admissionFormData.append('message', formData.message || '');
        
        const admissionResponse = await fetch(API_ADMISSION, {
          method: 'POST',
          body: admissionFormData,
        });

        if (!admissionResponse.ok) {
          const error = await admissionResponse.json();
          if (admissionResponse.status === 409) {
            // Student already passed the test - show dialog
            setShowAlreadyPassedDialog(true);
            return; // Don't proceed further
          }
          throw new Error(error.error || 'Failed to create admission');
        }

        const admissionData = await admissionResponse.json();
        effectiveAdmissionId = admissionData.id;
        
        if (!effectiveAdmissionId) {
          throw new Error('Failed to create admission record');
        }
        
        // Clear localStorage after successful admission creation
        localStorage.removeItem('admissionFormData');
      }

      // Step 4: Submit test result to DB
      if (!effectiveAdmissionId) {
        throw new Error('Admission ID not available');
      }

      const response = await fetch(API_TEST_SUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test._id,
          admissionId: effectiveAdmissionId,
          answers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      const data = await response.json();
      console.log('Test submission response:', data);
      
      setScore(data.score);
      setVoucher(data.voucher);
      setIsTestSubmitted(true);
      
      if (data.isPassed) {
        toast.success(`Congratulations! You passed with ${data.percentage}%`);
      } else {
        toast.error(`Test failed. You scored ${data.percentage}%`);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test. Please try again.');
      
      // Fallback to local calculation if API fails
      let calculatedScore = 0;
      test.mcqs.forEach((mcq, idx) => {
        if (answers[idx] === mcq.correctAnswer) {
          calculatedScore += mcq.marks || 1;
        }
      });
      setScore(calculatedScore);
      setIsTestSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [test, answers, admissionId, isNewStudent, classId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  // For new students with no test yet, show loading until test is fetched
  if (!test && isNewStudent) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">Test not found</p>
        <Link href="/" className="mt-4 text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  // Render appropriate screen based on test state
  if (isTestSubmitted) {
    return (
      <TestResultScreen
        test={test}
        score={score}
        answers={answers}
        onRetake={() => window.location.reload()}
        studentInfo={studentInfo}
        voucher={voucher}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (!isTestStarted) {
    return (
      <TestStartScreen
        test={test!}
        onStart={startTest}
      />
    );
  }

  return (
    <>
      <TestActiveScreen
        test={test}
        testClass={typeof test.class === 'object' ? test.class?.name : test.class}
        studentInfo={studentInfo}
        currentQuestion={currentQuestion}
        answers={answers}
        questionTimeLeft={questionTimeLeft}
        onSelectAnswer={selectAnswer}
        onPrevious={() => {
          setCurrentQuestion(Math.max(0, currentQuestion - 1));
          setQuestionTimeLeft(test.timeLimit || 30);
        }}
        onNext={() => {
          setCurrentQuestion(Math.min(test.mcqs.length - 1, currentQuestion + 1));
          setQuestionTimeLeft(test.timeLimit || 30);
        }}
        onSubmit={submitTest}
        onNavigate={(idx) => {
          setCurrentQuestion(idx);
          setQuestionTimeLeft(test.timeLimit || 30);
        }}
      />

      {/* Already Passed Dialog */}
      <AlertDialog open={showAlreadyPassedDialog} onOpenChange={setShowAlreadyPassedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Admission Test Already Passed</AlertDialogTitle>
            <AlertDialogDescription>
              This student has already passed the admission test. You cannot retake the test.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/admission-form")}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
