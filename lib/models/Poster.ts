import mongoose, { Document, Schema } from 'mongoose';

export interface IPosterDocument extends Document {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  isActive: boolean;
  buttonText?: string;
  buttonUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PosterSchema = new Schema<IPosterDocument>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    buttonText: {
      type: String,
      trim: true,
      default: '',
    },
    buttonUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Poster || mongoose.model<IPosterDocument>('Poster', PosterSchema);
