export interface ClassItem {
  _id: string;
  name: string;
  fees: number;
  admissionFee: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormValues {
  name: string;
  fees: number;
  admissionFee: number;
  description: string;
  isActive: boolean;
}
