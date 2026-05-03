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
  name: string;
  class: string;
  fatherName?: string;
  shift?: string;
  fatherCnic?: string;
  homeAddress?: string;
  dob?: string;
  contact1: string;
  parentEmail: string;
  program: string;
  message?: string;
  status: 'pending' | 'replied' | 'test_sent' | 'contacted';
  documents?: AdmissionDocument[];
  // Test related fields
  testToken?: string;
  testTokenExpiry?: string;
  testScore?: number;
  testPassed?: boolean;
  testCompleted?: boolean;
  testCompletedAt?: string;
  // Bank slip fields
  bankSlipGenerated?: boolean;
  bankSlipUrl?: string;
  feeAmount?: number;
  slipGeneratedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAdmissionQueryInput {
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
  contact2?: string;
  principal?: string;
  message?: string;
}
