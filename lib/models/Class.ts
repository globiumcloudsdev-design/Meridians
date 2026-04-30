import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
  },
  fees: {
    type: Number,
    required: [true, 'Class fees is required'],
    min: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on every save
ClassSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);
