import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmissionQuery extends Document {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
  status: 'pending' | 'replied';
  createdAt: Date;
}

const AdmissionQuerySchema = new Schema<IAdmissionQuery>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.models.AdmissionQuery || mongoose.model<IAdmissionQuery>('AdmissionQuery', AdmissionQuerySchema);
