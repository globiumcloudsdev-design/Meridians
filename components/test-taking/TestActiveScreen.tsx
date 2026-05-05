"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { TestItem } from "@/lib/types/test";

interface TestActiveScreenProps {
  test: TestItem;
  testClass?: string;
  studentInfo?: { studentName: string; studentClass: string } | null;
  currentQuestion: number;
  answers: Record<number, number>;
  questionTimeLeft: number;
  onSelectAnswer: (questionIndex: number, optionIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onNavigate: (index: number) => void;
}

function getOptionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export default function TestActiveScreen({
  test,
  testClass,
  studentInfo,
  currentQuestion,
  answers,
  questionTimeLeft,
  onSelectAnswer,
  onPrevious,
  onNext,
  onSubmit,
  onNavigate,
}: TestActiveScreenProps) {
  const currentMCQ = test.mcqs[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  if (!currentMCQ) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2 bg-background">
      <main className="px-4">
        <div className="max-w-xl mx-auto">
          <Card className="rounded-xl border border-primary/20 overflow-hidden">
            {/* Header with Timer */}
            <div className="bg-linear-to-r from-primary/10 via-primary/5 to-secondary/10 p-2">
              {/* Student Info (email link se) */}
              {studentInfo && (
                <div className="mb-1 p-1.5 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                      <span >Student:</span>
                      <span >{studentInfo.studentName}</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    {/* Test Class Badge */}
              {testClass && (
                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                  <span >
                    {testClass}
                  </span>
                </div>
              )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Q{currentQuestion + 1}/{test.mcqs.length}</span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {currentMCQ?.marks || 0} marks
                  </span>
                </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                questionTimeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'
              }`}>
                <Clock className="w-3 h-3" />
                <span className="text-xs font-bold">{questionTimeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Question Pills */}
          <div className="px-3 py-1 bg-muted/30 border-b border-border">
              <div className="flex flex-wrap gap-1.5">
                {test.mcqs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigate(idx)}
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
              
              <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
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

            <CardContent className="p-3 space-y-3">
              {/* Question */}
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {currentMCQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-1.5">
                {currentMCQ.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => onSelectAnswer(currentQuestion, optIdx)}
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

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  onClick={onPrevious}
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
                    onClick={onSubmit}
                    size="sm"
                    className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={onNext}
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
      </main>
    </div>
  );
}
