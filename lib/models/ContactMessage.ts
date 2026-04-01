import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  status: 'pending' | 'replied';
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
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
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
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

export default mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
