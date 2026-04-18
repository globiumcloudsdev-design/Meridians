// models/Video.ts
import mongoose, { Schema, Document } from 'mongoose';

export type VideoStatus = 'active' | 'inactive' | 'draft';

export interface IVideo extends Document {
  title: string;
  description: string;
  link: string;
  category: string;
  status: VideoStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    link: {
      type: String,
      required: [true, 'Video link is required'],
    },
    category: {
      type: String,
      trim: true,
      default: 'Uncategorized',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
      required: true,
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create index for better search performance
VideoSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);