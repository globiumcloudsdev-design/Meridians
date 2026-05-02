import mongoose from 'mongoose';

export interface IMCQ {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  marks: number;
}

export interface ITest {
  title: string;
  description?: string;
  class: mongoose.Types.ObjectId;
  mcqs: IMCQ[];
  totalMarks: number;
  correctAnswerMarks: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MCQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v: string[]) {
        return v.length === 4;
      },
      message: 'Exactly 4 options are required',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3,
  },
  marks: {
    type: Number,
    required: [true, 'Marks for this question is required'],
    default: 1,
    min: 1,
  },
});

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required'],
  },
  mcqs: {
    type: [MCQSchema],
    required: [true, 'At least one MCQ is required'],
    validate: {
      validator: function(v: IMCQ[]) {
        return v.length > 0;
      },
      message: 'At least one MCQ is required',
    },
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: 1,
  },
  correctAnswerMarks: {
    type: Number,
    required: [true, 'Correct answer marks is required'],
    default: 1,
    min: 1,
  },
  passingMarks: {
    type: Number,
    required: [true, 'Passing marks is required'],
    default: 0,
    min: 0,
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit per question is required'],
    default: 30, // Default 30 seconds per question
    min: 5, // Minimum 5 seconds
    max: 300, // Maximum 5 minutes per question
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;
