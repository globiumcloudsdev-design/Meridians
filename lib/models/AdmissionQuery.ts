import mongoose, { Schema, Document } from 'mongoose';


export interface IAdmissionQuery extends Document {
  queryType?: 'school' | 'online_quran';
  admissionDate?: string;
  name: string;
  class: string;
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
  contact1: string;
  contact2?: string;
  parentEmail: string;
  principal?: string;
  program: string;
  message?: string;
  status: 'pending' | 'replied' | 'test_sent' | 'contacted' | 'test_passed' | 'admitted' | 'trial_scheduled' | 'enrolled' | 'cancelled';
  testScore?: number;
  testPassed?: boolean;
  testCompleted?: boolean;
  testCompletedAt?: Date;
  bankSlipGenerated?: boolean;
  bankSlipUrl?: string;
  feeAmount?: number;
  slipGeneratedAt?: Date;
  admissionNo?: string;
  voucherData?: any;
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
  documents?: {
    url: string;
    publicId: string;
    name: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionQuerySchema = new Schema<IAdmissionQuery>({
  queryType: { type: String, enum: ['school', 'online_quran'], default: 'school' },
  admissionDate: { type: String },
  name: { type: String, required: true },
  class: { type: String, required: true },
  fatherName: { type: String },
  shift: { type: String },
  fatherOccupation: { type: String },
  fatherCnic: { type: String },
  homeAddress: { type: String },
  subjects: { type: String },
  dob: { type: String },
  age: { type: String },
  gender: { type: String },
  quranLevel: { type: String },
  relation: { type: String },
  classesPerWeek: { type: String },
  preferredDays: [{ type: String }],
  preferredTime: { type: String },
  timezone: { type: String },
  preferredTutor: { type: String },
  preferredPlatform: { type: String },
  currency: { type: String, default: 'PKR' },
  referenceNo: { type: String },
  contact1: { type: String, required: true },
  contact2: { type: String },
  parentEmail: { type: String, required: true, lowercase: true, trim: true },
  principal: { type: String },
  program: { type: String, required: true },
  message: { type: String },
  status: { 
    type: String, 
    default: 'pending'
  },
  testScore: { type: Number },
  testPassed: { type: Boolean, default: false },
  testCompleted: { type: Boolean, default: false },
  testCompletedAt: { type: Date },
  bankSlipGenerated: { type: Boolean, default: false },
  bankSlipUrl: { type: String },
  feeAmount: { type: Number },
  slipGeneratedAt: { type: Date },
  admissionNo: { type: String },
  voucherData: { type: Schema.Types.Mixed },
  testAnswers: [{
    questionIndex: { type: Number },
    selectedOption: { type: Number },
    correctOption: { type: Number },
    isCorrect: { type: Boolean },
    marks: { type: Number }
  }],
  testDetails: {
    totalMarks: { type: Number },
    passingMarks: { type: Number },
    percentage: { type: Number },
    correctAnswers: { type: Number },
    wrongAnswers: { type: Number },
    unattempted: { type: Number }
  },
  documents: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.AdmissionQuery || mongoose.model<IAdmissionQuery>('AdmissionQuery', AdmissionQuerySchema);

