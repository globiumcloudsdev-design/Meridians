"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TestItem } from "@/lib/types/test";
import { API_TEST_BY_ID, API_ADMISSION_BY_TOKEN } from "@/lib/api/endpoints";
import {
  Clock,
  Award,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Play,
} from "lucide-react";
import Link from "next/link";

interface TestTakingClientProps {
  testId: string;
  token?: string;
}

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export default function TestTakingClient({ testId, token }: TestTakingClientProps) {
  const [test, setTest] = useState<TestItem | null>(null);
  const [studentInfo, setStudentInfo] = useState<{studentName: string; studentClass: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentQuestionRef = useRef(currentQuestion);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);

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
            submitTest();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestSubmitted, test]);

  const fetchStudentInfo = async () => {
    try {
      const response = await fetch(API_ADMISSION_BY_TOKEN(token || ''));
      if (response.ok) {
        const data = await response.json();
        setStudentInfo(data);
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const fetchTest = async () => {
    try {
      const response = await fetch(API_TEST_BY_ID(testId));
      if (response.ok) {
        const data = await response.json();
        setTest(data);
        setQuestionTimeLeft(data.timeLimit || 30);
      } else {
        toast.error("Failed to load test");
      }
    } catch (error) {
      console.error("Error fetching test:", error);
      toast.error("Error loading test");
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setQuestionTimeLeft(test?.timeLimit || 30);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const submitTest = useCallback(() => {
    if (!test) return;

    let calculatedScore = 0;
    test.mcqs.forEach((mcq, idx) => {
      if (answers[idx] === mcq.correctAnswer) {
        calculatedScore += mcq.marks;
      }
    });

    setScore(calculatedScore);
    setIsTestSubmitted(true);
    
    setTimeout(() => {
      toast.success(`Test completed! You scored ${calculatedScore} out of ${test.totalMarks}`);
    }, 0);
  }, [test, answers]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">Loading test...</p>
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

  const progress = ((currentQuestion + 1) / test.mcqs.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Test Results View
  if (isTestSubmitted) {
    const percentage = Math.round((score / test.totalMarks) * 100);
    const correctCount = test.mcqs.filter((mcq, idx) => answers[idx] === mcq.correctAnswer).length;
    const incorrectCount = test.mcqs.length - correctCount;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 py-4 px-3">
          <div className="max-w-md mx-auto">
            <Card className="rounded-lg border shadow-sm">
              <div className="bg-primary/5 p-3 text-center border-b">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h1 className="text-lg font-bold text-foreground">Test Completed!</h1>
                <p className={`text-xs font-medium ${percentage >= 60 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {percentage >= 60 ? 'You Passed!' : 'Keep practicing!'}
                </p>
              </div>

              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="text-center">
                    <p className="text-2xl font-black text-primary">{score}</p>
                    <p className="text-[10px] text-muted-foreground">Score</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-foreground">{percentage}%</p>
                    <p className="text-[10px] text-muted-foreground">Percentage</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-muted-foreground">{test.totalMarks}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">{correctCount}</p>
                    <p className="text-[10px] text-emerald-700">Correct</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                    <AlertCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-red-500">{incorrectCount}</p>
                    <p className="text-[10px] text-red-600">Wrong</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                    <FileQuestion className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-600">{test.mcqs.length}</p>
                    <p className="text-[10px] text-blue-700">Total</p>
                  </div>
                </div>

                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-primary"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retake Test
                </Button>

                <div>
                  <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Review Answers</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {test.mcqs.map((mcq, idx) => {
                      const isCorrect = answers[idx] === mcq.correctAnswer;
                      return (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-md border ${
                            isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <span className={`text-xs font-bold shrink-0 mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                              {idx + 1}.
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground leading-tight">{mcq.question}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                You: {answers[idx] !== undefined ? mcq.options[answers[idx]] : "-"}
                                {!isCorrect && (
                                  <span className="text-emerald-600 ml-1">
                                    ✓ {mcq.options[mcq.correctAnswer]}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Test Instructions / Start Screen
  if (!isTestStarted) {
    return (
      <div className="flex flex-col bg-background">
        <main className="py-3 px-4">
          <div className="max-w-xl mx-auto">
            <Card className="rounded-xl border border-primary/20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4">
                <h1 className="text-xl font-bold text-foreground">{test.title}</h1>
                {test.description && <p className="text-sm text-muted-foreground mt-1">{test.description}</p>}
              </div>

              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                    <FileQuestion className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-primary">{test.mcqs.length}</p>
                    <p className="text-[10px] text-muted-foreground">Questions</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                    <Award className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-primary">{test.totalMarks}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                    <CheckCircle className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-primary">{test.passingMarks}</p>
                    <p className="text-[10px] text-muted-foreground">Passing</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                    <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-primary">{test.timeLimit || 30}s</p>
                    <p className="text-[10px] text-muted-foreground">Per Q</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-1 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Instructions
                  </h3>
                  <ul className="space-y-1 text-xs text-yellow-700">
                    <li>• {test.mcqs.length} MCQs, {test.timeLimit || 30}s per question</li>
                    <li>• Timer starts immediately on Start Test click</li>
                    <li>• Use Prev/Next buttons to navigate questions</li>
                    <li>• Auto-submitted when timer reaches zero</li>
                    <li>• Do not refresh or close browser during test</li>
                  </ul>
                </div>

                <Button 
                  onClick={startTest} 
                  className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-lg hover:scale-[1.01] transition-transform"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Active Test View
  const currentMCQ = test.mcqs[currentQuestion];
  if (!currentMCQ) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background py-2 px-3">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="rounded-xl border border-primary/20 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/10 p-3">
            {/* Student Info */}
            {studentInfo && (
              <div className="flex items-center gap-3 mb-2 p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Student:</span>
                  <span className="text-xs font-bold text-foreground">{studentInfo.studentName}</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Class:</span>
                  <span className="text-xs font-bold text-foreground">{studentInfo.studentClass}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <h1 className="font-bold text-sm text-foreground truncate max-w-[150px] sm:max-w-xs">
                {test.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  questionTimeLeft <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-primary/10 text-primary'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {questionTimeLeft}s
                </div>
                <Button 
                  onClick={submitTest}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 h-7 text-xs px-2"
                  size="sm"
                >
                  Submit
                </Button>
              </div>
            </div>
            
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Q{currentQuestion + 1}/{test.mcqs.length}</span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {currentMCQ?.marks || 0} marks
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {test.mcqs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentQuestion(idx);
                    setQuestionTimeLeft(test.timeLimit || 30);
                  }}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-all ${
                    currentQuestion === idx
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : answers[idx] !== undefined
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-white/80 text-muted-foreground border border-muted hover:border-primary/40'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-white/80 border border-muted" />
                <span>Pending ({test.mcqs.length - answeredCount})</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {currentMCQ.question}
              </p>
            </div>

            <div className="space-y-2">
              {currentMCQ.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => selectAnswer(currentQuestion, optIdx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    answers[currentQuestion] === optIdx
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                      answers[currentQuestion] === optIdx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getOptionLabel(optIdx)}
                    </span>
                    <span className="text-sm text-foreground">{option}</span>
                    {answers[currentQuestion] === optIdx && (
                      <CheckCircle className="w-4 h-4 text-primary ml-auto shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                onClick={() => {
                  setCurrentQuestion(Math.max(0, currentQuestion - 1));
                  setQuestionTimeLeft(test.timeLimit || 30);
                }}
                disabled={currentQuestion === 0}
                variant="outline"
                size="sm"
                className="h-9"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {currentQuestion === test.mcqs.length - 1 ? (
                <Button
                  onClick={submitTest}
                  size="sm"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentQuestion(Math.min(test.mcqs.length - 1, currentQuestion + 1));
                    setQuestionTimeLeft(test.timeLimit || 30);
                  }}
                  size="sm"
                  className="h-9"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
