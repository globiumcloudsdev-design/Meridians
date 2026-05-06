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
  admissionNo?: string;
  billNo?: string;
}

