// Admission query type definitions

export interface AdmissionDocument {
  url: string;
  publicId: string;
  name: string;
  size: number;
  type: string;
}

export interface AdmissionQuery {
  _id: string;
  queryType?: 'school' | 'online_quran';
  name: string;
  class: string;
  fatherName?: string;
  shift?: string;
  fatherCnic?: string;
  homeAddress?: string;
  dob?: string;
  age?: string;
  gender?: string;
  quranLevel?: string;
  relation?: string;
  classesPerWeek?: string;
  preferredDays?: string[];
  preferredTime?: string;
  timezone?: string;
  preferredTutor?: string;
  preferredPlatform?: string;
  currency?: string;
  referenceNo?: string;
  contact1: string;
  contact2?: string;
  parentEmail: string;
  program: string;
  message?: string;
  status: 'pending' | 'test_passed' | 'admitted' | 'contacted' | 'replied' | 'trial_scheduled' | 'enrolled' | 'cancelled' | string;
  documents?: AdmissionDocument[];
  // Test related fields
  testScore?: number;
  testPassed?: boolean;
  testCompleted?: boolean;
  testCompletedAt?: string;
  testAnswers?: {
    questionIndex: number;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    marks: number;
  }[];
  testDetails?: {
    totalMarks: number;
    passingMarks: number;
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
    unattempted: number;
  };
  voucherData?: any;
  // Bank slip fields
  bankSlipGenerated?: boolean;
  bankSlipUrl?: string;
  feeAmount?: number;
  slipGeneratedAt?: string;
  admissionNo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAdmissionQueryInput {
  queryType?: 'school' | 'online_quran';
  name: string;
  parentEmail: string;
  class: string;
  contact1: string;
  program: string;
  admissionDate?: string;
  fatherName?: string;
  shift?: string;
  fatherOccupation?: string;
  fatherCnic?: string;
  homeAddress?: string;
  subjects?: string;
  dob?: string;
  age?: string;
  gender?: string;
  quranLevel?: string;
  relation?: string;
  classesPerWeek?: string;
  preferredDays?: string[];
  preferredTime?: string;
  timezone?: string;
  preferredTutor?: string;
  preferredPlatform?: string;
  currency?: string;
  referenceNo?: string;
  admissionNo?: string;
  feeAmount?: number;
  contact2?: string;
  principal?: string;
  message?: string;
}

