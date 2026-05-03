"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { TestItem } from "@/lib/types/test";
import { API_TEST_BY_ID, API_TEST_SUBMIT, API_ADMISSION_BY_TOKEN } from "@/lib/api/endpoints";
import Link from "next/link";
import TestStartScreen from "@/components/test-taking/TestStartScreen";
import TestActiveScreen from "@/components/test-taking/TestActiveScreen";
import TestResultScreen from "@/components/test-taking/TestResultScreen";

interface TestTakingClientProps {
  testId: string;
  token?: string;
}

export default function TestTakingClient({ testId, token }: TestTakingClientProps) {
  const [test, setTest] = useState<TestItem | null>(null);
  const [studentInfo, setStudentInfo] = useState<{studentName: string; studentClass: string; fatherCnic?: string} | null>(null);
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

  // Keep ref in sync with state
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Fetch test and student info
  useEffect(() => {
    if (testId) {
      fetchTest();
    }
    if (token) {
      fetchStudentInfo();
    }
  }, [testId, token]);

  // Track if timer just hit 0 for last question
  const [shouldSubmit, setShouldSubmit] = useState(false);

  // Per-question timer with auto-advance
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
            // Last question - trigger submit via effect instead of direct call
            setTimeout(() => {
              setShouldSubmit(true);
            }, 100);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestSubmitted, test]);

  // Handle test submission when shouldSubmit is set
  useEffect(() => {
    if (shouldSubmit && !isTestSubmitted) {
      setShouldSubmit(false);
      submitTest();
    }
  }, [shouldSubmit, isTestSubmitted]);

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
    try {
      const response = await fetch(API_ADMISSION_BY_TOKEN(token!));
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
    if (!test || !token) return;

    setIsSubmitting(true);
    try {
      // Call backend API to submit test
      const response = await fetch(API_TEST_SUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test._id,
          token: token,
          answers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      const data = await response.json();
      console.log('Test submission response:', data);
      
      setScore(data.score);
      setVoucher(data.voucher); // Will be null if not passed
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
  }, [test, answers, token]);

  if (isLoading) {
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
        test={test}
        onStart={startTest}
      />
    );
  }

  return (
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
  );
}
