export interface MCQ {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface TestItem {
  _id: string;
  title: string;
  description?: string;
  class: string | { _id: string; name: string };
  mcqs: MCQ[];
  totalMarks: number;
  correctAnswerMarks: number;
  passingMarks: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestFormValues {
  title: string;
  description?: string;
  classId: string;
  mcqs: MCQ[];
  totalMarks: number;
  correctAnswerMarks: number;
  passingMarks: number;
  timeLimit: number;
  isActive: boolean;
}

export interface TestResult {
  testId: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number; // in seconds
  submittedAt: string;
}
