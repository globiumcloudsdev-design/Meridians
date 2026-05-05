"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle,
  RotateCcw,
  Loader2,
  X,
} from "lucide-react";
import { TestItem } from "@/lib/types/test";
import { VoucherData } from "@/lib/types/voucher";
import VoucherTemplate from "@/components/voucher/VoucherTemplate";
import { toast } from "sonner";

interface TestResultScreenProps {
  test: TestItem;
  score: number;
  answers: Record<number, number>;
  onRetake: () => void;
  studentInfo?: { studentName: string; studentClass: string; fatherCnic?: string } | null;
  voucher?: VoucherData | null;
  isSubmitting?: boolean;
}

export default function TestResultScreen({
  test,
  score,
  answers,
  onRetake,
  studentInfo,
  voucher,
  isSubmitting,
}: TestResultScreenProps) {

  const percentage = (score / test.totalMarks) * 100;
  const isPassed = percentage >= (test.passingMarks / test.totalMarks) * 100;
  const answeredCount = Object.keys(answers).length;
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main className="py-2 px-3">
        <div className="max-w-md mx-auto space-y-3">
          {/* Result Card - All Info Merged */}
          <Card className="rounded-xl border border-primary/20 overflow-hidden">
            {/* Score Section */}
            <div
              className={`p-4 text-center ${
                isPassed
                  ? "bg-linear-to-r from-emerald-50 via-emerald-100 to-emerald-50"
                  : "bg-linear-to-r from-red-50 via-red-100 to-red-50"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  isPassed ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                <Award className="w-6 h-6 text-white" />
              </div>

              {/* Student Info */}
              {studentInfo && (
                <div className="mb-3 p-2 bg-white/80 rounded-lg">
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Student:</span>
                      <span className="font-bold text-foreground">
                        {studentInfo.studentName}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-bold text-foreground">
                        {studentInfo.studentClass}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <h2
                className={`text-lg font-bold ${
                  isPassed ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {isPassed ? "Congratulations!" : "Test Failed"}
              </h2>

              {/* Score Stats - Compact */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="bg-white/60 rounded-lg p-1.5">
                  <p className="text-lg font-bold text-foreground">{score}</p>
                  <p className="text-[10px] text-muted-foreground">Score</p>
                </div>
                <div className="bg-white/60 rounded-lg p-1.5">
                  <p className="text-lg font-bold text-foreground">
                    {test.totalMarks}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
                <div className="bg-white/60 rounded-lg p-1.5">
                  <p
                    className={`text-lg font-bold ${
                      isPassed ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {percentage.toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">Pass</p>
                </div>
              </div>

              <div className="mt-2 bg-white/80 rounded-lg p-1.5">
                <p className="text-[10px] text-muted-foreground">
                  Passing:{" "}
                  <span className="font-semibold text-foreground">
                    {test.passingMarks} (
                    {((test.passingMarks / test.totalMarks) * 100).toFixed(0)}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Question Summary */}
            <div className="p-3 border-t border-border bg-muted/20">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-primary/5 rounded-lg p-1.5 text-center border border-primary/10">
                  <p className="text-base font-bold text-primary">
                    {test.mcqs.length}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-1.5 text-center border border-emerald-200">
                  <p className="text-base font-bold text-emerald-600">
                    {answeredCount}
                  </p>
                  <p className="text-[10px] text-emerald-600/70">Attempted</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-1.5 text-center border border-amber-200">
                  <p className="text-base font-bold text-amber-600">
                    {test.mcqs.length - answeredCount}
                  </p>
                  <p className="text-[10px] text-amber-600/70">Skipped</p>
                </div>
              </div>
            </div>

            {/* Review Answers - Merged Inside */}
            <div className="p-3 border-t border-border">
              <h3
                className="font-bold text-foreground flex items-center gap-1.5 mb-2 text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                Review ({test.mcqs.length} questions)
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {test.mcqs.map((mcq, idx) => {
                  const isCorrect = answers[idx] === mcq.correctAnswer;
                  const userAnswer = answers[idx] !== undefined ? mcq.options[answers[idx]] : "—";
                  const correctAnswer = mcq.options[mcq.correctAnswer];
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-md border ${
                        isCorrect
                          ? "bg-emerald-50/50 border-emerald-200"
                          : answers[idx] !== undefined
                          ? "bg-red-50/50 border-red-200"
                          : "bg-amber-50/50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <span
                          className={`text-[10px] font-bold shrink-0 mt-0.5 ${
                            isCorrect ? "text-emerald-600" : answers[idx] !== undefined ? "text-red-500" : "text-amber-600"
                          }`}
                        >
                          {idx + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-snug line-clamp-2">
                            {mcq.question}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="text-muted-foreground">You:</span>
                            <span
                              className={
                                isCorrect ? "text-emerald-600 font-medium" : answers[idx] !== undefined ? "text-red-500 font-medium" : "text-amber-600 font-medium"
                              }
                            >
                              {userAnswer}
                            </span>
                            {!isCorrect && (
                              <>
                                <span className="text-muted-foreground">|</span>
                                <span className="text-emerald-600 font-medium">
                                  {correctAnswer}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-[10px]">
                          {isCorrect ? (
                            <span className="text-emerald-600">✓</span>
                          ) : answers[idx] !== undefined ? (
                            <span className="text-red-500">✗</span>
                          ) : (
                            <span className="text-amber-500">−</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions - Inside Card */}
            <div className="p-3 border-t border-border bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex gap-2 flex-1 flex-wrap">
                  {!studentInfo && (
                    <Button
                      onClick={onRetake}
                      variant="outline"
                      size="sm"
                      className="h-9"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Retake
                    </Button>
                  )}
                  {isPassed && voucher && (
                    <Button
                      onClick={() => setShowVoucherModal(true)}
                      size="sm"
                      variant="outline"
                      className="h-9"
                    >
                      View Voucher
                    </Button>
                  )}
                </div>
                {studentInfo && isPassed && !voucher && (
                  <div className="w-full sm:w-auto text-center p-2 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-700">Voucher not available. Please contact support.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

      </main>

      {/* View Voucher Modal */}
      {showVoucherModal && voucher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-h-[95vh] overflow-y-auto max-w-5xl w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Bank Voucher</h2>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Voucher Content */}
            <div className="p-4 bg-gray-100">
              <VoucherTemplate
                studentName={voucher.studentName}
                fatherName={voucher.fatherName || ''}
                fatherCNIC={voucher.fatherCnic || ''}
                rollNumber=""
                class={voucher.studentClass}
                section={voucher.shift || ''}
                testScore={voucher.testScore}
                totalMarks={voucher.totalMarks}
                percentage={parseFloat(voucher.percentage)}
                testDate={new Date(voucher.issueDate).toLocaleDateString('en-PK')}
                testTitle="Admission Test"
                contact={voucher.contact || ''}
                challanNo={voucher.challanNo}
                dueDate={new Date(voucher.dueDate).toLocaleDateString('en-PK', {
                  day: '2-digit', month: 'short', year: 'numeric'
                }).replace(/ /g, '-')}
                fees={[
                  { month: 'Current', particular: 'Class Fees', amount: voucher.classFees },
                  { month: 'Current', particular: 'Admission Fee', amount: voucher.admissionFee },
                ]}
                totalAmount={voucher.totalFee}
                payableWithin={voucher.payableWithin}
                payableAfter={voucher.payableAfter}
                motto={voucher.motto}
                instructions={voucher.instructions}
                showDownloadButton={true}
                fileName={`fee-voucher-${voucher.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-gray-50">
              <Button
                onClick={() => setShowVoucherModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
