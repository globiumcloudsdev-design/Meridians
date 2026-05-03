import mongoose, { Schema, Document } from 'mongoose';


export interface IAdmissionQuery extends Document {
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
  contact1: string;
  contact2?: string;
  parentEmail: string;
  principal?: string;
  program: string;
  message?: string;
  status: 'pending' | 'replied' | 'test_sent' | 'contacted';
  testToken?: string;
  testTokenExpiry?: Date;
  testScore?: number;
  testPassed?: boolean;
  testCompleted?: boolean;
  testCompletedAt?: Date;
  bankSlipGenerated?: boolean;
  bankSlipUrl?: string;
  feeAmount?: number;
  slipGeneratedAt?: Date;
  voucherData?: any;
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
  contact1: { type: String, required: true },
  contact2: { type: String },
  parentEmail: { type: String, required: true, lowercase: true, trim: true },
  principal: { type: String },
  program: { type: String, required: true },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'replied', 'test_sent', 'contacted'],
    default: 'pending'
  },
  testToken: { type: String, unique: true, sparse: true },
  testTokenExpiry: { type: Date },
  testScore: { type: Number },
  testPassed: { type: Boolean, default: false },
  testCompleted: { type: Boolean, default: false },
  testCompletedAt: { type: Date },
  bankSlipGenerated: { type: Boolean, default: false },
  bankSlipUrl: { type: String },
  feeAmount: { type: Number },
  slipGeneratedAt: { type: Date },
  voucherData: { type: Schema.Types.Mixed },
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
