// Admission query type definitions

export interface AdmissionQuery {
  _id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
  status: 'pending' | 'replied';
  createdAt: string;
}

export interface CreateAdmissionQueryInput {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}
