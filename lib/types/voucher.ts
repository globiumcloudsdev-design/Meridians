export interface VoucherData {
  voucherNumber: string;
  challanNo: string;
  studentName: string;
  fatherName: string;
  fatherCnic: string;
  studentClass: string;
  shift?: string;
  contact?: string;
  testScore: number;
  totalMarks: number;
  percentage: string;
  classFees: number;
  admissionFee: number;
  totalFee: number;
  payableWithin: number;
  payableAfter: number;
  issueDate: string;
  dueDate: string;
  motto: string;
  instructions: string;
}

export interface VoucherTemplateProps {
  studentName: string;
  fatherName: string;
  fatherCNIC?: string;
  rollNumber?: string;
  class: string;
  section?: string;
  testScore?: number;
  totalMarks?: number;
  percentage?: number;
  testDate?: string;
  testTitle?: string;
  sid?: string;
  contact?: string;
  admissionNo?: string;
  challanNo?: string;
  familyNo?: string;
  dueDate?: string;
  fees?: Array<{ month: string; particular: string; amount: number }>;
  totalAmount?: number;
  amountInWords?: string;
  payableWithin?: number;
  payableAfter?: number;
  motto?: string;
  instructions?: string;
  showDownloadButton?: boolean;
  fileName?: string;
}
