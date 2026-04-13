import mongoose, { Schema, Document } from 'mongoose';


export interface IAdmissionQuery extends Document {
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
  program: string;
  message?: string;
  status: 'pending' | 'replied';
  createdAt: Date;
}

const AdmissionQuerySchema = new Schema<IAdmissionQuery>({
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
  program: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.AdmissionQuery || mongoose.model<IAdmissionQuery>('AdmissionQuery', AdmissionQuerySchema);
