// Admission query type definitions

export interface AdmissionQuery {
  _id: string;
  admissionDate: string;
  name: string;
  class: string;
  fatherName?: string;
  shift?: string;
  fatherOccupation?: string;
  fatherCnic?: string;
  homeAddress?: string;
  subjects?: string;
  dob?: string;
  contact1: string;
  contact2?: string;
  parentEmail: string;
  principal?: string;
  program: string;
  message?: string;
  status: 'pending' | 'replied';
  createdAt: string;
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
