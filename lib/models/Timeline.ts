import mongoose, { Document, Schema } from 'mongoose';

export interface ITimelineEvent extends Document {
  title: string;
  date: string;
  description: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineSchema = new Schema<ITimelineEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
      default: 'Calendar',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Timeline || mongoose.model<ITimelineEvent>('Timeline', TimelineSchema);
